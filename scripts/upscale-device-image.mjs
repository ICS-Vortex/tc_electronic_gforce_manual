import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SOURCE = path.join(root, 'images', 'gforce_view.jpg');
const MASK = path.join(root, 'images', 'gforce_view-removebg-preview.png');
const OUTPUT = path.join(root, 'images', 'gforce_view-hq.png');
const TARGET_WIDTH = 2560;

const sourceMeta = await sharp(SOURCE).metadata();
const targetHeight = Math.round(sourceMeta.height * (TARGET_WIDTH / sourceMeta.width));

console.log(`Source: ${path.basename(SOURCE)} — ${sourceMeta.width}x${sourceMeta.height}`);
console.log(`Mask: ${path.basename(MASK)}`);

const resizeOpts = {
  width: TARGET_WIDTH,
  height: targetHeight,
  kernel: sharp.kernel.lanczos3,
  fit: 'fill',
};

const rgb = await sharp(SOURCE)
  .resize(resizeOpts)
  .median(1)
  .sharpen({
    sigma: 1.15,
    m1: 1.15,
    m2: 0.42,
    x1: 2,
    y2: 10,
    y3: 20,
  })
  .removeAlpha()
  .toBuffer();

const alpha = await sharp(MASK)
  .resize(resizeOpts)
  .ensureAlpha()
  .extractChannel('alpha')
  .toBuffer();

await sharp(rgb)
  .joinChannel(alpha)
  .png({
    compressionLevel: 6,
    adaptiveFiltering: true,
  })
  .toFile(OUTPUT);

const out = await sharp(OUTPUT).metadata();
console.log(`Written: ${OUTPUT} — ${out.width}x${out.height} (transparent background)`);
