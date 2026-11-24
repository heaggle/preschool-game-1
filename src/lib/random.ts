export function randInt(min: number, max: number): number {
  if (max < min) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/**
 * Builds a short list of answer choices that always contains the answer.
 * Distractors stay close to the answer so the exercise stays gentle.
 */
export function buildChoices(answer: number, count = 3, min = 0): number[] {
  const values = new Set<number>([answer]);
  const offsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];

  for (const offset of offsets) {
    if (values.size >= count) break;
    const candidate = answer + offset;
    if (candidate >= min) values.add(candidate);
  }

  let guard = 0;
  while (values.size < count && guard < 200) {
    guard += 1;
    values.add(randInt(min, Math.max(min + 6, answer + 6)));
  }

  return shuffle([...values]).slice(0, count);
}

const PRAISE = ['Great job!', 'Well done!', 'You did it!', 'Awesome!', 'Super!'];

export function praise(): string {
  return pick(PRAISE);
}
