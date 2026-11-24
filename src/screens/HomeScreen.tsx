import { useEffect } from 'react';
import { IconButton, StarBar } from '../components/ui';
import { APP_AUTHOR, APP_SITE_LABEL, APP_YEAR, ROUND_LENGTH } from '../lib/constants';
import { speak } from '../lib/audio';
import { useInstallPrompt } from '../lib/pwa';
import { useApp } from '../state/AppContext';

type HomeTarget = 'words' | 'counting' | 'math' | 'stickers';

const CARDS: Array<{
  id: HomeTarget;
  emoji: string;
  title: string;
  subtitle: string;
  color: 'grape' | 'sky' | 'coral' | 'sun';
}> = [
  { id: 'words', emoji: '📖', title: 'Words', subtitle: 'Read & build', color: 'grape' },
  { id: 'counting', emoji: '🔢', title: 'Counting', subtitle: '1 to 100', color: 'sky' },
  { id: 'math', emoji: '➕', title: 'Math', subtitle: 'Add & take away', color: 'coral' },
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
  const name = save.profile.name.trim() || 'Friend';
  const greeting = `Hi, ${name}! Tap a card to play.`;

  useEffect(() => {
    speak(greeting);
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
            {canInstall ? <span className="dot-badge" aria-hidden /> : null}
          </IconButton>
        </div>
      </header>

      <StarBar />

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

      <div className="home-foot">
        <p>Earn {ROUND_LENGTH} stars every round. Collect stickers!</p>
        <p className="home-signature">
          © {APP_YEAR} {APP_AUTHOR} · {APP_SITE_LABEL}
        </p>
      </div>
    </div>
  );
}
