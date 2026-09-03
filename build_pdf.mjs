import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'tc_electronic_g_force_UA.pdf');
const OUT_DIR = path.join(__dirname, 'out');
const MANUAL_MD = path.join(__dirname, 'manuals', 'GForce.ua.md');
const EXPORT = path.join(__dirname, 'export-gforce-pdf.mjs');

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

  fs.copyFileSync(manualPdf, OUT);
  console.log('Written:', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
