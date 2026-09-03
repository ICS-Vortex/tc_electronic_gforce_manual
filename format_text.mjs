/**
 * Turns flat extracted manual text into structured blocks for PDF layout.
 */

// Описові заголовки секцій → українська. Назви меню/кнопок/блоків залишаємо англійською.
const HEADER_UA = {
  'About this Manual': 'Про цей посібник',
  'From a users point of view': 'З точки зору користувача',
  'Setting up an Effect': 'Налаштування ефекту',
  'Editing an effect': 'Редагування ефекту',
  'How to set the level of a preset:': 'Як установити рівень preset',
  'How to set the level of a preset': 'Як установити рівень preset',
  'How to add a block to the Routing': 'Як додати блок до Routing',
  'How to change a sub-algorithm': 'Як змінити sub-algorithm',
  'How to Delete or Replace a block': 'Як видалити або замінити блок',
  'How to Store your new preset': 'Як зберегти ваш новий preset',
  'How to connect the Modifiers': 'Як підключити Modifiers',
  'Creating a ducking Delay': 'Створення ducking Delay',
  'Creating an Autopanning Delay via Modifiers': 'Автопанорамування Delay через Modifiers',
  'How to set up an Expression pedal': 'Налаштування Expression Pedal',
  'How to calibrate and choose Pedal type': 'Калібрування та вибір типу педалі',
  'The function of the Pedal': 'Функція педалі',
  'How to set up my MIDI board': 'Налаштування MIDI board',
  'How to change User presets using my MIDI board': 'Зміна User presets через MIDI board',
  'How to use some of the extra functions of my board with the G-Force': 'Додаткові функції MIDI board',
  'How to Recall a single block from an existing preset': 'Виклик одного блоку з preset',
  'The Stereo Guitar System': 'Стерео гітарна система',
  'Serial setup': 'Послідовне (serial) підключення',
  'Parallel setup': 'Паралельне (parallel) підключення',
  'The Connections': 'Підключення',
  'The Mono Guitar System': 'Моно гітарна система',
  'Editing directly from the Routing display': 'Редагування з дисплею Routing',
  'Changing the Sub-algorithm': 'Зміна sub-algorithm',
  'Quick Store with the same name': 'Збереження з тим самим ім’ям',
  'Using a Memory Card': 'Використання memory card',
  'Card types': 'Типи карт',
  'Recalling a Preset': 'Виклик Preset',
  'Recalling a single effect': 'Виклик одного ефекту',
  'Optimal preset change': 'Оптимальна зміна preset',
  'For the customers in Canada:': 'Для клієнтів у Канаді:',
  'Example:': 'Приклад:',
  'NOTE:': 'ПРИМІТКА:',
  'WARNING:': 'УВАГА:',
  'Caution:': 'Обережно:',
  'Service': 'Сервіс',
  'Warning!': 'Попередження!',
  'Setting up your MIDI board': 'Налаштування MIDI board',
  'Setting up an Expression Pedal': 'Налаштування Expression Pedal',
  'The Tuner display': 'Дисплей Tuner',
  'The Pitch block': 'Блок Pitch',
  'The Drive': 'Блок Drive',
  'The Chorus/Flanger Block': 'Блок Chorus/Flanger',
  'Default parameter setting': 'Параметр за замовчуванням',
  'Board factory defaults': 'Заводські налаштування board',
  'G-Force control': 'Керування G-Force',
  'Modifier input': 'Вхід Modifier',
  'Effect Bypass': 'Bypass ефектів',
  'Environment': 'Окруження',
  'User Bank Protect': 'Захист User bank',
  'User Bank Backup': 'Резервна копія User bank',
  'Message String': 'Текст повідомлення',
  'Activity': 'Активність',
  'Scrolling': 'Прокручування',
  'Tempo display': 'Дисплей Tempo',
  'Pan+Trem block': 'Блок Pan+Trem',
};

