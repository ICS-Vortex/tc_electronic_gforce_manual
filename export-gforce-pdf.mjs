import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const linktoolRoot = 'c:\\Users\\Vortex\\Documents\\Development\\linktool';
const requireFromLinktool = createRequire(path.join(linktoolRoot, 'package.json'));
const puppeteer = requireFromLinktool('puppeteer-core');
const repoRoot = linktoolRoot;

let marked;

const [inputArg, outputArg, titleArg, ...rest] = process.argv.slice(2);
const contentOnly = rest.includes('--content-only');
const skipCover = contentOnly || rest.includes('--skip-cover');
const skipPrintedToc = rest.includes('--skip-printed-toc');
const skipSections = [
  ...rest
    .filter((arg) => arg.startsWith('--skip-section='))
    .map((arg) => arg.slice('--skip-section='.length).trim())
    .filter(Boolean),
  ...(skipPrintedToc ? ['Про цей посібник'] : []),
];

if (!inputArg || !outputArg) {
  console.error('Usage: node export-gforce-pdf.mjs <input.md> <output.pdf> [title] [--content-only] [--skip-cover] [--skip-printed-toc] [--skip-section=Title]');
  process.exit(1);
}

const inputPath = path.isAbsolute(inputArg) ? inputArg : path.resolve(repoRoot, inputArg);
const outputPath = path.isAbsolute(outputArg) ? outputArg : path.resolve(repoRoot, outputArg);
const fallbackTitle = path.basename(inputPath, path.extname(inputPath));
const explicitTitle = titleArg?.trim() || fallbackTitle;

