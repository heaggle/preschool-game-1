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

await new Promise((resolve) => server.listen(4174, resolve));

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

const makePage = async (options = {}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    locale: 'en-US',
    ...options,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors };
};

const shot = async (page, name) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(shots, `${name}.png`), fullPage: true });
  console.log(`screenshot: ${name}`);
};

const openSection = async (page, card, game) => {
  await page.locator('.home-card', { hasText: card }).click();
  await page.waitForTimeout(250);
  await page.locator('.menu-card', { hasText: game }).click();
  await page.waitForTimeout(300);
};

const clickChoice = async (page, value) => {
  await page
    .locator('.choice')
    .filter({ hasText: new RegExp(`^${value}$`) })
    .first()
    .click({ force: true });
};

const goHome = async (page) => {
  const reward = await page.locator('.reward-card').isVisible().catch(() => false);
  if (reward) {
    await page.getByRole('button', { name: 'Home', exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Go home' }).click();
  }
  await page.waitForTimeout(400);
};

const { context, page, errors } = await makePage();

try {
  // ------------------------------------------------------------
  // Read Together: 5 words.
  // ------------------------------------------------------------
  await openSection(page, 'Words', 'Read Together');
  await shot(page, '20-read-together');
  for (let round = 0; round < 5; round += 1) {
    const chips = page.locator('.read-chip');
    const chipCount = await chips.count();
    for (let index = 0; index < chipCount; index += 1) {
      await chips.nth(index).click({ force: true });
      await page.waitForTimeout(80);
    }
    await page.getByRole('button', { name: /Blend it/ }).click();
    await page.waitForTimeout(350);
    if (round === 0) await shot(page, '21-read-blended');
    await page.getByRole('button', { name: /Next word/ }).click({ force: true });
    await page.waitForTimeout(450);
  }
  console.log('read reward:', await page.locator('.reward-card').isVisible());
  await goHome(page);

  // ------------------------------------------------------------
  // Build a Word: 5 words, brute force the correct order.
  // ------------------------------------------------------------
  await openSection(page, 'Words', 'Build a Word');
  await shot(page, '22-build-word');
  for (let round = 0; round < 5; round += 1) {
    let guard = 0;
    while (guard < 30 && !(await page.locator('.build-done').isVisible().catch(() => false))) {
      guard += 1;
      const tiles = page.locator('.syllable-tile');
      const tileCount = await tiles.count();
      let clicked = false;
      for (let index = 0; index < tileCount; index += 1) {
        const tile = tiles.nth(index);
        if (await tile.isEnabled()) {
          await tile.click({ force: true });
          clicked = true;
          await page.waitForTimeout(70);
        }
      }
      if (!clicked) break;
    }
    await page.locator('.build-done .btn').click({ force: true });
    await page.waitForTimeout(450);
  }
  console.log('build reward:', await page.locator('.reward-card').isVisible());
  await goHome(page);

  // ------------------------------------------------------------
  // What's Next?
  // ------------------------------------------------------------
  await openSection(page, 'Counting', "What's Next?");
  await shot(page, '23-whats-next');
  for (let round = 0; round < 5; round += 1) {
    const items = await page.locator('.seq-item').allInnerTexts();
    const blank = items.indexOf('?');
    const answer = blank === 0 ? Number(items[1]) - 1 : Number(items[blank - 1]) + 1;
    await clickChoice(page, answer);
    await page.waitForTimeout(1900);
  }
  console.log("what's-next reward:", await page.locator('.reward-card').isVisible());
  await goHome(page);

  // ------------------------------------------------------------
  // Count by 10s.
  // ------------------------------------------------------------
  await openSection(page, 'Counting', 'Count by 10s');
  await shot(page, '24-count-by-tens');
  for (let round = 0; round < 5; round += 1) {
    const items = await page.locator('.tens-item').allInnerTexts();
    const blank = items.indexOf('?');
    const answer = blank === 0 ? Number(items[1]) - 10 : Number(items[blank - 1]) + 10;
    await clickChoice(page, answer);
    await page.waitForTimeout(1900);
  }
  console.log('tens reward:', await page.locator('.reward-card').isVisible());
  await goHome(page);

  // ------------------------------------------------------------
  // Number Hunt.
  // ------------------------------------------------------------
  await openSection(page, 'Counting', 'Number Hunt');
  await shot(page, '25-number-hunt');
  for (let round = 0; round < 5; round += 1) {
    const target = (await page.locator('.hunt-number').innerText()).trim();
    await page.locator(`.hundred-cell[aria-label="${target}"]`).click({ force: true });
    await page.waitForTimeout(1900);
  }
  console.log('hunt reward:', await page.locator('.reward-card').isVisible());
  await goHome(page);

  // ------------------------------------------------------------
  // Math: Add to 10.
  // ------------------------------------------------------------
  await openSection(page, 'Math', 'Add to 10');
  await shot(page, '26-add-to-ten');
  for (let round = 0; round < 5; round += 1) {
    const equation = (await page.locator('.equation').innerText()).replace(/\s+/g, ' ');
    const match = equation.match(/(\d+)\s*([+−-])\s*(\d+)/);
    if (!match) throw new Error(`Cannot parse equation: ${equation}`);
    const a = Number(match[1]);
    const b = Number(match[3]);
    const answer = match[2] === '+' ? a + b : a - b;
    await clickChoice(page, answer);
    await page.waitForTimeout(1900);
  }
  console.log('math reward:', await page.locator('.reward-card').isVisible());
  await shot(page, '27-math-reward');
  await goHome(page);

  // ------------------------------------------------------------
  // Parent: change name, toggle sound, reset progress.
  // ------------------------------------------------------------
  await page.getByRole('button', { name: 'Parent settings' }).click();
  const gate = await page.locator('.hold-btn').boundingBox();
  await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2400);
  await page.mouse.up();
  await page.waitForTimeout(400);

  await page.locator('#child-name').fill('Noah');
  await page.locator('.avatar-option[aria-label="Choose avatar 🐸"]').click();
  await page.locator('.switch[role="switch"]').click();
  await page.getByRole('button', { name: 'Test the voice' }).click();
  await page.waitForTimeout(300);
  await shot(page, '28-parent-edited');

  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Yes, reset' }).click();
  await page.waitForTimeout(300);
  const statsText = await page.locator('.stat-row').innerText();
  console.log('stars after reset:', statsText.replace(/\s+/g, ' '));

  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForTimeout(300);
  const hello = await page.locator('.hello').innerText();
  console.log('home greeting:', hello);
  await shot(page, '29-home-noah', false);

  console.log('errors main context:', errors.length ? errors : 'none');
  await context.close();

  // ------------------------------------------------------------
  // iPhone install instructions.
  // ------------------------------------------------------------
  const iphone = await makePage({
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });

  await iphone.page.getByRole('button', { name: 'Parent settings' }).click();
  const iosGate = await iphone.page.locator('.hold-btn').boundingBox();
  await iphone.page.mouse.move(iosGate.x + iosGate.width / 2, iosGate.y + iosGate.height / 2);
  await iphone.page.mouse.down();
  await iphone.page.waitForTimeout(2400);
  await iphone.page.mouse.up();
  await iphone.page.waitForTimeout(400);
  await iphone.page.getByRole('button', { name: /How to install/ }).click();
  await iphone.page.waitForTimeout(300);
  const iosText = await iphone.page.locator('.modal').innerText();
  console.log('ios help visible:', /Add to Home Screen/.test(iosText));
  await shot(iphone.page, '30-ios-install');
  console.log('errors iphone context:', iphone.errors.length ? iphone.errors : 'none');
  await iphone.context.close();
} catch (error) {
  console.error('GAME SMOKE FAILED:', error);
  await shot(page, '98-failure');
  console.log('errors:', errors);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
