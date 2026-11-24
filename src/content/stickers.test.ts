import { describe, expect, it } from 'vitest';
import { STICKERS, nextSticker, unlockedStickers } from './stickers';

describe('stickers', () => {
  it('starts unlocked and grows with stars', () => {
    expect(unlockedStickers(0)).toHaveLength(1);
    expect(unlockedStickers(5)).toHaveLength(2);
    expect(unlockedStickers(500)).toHaveLength(STICKERS.length);
  });

  it('has strictly increasing thresholds', () => {
    for (let index = 1; index < STICKERS.length; index += 1) {
      expect(STICKERS[index].threshold).toBeGreaterThan(STICKERS[index - 1].threshold);
    }
  });

  it('points at the next locked sticker', () => {
    expect(nextSticker(0)?.threshold).toBe(5);
    expect(nextSticker(5)?.threshold).toBe(10);
    expect(nextSticker(500)).toBeNull();
  });
});