const labelsByLocale = {
  en: {
    manualBandMajor: 'LINKTOOL',
    manualBandMinor: 'USER GUIDE',
    coverKicker: 'Operational Guide',
    tableOfContents: 'Table of Contents',
    sectionIndex: 'Section Index',
    document: 'Document',
    format: 'Format',
    branding: 'Branding',
    generated: 'Generated',
    contentsIntro: 'This table of contents contains clickable links that jump to each section inside the PDF.',
    contentsSupport: 'Primary sections are listed first, followed by operational subsections for faster navigation.',
    brandAlignedExport: 'Print-ready export',
    sectionLabel: 'Section',
    catalogNote: 'Catalog-style operational reference',
    coverDescription: 'Daily operation, simulator integration setup, profile management, rule editing, telemetry diagnostics, and recovery workflow.',
    coverLeadFallback: 'A practical operational reference for telemetry setup, profile editing, rule authoring, diagnostics, and day-to-day LinkTool usage.',
    keylines: [
      ['Telemetry', 'Source setup and validation'],
      ['Profiles', 'Create, open, save, and test rule sets'],
      ['Rules', 'Build, troubleshoot, and verify LED logic'],
      ['Diagnostics', 'Isolate device, runtime, and simulator issues'],
    ],
    footerTitle: 'LinkTool User Guide',
    sectionFallbackMajor: 'SECTION',
    sectionFallbackMinor: '',
    sectionSingleWordMinor: 'SECTION',
    sectionSummaryFallback: title => `${title} guidance and operational notes for LinkTool.`,
  },
  ua: {
    manualBandMajor: 'G-FORCE',
    manualBandMinor: 'ПОСІБНИК UA',
    coverKicker: 'Посібник користувача',
    tableOfContents: 'Зміст',
    sectionIndex: 'Навігація',
    document: 'Документ',
    format: 'Формат',
    branding: 'Брендинг',
    generated: 'Сформовано',
    contentsIntro: 'Зміст містить клікабельні посилання на розділи внутрішнього PDF.',
    contentsSupport: 'Основні розділи згруповані для швидшої навігації.',
    brandAlignedExport: 'Документ для друку',
    sectionLabel: 'Розділ',
    catalogNote: 'Операційний посібник',
    coverDescription: 'Український переклад посібника TC Electronic G-Force. Назви меню, кнопок і параметрів залишені англійською.',
    coverLeadFallback: 'Практичний посібник з налаштування ефектів, presets, Routing, Modifiers, I/O та MIDI для G-Force.',
    coverSupportFallback: 'Документ для друку.',
    keylines: [
      ['Effects', 'Routing, блоки та редагування'],
      ['Presets', 'Recall, Store та User bank'],
      ['Modifiers', 'Matrix, педалі та MIDI'],
      ['I/O', 'Audio, MIDI та Utility'],
    ],
    footerTitle: 'TC Electronic G-Force',
    sectionFallbackMajor: 'РОЗДІЛ',
    sectionFallbackMinor: '',
    sectionSingleWordMinor: 'РОЗДІЛ',
    sectionSummaryFallback: title => `Розділ «${title}» — практичні пояснення для TC Electronic G-Force.`,
  },
  ru: {
    manualBandMajor: 'LINKTOOL',
    manualBandMinor: 'РУКОВОДСТВО',
    coverKicker: 'Эксплуатационное руководство',
    tableOfContents: 'Оглавление',
    sectionIndex: 'Навигация по разделам',
    document: 'Документ',
    format: 'Формат',
    branding: 'Брендинг',
    generated: 'Сформировано',
    contentsIntro: 'Это оглавление содержит кликабельные ссылки, которые переводят к нужному разделу внутри PDF.',
    contentsSupport: 'Сначала идут основные разделы, затем вложенные рабочие подразделы для быстрой навигации.',
    brandAlignedExport: 'Документ для друку',
    sectionLabel: 'Раздел',
    catalogNote: 'Каталожный эксплуатационный формат',
    coverDescription: 'Повседневная работа, настройка интеграций симуляторов, управление профилями, редактор правил, диагностика телеметрии и сценарии восстановления.',
    coverLeadFallback: 'Практическое эксплуатационное руководство по настройке телеметрии, работе с профилями, созданию правил, диагностике и повседневному использованию LinkTool.',
    coverSupportFallback: 'Подготовлено как печатный документ.',
    keylines: [
      ['Телеметрия', 'Настройка источников и проверка данных'],
      ['Профили', 'Создание, открытие, сохранение и тестирование правил'],
      ['Правила', 'Настройка и проверка LED-логики'],
      ['Диагностика', 'Поиск проблем устройств, рантайма и симуляторов'],
    ],
    footerTitle: 'LinkTool Руководство',
    sectionFallbackMajor: 'РАЗДЕЛ',
    sectionFallbackMinor: '',
    sectionSingleWordMinor: 'РАЗДЕЛ',
    sectionSummaryFallback: title => `Раздел «${title}» с практическими пояснениями по работе в LinkTool.`,
  },
  fr: {
    manualBandMajor: 'LINKTOOL',
    manualBandMinor: 'GUIDE UTILISATEUR',
    coverKicker: 'Guide opérationnel',
    tableOfContents: 'Table des matières',
    sectionIndex: 'Index des sections',
    document: 'Document',
    format: 'Format',
    branding: 'Image de marque',
    generated: 'Généré le',
    contentsIntro: 'Cette table des matières contient des liens cliquables vers chaque section du PDF.',
    contentsSupport: 'Les sections principales sont listées en premier, suivies des sous-sections opérationnelles pour une navigation plus rapide.',
    brandAlignedExport: 'Export prêt à l\'impression',
    sectionLabel: 'Section',
    catalogNote: 'Référence opérationnelle de type catalogue',
    coverDescription: 'Utilisation quotidienne, configuration des intégrations simulateur, gestion des profils, édition des règles, diagnostic télémétrie et procédures de récupération.',
    coverLeadFallback: 'Référence opérationnelle pratique pour la télémétrie, les profils, les règles LED, le diagnostic et l\'utilisation quotidienne de LinkTool.',
    coverSupportFallback: 'Document prêt à l\'impression.',
    keylines: [
      ['Télémétrie', 'Configuration des sources et validation'],
      ['Profils', 'Créer, ouvrir, enregistrer et tester les règles'],
      ['Règles', 'Configurer, dépanner et vérifier la logique LED'],
      ['Diagnostics', 'Isoler les problèmes périphérique, runtime et simulateur'],
    ],
    footerTitle: 'LinkTool Guide utilisateur',
    sectionFallbackMajor: 'SECTION',
    sectionFallbackMinor: '',
    sectionSingleWordMinor: 'SECTION',
    sectionSummaryFallback: title => `Section « ${title} » — notes opérationnelles pour LinkTool.`,
  },
};

function resolveLocale(markdownPath) {
  const base = path.basename(markdownPath).toLowerCase();
  if (base.includes('.ua.')) return 'ua';
  const match = base.match(/\.([a-z]{2})\./i);
  const code = match?.[1]?.toLowerCase();
  return code && Object.prototype.hasOwnProperty.call(labelsByLocale, code) ? code : 'ua';
}