// Назви меню, кнопок, блоків — не перекладаємо
const KEEP_HEADER_EN = new Set([
  'Recall', 'Quick Store', 'Editing', 'Store', 'Effects', 'Mix', 'Layout', 'Routing',
  'Audio', 'MIDI', 'Input/Output', 'The Letterbox', 'Delete',
  'POWER', 'IN/OUT KNOBS', 'CARD SLOT', 'BILLBOARD', 'METERS',
  'OVERALL BYPASS', 'TUNER', 'TEMPO', 'ARROW KEYS', 'THE PARAMETER WHEEL',
  'THE VALUE WHEEL', 'ENTER, EXIT', 'EFFECT BYPASS', 'NOISE GATE',
  'Compressor', 'Filters', 'The Source', 'The Input',
  'PARAMETRIC EQ', 'RESONANCE', 'WAH WAH', 'PHASER', 'TREMOLO / PAN',
  'INTELLIGENT PITCHER', 'STEREO DELAY', 'DUAL DELAY', 'REVERB', 'CHORUS/FLANGER',
  'FLANGER CLASSIC', 'QUAD TAP DELAY', 'Config.', 'Utility', 'Billboard',
]);

function translateHeading(text) {
  const t = text.trim();
  if (KEEP_HEADER_EN.has(t)) return t;
  if (HEADER_UA[t]) return HEADER_UA[t];
  const ukr = (t.match(/[а-яіїєґА-ЯІЇЄҐ]/g) || []).length;
  if (ukr > t.length * 0.3) return t;
  return HEADER_UA[t] || t;
}

const HEADING_HINTS = new Set([
  'Quick Store with the same name', 'The Letterbox', 'Using a Memory Card',
  'Card types', 'Delete', 'Recalling a Preset', 'Recalling a single effect',
  'Optimal preset change', 'Setting up an Effect', 'Editing an effect',
  'How to set the level of a preset', 'How to add a block to the Routing',
  'How to change a sub-algorithm', 'How to Delete or Replace a block',
  'How to Store your new preset', 'How to connect the Modifiers',
  'Creating a ducking Delay', 'Creating an Autopanning Delay via Modifiers',
  'How to set up an Expression pedal', 'How to calibrate and choose Pedal type',
  'The function of the Pedal', 'How to set up my MIDI board',
  'How to change User presets using my MIDI board',
  'How to use some of the extra functions of my board with the G-Force',
  'How to Recall a single block from an existing preset',
  'The Stereo Guitar System', 'Serial setup', 'Parallel setup', 'The Connections',
  'Input/Output', 'The Mono Guitar System', 'Editing directly from the Routing display',
  'Mix', 'Layout', 'Editing an effect', 'Changing the Sub-algorithm', 'Routing',
  'The Source', 'The Input', 'Audio', 'MIDI', 'About this Manual',
  'From a users point of view', 'Recall', 'Quick Store', 'Editing',
  'Setting up your MIDI board', 'Setting up an Expression Pedal',
  'Input/Output', 'Recall', 'Quick Store', 'Editing',
  'POWER', 'IN/OUT KNOBS', 'CARD SLOT', 'BILLBOARD', 'METERS',
  'OVERALL BYPASS', 'TUNER', 'TEMPO', 'ARROW KEYS', 'THE PARAMETER WHEEL',
  'THE VALUE WHEEL', 'ENTER, EXIT', 'EFFECT BYPASS', 'NOISE GATE',
  'Compressor', 'Filters', 'Service', 'Warning!', 'Caution:',
  'For the customers in Canada:', 'Example:', 'NOTE:', 'WARNING:',
  'Приклад:', 'ПРИМІТКА:', 'УВАГА:', 'З точки зору користувача',
]);

