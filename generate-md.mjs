import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translations } from './translations.mjs';
import { formatPageRange } from './format_text.mjs';
import { isPanelLabel } from './brand.mjs';
import { PART1_SECTIONS, PART2_SECTIONS } from './manual-sections.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'manuals');

const UI_TERMS = [
  'I/O Setup', 'Parameter wheel', 'Value wheel', 'Arrow keys',
  '> Arrow right', '< Arrow left', 'External Control In', 'External control',
  'Power switch', 'bypass key', 'Quick Store', 'Input/Output',
  'Main Vol', 'Killdry', 'Empty Routing', 'Fx In', 'Mute mode',
  'Recall', 'Effects', 'Routing', 'Layout', 'Editing', 'Store', 'Enter', 'Exit',
  'Utility', 'Mod', 'Tuner', 'Tempo', 'Bypass', 'MIDI', 'Audio', 'Control',
  'Compressor', 'Reverb', 'Delay', 'Chorus', 'Pitch', 'Drive', 'Mix', 'Edit',
  'Billboard', 'Letterbox', 'Preset', 'ROM', 'USER', 'CARD',
  'IN/OUT KNOBS', 'CARD SLOT', 'OVERALL BYPASS', 'THE PARAMETER WHEEL',
  'THE VALUE WHEEL', 'ENTER, EXIT', 'EFFECT BYPASS', 'NOISE GATE',
  'POWER', 'BILLBOARD', 'METERS', 'TUNER', 'TEMPO', 'ARROW KEYS',
].sort((a, b) => b.length - a.length);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wrapUiTerms(text) {
  let t = text;
  t = t.replace(/< > Arrow keys/g, '`Arrow keys`');
  t = t.replace(/< >\s*Arrow keys/g, '`Arrow keys`');
  for (const term of UI_TERMS) {
    const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
    t = t.replace(re, (match, offset, whole) => {
      const before = whole[offset - 1];
      const after = whole[offset + match.length];
      if (before === '`' || after === '`') return match;
      return `\`${match}\``;
    });
  }
  t = t.replace(/``+/g, '`');
  return t;
}

function blocksToMarkdown(blocks) {
  const lines = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      lines.push('');
      inList = false;
    }
  };

  for (const b of blocks) {
    if (b.type === 'gap') continue;

    const text = wrapUiTerms(b.text || '');

    if (b.type === 'heading') {
      closeList();
      if (isPanelLabel(b.text)) {
        lines.push(`#### ${b.text}`);
      } else {
        lines.push(`### ${b.text}`);
      }
      lines.push('');
      continue;
    }

    if (b.type === 'paragraph' || b.type === 'preset-header') {
      closeList();
      lines.push(text);
      lines.push('');
      continue;
    }

    if (b.type === 'bullet') {
      if (!inList) inList = true;
      lines.push(`- ${text}`);
      continue;
    }

    if (b.type === 'numbered') {
      closeList();
      lines.push(`${b.num}. ${text}`);
      continue;
    }

    if (b.type === 'note') {
      closeList();
      lines.push(`> ${text}`);
      lines.push('');
    }
  }

  closeList();
  return lines.join('\n').trim();
}

function tocSectionMarkdown() {
  return `Цей посібник описує кнопки, ручки, контролери, входи та виходи, створення User preset, підключення Modifiers, налаштування Expression pedal, виклик і збереження preset, I/O, MIDI та системні параметри.

### Основні розділи

- Про цей посібник та передмова
- Короткий посилання
- Передня та задня панель
- Схема сигналу
- Налаштування ефектів та presets
- Виклик, Store, Effects, I/O, Modifiers, Utility
- Опис блоків ефектів
- Технічні характеристики, усунення несправностей, MIDI
- Self Test та список presets

**Виробник:** TC Electronic, Sindalsvej 34, DK-8240 Risskov — tcdk@tcelectronic.com  
**Rev** 1.01 — SW V 2.04 — Prod No: 606055012`;
}

function buildPart(title, intro, sections) {
  const parts = [`# ${title}`, '', intro, ''];

  for (const sec of sections) {
    parts.push(`## ${sec.title}`, '');
    if (sec.custom === 'toc') {
      parts.push(tocSectionMarkdown(), '');
      continue;
    }
    const blocks = formatPageRange(translations, sec.from, sec.to);
    parts.push(blocksToMarkdown(blocks), '');
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const part1 = buildPart(
    'TC Electronic G-Force — Посібник користувача',
    'Український переклад оригінального посібника TC Electronic G-Force. Назви меню, кнопок, параметрів і presets залишені англійською, як у оригіналі.',
    PART1_SECTIONS
  );

  const part2 = buildPart(
    'TC Electronic G-Force — Посібник користувача (продовження)',
    'Продовження посібника G-Force.',
    PART2_SECTIONS
  );

  const part1Path = path.join(OUT_DIR, 'GForce.ua.part1.md');
  const part2Path = path.join(OUT_DIR, 'GForce.ua.part2.md');
  fs.writeFileSync(part1Path, part1, 'utf8');
  fs.writeFileSync(part2Path, part2, 'utf8');
  console.log('Written:', part1Path);
  console.log('Written:', part2Path);
  console.log('part1 chars:', part1.length, 'part2 chars:', part2.length);
}

main();
