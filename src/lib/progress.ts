import type { Domain, Progress } from './storage';

export const DOMAIN_META: Record<Domain, { label: string; emoji: string }> = {
  words: { label: 'Words', emoji: '📖' },
  counting: { label: 'Counting', emoji: '🔢' },
  math: { label: 'Math', emoji: '➕' },
  logic: { label: 'Logic', emoji: '🧠' },
  geography: { label: 'Geography', emoji: '🌍' },
  madagascar: { label: 'Madagascar', emoji: '🇲🇬' },
  robot: { label: 'Robot', emoji: '🤖' },
};

export const DOMAINS = Object.keys(DOMAIN_META) as Domain[];

/** Small, friendly level based on the number of correct answers. */
export function levelFor(count: number): number {
  if (count >= 100) return 5;
  if (count >= 50) return 4;
  if (count >= 25) return 3;
  if (count >= 10) return 2;
  if (count >= 1) return 1;
  return 0;
}

/** The domain the child has practised the least — a gentle "next" hint. */
export function suggestedDomain(progress: Progress): Domain | null {
  let best: Domain | null = null;
  let bestCount = Infinity;
  for (const domain of DOMAINS) {
    if (progress[domain] < bestCount) {
      bestCount = progress[domain];
      best = domain;
    }
  }
  return best;
}
