import { useCallback, useEffect, useRef } from 'react';

/**
 * Runs `onAdvance` once after a short delay, so praise audio can finish
 * before the next question appears. The timer is cleared on unmount.
 */
export function useAdvance(onAdvance: () => void): (delay?: number) => void {
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  return useCallback(
    (delay = 1400) => {
      if (timer.current !== null) return;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        onAdvance();
      }, delay);
    },
    [onAdvance],
  );
}
