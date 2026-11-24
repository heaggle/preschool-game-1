import { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from './ui';

export function ParentGate({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);
  const startedAt = useRef(0);

  const stop = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (frame.current !== null) return;
    startedAt.current = performance.now();

    const tick = () => {
      const value = Math.min(1, (performance.now() - startedAt.current) / 2200);
      setProgress(value);
      if (value >= 1) {
        frame.current = null;
        onSuccess();
      } else {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
  }, [onSuccess]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return (
    <div className="screen gate-screen">
      <header className="screen-header">
        <IconButton label="Go back" onClick={onBack} className="back-btn">
          ←
        </IconButton>
        <h1 className="screen-title">Grown-ups</h1>
      </header>

      <div className="gate-card">
        <div className="gate-emoji" aria-hidden>
          🔒
        </div>
        <h2 className="gate-title">Parents only</h2>
        <p className="gate-text">Press and hold the button for two seconds to open the settings.</p>

        <button
          type="button"
          className="hold-btn"
          onPointerDown={start}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onContextMenu={(event) => event.preventDefault()}
        >
          <span className="hold-fill" style={{ transform: `scaleX(${progress})` }} />
          <span className="hold-label">{progress > 0 ? 'Keep holding…' : 'Press and hold'}</span>
        </button>
      </div>
    </div>
  );
}
