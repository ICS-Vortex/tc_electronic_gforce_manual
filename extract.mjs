import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function main() {
  const data = new Uint8Array(fs.readFileSync('c:\\Users\\Vortex\\Downloads\\tc_electronic_g_force.PDF'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  console.log('Pages:', doc.numPages);
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    console.log('\n=== PAGE ' + i + ' ===\n');
    console.log(text);
  }
}

main().catch(console.error);