function isLikelyHeading(text) {
  const t = text.trim();
  if (!t || t.length > 90) return false;
  if (t.startsWith('•')) return false;
  if (HEADING_HINTS.has(t)) return true;
  // Short English-heavy line (menu / section title)
  const letters = t.match(/[A-Za-z]/g)?.length ?? 0;
  const ukr = t.match(/[а-яіїєґА-ЯІЇЄҐ]/g)?.length ?? 0;
  if (letters > 4 && letters / (letters + ukr) > 0.75 && t.length < 55) return true;
  // ALL CAPS short
  if (t.length < 50 && t === t.toUpperCase() && /[A-Z]/.test(t)) return true;
  return false;
}

function isPresetListPage(pageNum) {
  return pageNum >= 57 && pageNum <= 63;
}

/** Маркер нумерованого пункту: число + пробіл(и) + велика літера (не «3 секунд», «10 ms») */
const NUMBERED_MARKER = /(?:^|\s)((?:1[0-3]|[1-9]))\s+(?=[A-ZА-ЯІЇЄҐ])/g;

function findNumberedMarkers(text) {
  const markers = [];
  let m;
  const re = new RegExp(NUMBERED_MARKER.source, 'g');
  while ((m = re.exec(text)) !== null) {
    markers.push({ num: parseInt(m[1], 10), index: m.index + m[0].length - m[1].length - 1 });
  }
  return markers;
}

function isSequentialRun(nums, minRun = 3) {
  if (nums.length < minRun) return false;
  let run = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      run++;
      if (run >= minRun) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

/** Розбиває «1. Текст. 2. Текст.» (англ. стиль) */
function expandDotNumberedLists(text) {
  const markers = [];
  const re = /(?:^|[\s:;,])(\d{1,2})\.\s+(?=[A-ZА-ЯІЇЄҐ])/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    markers.push(parseInt(m[1], 10));
  }
  if (markers.length < 2 || !isSequentialRun(markers, 2)) return text;

  const parts = text.split(/\s+(?=\d{1,2}\.\s+(?=[A-ZА-ЯІЇЄҐ]))/);
  return parts
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      const dm = trimmed.match(/^(\d{1,2})\.\s+(.*)$/s);
      if (dm) return `\n§${dm[1]}§${dm[2].trim()}`;
      return trimmed;
    })
    .filter(Boolean)
    .join('');
}

/** Розбиває «1   Текст. 2   Текст.» на нумерований список */
function expandNumberedLists(text) {
  text = text.replace(/^[a-z]\s{2,}/i, '');
  const markers = findNumberedMarkers(text);
  if (markers.length < 3 && !isSequentialRun(markers.map((x) => x.num))) {
    return expandDotNumberedLists(text);
  }

  const splitRe = /\s+(?=(?:1[0-3]|[1-9])\s+(?=[A-ZА-ЯІЇЄҐ]))/;
  const parts = text.split(splitRe);
  const expanded = parts
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      const m = trimmed.match(/^((?:1[0-3]|[1-9]))\s+(.*)$/s);
      if (m) return `\n§${m[1]}§${m[2].trim()}`;
      return trimmed;
    })
    .filter(Boolean)
    .join('');
  return expanded.includes('§') ? expanded : expandDotNumberedLists(text);
}

/** Таблиця напруг (110-125V   UL817...) */
function expandVoltageTable(text) {
  return text.replace(/\s{2,}((?:1[0-3]|[2-9])\d{1,2}-\d+V)\s{2,}/g, '\n• $1  ');
}

// Назви елементів передньої панелі / секцій (CAPS)
const PANEL_LABELS =
  'POWER|IN/OUT KNOBS|CARD SLOT|BILLBOARD|METERS|OVERALL BYPASS|TUNER|TEMPO|ARROW KEYS|' +
  'THE PARAMETER WHEEL|THE VALUE WHEEL|ENTER, EXIT|EFFECT BYPASS|NOISE GATE|' +
  'Recall|Quick Store|Editing|Setting up your MIDI board|Setting up an Expression Pedal|Input/Output';

const PANEL_LABELS_RE = new RegExp(`\\s{2,}(${PANEL_LABELS})\\s{2,}`, 'g');
const PANEL_LINE_RE = new RegExp(`^(${PANEL_LABELS})\\s{2,}(.*)$`);

