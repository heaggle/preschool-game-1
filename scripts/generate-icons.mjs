import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'icons');
const icon = path.join(root, 'public', 'icon.svg');
const maskable = path.join(root, 'public', 'icon-maskable.svg');

await mkdir(outDir, { recursive: true });

const targets = [
  { file: 'icon-192.png', size: 192, source: icon },
  { file: 'icon-512.png', size: 512, source: icon },
  { file: 'icon-maskable-512.png', size: 512, source: maskable },
  { file: 'apple-touch-icon.png', size: 180, source: maskable },
];

for (const { file, size, source } of targets) {
  await sharp(source).resize(size, size).png().toFile(path.join(outDir, file));
  console.log(`generated ${file} (${size}x${size})`);
}

console.log('PWA icons are ready.');
