import { useCallback, useEffect, useState } from 'react';
import { playSfx, primeAudio } from './lib/audio';
import { CountingScreen } from './screens/CountingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MathScreen } from './screens/MathScreen';
import { ParentScreen } from './screens/ParentScreen';
import { StickersScreen } from './screens/StickersScreen';
import { WordsScreen } from './screens/WordsScreen';

export type ScreenName = 'home' | 'words' | 'counting' | 'math' | 'stickers' | 'parent';
export type Route = { screen: ScreenName; activity?: string };

const HOME: Route = { screen: 'home' };

function routeFromHistory(): Route {
  if (typeof window === 'undefined') return HOME;
  const state = window.history.state as Route | null;
  if (state && typeof state.screen === 'string') return state;
  return HOME;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHistory());

  useEffect(() => {
    window.history.replaceState(route, '');
    // Only stamp the initial entry; later entries are created by navigate().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      setRoute((event.state as Route | null) ?? HOME);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      primeAudio();
      const target = event.target as HTMLElement | null;
      if (target?.closest('button:not(:disabled)')) playSfx('click');
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.history.pushState(next, '');
    setRoute(next);
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => navigate(HOME), [navigate]);
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="app">
      <main className="app-main">
        {route.screen === 'home' ? (
          <HomeScreen
            onOpen={(target) => navigate({ screen: target })}
            onParent={() => navigate({ screen: 'parent' })}
          />
        ) : null}

        {route.screen === 'words' ? (
          <WordsScreen
            activity={route.activity}
            onSelect={(activity) => navigate({ screen: 'words', activity })}
            onBack={goBack}
            onHome={goHome}
          />
        ) : null}

        {route.screen === 'counting' ? (
          <CountingScreen
            activity={route.activity}
            onSelect={(activity) => navigate({ screen: 'counting', activity })}
            onBack={goBack}
            onHome={goHome}
          />
        ) : null}

        {route.screen === 'math' ? (
          <MathScreen
            activity={route.activity}
            onSelect={(activity) => navigate({ screen: 'math', activity })}
            onBack={goBack}
            onHome={goHome}
          />
        ) : null}

        {route.screen === 'stickers' ? <StickersScreen onBack={goBack} /> : null}

        {route.screen === 'parent' ? <ParentScreen onBack={goBack} /> : null}
      </main>
    </div>
  );
}