const locale = resolveLocale(inputPath);
const generatedOn = new Intl.DateTimeFormat(locale === 'ua' ? 'uk-UA' : locale === 'ru' ? 'ru-RU' : locale === 'fr' ? 'fr-FR' : 'en', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
}).format(new Date());

const labels = labelsByLocale[locale];

const browserCandidates = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];

async function resolveBrowserPath() {
  for (const candidate of browserCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    }
    catch {
    }
  }

  throw new Error('No supported Chromium browser was found. Install Microsoft Edge or Google Chrome.');
}

function toFileUrl(filePath) {
  return `file:///${path.resolve(filePath).replace(/\\/g, '/')}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'section';
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function embedMarkdownImages(markdown, baseDir) {
  const imageRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let result = markdown;
  const matches = [...markdown.matchAll(imageRe)];

  for (const match of matches) {
    const [full, alt, src] = match;
    if (/^(?:https?:|data:|file:)/i.test(src)) {
      continue;
    }

    const absPath = path.resolve(baseDir, src);
    try {
      await fs.access(absPath);
      const fileUrl = pathToFileURL(absPath).href;
      result = result.replace(full, `![${alt}](${fileUrl})`);
    }
    catch {
      console.warn('Missing image:', absPath);
    }
  }

  return result;
}

function extractToc(markdown) {
  const items = [];
  const lines = markdown.split(/\r?\n/);
  let insideFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) {
      continue;
    }

    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) {
      continue;
    }

    items.push({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    });
  }

  return items;
}

function extractDocumentStructure(markdown) {
  const lines = markdown.split(/\r?\n/);
  let insideFence = false;
  let documentHeading = '';
  const introLines = [];
  const sections = [];
  let currentSection = null;

  const pushCurrentSection = () => {
    if (!currentSection) {
      return;
    }

    sections.push({
      title: currentSection.title,
      markdown: currentSection.lines.join('\n').trim(),
    });
  };

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      insideFence = !insideFence;
    }

    if (!insideFence && !documentHeading) {
      const documentMatch = /^#\s+(.+?)\s*$/.exec(line);
      if (documentMatch) {
        documentHeading = documentMatch[1].trim();
        continue;
      }
    }

    if (!insideFence) {
      const sectionMatch = /^##\s+(.+?)\s*$/.exec(line);
      if (sectionMatch) {
        pushCurrentSection();
        currentSection = {
          title: sectionMatch[1].trim(),
          lines: [],
        };
        continue;
      }
    }

    if (currentSection) {
      currentSection.lines.push(line);
    }
    else {
      introLines.push(line);
    }
  }

  pushCurrentSection();

  return {
    title: documentHeading || explicitTitle,
    introMarkdown: introLines.join('\n').trim(),
    sections,
  };
}

function splitTitleForBand(title) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return { major: labels.sectionFallbackMajor, minor: labels.sectionFallbackMinor };
  }

  if (words.length === 1) {
    return { major: words[0].toUpperCase(), minor: labels.sectionSingleWordMinor };
  }

  return {
    major: words[0].toUpperCase(),
    minor: words.slice(1).join(' ').toUpperCase(),
  };
}

function extractLeadParagraph(markdown) {
  if (!markdown.trim()) {
    return { summary: '', remainder: '' };
  }

  const lines = markdown.split(/\r?\n/);
  let index = 0;

  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  if (index >= lines.length) {
    return { summary: '', remainder: '' };
  }

  const firstLine = lines[index].trim();
  if (/^(#|>|-|\*|\d+\.|\||```|!\[)/.test(firstLine)) {
    return { summary: '', remainder: markdown.trim() };
  }

  const summaryLines = [];
  while (index < lines.length && lines[index].trim()) {
    summaryLines.push(lines[index].trim());
    index += 1;
  }

  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  return {
    summary: summaryLines.join(' ').replace(/\s+/g, ' ').trim(),
    remainder: lines.slice(index).join('\n').trim(),
  };
}

function extractIntroParagraphs(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .filter(paragraph => !paragraph.startsWith('#'));
}

