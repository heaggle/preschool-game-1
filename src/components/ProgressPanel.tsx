import { DOMAINS, DOMAIN_META, levelFor, suggestedDomain } from '../lib/progress';
import type { Progress } from '../lib/storage';

const BAR_MAX = 50;

export function ProgressPanel({ progress }: { progress: Progress }) {
  const suggestion = suggestedDomain(progress);

  return (
    <div className="talent-profile">
      {DOMAINS.map((domain) => {
        const count = progress[domain];
        const level = levelFor(count);
        const meta = DOMAIN_META[domain];
        const pct = Math.min(100, Math.round((count / BAR_MAX) * 100));
        return (
          <div key={domain} className="talent-row">
            <span className="talent-emoji" aria-hidden>
              {meta.emoji}
            </span>
            <span className="talent-label">{meta.label}</span>
            <div
              className="talent-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={BAR_MAX}
              aria-valuenow={count}
            >
              <span className="talent-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="talent-pct">{level > 0 ? `Lv ${level}` : '—'}</span>
          </div>
        );
      })}
      {suggestion ? (
        <p className="talent-note">
          Next to explore: {DOMAIN_META[suggestion].emoji} {DOMAIN_META[suggestion].label}.
        </p>
      ) : null}
    </div>
  );
}
