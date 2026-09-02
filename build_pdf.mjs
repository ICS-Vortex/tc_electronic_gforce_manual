import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'tc_electronic_g_force_UA.pdf');
const OUT_DIR = path.join(__dirname, 'out');
const MANUAL_MD = path.join(__dirname, 'manuals', 'GForce.ua.md');
const EXPORT = path.join(__dirname, 'export-gforce-pdf.mjs');

/** A4 portrait, blank placeholder for future custom cover art. */
const A4 = [595.28, 841.89];

async function writeBlankPagePdf(outPath) {
  const doc = await PDFDocument.create();
  doc.addPage(A4);
  fs.writeFileSync(outPath, await doc.save());
}

async function mergePdfs(parts, outPath) {
  const out = await PDFDocument.create();
  for (const partPath of parts) {
    const bytes = fs.readFileSync(partPath);
    const doc = await PDFDocument.load(bytes);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    for (const p of pages) out.addPage(p);
  }
  fs.writeFileSync(outPath, await out.save());
  console.log('Merged:', outPath, 'pages:', out.getPageCount());
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating Markdown...');
  execSync('node generate-md.mjs', { cwd: __dirname, stdio: 'inherit' });

  const manualPdf = path.join(OUT_DIR, 'manual.pdf');

  console.log('Exporting manual PDF...');
  execSync(
    `node "${EXPORT}" "${MANUAL_MD}" "${manualPdf}" "TC Electronic G-Force" --skip-cover --skip-printed-toc`,
    { cwd: __dirname, stdio: 'inherit' }
  );

  const cover1 = path.join(OUT_DIR, 'orig-cover1.pdf');
  const cover2 = path.join(OUT_DIR, 'orig-cover2.pdf');

  console.log('Writing blank cover placeholders...');
  await writeBlankPagePdf(cover1);
  await writeBlankPagePdf(cover2);

  await mergePdfs([cover1, cover2, manualPdf], OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
