export type Settings = {
  soundOn: boolean;
  volume: number;
  voiceURI: string | null;
};

export type Profile = {
  name: string;
  avatar: string;
};

export type SaveData = {
  version: 1;
  stars: number;
  profile: Profile;
  settings: Settings;
};

const STORAGE_KEY = 'aphakids.save.v1';

export const DEFAULT_SAVE: SaveData = {
  version: 1,
  stars: 0,
  profile: { name: 'Friend', avatar: '🦊' },
  settings: { soundOn: true, volume: 0.9, voiceURI: null },
};

function clampVolume(value: unknown): number {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return DEFAULT_SAVE.settings.volume;
  return Math.min(1, Math.max(0, number));
}

function cleanName(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_SAVE.profile.name;
  const name = value.slice(0, 12).trim();
  return name.length > 0 ? name : DEFAULT_SAVE.profile.name;
}

function sanitize(raw: unknown): SaveData {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SAVE };
  const data = raw as Partial<SaveData>;
  const profile = (data.profile ?? {}) as Partial<Profile>;
  const settings = (data.settings ?? {}) as Partial<Settings>;

  const stars =
    typeof data.stars === 'number' && Number.isFinite(data.stars)
      ? Math.max(0, Math.floor(data.stars))
      : DEFAULT_SAVE.stars;

  return {
    version: 1,
    stars,
    profile: {
      name: cleanName(profile.name),
      avatar: typeof profile.avatar === 'string' && profile.avatar ? profile.avatar : DEFAULT_SAVE.profile.avatar,
    },
    settings: {
      soundOn: typeof settings.soundOn === 'boolean' ? settings.soundOn : DEFAULT_SAVE.settings.soundOn,
      volume: clampVolume(settings.volume),
      voiceURI: typeof settings.voiceURI === 'string' && settings.voiceURI ? settings.voiceURI : null,
    },
  };
}

export function loadSave(): SaveData {
  if (typeof window === 'undefined') return { ...DEFAULT_SAVE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function persistSave(data: SaveData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working.
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
