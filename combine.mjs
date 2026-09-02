import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const parts = [
  'pages_3_32_complete.mjs',
  'pages_33_52.mjs',
  'pages_53_63_fragment.mjs',
];

let body = '';
for (const file of parts) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) {
    console.error('Missing:', p);
    process.exit(1);
  }
  body += fs.readFileSync(p, 'utf8').trim() + '\n';
}

// Remove trailing comma before closing brace if present
body = body.replace(/,\s*$/, '');

const out = `export const translations = {\n${body}\n};\n`;
fs.writeFileSync(path.join(dir, 'translations.mjs'), out, 'utf8');
console.log('Created translations.mjs');
