import type { TalentAxis, Talents } from '../lib/storage';

const AXES: { key: TalentAxis; label: string; emoji: string }[] = [
  { key: 'math', label: 'Numbers', emoji: '🔢' },
  { key: 'letters', label: 'Letters', emoji: '🔤' },
  { key: 'logic', label: 'Logic', emoji: '🧩' },
];

export function TalentProfile({ talents }: { talents: Talents }) {
  const totalAttempts = AXES.reduce((sum, axis) => sum + talents[axis.key].total, 0);

  return (
    <div className="talent-profile">
      {AXES.map((axis) => {
        const stats = talents[axis.key];
        const pct = stats.total > 0 ? Math.round((stats.right / stats.total) * 100) : null;
        return (
          <div key={axis.key} className="talent-row">
            <span className="talent-emoji" aria-hidden>
              {axis.emoji}
            </span>
            <span className="talent-label">{axis.label}</span>
            <div
              className="talent-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct ?? 0}
            >
              <span className="talent-fill" style={{ width: `${pct ?? 0}%` }} />
            </div>
            <span className="talent-pct">{pct === null ? '—' : `${pct}%`}</span>
          </div>
        );
      })}
      <p className="talent-note">
        {totalAttempts > 0
          ? `Based on ${totalAttempts} answers while playing.`
          : 'Play the Explorations to reveal your child’s strengths.'}
      </p>
    </div>
  );
}
