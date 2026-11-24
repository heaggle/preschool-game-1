# Aphakids v1

A small, playful **PWA** (no APK) that helps a 4–6 year old learn in English:

- **Words** — listen & find, read syllables, build 2- and 3-syllable words.
- **Counting** — count & tap, missing numbers 1–20, count by 10s to 100, number hunt 1–100.
- **Math** — visual addition and subtraction up to 5, 10 and 20.
- **Rewards** — stars and 20 collectible stickers.
- **Parent Zone** — protected by press-and-hold, with name/avatar, sound, voice, install help and reset.

Everything runs **offline**, with **no ads, no accounts and no tracking**. All progress is stored on the device only.

## Run it

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

```bash
npm test        # logic tests (words, math generator, stickers)
npm run build   # type-check + production build in dist/
npm run preview # serve the production build locally
```

### End-to-end checks (optional)

The browser checks use the locally installed Chrome. Set `CHROME_PATH` if yours lives elsewhere.

```bash
npm run smoke        # screens, offline reload, service worker, install screens
npm run smoke:games  # plays every game mode end to end (5 rounds each)
npm run a11y         # axe-core WCAG A/AA scan on every screen
```

They expect `npm run build` to have run first, and write screenshots to `shots/`.

## Install on a phone

A PWA can only be installed from a **secure (HTTPS)** origin, or from `localhost`.

1. Deploy `dist/` to any HTTPS static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages…).
2. **Android / Chrome** — open the site, then use “Install app” in the Parent Zone (or Chrome’s menu).
3. **iPhone / iPad / Safari** — Share → **Add to Home Screen** (also explained in the Parent Zone).

After the first visit, the service worker caches the app shell, fonts and icons. The app then works with no network.

> Testing on a phone over plain `http://192.168.x.x` will show the UI, but the service worker and the install prompt stay disabled. Use a temporary HTTPS tunnel or deploy to test real installation.

### Deploying under a sub-path

The default configuration targets the root of a domain. For a GitHub Pages project site (for example `https://name.github.io/aphakids/`), add `base: '/aphakids/'` to `vite.config.ts`. The manifest uses relative `start_url` and `scope` values, so installation keeps working.

## Structure

```
src/
  App.tsx                 screen router + global audio unlock
  screens/                Home, Words, Counting, Math, Stickers, Parent
  games/words/            Hear & Find, Read Together, Build a Word + word bank
  games/counting/         Count & Tap, What's Next?, Count by 10s, Number Hunt
  games/math/             problem generator + visual add/sub
  components/             shared UI, game frame, hundred chart, parent gate
  lib/                    audio (TTS + WebAudio SFX), storage, PWA, random, hooks
  content/                words, stickers
  state/                  profile, stars, settings context
  styles/                 design tokens, base layout, components
public/
  icon.svg                source icon
  icon-maskable.svg       maskable source
  icons/                  generated PWA icons
scripts/
  generate-icons.mjs      regenerates icons with sharp
```

## Audio

Voice uses the device's English speech synthesis (`en-US`) and sound effects are synthesised with the Web Audio API, so there is no audio asset to download. If the device has no English voice, the app stays fully playable visually.

The audio layer exposes `speak()` and `playSfx()`; swapping in recorded files later only requires changing `src/lib/audio.ts`, not the games.

## Notes

- `npm run icons` regenerates `public/icons/*` from the SVG sources.
- The manifest, icons and Workbox configuration live in `vite.config.ts`.
- The app is designed portrait-first, with large touch targets, safe-area padding and reduced-motion support.
- No external requests are made at runtime: fonts are bundled from `@fontsource-variable/fredoka`.
