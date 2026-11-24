import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = process.cwd();
const dist = path.join(root, 'dist');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const file = path.join(dist, urlPath === '/' ? 'index.html' : urlPath);
  try {
    const data = await readFile(file);
    response.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
    });
    response.end(data);
  } catch {
    const html = await readFile(path.join(dist, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
  }
});
await new Promise((resolve) => server.listen(4175, resolve));

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  locale: 'en-US',
});
const page = await context.newPage();
await page.goto('http://localhost:4175/', { waitUntil: 'networkidle' });

const scan = async (label) => {
  await page.waitForTimeout(350);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  console.log(`\n=== ${label}: ${results.violations.length} violations ===`);
  for (const violation of results.violations) {
    console.log(`- [${violation.impact}] ${violation.id}: ${violation.help}`);
    for (const node of violation.nodes) {
      console.log(`    ${node.target.join(' ')}`);
      console.log(`    ${node.failureSummary?.replace(/\n/g, ' ')}`);
    }
  }
};

const openSection = async (card, game) => {
  await page.locator('.home-card', { hasText: card }).click();
  await page.waitForTimeout(250);
  if (game) {
    await page.locator('.menu-card', { hasText: game }).click();
    await page.waitForTimeout(300);
  }
};

const goHome = async () => {
  const rewardHome = page.getByRole('button', { name: 'Home', exact: true }).first();
  if ((await rewardHome.count()) > 0 && (await rewardHome.isVisible().catch(() => false))) {
    await rewardHome.click();
    await page.waitForTimeout(450);
    return;
  }
  const homeBtn = page.getByRole('button', { name: 'Go home' }).first();
  if ((await homeBtn.count()) > 0 && (await homeBtn.isVisible().catch(() => false))) {
    await homeBtn.click();
    await page.waitForTimeout(450);
    return;
  }
  const backBtn = page.getByRole('button', { name: 'Go back' }).first();
  if ((await backBtn.count()) > 0) {
    await backBtn.click();
    await page.waitForTimeout(450);
  }
  const onHome = await page.locator('.home-card').first().isVisible().catch(() => false);
  if (!onHome) {
    const anotherBack = page.getByRole('button', { name: 'Go back' }).first();
    if ((await anotherBack.count()) > 0) {
      await anotherBack.click();
      await page.waitForTimeout(450);
    }
  }
};

try {
  await scan('Home');
  await openSection('Words');
  await scan('Words menu');
  await page.locator('.menu-card', { hasText: 'Read Together' }).click();
  await scan('Read Together');
  await goHome();

  await openSection('Words', 'Build a Word');
  await scan('Build a Word');
  await goHome();

  await openSection('Words', 'Hear & Find');
  await scan('Hear & Find');
  for (let round = 0; round < 5; round += 1) {
    const cards = page.locator('.picture-card');
    const count = await cards.count();
    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      if (await card.isEnabled()) {
        await card.click({ force: true });
        await page.waitForTimeout(100);
      }
    }
    await page.waitForTimeout(1800);
  }
  await scan('Reward overlay');
  await goHome();

  await openSection('Counting', 'Count & Tap');
  await scan('Count & Tap');
  await goHome();

  await openSection('Counting', 'Count by 10s');
  await scan('Count by 10s');
  await goHome();

  await openSection('Math', 'Take Away 5');
  await scan('Take Away 5');
  await goHome();

  await page.getByRole('button', { name: 'Parent settings' }).click();
  await scan('Parent gate');
  const gate = await page.locator('.hold-btn').boundingBox();
  await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2400);
  await page.mouse.up();
  await page.waitForTimeout(400);
  await scan('Parent zone');
  await goHome();

  await page.evaluate(() => {
    const raw = window.localStorage.getItem('aphakids.save.v1');
    const save = raw ? JSON.parse(raw) : { version: 1 };
    save.stars = 60;
    window.localStorage.setItem('aphakids.save.v1', JSON.stringify(save));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await openSection('Stickers');
  await scan('Stickers');
} finally {
  await browser.close();
  server.close();
}
