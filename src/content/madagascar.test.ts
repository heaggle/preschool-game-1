import { describe, expect, it } from 'vitest';
import { ANIMALS, ETHNICITIES, PLACES, PROVINCES } from './madagascar';

describe('madagascar', () => {
  it('has 6 provinces with unique ids', () => {
    expect(PROVINCES).toHaveLength(6);
    const ids = new Set<string>();
    for (const province of PROVINCES) {
      expect(ids.has(province.id)).toBe(false);
      expect(province.capital.length).toBeGreaterThan(0);
      expect(province.zone.length).toBeGreaterThan(0);
      ids.add(province.id);
    }
  });

  it('every place points to a known province', () => {
    const provinceIds = new Set(PROVINCES.map((province) => province.id));
    for (const place of PLACES) {
      expect(provinceIds.has(place.province)).toBe(true);
      expect(place.emoji.length).toBeGreaterThan(0);
    }
  });

  it('lists the 18 ethnic groups (foko 18)', () => {
    expect(ETHNICITIES).toHaveLength(18);
    const ids = new Set<string>();
    for (const ethnicity of ETHNICITIES) {
      expect(ids.has(ethnicity.id)).toBe(false);
      expect(ethnicity.region.length).toBeGreaterThan(0);
      ids.add(ethnicity.id);
    }
  });

  it('has animals and places enough for varied rounds', () => {
    expect(ANIMALS.length).toBeGreaterThanOrEqual(6);
    expect(PLACES.length).toBeGreaterThanOrEqual(10);
  });
});
