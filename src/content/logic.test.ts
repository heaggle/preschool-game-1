import { describe, expect, it } from 'vitest';
import { CATEGORY_GROUPS, MEMORY_ITEMS, PATTERN_TOKENS } from './logic';

describe('logic content', () => {
  it('every category has at least 3 items (for odd-one-out)', () => {
    for (const group of CATEGORY_GROUPS) {
      expect(group.items.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('has unique item ids across categories', () => {
    const ids = new Set<string>();
    for (const group of CATEGORY_GROUPS) {
      for (const item of group.items) {
        expect(ids.has(item.id)).toBe(false);
        expect(item.emoji.length).toBeGreaterThan(0);
        ids.add(item.id);
      }
    }
  });

  it('has enough pattern tokens and they are unique', () => {
    expect(PATTERN_TOKENS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(PATTERN_TOKENS).size).toBe(PATTERN_TOKENS.length);
  });

  it('has enough named memory items for varied boards', () => {
    expect(MEMORY_ITEMS.length).toBeGreaterThanOrEqual(8);
    const emojis = new Set<string>();
    for (const item of MEMORY_ITEMS) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(emojis.has(item.emoji)).toBe(false);
      emojis.add(item.emoji);
    }
  });
});
