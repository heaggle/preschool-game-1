import { describe, expect, it } from 'vitest';
import { CONTINENTS, COUNTRIES } from './geography';

describe('geography', () => {
  it('lists the 7 continents with unique ids and a picture', () => {
    expect(CONTINENTS).toHaveLength(7);
    const ids = new Set<string>();
    for (const continent of CONTINENTS) {
      expect(continent.name.length).toBeGreaterThan(0);
      expect(continent.emoji.length).toBeGreaterThan(0);
      expect(ids.has(continent.id)).toBe(false);
      ids.add(continent.id);
    }
  });

  it('has unique country ids and flags', () => {
    const ids = new Set<string>();
    const flags = new Set<string>();
    for (const country of COUNTRIES) {
      expect(ids.has(country.id)).toBe(false);
      expect(flags.has(country.flag)).toBe(false);
      ids.add(country.id);
      flags.add(country.flag);
    }
  });

  it('every country points to a known continent', () => {
    const continentIds = new Set(CONTINENTS.map((continent) => continent.id));
    for (const country of COUNTRIES) {
      expect(continentIds.has(country.continent)).toBe(true);
      expect(country.greeting.length).toBeGreaterThan(0);
      expect(country.languages.length).toBeGreaterThan(0);
    }
  });

  it('offers enough countries for varied rounds', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(12);
  });
});
