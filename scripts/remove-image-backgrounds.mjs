import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, '..', 'manuals', 'images');
const TOLERANCE = 30;
const FEATHER = 10;

function colorDist(r, g, b, br, bg, bb) {
  return Math.max(Math.abs(r - br), Math.abs(g - bg), Math.abs(b - bb));
}

function detectBackgroundColor(data, width, height) {
  const buckets = new Map();

  const sample = (x, y) => {
    const i = (y * width + x) * 4;
    const a = data[i + 3];
    if (a < 16) {
      const key = 'transparent';
      buckets.set(key, (buckets.get(key) || 0) + 1);
      return;
    }
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > 28 || lum < 170) return;
    const key = `${Math.round(r / 5) * 5},${Math.round(g / 5) * 5},${Math.round(b / 5) * 5}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  };

  for (let x = 0; x < width; x++) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    sample(0, y);
    sample(width - 1, y);
  }

  let bestKey = '';
  let bestCount = 0;
  for (const [key, count] of buckets) {
    if (key === 'transparent') continue;
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }

  if (bestKey) {
    const [r, g, b] = bestKey.split(',').map(Number);
    return { r, g, b };
  }

  return { r: 230, g: 230, b: 230 };
}

async function removeBackground(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const pixels = Buffer.from(data);
  const total = width * height;

  let transparent = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 16) transparent++;
  }
  if (transparent / total > 0.92) {
    return { skipped: true, reason: 'already transparent' };
  }

  const bg = detectBackgroundColor(pixels, width, height);
  const visited = new Uint8Array(total);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push(x, 0, x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push(0, y, width - 1, y);
  }

  for (let qi = 0; qi < queue.length; qi += 2) {
    const x = queue[qi];
    const y = queue[qi + 1];
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const i = idx * 4;
    const alpha = pixels[i + 3];
    if (alpha >= 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const dist = colorDist(r, g, b, bg.r, bg.g, bg.b);
      if (dist > TOLERANCE) continue;
      pixels[i + 3] = 0;
    }
    if (x > 0) queue.push(x - 1, y);
    if (x < width - 1) queue.push(x + 1, y);
    if (y > 0) queue.push(x, y - 1);
    if (y < height - 1) queue.push(x, y + 1);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const i = idx * 4;
      if (pixels[i + 3] === 0) continue;

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const dist = colorDist(r, g, b, bg.r, bg.g, bg.b);
      if (dist <= TOLERANCE + FEATHER) {
        const fade = (dist - TOLERANCE) / FEATHER;
        pixels[i + 3] = Math.round(255 * Math.min(1, Math.max(0, fade)));
      }
    }
  }

  const tempPath = `${filePath}.tmp.png`;
  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toFile(tempPath);
  await fsPromises.rename(tempPath, filePath);

  let after = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 16) after++;
  }

  return {
    skipped: false,
    bg,
    transparentPct: Math.round((100 * after) / total),
  };
}

const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.png$/i.test(f)).sort();
let processed = 0;
let skipped = 0;

for (const name of files) {
  const filePath = path.join(IMAGES_DIR, name);
  const result = await removeBackground(filePath);
  if (result.skipped) {
    skipped++;
    console.log(`skip  ${name} — ${result.reason}`);
  } else {
    processed++;
    console.log(`ok    ${name} — bg rgb(${result.bg.r},${result.bg.g},${result.bg.b}), transparent ${result.transparentPct}%`);
  }
}

console.log(`\nDone: ${processed} processed, ${skipped} skipped`);
