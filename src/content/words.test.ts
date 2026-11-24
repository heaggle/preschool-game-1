import { describe, expect, it } from 'vitest';
import { ALL_WORDS, WORDS_2, WORDS_3 } from './words';

describe('word bank', () => {
  it('splits every word into syllables that rebuild the word', () => {
    for (const word of ALL_WORDS) {
      expect(word.syllables.join('').toLowerCase()).toBe(word.word.toLowerCase());
    }
  });

  it('uses the right number of syllables for each list', () => {
    for (const word of WORDS_2) expect(word.syllables).toHaveLength(2);
    for (const word of WORDS_3) expect(word.syllables).toHaveLength(3);
  });

  it('has a picture and a unique emoji for every word', () => {
    const emojis = new Set<string>();
    for (const word of ALL_WORDS) {
      expect(word.emoji.length).toBeGreaterThan(0);
      expect(emojis.has(word.emoji)).toBe(false);
      emojis.add(word.emoji);
    }
  });

  it('offers enough words to avoid a repetitive round', () => {
    expect(WORDS_2.length).toBeGreaterThanOrEqual(12);
    expect(WORDS_3.length).toBeGreaterThanOrEqual(12);
  });
});
