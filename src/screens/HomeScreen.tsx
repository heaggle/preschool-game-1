import { useEffect } from 'react';
import { IconButton, StarBar } from '../components/ui';
import { ROUND_LENGTH } from '../lib/constants';
import { isAudioPrimed, speak } from '../lib/audio';
import { useInstallPrompt, useAppUpdate } from '../lib/pwa';
import { useApp } from '../state/AppContext';

type HomeTarget =
  | 'words'
  | 'counting'
  | 'math'
  | 'logic'
  | 'geography'
  | 'madagascar'
  | 'talents'
  | 'robot'
  | 'stickers';

const CARDS: Array<{
  id: HomeTarget;
  emoji: string;
  title: string;
  subtitle: string;
  color: 'grape' | 'sky' | 'coral' | 'sun' | 'mint' | 'teal' | 'rose' | 'lime' | 'indigo';
}> = [
  { id: 'words', emoji: '📖', title: 'Words', subtitle: 'Read & build', color: 'grape' },
  { id: 'counting', emoji: '🔢', title: 'Counting', subtitle: '1 to 100', color: 'sky' },
  { id: 'math', emoji: '➕', title: 'Math', subtitle: 'Add & take away', color: 'coral' },
  { id: 'logic', emoji: '🧠', title: 'Logic', subtitle: 'Think & match', color: 'rose' },
  { id: 'geography', emoji: '🌍', title: 'Geography', subtitle: 'Countries & flags', color: 'mint' },
  { id: 'madagascar', emoji: '🇲🇬', title: 'Madagascar', subtitle: 'My island', color: 'teal' },
  { id: 'talents', emoji: '🧩', title: 'Explorations', subtitle: 'Fun challenges', color: 'lime' },
  { id: 'robot', emoji: '🤖', title: 'Robot', subtitle: 'Guide the path', color: 'indigo' },
  { id: 'stickers', emoji: '⭐', title: 'Stickers', subtitle: 'My rewards', color: 'sun' },
];

export function HomeScreen({
  onOpen,
  onParent,
}: {
  onOpen: (target: HomeTarget) => void;
  onParent: () => void;
}) {
  const { save } = useApp();
  const { canInstall } = useInstallPrompt();
  const { needRefresh } = useAppUpdate();
  const name = save.profile.name.trim() || 'Friend';
  const greeting = `Hi, ${name}! Tap a card to play.`;

  useEffect(() => {
    // Speech can be blocked until the first user gesture (iOS/Chrome autoplay
    // policy). Greet immediately when audio is already unlocked; otherwise
    // wait for the first tap so the child still hears the welcome.
    if (isAudioPrimed()) {
      speak(greeting);
      return undefined;
    }
    const greetOnce = () => {
      speak(greeting);
      window.removeEventListener('pointerdown', greetOnce);
    };
    window.addEventListener('pointerdown', greetOnce);
    return () => window.removeEventListener('pointerdown', greetOnce);
  }, [greeting]);

  return (
    <div className="screen home-screen">
      <header className="home-top">
        <div className="greeting">
          <div className="avatar-bubble" aria-hidden>
            {save.profile.avatar}
          </div>
          <div>
            <p className="hello">Hi, {name}!</p>
            <p className="tagline">Read • Count • Play</p>
          </div>
        </div>

        <div className="top-actions">
          <IconButton label="Say hello" onClick={() => speak(greeting)}>
            🔊
          </IconButton>
          <IconButton
            label="Parent settings"
            onClick={onParent}
            className="gear-btn"
          >
            ⚙️
            {canInstall || needRefresh ? <span className="dot-badge" aria-hidden /> : null}
          </IconButton>
        </div>
      </header>

      <StarBar />

      {needRefresh ? (
        <p className="update-note" role="status">
          ✨ A new version is ready — ask a grown-up to install it.
        </p>
      ) : null}

      <div className="home-grid">
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`home-card card-${card.color}`}
            onClick={() => onOpen(card.id)}
          >
            <span className="home-card-emoji" aria-hidden>
              {card.emoji}
            </span>
            <span className="home-card-title">{card.title}</span>
            <span className="home-card-sub">{card.subtitle}</span>
          </button>
        ))}
      </div>

      <p className="home-foot">
        <img
          className="home-foot-mascot"
          src={`${import.meta.env.BASE_URL}mascot.svg`}
          alt=""
          aria-hidden
        />
        <span>Earn {ROUND_LENGTH} stars every round. Collect stickers!</span>
      </p>
    </div>
  );
}
