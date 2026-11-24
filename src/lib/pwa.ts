import { useState, useSyncExternalStore } from 'react';
import { registerSW } from 'virtual:pwa-register';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getCanInstall(): boolean {
  return deferredPrompt !== null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const displayMode = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return displayMode || iosStandalone;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function useInstallPrompt() {
  const canInstall = useSyncExternalStore(subscribe, getCanInstall, getCanInstall);
  const [busy, setBusy] = useState(false);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) return 'unavailable';
    setBusy(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      notify();
      return choice.outcome;
    } finally {
      setBusy(false);
    }
  };

  return {
    canInstall,
    busy,
    promptInstall,
    isIOS: isIOS(),
    standalone: isStandalone(),
  };
}

/* ---------------------------------------------------------------
   App updates
   The service worker no longer swaps versions on its own: it waits,
   and the new version is offered on the home screen and applied from
   the Parent Zone.
--------------------------------------------------------------- */

let needRefresh = false;
let registration: ServiceWorkerRegistration | undefined;
let updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;
let updatesStarted = false;

function getNeedRefresh(): boolean {
  return needRefresh;
}

/** Registers the service worker once and starts watching for new versions. */
export function initPwaUpdates(): void {
  if (updatesStarted || typeof window === 'undefined') return;
  updatesStarted = true;

  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      needRefresh = true;
      notify();
    },
    onRegisteredSW(_swUrl, swRegistration) {
      registration = swRegistration;
    },
  });
}

export type UpdateCheck = 'ready' | 'current' | 'unavailable';

export function useAppUpdate() {
  const ready = useSyncExternalStore(subscribe, getNeedRefresh, getNeedRefresh);
  const [checking, setChecking] = useState(false);

  const applyUpdate = async (): Promise<void> => {
    const update = updateSW;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      window.location.reload();
      return;
    }
    if (!update) {
      window.location.reload();
      return;
    }

    // Reload ourselves as soon as the new worker takes control. This also
    // covers a first install followed by an update in the same session, where
    // workbox-window does not fire its own reload.
    const reload = () => {
      navigator.serviceWorker.removeEventListener('controllerchange', reload);
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', reload);
    window.setTimeout(reload, 2000);

    await update(false);
  };

  const checkForUpdate = async (): Promise<UpdateCheck> => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return 'unavailable';
    setChecking(true);
    try {
      const reg = registration ?? (await navigator.serviceWorker.getRegistration());
      if (!reg) return 'unavailable';
      registration = reg;
      await reg.update();
      // Give the browser a moment to fire updatefound and the waiting event.
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      return needRefresh ? 'ready' : 'current';
    } catch {
      return 'unavailable';
    } finally {
      setChecking(false);
    }
  };

  return { needRefresh: ready, checking, applyUpdate, checkForUpdate };
}
