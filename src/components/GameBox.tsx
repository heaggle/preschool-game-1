import type { ReactNode } from 'react';
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