function stripPageNumber(text) {
  return text.replace(/^\d{1,3}\s{2,}/, '').replace(/\s+\d{1,3}\s*$/, '').trim();
}

function mergeBoundaryBlocks(prev, next) {
  if (!prev.length || !next.length) return;
  const last = prev[prev.length - 1];
  const first = next[0];
  if (last.type === 'gap') return;
  if (first.type === 'gap') {
    next.shift();
    if (!next.length) return;
    mergeBoundaryBlocks(prev, next);
    return;
  }
  if (last.type === 'paragraph' && first.type === 'paragraph') {
    last.text = `${last.text.replace(/\s+$/, '')} ${first.text.replace(/^\s+/, '')}`;
    next.shift();
  }
}

function postProcessBlocks(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.type === 'section') continue;
    if (b.type === 'gap') {
      if (out.length && out[out.length - 1].type === 'gap') continue;
      if (out.length && out[out.length - 1].type === 'heading') continue;
      continue;
    }
    if (b.type === 'paragraph' && out.length) {
      const prev = out[out.length - 1];
      const t = b.text.trim();
      // «line mixer.» або один короткий уривок — злити з попереднім абзацом
      if (
        prev.type === 'paragraph' &&
        (t.length < 20 || /^[a-zа-яіїєґ][a-zа-яіїєґ.\s]{0,18}$/i.test(t))
      ) {
        prev.text = `${prev.text.replace(/\s+$/, '')} ${t}`;
        continue;
      }
    }
    out.push(b);
  }
  return out;
}

export function formatPageRange(translations, fromPage, toPage) {
  const allBlocks = [];
  for (let p = fromPage; p <= toPage; p++) {
    if (p === 2 || p === 6 || !translations[p]) continue;
    const blocks = formatRawText(translations[p], p);
    if (blocks.length && blocks[blocks.length - 1].type === 'paragraph') {
      blocks[blocks.length - 1].text = stripPageNumber(blocks[blocks.length - 1].text);
    }
    mergeBoundaryBlocks(allBlocks, blocks);
    allBlocks.push(...blocks);
  }
  return postProcessBlocks(allBlocks);
}

