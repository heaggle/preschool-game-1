import { describe, expect, it } from 'vitest';
import { PHONIC_WORDS } from './phonics';

describe('phonics word bank', () => {
  it('contains only lowercase 3-letter (CVC) words', () => {
    for (const word of PHONIC_WORDS) {
      expect(word.word).toMatch(/^[a-z]{3}$/);
    }
  });

  it('every word has a picture and unique spelling', () => {
    const words = new Set<string>();
    for (const word of PHONIC_WORDS) {
      expect(word.emoji.length).toBeGreaterThan(0);
      expect(words.has(word.word)).toBe(false);
      words.add(word.word);
    }
  });

  it('every rhyme family has at least 2 words', () => {
    const counts = new Map<string, number>();
    for (const word of PHONIC_WORDS) {
      counts.set(word.family, (counts.get(word.family) ?? 0) + 1);
    }
    for (const [, count] of counts) {
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  it('offers several different starting letters (for first-sound games)', () => {
    const initials = new Set(PHONIC_WORDS.map((word) => word.initial));
    expect(initials.size).toBeGreaterThanOrEqual(8);
  });

  it('offers enough words to avoid a repetitive round', () => {
    expect(PHONIC_WORDS.length).toBeGreaterThanOrEqual(20);
  });
});
