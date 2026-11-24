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
  type Profile,
  type SaveData,
  type Settings,
} from '../lib/storage';

type AppContextValue = {
  save: SaveData;
  addStars: (amount?: number) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
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
    setSave((current) => ({ ...current, stars: 0 }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ save, addStars, setProfile, setSettings, resetProgress }),
    [save, addStars, setProfile, setSettings, resetProgress],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
