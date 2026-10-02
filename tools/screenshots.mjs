// Captures App Store screenshots of real gameplay at Apple's required sizes.
// Usage: node tools/screenshots.mjs   (needs the `playwright` package and Chromium)
// Output: appstore/screenshots/<device>/NN-name.png
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const gameUrl = pathToFileURL(path.join(root, 'web/index.html')).href;

const DEVICES = [
  { name: 'iphone-6.9', viewport: { width: 440, height: 956 }, scale: 3 },   // 1320 x 2868
  { name: 'ipad-13', viewport: { width: 1032, height: 1376 }, scale: 2 },    // 2064 x 2752
];

// A decent pilot so gameplay shots show a run in progress rather than a crash.
const AUTOPILOT = () => {
  const o = window.__orbital;
  window.__pilot = setInterval(() => {
    const S = o.S; if (S.mode !== 'playing') return;
    const spikes = S.items.filter(it => it.type === 'spike' && it.a > S.theta - 0.26).sort((a, b) => a.a - b.a);
    if (!spikes.length) return;
    const a0 = spikes[0].a;
    if (a0 - S.theta < 0.17) return;
    const blocked = new Set(spikes.filter(s => Math.abs(s.a - a0) < 0.02).map(s => s.ring));
    let best = -1;
    for (let k = 0; k < S.rings; k++) if (!blocked.has(k) && (best < 0 || Math.abs(k - S.ring) < Math.abs(best - S.ring))) best = k;
    if (best >= 0 && best !== S.ring && Math.abs(S.rPos - S.ring) < 0.3) o.switchRing(Math.sign(best - S.ring));
  }, 25);
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const dev of DEVICES) {
  const dir = path.join(root, 'appstore/screenshots', dev.name);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: dev.viewport, deviceScaleFactor: dev.scale, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => {
    localStorage.setItem('orbital.runs', '10');          // skip first-run hints
    localStorage.setItem('orbital.best', '247');
    localStorage.setItem('orbital.muted', 'true');
  });
  const page = await ctx.newPage();
  // Wait for a calm frame: no level-up flash/warp and no big pop-up text.
  const calm = () => page.waitForFunction(() => {
    const S = window.__orbital.S;
    return S.flash < 0.03 && S.warp < 0.15 && S.texts.every(t => t.size < 26 && !/LOST|LEVEL/.test(t.str));
  }, null, { timeout: 15000, polling: 50 }).catch(() => {});
  const shot = async name => { await calm(); await page.screenshot({ path: path.join(dir, name + '.png') }); console.log('wrote', dev.name, name); };

  await page.goto(gameUrl);
  await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 15000 });
  await page.waitForTimeout(600);
  await shot('01-title');

  // classic two-orbit run with a combo going
  await page.evaluate(() => window.__orbital.start());
  await page.evaluate(AUTOPILOT);
  await page.waitForTimeout(9000);
  await shot('02-gameplay');

  // later levels: four orbits
  await page.evaluate(() => {
    const o = window.__orbital;
    o.start();
    o.S.spawned = 62;            // course difficulty as if at level 6
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => { const S = window.__orbital.S; S.level = 6; S.passed = 60; });
  await page.waitForTimeout(6500);
  await shot('03-four-orbits');
  await page.evaluate(() => clearInterval(window.__pilot));

  // multiplayer-style race against bots (works offline)
  await page.reload();
  await page.waitForTimeout(800);
  await page.click('#btnQuick', { force: true });
  await page.evaluate(AUTOPILOT);
  await page.waitForTimeout(3500 + 7000);
  await shot('04-race');
  await ctx.close();
}
await browser.close();
