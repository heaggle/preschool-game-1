import { useEffect, type ReactNode } from 'react';
import { stopSpeaking } from '../lib/audio';
import { ROUND_LENGTH } from '../lib/constants';
import { useWakeLock } from '../lib/useWakeLock';
import { ProgressDots, RewardOverlay } from './ui';

export function GameBox({
  done,
  onAgain,
  onHome,
  children,
}: {
  done: number;
  onAgain: () => void;
  onHome: () => void;
  children: ReactNode;
}) {
  useWakeLock(true);

  // Stop any queued speech when leaving the game, so praise or instructions
  // never bleed into the home screen or the next activity.
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="game">
      <ProgressDots done={done} total={ROUND_LENGTH} />
      <div className="game-content">{children}</div>
      <RewardOverlay
        open={done >= ROUND_LENGTH}
        starsEarned={ROUND_LENGTH}
        onAgain={onAgain}
        onHome={onHome}
      />
    </div>
  );
}
