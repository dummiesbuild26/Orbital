// Renders the app icon (1024x1024 PNG) with headless Chromium.
// Usage: node tools/render-icon.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = `<!doctype html><html><body style="margin:0;background:#05010f">
<canvas id="c" width="1024" height="1024"></canvas>
<script>
const c = document.getElementById('c'), g = c.getContext('2d'), s = 1024, m = s / 2, TAU = Math.PI * 2;
const A = '#22f3ff', B = '#ff2d95', G = '#fff36b';
const bg = g.createRadialGradient(m, m, 0, m, m, s * 0.72);
bg.addColorStop(0, '#2a0a66'); bg.addColorStop(1, '#05010f');
g.fillStyle = bg; g.fillRect(0, 0, s, s);
for (let i = 0; i < 90; i++) { const a = Math.random() * TAU, r = 80 + Math.random() * 600;
  g.globalAlpha = Math.random() * 0.8; g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.moveTo(m + Math.cos(a) * r, m + Math.sin(a) * r); g.lineTo(m + Math.cos(a) * r * 1.08, m + Math.sin(a) * r * 1.08); g.stroke(); }
g.globalAlpha = 1;
function glow(x, y, r, col, a = 1) { const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, 'rgba(255,255,255,' + a + ')'); gr.addColorStop(0.15, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalCompositeOperation = 'source-over'; }
glow(m, m, 330, 'rgba(34,243,255,.35)', 0.5);
g.shadowColor = A; g.shadowBlur = 50; g.strokeStyle = A;
g.lineWidth = 22; g.beginPath(); g.arc(m, m, 370, 0, TAU); g.stroke();
g.lineWidth = 16; g.globalAlpha = 0.75; g.beginPath(); g.arc(m, m, 222, 0, TAU); g.stroke();
g.globalAlpha = 1; g.shadowBlur = 0;
g.fillStyle = '#0b0420'; g.beginPath(); g.arc(m, m, 138, 0, TAU); g.fill();
g.lineWidth = 10; g.strokeStyle = A; g.stroke();
function spike(x, y, r, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
  for (let i = 0; i < 18; i++) { const rr = i % 2 ? r * 0.55 : r, a = i / 18 * TAU; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  g.closePath(); g.fillStyle = B; g.shadowColor = B; g.shadowBlur = 40; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 6; g.strokeStyle = '#fff'; g.stroke(); g.restore(); }
spike(m + Math.cos(2.3) * 222, m + Math.sin(2.3) * 222, 62, 0.3);
spike(m + Math.cos(0.5) * 370, m + Math.sin(0.5) * 370, 66, 0.1);
g.save(); g.translate(m + Math.cos(3.6) * 370, m + Math.sin(3.6) * 370);
g.beginPath(); g.moveTo(0, -52); g.lineTo(38, 0); g.lineTo(0, 52); g.lineTo(-38, 0); g.closePath();
g.fillStyle = G; g.shadowColor = G; g.shadowBlur = 40; g.fill(); g.shadowBlur = 0; g.lineWidth = 6; g.strokeStyle = '#fff'; g.stroke(); g.restore();
const pa = -1.15, px = m + Math.cos(pa) * 370, py = m + Math.sin(pa) * 370;
g.lineCap = 'round'; g.globalCompositeOperation = 'lighter';
for (let i = 0; i < 30; i++) { const a = pa - i * 0.03, k = 1 - i / 30; g.globalAlpha = k * 0.7; g.strokeStyle = A; g.lineWidth = 60 * k;
  g.beginPath(); g.arc(m, m, 370, a - 0.03, a); g.stroke(); }
g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
glow(px, py, 200, A, 1);
g.fillStyle = '#fff'; g.beginPath(); g.arc(px, py, 44, 0, TAU); g.fill();
</script></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.setContent(html);
const buf = await page.locator('#c').screenshot({ type: 'png' });
await browser.close();
for (const out of ['web/icon.png', 'ios/Orbital/Assets.xcassets/AppIcon.appiconset/icon-1024.png']) {
  const p = path.join(root, out);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  console.log('wrote', out);
}
