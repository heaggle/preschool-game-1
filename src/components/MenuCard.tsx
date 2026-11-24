export function MenuCard({
  emoji,
  title,
  subtitle,
  accent,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  accent: 'grape' | 'sky' | 'coral' | 'sun' | 'mint';
  onClick: () => void;
}) {
  return (
    <button type="button" className={`menu-card accent-${accent}`} onClick={onClick}>
      <span className="menu-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="menu-name">{title}</span>
      <span className="menu-desc">{subtitle}</span>
    </button>
  );
}
