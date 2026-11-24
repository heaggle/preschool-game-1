import { useEffect } from 'react';

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
};

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

/** Keeps the screen awake while a game is open, when the browser allows it. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const nav = navigator as WakeLockNavigator;
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        if (document.visibilityState !== 'visible') return;
        const lock = await nav.wakeLock?.request('screen');
        if (cancelled) {
          void lock?.release();
          return;
        }
        sentinel = lock ?? null;
      } catch {
        // Wake lock is optional and often blocked by battery saver.
      }
    };

    void request();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void request();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel?.release().catch(() => undefined);
    };
  }, [active]);
}
