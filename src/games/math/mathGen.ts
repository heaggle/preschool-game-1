import { randInt } from '../../lib/random';

export type MathKind = 'add' | 'sub';

export type Problem = {
  kind: MathKind;
  max: number;
  a: number;
  b: number;
  answer: number;
};

export function makeProblem(kind: MathKind, max: number): Problem {
  const safeMax = Math.max(3, Math.floor(max));

  if (kind === 'add') {
    const a = randInt(1, safeMax - 1);
    const b = randInt(1, safeMax - a);
    return { kind, max: safeMax, a, b, answer: a + b };
  }

  const a = randInt(2, safeMax);
  const b = randInt(1, a - 1);
  return { kind, max: safeMax, a, b, answer: a - b };
}
