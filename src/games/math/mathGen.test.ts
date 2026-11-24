import { describe, expect, it } from 'vitest';
import { buildChoices } from '../../lib/random';
import { makeProblem } from './mathGen';

describe('math generator', () => {
  it('keeps addition within the chosen maximum', () => {
    for (const max of [5, 10, 20]) {
      for (let index = 0; index < 200; index += 1) {
        const problem = makeProblem('add', max);
        expect(problem.a + problem.b).toBe(problem.answer);
        expect(problem.answer).toBeLessThanOrEqual(max);
        expect(problem.a).toBeGreaterThanOrEqual(1);
        expect(problem.b).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('never produces a negative subtraction', () => {
    for (const max of [5, 10, 20]) {
      for (let index = 0; index < 200; index += 1) {
        const problem = makeProblem('sub', max);
        expect(problem.a - problem.b).toBe(problem.answer);
        expect(problem.answer).toBeGreaterThan(0);
        expect(problem.b).toBeGreaterThanOrEqual(1);
        expect(problem.b).toBeLessThan(problem.a);
      }
    }
  });
});

describe('answer choices', () => {
  it('always contains the answer with unique values', () => {
    for (let answer = 0; answer <= 20; answer += 1) {
      const choices = buildChoices(answer, 3, 0);
      expect(choices).toHaveLength(3);
      expect(new Set(choices).size).toBe(3);
      expect(choices).toContain(answer);
      for (const choice of choices) expect(choice).toBeGreaterThanOrEqual(0);
    }
  });

  it('never offers negative answers for counting games', () => {
    for (let answer = 1; answer <= 10; answer += 1) {
      const choices = buildChoices(answer, 3, 1);
      for (const choice of choices) expect(choice).toBeGreaterThanOrEqual(1);
    }
  });
});
