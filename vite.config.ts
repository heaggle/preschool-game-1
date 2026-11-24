import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'AlphaKids — Read, Count, Play',
        short_name: 'AlphaKids',
        description:
          'A safe, playful app for ages 4–6: read easy words, count to 100, and practise addition and subtraction.',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#4CC3FF',
        background_color: '#FFF8ED',
        lang: 'en',
        categories: ['education', 'kids'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Wait for the user (through the Parent Zone) before swapping versions,
        // so a running game is never reloaded mid-round. clientsClaim lets the
        // activated worker take over once the user asks for the update.
        skipWaiting: false,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    target: 'es2020',
  },
});