export function formatRawText(raw, pageNum) {
  let text = stripPageNumber(raw);
  text = text.replace(/^-\s{2,}/, '• ');

  if (isPresetListPage(pageNum)) {
    return formatPresetList(text);
  }

  text = expandNumberedLists(text);
  text = expandVoltageTable(text);

  // Елементи панелі та секції quick reference
  text = text.replace(PANEL_LABELS_RE, '\n\n$1\n');
  text = text.replace(
    /\s{2,}(Recall|Quick Store|Editing|Setting up your MIDI board|Setting up an Expression Pedal|Input\/Output)\s{2,}/g,
    '\n\n$1\n'
  );

  // Bullet lists: "-   " pattern from original PDF extraction
  text = text.replace(/\s+-\s{2,}/g, '\n• ');
  text = text.replace(/^З точки зору користувача\s{2,}/, 'З точки зору користувача\n');

  // Break before common section headers (English titles between double spaces)
  text = text.replace(
    /\s{2,}((?:Quick Store with the same name|The Letterbox|Using a Memory Card|Card types|Delete|Recalling a Preset|Recalling a single effect|Optimal preset change|Setting up an Effect|Editing an effect|How to [A-Za-z][^•]{3,60}?|Creating a [A-Za-z][^•]{3,50}?|The [A-Za-z][^•]{3,40}?|From a users point of view|З точки зору користувача|About this Manual|For the customers in Canada:))\s{2,}/g,
    '\n\n$1\n'
  );

  // Маркери •
  text = text.replace(/\s+•\s{2,}/g, '\n• ');

  // Labels / emphasis blocks
  text = text.replace(/\s+(Example:|NOTE:|WARNING:|Приклад:|ПРИМІТКА:|УВАГА:)\s*/g, '\n\n$1\n');

  // Розбиття абзаців — лише після крапки/знаку питання (не ламати «line mixer»)
  text = text.replace(/([.!?])\s+(?=[А-ЯІЇЄҐA-Z][a-zа-яіїєґ])/g, '$1\n');
  text = text.replace(/([а-яіїєґ'»])\s+(?=[А-ЯІЇЄҐ][а-яіїєґ])/g, '$1\n');

  // UI field labels (from diagram pages mixed into text)
  text = text.replace(
    /\s+(Bank Indicator|Store location|CAPS lock indicator|New preset name|Letterbox|Place cursor here)/g,
    '\n• $1'
  );

  // UI diagram pages (short label chains)
  if (pageNum === 21) {
    text = text.replace(
      /\s+(Double click|Двічі натисніть|Виберіть|Select|Set |Встановіть|Обертайте|Dial |Порожні|Empty |Selected|Bypassed)/gi,
      '\n• $1'
    );
  }

  // Collapse extra whitespace on single lines
  const chunks = text.split(/\n\n+/);
  const blocks = [];

  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    const chunkBlocks = [];
    for (const line of lines) {
      const panelMatch = line.match(PANEL_LINE_RE);
      if (panelMatch) {
        chunkBlocks.push({ type: 'heading', text: translateHeading(panelMatch[1]) });
        if (panelMatch[2].trim()) chunkBlocks.push({ type: 'paragraph', text: panelMatch[2].trim() });
        continue;
      }
      const numMatch = line.match(/^§(\d{1,2})§(.*)$/);
      if (numMatch) {
        chunkBlocks.push({ type: 'numbered', num: numMatch[1], text: numMatch[2].trim() });
      } else if (line.startsWith('•')) {
        chunkBlocks.push({ type: 'bullet', text: line.replace(/^•\s*/, '') });
      } else if (line.match(/^-\s+/)) {
        chunkBlocks.push({ type: 'bullet', text: line.replace(/^-\s+/, '') });
      } else if (isLikelyHeading(line)) {
        chunkBlocks.push({ type: 'heading', text: translateHeading(line) });
      } else if (line.match(/^(Example:|NOTE:|WARNING:|Приклад:|ПРИМІТКА:|УВАГА:)/)) {
        chunkBlocks.push({ type: 'note', text: translateHeading(line) });
      } else {
        chunkBlocks.push({ type: 'paragraph', text: line });
      }
    }
    if (ci > 0 && chunkBlocks[0]?.type === 'heading') {
      blocks.push({ type: 'gap', size: 5 });
    }
    blocks.push(...chunkBlocks);
  }

  // Remove trailing gap
  while (blocks.length && blocks[blocks.length - 1].type === 'gap') blocks.pop();

  // Collapse consecutive gaps
  const merged = [];
  for (const b of blocks) {
    if (b.type === 'gap' && merged.length && merged[merged.length - 1].type === 'gap') continue;
    merged.push(b);
  }
  return merged;
}

function formatPresetList(text) {
  const blocks = [];
  // Preset descriptions often follow "X X " markers at end — split long runs
  text = text.replace(/\s{2,}(A [А-Я])/g, '\n\n$1');
  text = text.replace(/\s{2,}(Простий|Стандартний|Preset|Pedal|Single|Універсальний|По суті)/g, '\n\n$1');
  text = text.replace(/([.!?])\s+(?=[А-ЯA-Z])/g, '$1\n');

  const parts = text.split(/\n\n+/);
  for (const part of parts) {
    const t = part.trim();
    if (!t) continue;
    if (t.length < 70 && /^[\d\sA-Za-z/]+$/.test(t.slice(0, 20))) {
      blocks.push({ type: 'preset-header', text: t });
    } else {
      blocks.push({ type: 'paragraph', text: t, small: true });
    }
    blocks.push({ type: 'gap', size: 1 });
  }
  if (blocks.length && blocks[blocks.length - 1].type === 'gap') blocks.pop();
  return blocks;
}

export function wrapLine(text, font, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
