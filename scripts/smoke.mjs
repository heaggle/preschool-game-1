import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist');
const shots = path.join(root, 'shots');
await mkdir(shots, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const server = createServer(async (request, response) => {
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const file = path.join(dist, urlPath === '/' ? 'index.html' : urlPath);
  try {
    const data = await readFile(file);
    response.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(data);
  } catch {
    const html = await readFile(path.join(dist, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
  }
});

await new Promise((resolve) => server.listen(4173, resolve));

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  locale: 'en-US',
});

const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});

const shot = async (name, fullPage = true) => {
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(shots, `${name}.png`), fullPage });
  console.log(`screenshot: ${name}`);
};

const reportOverflow = async (label) => {
  const data = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  console.log(`overflow ${label}: ${data.scrollWidth}/${data.width}`);
  return data.scrollWidth <= data.width + 1;
};

try {
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await shot('01-home', false);
  await reportOverflow('home-390');

  console.log('title:', await page.title());
  console.log('manifest:', await page.locator('link[rel="manifest"]').getAttribute('href'));

  // Words menu -> Hear & Find -> play five rounds.
  await page.locator('.home-card', { hasText: 'Words' }).click();
  await shot('02-words-menu');
  await page.locator('.menu-card', { hasText: 'Hear & Find' }).click();
  await shot('03-hear-and-find');
  await reportOverflow('find-390');

  for (let round = 0; round < 5; round += 1) {
    const cards = page.locator('.picture-card');
    const count = await cards.count();
    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      if (await card.isEnabled()) {
        await card.click({ force: true });
        await page.waitForTimeout(120);
      }
    }
    await page.waitForTimeout(1900);
  }

  const rewardVisible = await page.locator('.reward-card').isVisible().catch(() => false);
  console.log('reward after 5 rounds:', rewardVisible);
  if (rewardVisible) await shot('04-reward', false);
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.waitForTimeout(400);

  // Counting -> Count & Tap.
  await page.locator('.home-card', { hasText: 'Counting' }).click();
  await shot('05-counting-menu');
  await page.locator('.menu-card', { hasText: 'Count & Tap' }).click();
  await shot('06-count-and-tap');
  const objects = page.locator('.count-object');
  const objectCount = await objects.count();
  for (let index = 0; index < objectCount; index += 1) {
    const object = objects.nth(index);
    if (await object.isEnabled()) {
      await object.click({ force: true });
      await page.waitForTimeout(140);
    }
  }
  await page.waitForTimeout(900);
  await shot('07-how-many');
  const choices = page.locator('.question-card .choice');
  const choiceCount = await choices.count();
  for (let index = 0; index < choiceCount; index += 1) {
    const choice = choices.nth(index);
    if (await choice.isEnabled()) {
      await choice.click({ force: true });
      await page.waitForTimeout(150);
    }
  }
  await page.waitForTimeout(1800);
  await page.getByRole('button', { name: 'Go home' }).click();
  await page.waitForTimeout(400);

  // Math.
  await page.locator('.home-card', { hasText: 'Math' }).click();
  await shot('08-math-menu');
  await page.locator('.menu-card', { hasText: 'Take Away 10' }).click();
  await shot('09-take-away');
  await reportOverflow('math-390');
  await page.getByRole('button', { name: 'Go home' }).click();
  await page.waitForTimeout(400);

  // Parent gate.
  await page.getByRole('button', { name: 'Parent settings' }).click();
  await shot('10-parent-gate', false);
  const gate = await page.locator('.hold-btn').boundingBox();
  if (!gate) throw new Error('Hold button not found');
  await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2400);
  await page.mouse.up();
  await page.waitForTimeout(400);
  const parentVisible = await page
    .locator('.screen-title', { hasText: 'Parent Zone' })
    .isVisible()
    .catch(() => false);
  console.log('parent zone opened:', parentVisible);
  if (parentVisible) {
    await shot('11-parent-zone');
    await reportOverflow('parent-390');
    await page.getByRole('button', { name: 'Go back' }).click();
  }

  // Simulate a child with 60 stars, then open stickers.
  await page.evaluate(() => {
    const raw = window.localStorage.getItem('alphakids.save.v1');
    const save = raw ? JSON.parse(raw) : { version: 1 };
    save.stars = 60;
    save.profile = { name: 'Lina', avatar: '🦊' };
    window.localStorage.setItem('alphakids.save.v1', JSON.stringify(save));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await shot('12-home-lina', false);
  await page.locator('.home-card', { hasText: 'Stickers' }).click();
  await shot('13-stickers');
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForTimeout(300);

  // Small phone layout.
  await page.setViewportSize({ width: 360, height: 640 });
  await page.waitForTimeout(400);
  await shot('14-home-360', false);
  console.log('overflow home-360 ok:', await reportOverflow('home-360'));
  await page.locator('.home-card', { hasText: 'Words' }).click();
  await page.locator('.menu-card', { hasText: 'Build a Word' }).click();
  await shot('15-build-360');
  console.log('overflow build-360 ok:', await reportOverflow('build-360'));

  // Tablet layout.
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Go home' }).click();
  await shot('16-home-tablet', false);

  // Service worker + icons.
  const swState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state ?? 'none';
  });
  console.log('service worker:', swState);

  for (const icon of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
    const response = await page.request.get(`http://localhost:4173/icons/${icon}`);
    console.log(`icon ${icon}:`, response.status(), response.headers()['content-type']);
  }

  // Offline reload (reload once while online so the SW controls the page).
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const offlineHome = await page.locator('.home-card', { hasText: 'Words' }).isVisible().catch(() => false);
  console.log('offline home visible:', offlineHome);
  await shot('17-offline', false);
  await context.setOffline(false);

  console.log('errors:', errors.length ? errors : 'none');
} catch (error) {
  console.error('SMOKE FAILED:', error);
  await shot('99-failure', false);
  console.log('errors:', errors);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
