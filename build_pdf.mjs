import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'source', 'tc_electronic_g_force.PDF');
const OUT = path.join(__dirname, 'tc_electronic_g_force_UA.pdf');
const OUT_DIR = path.join(__dirname, 'out');
const PART1_MD = path.join(__dirname, 'manuals', 'GForce.ua.part1.md');
const PART2_MD = path.join(__dirname, 'manuals', 'GForce.ua.part2.md');
const EXPORT = path.join(__dirname, 'export-gforce-pdf.mjs');

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
  if (!fs.existsSync(SRC)) {
    console.error('Missing source PDF:', SRC);
    console.error('Place the original manual at source/tc_electronic_g_force.PDF');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating Markdown...');
  execSync('node generate-md.mjs', { cwd: __dirname, stdio: 'inherit' });

  const part1Pdf = path.join(OUT_DIR, 'part1.pdf');
  const part2Pdf = path.join(OUT_DIR, 'part2.pdf');

  console.log('Exporting part1 PDF (cover + TOC)...');
  execSync(
    `node "${EXPORT}" "${PART1_MD}" "${part1Pdf}" "TC Electronic G-Force"`,
    { cwd: __dirname, stdio: 'inherit' }
  );

  console.log('Exporting part2 PDF (content)...');
  execSync(
    `node "${EXPORT}" "${PART2_MD}" "${part2Pdf}" "TC Electronic G-Force" --content-only`,
    { cwd: __dirname, stdio: 'inherit' }
  );

  const srcBytes = fs.readFileSync(SRC);
  const srcPdf = await PDFDocument.load(srcBytes);
  const cover1 = path.join(OUT_DIR, 'orig-cover1.pdf');
  const cover2 = path.join(OUT_DIR, 'orig-cover2.pdf');
  const imagePage = path.join(OUT_DIR, 'orig-page6.pdf');

  const tmp1 = await PDFDocument.create();
  tmp1.addPage((await tmp1.copyPages(srcPdf, [0]))[0]);
  fs.writeFileSync(cover1, await tmp1.save());

  const tmp2 = await PDFDocument.create();
  tmp2.addPage((await tmp2.copyPages(srcPdf, [1]))[0]);
  fs.writeFileSync(cover2, await tmp2.save());

  const tmp6 = await PDFDocument.create();
  tmp6.addPage((await tmp6.copyPages(srcPdf, [5]))[0]);
  fs.writeFileSync(imagePage, await tmp6.save());

  await mergePdfs([cover1, cover2, part1Pdf, imagePage, part2Pdf], OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
