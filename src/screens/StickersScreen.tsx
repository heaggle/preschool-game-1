import { useEffect, useMemo, useRef, useState } from 'react';
import { IconButton, ScreenHeader } from '../components/ui';
import { STICKERS, nextSticker, unlockedStickers, type Sticker } from '../content/stickers';
import { playSfx, speak } from '../lib/audio';
import { useApp } from '../state/AppContext';

export function StickersScreen({ onBack }: { onBack: () => void }) {
  const { save } = useApp();
  const unlocked = useMemo(() => new Set(unlockedStickers(save.stars).map((s) => s.id)), [save.stars]);
  const next = nextSticker(save.stars);
  const remaining = next ? next.threshold - save.stars : 0;
  const previousThreshold = useMemo(() => {
    const earned = STICKERS.filter((sticker) => save.stars >= sticker.threshold);
    return earned.length > 0 ? earned[earned.length - 1].threshold : 0;
  }, [save.stars]);
  const progress = next
    ? Math.min(1, Math.max(0, (save.stars - previousThreshold) / (next.threshold - previousThreshold)))
    : 1;

  const [tapped, setTapped] = useState<{ id: string; locked: boolean } | null>(null);
  const tapTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (tapTimer.current) window.clearTimeout(tapTimer.current);
    },
    [],
  );

  const tapSticker = (sticker: Sticker, isUnlocked: boolean) => {
    playSfx(isUnlocked ? 'pop' : 'click');
    speak(
      isUnlocked
        ? `${sticker.name}!`
        : `Locked. ${sticker.threshold} stars to unlock this sticker.`,
    );
    setTapped({ id: sticker.id, locked: !isUnlocked });
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => setTapped(null), 540);
  };

  return (
    <div className="screen">
      <ScreenHeader
        title="My Stickers"
        emoji="⭐"
        onBack={onBack}
        right={
          <IconButton
            label="Hear the instructions"
            onClick={() => speak('This is your sticker collection. Tap a sticker to hear its name. Play games to earn more stars!')}
          >
            🔊
          </IconButton>
        }
      />

      <div className="sticker-summary">
        <div>
          <p className="sticker-total">⭐ {save.stars} stars</p>
          <p className="sticker-count">
            {unlocked.size} of {STICKERS.length} stickers
          </p>
        </div>
        {next ? (
          <div className="sticker-next">
            <span className="sticker-next-emoji" aria-hidden>
              {next.emoji}
            </span>
            <span>
              {remaining} more {remaining === 1 ? 'star' : 'stars'}
            </span>
          </div>
        ) : (
          <div className="sticker-next complete">All collected! 👑</div>
        )}
      </div>

      {next ? (
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label={`${Math.round(progress * 100)}% to the next sticker`}
        >
          <span className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      ) : null}

      <div className="sticker-grid">
        {STICKERS.map((sticker) => {
          const isUnlocked = unlocked.has(sticker.id);
          const reaction =
            tapped?.id === sticker.id ? (tapped.locked ? 'nudge' : 'pop') : '';
          return (
            <button
              key={sticker.id}
              type="button"
              className={`sticker-card ${isUnlocked ? 'unlocked' : 'locked'}${reaction ? ` ${reaction}` : ''}`}
              aria-label={
                isUnlocked
                  ? `${sticker.name} sticker, tap to hear its name`
                  : `Locked sticker, ${sticker.threshold} stars`
              }
              onClick={() => tapSticker(sticker, isUnlocked)}
            >
              <span className="sticker-emoji" aria-hidden>
                {isUnlocked ? sticker.emoji : '🔒'}
              </span>
              <span className="sticker-name">
                {isUnlocked ? sticker.name : `${sticker.threshold} ⭐`}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          playSfx('star');
          speak('Keep playing to unlock more stickers!');
        }}
      >
        🎉 Cheer me on
      </button>
    </div>
  );
}
