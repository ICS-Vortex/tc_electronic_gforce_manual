import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function main() {
  const data = new Uint8Array(fs.readFileSync('c:\\Users\\Vortex\\Downloads\\tc_electronic_g_force.PDF'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pages = {};
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items.map(item => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height
    }));
    pages[i] = items;
    const text = items.map(it => it.str).join(' ');
    fs.writeFileSync(`page_${i}.txt`, text, 'utf8');
  }
  
  fs.writeFileSync('pages.json', JSON.stringify(pages, null, 2), 'utf8');
  console.log('Done', doc.numPages, 'pages');
}

main().catch(console.error);
