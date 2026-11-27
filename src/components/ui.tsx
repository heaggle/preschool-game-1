import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buzz, playSfx, speak } from '../lib/audio';
import { useApp } from '../state/AppContext';
export function IconButton({
  label,
  onClick,
  children,
  className = '',
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function ScreenHeader({
  title,
  emoji,
  onBack,
  right,
}: {
  title: string;
  emoji?: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="screen-header">
      <IconButton label="Go back" onClick={onBack} className="back-btn">
        ←
      </IconButton>
      <h1 className="screen-title">
        {emoji ? <span aria-hidden>{emoji} </span> : null}
        {title}
      </h1>
      {right ? <div className="header-right">{right}</div> : null}
    </header>
  );
}

export function StarBar() {
  const { save } = useApp();
  const [bump, setBump] = useState(false);
  const previous = useRef(save.stars);

  useEffect(() => {
    if (save.stars > previous.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 460);
      previous.current = save.stars;
      return () => window.clearTimeout(timer);
    }
    previous.current = save.stars;
    return undefined;
  }, [save.stars]);

  return (
    <div className={`star-bar ${bump ? 'bump' : ''}`} aria-label={`${save.stars} stars`}>
      <span className="star-icon" aria-hidden>
        ⭐
      </span>
      <span className="star-count">{save.stars}</span>
      <span className="star-label">stars</span>
    </div>
  );
}

export function ProgressDots({ done, total }: { done: number; total: number }) {
  return (
    <div
      className="progress-dots"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={`${done} of ${total} finished`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`dot ${index < done ? 'done' : ''}`} />
      ))}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Dialog'}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        {title ? <h2 className="modal-title">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

const CONFETTI_COLORS = ['#FFD93D', '#FF6B6B', '#5AD8A6', '#9B7EDE', '#4CC3FF', '#FFFFFF'];

export function Confetti({ count = 44 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 1.9 + Math.random() * 1.5,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        size: 8 + Math.random() * 9,
        rotation: Math.random() * 360,
      })),
    [count],
  );

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((piece, index) => (
        <i
          key={index}
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.5,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function RewardOverlay({
  open,
  starsEarned,
  onAgain,
  onHome,
}: {
  open: boolean;
  starsEarned: number;
  onAgain: () => void;
  onHome: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    playSfx('win');
    buzz(35);
    speak(`Amazing! You earned ${starsEarned} stars!`);
  }, [open, starsEarned]);

  if (!open) return null;

  return (
    <>
      <Confetti />
      <div className="overlay reward-overlay">
        <div className="reward-card" role="dialog" aria-modal="true" aria-label="Round complete">
          <img
            className="reward-mascot"
            src={`${import.meta.env.BASE_URL}mascot.svg`}
            alt=""
            aria-hidden
          />
          <h2 className="reward-title">Amazing!</h2>
          <p className="reward-stars">+{starsEarned} ⭐</p>
          <div className="reward-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAgain}
            >
              Play again
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHome}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