function injectHeadingAnchors(markdown) {
  const lines = markdown.split(/\r?\n/);
  let insideFence = false;

  return lines.map(line => {
    if (line.trimStart().startsWith('```')) {
      insideFence = !insideFence;
      return line;
    }

    if (insideFence) {
      return line;
    }

    const match = /^(###|####)\s+(.+?)\s*$/.exec(line);
    if (!match) {
      return line;
    }

    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    return `<h${level} id="${id}">${escapeHtml(text)}</h${level}>`;
  }).join('\n');
}

function sectionStartsWithImage(markdown) {
  const line = markdown.split(/\r?\n/).find((l) => l.trim())?.trim() ?? '';
  return /^!\[/.test(line);
}

function markdownImagesToHtml(markdown) {
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    return `<img alt="${escapeHtml(alt)}" src="${src}" />`;
  });
}

function formatManualHtml(markdown) {
  return marked.parse(markdownImagesToHtml(injectHeadingAnchors(markdown)))
    .replace(/<h3>/g, '<h3 class="content-h3">')
    .replace(/<h4>/g, '<h4 class="content-h4">');
}

function buildCoverHtml({ title, introParagraphs }) {
  const leadParagraph = introParagraphs[0]
    || labels.coverLeadFallback;

  return `<section class="cover-page">
    <div class="page-shell cover-shell">
      <div class="cover-topline">
        <div class="cover-topmeta">
          <span>TC Electronic</span>
          <span>${escapeHtml(generatedOn)}</span>
        </div>
      </div>

      <div class="section-band cover-band-header">
        <span class="section-band-major">${escapeHtml(labels.manualBandMajor)}</span>
        <span class="section-band-minor">${escapeHtml(labels.manualBandMinor)}</span>
      </div>

      <div class="cover-hero">
        <div class="cover-kicker">${escapeHtml(labels.coverKicker)}</div>
        <h1 class="cover-title">${escapeHtml(title)}</h1>
        <p class="cover-description">${escapeHtml(labels.coverDescription)}</p>
      </div>

      <div class="cover-summary-panel">
        <div class="cover-summary-text">
          <p>${escapeHtml(leadParagraph)}</p>
        </div>
      </div>

      <div class="cover-keylines">
        ${labels.keylines.map(([label, value]) => `<div class="cover-keyline"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function buildTocHtml(items) {
  const rows = items
    .filter(item => item.level <= 3)
    .map(item => {
      const itemClass = item.level === 2 ? 'toc-item toc-item-h2' : 'toc-item toc-item-h3';
      return `<li class="${itemClass}"><a href="#${escapeHtml(item.id)}">${escapeHtml(item.text)}</a></li>`;
    }).join('');

  return `<section class="toc-page">
    <div class="page-shell toc-shell">
      <div class="section-band">
        <span class="section-band-major">${escapeHtml(labels.tableOfContents.toUpperCase())}</span>
        <span class="section-band-minor">${escapeHtml(labels.sectionIndex.toUpperCase())}</span>
      </div>

      <div class="toc-main toc-main-full">
        <div class="toc-intro">
          <p>${escapeHtml(labels.contentsIntro)}</p>
          <p>${escapeHtml(labels.contentsSupport)}</p>
        </div>
        <h2 class="toc-title">${escapeHtml(labels.tableOfContents)}</h2>
        <ol class="toc-list">${rows}</ol>
      </div>
    </div>
  </section>`;
}

function buildSectionHtml(sections) {
  return sections.map((section, index) => {
    const { summary, remainder } = extractLeadParagraph(section.markdown);
    const bodyMarkdown = remainder || section.markdown;
    const bodyHtml = formatManualHtml(bodyMarkdown);
    const bandTitle = splitTitleForBand(section.title);
    const summaryText = summary || labels.sectionSummaryFallback(section.title);
    const startsWithImage = sectionStartsWithImage(section.markdown);
    const headerInline = startsWithImage
      ? ''
      : `<div class="section-header-inline">
        <div class="section-number">${escapeHtml(labels.sectionLabel.toUpperCase())} ${String(index + 1).padStart(2, '0')}</div>
        <p class="section-summary">${escapeHtml(summaryText)}</p>
      </div>`;

    return `<section class="manual-section" id="${slugify(section.title)}">
      <div class="section-band">
        <span class="section-band-major">${escapeHtml(bandTitle.major)}</span>
        <span class="section-band-minor">${escapeHtml(bandTitle.minor)}</span>
      </div>

      ${headerInline}

      <div class="section-main">
        <h2 class="section-title">${escapeHtml(section.title)}</h2>
        ${bodyHtml}
      </div>
    </section>`;
  }).join('');
}

function buildHtml({ title, tocItems, sections, introParagraphs, skipCover: skipCoverPage = false, skipToc = false }) {
  const oswald300 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-latin-300-normal.woff2'));
  const oswald400 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-latin-400-normal.woff2'));
  const oswald500 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-latin-500-normal.woff2'));
  const oswald600 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-latin-600-normal.woff2'));
  const oswald700 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-latin-700-normal.woff2'));
  const oswaldCyr300 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-cyrillic-300-normal.woff2'));
  const oswaldCyr400 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-cyrillic-400-normal.woff2'));
  const oswaldCyr500 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-cyrillic-500-normal.woff2'));
  const oswaldCyr600 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-cyrillic-600-normal.woff2'));
  const oswaldCyr700 = toFileUrl(path.resolve(repoRoot, 'node_modules/@fontsource/oswald/files/oswald-cyrillic-700-normal.woff2'));

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 300;
      src: url('${oswald300}') format('woff2');
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 300;
      src: url('${oswaldCyr300}') format('woff2');
      unicode-range: U+0400-04FF, U+0500-052F;
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 400;
      src: url('${oswald400}') format('woff2');
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 400;
      src: url('${oswaldCyr400}') format('woff2');
      unicode-range: U+0400-04FF, U+0500-052F;
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 500;
      src: url('${oswald500}') format('woff2');
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 500;
      src: url('${oswaldCyr500}') format('woff2');
      unicode-range: U+0400-04FF, U+0500-052F;
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 600;
      src: url('${oswald600}') format('woff2');
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 600;
      src: url('${oswaldCyr600}') format('woff2');
      unicode-range: U+0400-04FF, U+0500-052F;
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 700;
      src: url('${oswald700}') format('woff2');
    }

    @font-face {
      font-family: 'ManualTitle';
      font-style: normal;
      font-weight: 700;
      src: url('${oswaldCyr700}') format('woff2');
      unicode-range: U+0400-04FF, U+0500-052F;
    }

    :root {
      --brand-red: #E50011;
      --brand-black: #000000;
      --brand-white: #FFFFFF;
      --brand-dark-grey: #2E2822;
      --brand-light-grey: #939598;
      --brand-lightest-grey: #F1F1F1;
      --rule: #cfcfcf;
    }

    * {
      box-sizing: border-box;
    }

    html {
      font-size: 14px;
    }

    body {
      margin: 0;
      color: var(--brand-dark-grey);
      background: var(--brand-white);
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.58;
      font-weight: 400;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cover-page,
    .toc-page,
    .manual-section {
      page-break-after: always;
      break-after: page;
      background: var(--brand-white);
    }

    .cover-shell,
    .toc-shell {
      overflow: hidden;
      padding-bottom: 2mm;
    }

    .cover-topline {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      margin: 0 0 6mm;
    }

    .cover-topmeta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1mm;
      font-size: 0.82rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 400;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--brand-light-grey);
    }

    .section-band {
      display: inline-flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 10mm;
      min-width: 112mm;
      max-width: 130mm;
      background: var(--brand-red);
      color: var(--brand-white);
      padding: 4.5mm 6mm 4.3mm;
      margin: 0 0 5.5mm;
    }

    .section-band-major {
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-size: 2.25rem;
      line-height: 0.92;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .section-band-minor {
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      align-self: center;
      font-size: 0.98rem;
      line-height: 1;
      font-weight: 400;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .cover-hero {
      margin: 0 0 6mm;
      padding-right: 2mm;
    }

    .cover-kicker {
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-size: 0.86rem;
      font-weight: 400;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--brand-red);
      margin: 1mm 0 4mm;
    }

    .cover-title {
      margin: 0 0 5mm;
      font-size: 2.25rem;
      line-height: 0.95;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--brand-black);
    }

    .cover-description {
      font-size: 1rem;
      margin: 0;
      max-width: 148mm;
      color: var(--brand-dark-grey);
    }

    .cover-summary-panel {
      display: block;
      margin: 0 0 7mm;
      padding: 5mm 0;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
    }

    .cover-summary-text p {
      margin: 0 0 3.4mm;
      font-size: 0.98rem;
    }

    .cover-summary-text p:last-child {
      margin-bottom: 0;
    }

    .cover-keylines {
      display: grid;
      gap: 2.6mm;
      max-width: 100%;
    }

    .cover-keyline {
      display: grid;
      grid-template-columns: 35mm 1fr;
      gap: 4mm;
      padding-top: 2.2mm;
      border-top: 1px solid var(--rule);
    }

    .cover-keyline span:first-child {
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      color: var(--brand-red);
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .cover-keyline span:last-child {
      color: var(--brand-dark-grey);
      font-size: 0.95rem;
      font-weight: 400;
    }

    .fact-label {
      display: block;
      color: var(--brand-light-grey);
      font-size: 0.7rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 0.6mm;
    }

    .fact-value {
      display: block;
      color: var(--brand-dark-grey);
      font-size: 0.9rem;
      font-weight: 400;
    }

    .toc-main-full,
    .section-main {
      width: 100%;
      max-width: 100%;
    }

    .toc-intro,
    .section-header-inline {
      display: grid;
      grid-template-columns: 38mm 1fr;
      gap: 8mm;
      margin: 0 0 6mm;
      padding-bottom: 4.5mm;
      border-bottom: 1px solid var(--rule);
    }

    .toc-intro p,
    .section-summary {
      margin: 0;
      font-size: 0.95rem;
    }

    .toc-intro p:last-child {
      grid-column: 2;
    }

    .toc-title,
    .section-title {
      margin: 0 0 5mm;
      font-size: 2.1rem;
      line-height: 0.98;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--brand-black);
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      columns: 2;
      column-gap: 11mm;
    }

    .toc-item {
      break-inside: avoid;
      margin: 0 0 3.4mm;
      padding-bottom: 2.1mm;
      border-bottom: 1px solid #dfdfdf;
    }

    .toc-item-h2 {
      font-size: 0.96rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 500;
      color: var(--brand-black);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .toc-item-h3 {
      font-size: 0.84rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 400;
      color: var(--brand-dark-grey);
      padding-left: 4mm;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .toc-item a {
      color: inherit;
      text-decoration: none;
      display: block;
    }

    .section-number {
      color: var(--brand-red);
      font-size: 0.78rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .section-main p,
    .section-main ul,
    .section-main ol,
    .section-main blockquote,
    .section-main table,
    .section-main pre {
      margin: 0 0 4.2mm;
      font-size: 0.96rem;
    }

    .section-main ul,
    .section-main ol {
      padding-left: 5.5mm;
    }

    .section-main li {
      margin: 0 0 1.4mm;
      padding-left: 1mm;
    }

    .self-test-page {
      margin-top: 1mm;
    }

    .self-test-lead {
      margin: 0 0 3mm !important;
      font-size: 0.9rem !important;
      line-height: 1.35;
    }

    .self-test-intro {
      margin: 0 0 5mm !important;
      font-size: 0.92rem !important;
    }

    .self-test-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8mm;
      align-items: start;
    }

    .self-test-col {
      min-width: 0;
    }

    .self-test-item {
      break-inside: avoid;
      margin: 0 0 4.5mm;
    }

    .self-test-item h4 {
      margin: 0 0 1.8mm;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--brand-black);
      text-transform: none;
    }

    .self-test-item p {
      margin: 0 0 2mm !important;
      font-size: 0.88rem !important;
      line-height: 1.4;
    }

    .self-test-footer {
      margin: 3mm 0 0 !important;
      font-size: 0.88rem !important;
      text-align: right;
    }

    .midi-chart-page {
      margin-top: 1mm;
    }

    .midi-chart-banner {
      background: #2a2a2a;
      color: var(--brand-white);
      padding: 3.2mm 4.5mm;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .midi-chart-subtitle {
      margin: 3.5mm 0 4mm !important;
      font-size: 0.92rem !important;
    }

    .midi-chart-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      line-height: 1.35;
    }

    .midi-chart-table th {
      text-align: left;
      font-weight: 700;
      padding: 1.8mm 2.5mm 2.2mm;
      border-bottom: 1px dotted #888;
      font-family: 'Segoe UI', Arial, sans-serif;
      text-transform: none;
      letter-spacing: normal;
      background: transparent;
    }

    .midi-chart-table td {
      padding: 1.4mm 2.5mm;
      border-bottom: 1px dotted #c8c8c8;
      vertical-align: top;
    }

    .midi-chart-table .midi-tx,
    .midi-chart-table .midi-rx {
      text-align: center;
      width: 20%;
    }

    .midi-chart-table .midi-remarks {
      width: 18%;
    }

    .midi-chart-table .midi-fn-main {
      font-weight: 700;
    }

    .midi-chart-table .midi-fn-sub {
      padding-left: 7mm;
    }

    .midi-chart-table tr.midi-section-divider td {
      border-bottom: 1px dotted #666;
      padding: 0;
      height: 2.5mm;
      line-height: 0;
    }

    .midi-chart-legend {
      margin: 4.5mm 0 0 !important;
      font-size: 0.88rem !important;
    }

    .section-main ul li::marker,
    .section-main ol li::marker {
      color: var(--brand-red);
      font-weight: 500;
    }

    .content-h3,
    .section-main h3 {
      margin: 8mm 0 3mm;
      font-size: 1.2rem;
      line-height: 1;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--brand-black);
    }

    .content-h4,
    .section-main h4 {
      margin: 5mm 0 2mm;
      font-size: 0.98rem;
      line-height: 1.1;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--brand-red);
    }

    .section-main strong {
      font-weight: 500;
      color: var(--brand-black);
    }

    .section-main em {
      font-style: normal;
    }

    .section-main a {
      color: var(--brand-black);
      text-decoration: none;
      border-bottom: 1px solid rgba(229, 0, 17, 0.35);
    }

    .section-main blockquote {
      margin-left: 0;
      padding: 4mm 4.5mm;
      background: var(--brand-lightest-grey);
      border-left: 3px solid var(--brand-red);
    }

    .section-main code {
      font-family: 'Consolas', 'Cascadia Code', monospace;
      font-size: 0.85em;
      background: #f3f3f3;
      padding: 0.15rem 0.3rem;
      border-radius: 2px;
    }

    .section-main pre {
      padding: 4mm 4.5mm;
      background: #f6f6f6;
      border: 1px solid #dddddd;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .section-main pre code {
      background: transparent;
      padding: 0;
    }

    .section-main table {
      width: 100%;
      border-collapse: collapse;
      break-inside: avoid;
    }

    .section-main th,
    .section-main td {
      border: 1px solid #d7d7d7;
      padding: 2.6mm 2.8mm;
      vertical-align: top;
      text-align: left;
    }

    .section-main th {
      background: var(--brand-lightest-grey);
      color: var(--brand-black);
      font-size: 0.78rem;
      font-family: 'ManualTitle', 'Arial Narrow', sans-serif;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .section-main img {
      max-width: 100%;
      display: block;
      margin: 4mm 0;
    }

    @page {
      size: A4;
      margin: 16mm 14mm 16mm;
    }
  </style>
</head>
<body>
  ${skipCoverPage ? '' : buildCoverHtml({ title, introParagraphs })}
  ${skipToc ? '' : buildTocHtml(tocItems)}
  ${buildSectionHtml(sections)}
</body>
</html>`;
}

async function main() {
  const markedModule = await import(
    pathToFileURL(path.join(linktoolRoot, 'node_modules/marked/lib/marked.esm.js'))
  );
  marked = markedModule.marked ?? markedModule.default;

  const markdownRaw = await fs.readFile(inputPath, 'utf8');
  const markdown = await embedMarkdownImages(markdownRaw, path.dirname(inputPath));

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  const tocItems = extractToc(markdown);
  const structure = extractDocumentStructure(markdown);
  const introParagraphs = extractIntroParagraphs(structure.introMarkdown);
  const sections = skipSections.length
    ? structure.sections.filter((section) => !skipSections.includes(section.title))
    : structure.sections;
  const html = buildHtml({
    title: structure.title || explicitTitle,
    tocItems,
    sections,
    introParagraphs,
    skipCover: skipCover,
    skipToc: contentOnly,
  });
  const browserPath = await resolveBrowserPath();

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const htmlPath = path.join(path.dirname(outputPath), 'manual-export.html');
  await fs.writeFile(htmlPath, html, 'utf8');

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(180000);
    page.setDefaultNavigationTimeout(180000);
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0', timeout: 180000 });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      margin: {
        top: '16mm',
        right: '14mm',
        bottom: '16mm',
        left: '14mm',
      },
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;padding:0 10mm;font-size:8px;font-family:'Arial Narrow','Segoe UI',sans-serif;display:flex;justify-content:space-between;align-items:center;color:#939598;letter-spacing:0.08em;text-transform:uppercase;">
          <span style="color:#E50011;">${escapeHtml(labels.footerTitle.toUpperCase())}</span>
          <span style="color:#000000;"><span class="pageNumber"></span></span>
        </div>`,
    });
  }
  finally {
    await browser.close();
  }

  console.log(`PDF created: ${outputPath}`);
}

await main();