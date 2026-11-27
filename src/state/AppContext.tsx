import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { configureAudio } from '../lib/audio';
import {
  loadSave,
  persistSave,
  type Domain,
  type Profile,
  type SaveData,
  type Settings,
  type TalentAxis,
} from '../lib/storage';

type AppContextValue = {
  save: SaveData;
  addStars: (amount?: number) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
  recordTalent: (axis: TalentAxis, correctFirstTry: boolean) => void;
  resetTalents: () => void;
  recordProgress: (domain: Domain, amount?: number) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => loadSave());

  useEffect(() => {
    persistSave(save);
  }, [save]);

  useLayoutEffect(() => {
    configureAudio(save.settings);
  }, [save.settings]);

  useEffect(() => {
    if (navigator.storage?.persist) {
      void navigator.storage.persist().catch(() => undefined);
    }
  }, []);

  const addStars = useCallback((amount = 1) => {
    setSave((current) => ({ ...current, stars: Math.max(0, current.stars + amount) }));
  }, []);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setSave((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSave((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    setSave((current) => ({
      ...current,
      stars: 0,
      progress: {
        words: 0,
        counting: 0,
        math: 0,
        logic: 0,
        geography: 0,
        madagascar: 0,
        robot: 0,
      },
    }));
  }, []);

  const recordTalent = useCallback((axis: TalentAxis, correctFirstTry: boolean) => {
    setSave((current) => {
      const stats = current.talents[axis];
      return {
        ...current,
        talents: {
          ...current.talents,
          [axis]: {
            right: stats.right + (correctFirstTry ? 1 : 0),
            total: stats.total + 1,
          },
        },
      };
    });
  }, []);

  const resetTalents = useCallback(() => {
    setSave((current) => ({
      ...current,
      talents: {
        math: { right: 0, total: 0 },
        letters: { right: 0, total: 0 },
        logic: { right: 0, total: 0 },
      },
    }));
  }, []);

  const recordProgress = useCallback((domain: Domain, amount = 1) => {
    setSave((current) => ({
      ...current,
      progress: { ...current.progress, [domain]: (current.progress[domain] ?? 0) + amount },
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      save,
      addStars,
      setProfile,
      setSettings,
      resetProgress,
      recordTalent,
      resetTalents,
      recordProgress,
    }),
    [save, addStars, setProfile, setSettings, resetProgress, recordTalent, resetTalents, recordProgress],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
