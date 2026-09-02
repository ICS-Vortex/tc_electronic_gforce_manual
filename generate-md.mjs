import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translations } from './translations.mjs';
import { formatPageRange } from './format_text.mjs';
import { isPanelLabel } from './brand.mjs';
import { MANUAL_SECTIONS } from './manual-sections.mjs';
import { presetsListMarkdown } from './presets-list-57.mjs';
import { selfTestMarkdown } from './self-test-page.mjs';
import { midiImplementationChartMarkdown } from './midi-implementation-chart.mjs';

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

const MANUAL_IMAGES = {
  welcomeControls: '![Елементи керування G-Force — Parameter wheel, Value wheel, Enter та Exit](images/welcome-controls.png)',
  frontPanelTop: '![Передня панель G-Force — Power, In/Out, Card Slot, Billboard та Meters](images/front-panel-top.png)',
  frontPanelControls: '![Передня панель G-Force — Effects Control та Control](images/front-panel-controls.png)',
  rearPanel: '![Задня панель G-Force — входи, виходи, MIDI та External Control](images/rear-panel.png)',
  signalFlow: '![Схема сигналу G-Force — Analog/Digital input, Effects, Bypass, output](images/signal-flow.png)',
  guitarSetupStereo: '![Stereo гітарна система — Guitar, Preamp, G-Force, Poweramp](images/guitar-setup-stereo.png)',
  guitarSetupMono: '![Моно гітарна система — Guitar, Pedals, Combo, G-Force](images/guitar-setup-mono.png)',
  recallDisplay: '![Дисплей Recall — Select, Bank, Preset](images/recall-display.png)',
  storeDisplay: '![Дисплей Store — Letterbox та Bank Indicator](images/store-display.png)',
  effectsEdit: '![Дисплей Effects — Edit](images/effects-edit.png)',
  effectsRouting: '![Дисплей Effects — Routing](images/effects-routing.png)',
  effectsMix: '![Дисплей Effects — Mix](images/effects-mix.png)',
  ioSetupAudio: '![Дисплей I/O Setup — Audio, Input selector, Killdry](images/io-setup-audio.png)',
  modifiersOverview: '![Налаштування Expression Pedal — Utilities, Effects та Modifiers](images/modifiers-overview.png)',
  modifierMatrix: '![Modifier Matrix — Cursor, Connection Point, Parameter List](images/modifier-matrix.png)',
  modifierLink: '![Дисплей Link — Curve, Low/Mid/High input та Slope](images/modifier-link.png)',
  modifiersDisplay: '![Дисплей Modifiers — Envelope, ADSR, LFO та Pitch](images/modifiers-display.png)',
  lfoWaveforms: '![LFO waveforms — Square, Triangle, Sine](images/lfo-waveforms.png)',
  lfoPulsewidth: '![LFO Pulsewidth — duty cycle waveform](images/lfo-pulsewidth.png)',
  modifierDials: '![Дисплей Mod Dials — Param dial, Value dial, EXT1/EXT2](images/modifier-dials.png)',
  tempoDisplay: '![Дисплей Tempo — TEMPO, Override preset tempo, Tempo time interval](images/tempo-display.png)',
  tunerDisplay: '![Дисплей Tuner — Tuning note, Master tune, Show always, Mute in tuner](images/tuner-display.png)',
  noiseGateSignalFlow: '![Noise Gate — схема сигналу Dyn Filters і Noise Killer](images/noise-gate-signal-flow.png)',
  compressorSignalFlow: '![Compressor — схема сигналу Sidechain](images/compressor-signal-flow.png)',
  parametricEqSignalFlow: '![Parametric EQ — схема сигналу stereo EQ bands](images/parametric-eq-signal-flow.png)',
  resonanceFiltersSignalFlow: '![Resonance filters — схема сигналу Locut і Hicut](images/resonance-filters-signal-flow.png)',
  wahWahSignalFlow: '![Wah Wah — схема сигналу stereo band-pass filter](images/wah-wah-signal-flow.png)',
  formantFiltersSignalFlow: '![Formant filters — схема сигналу formant curve](images/formant-filters-signal-flow.png)',
  phaserSignalFlow: '![Phaser — схема сигналу L/R sum, Phaser і LFO](images/phaser-signal-flow.png)',
  panTremSignalFlow: '![Pan+Trem — схема сигналу PAN+TREMOLO і LFO](images/pan-trem-signal-flow.png)',
  panTremLfoCurves: '![LFO curves — Square, Triangle, Sine](images/pan-trem-lfo-curves.png)',
  panTremPulsewidth: '![Pulsewidth — duty cycle waveform](images/pan-trem-pulsewidth.png)',
  panTremLfoPhase: '![LFO Phase — 90 degree phase change](images/pan-trem-lfo-phase.png)',
  pitcherSignalFlow: '![Pitcher — схема сигналу Detector, Pitcher і Pan](images/pitcher-signal-flow.png)',
  stereoDelaySignalFlow: '![Stereo Delay — схема сигналу Delay Line і feedback](images/stereo-delay-signal-flow.png)',
  dualDelaySignalFlow: '![Dual Delay — схема сигналу cross-feedback і Delay Line](images/dual-delay-signal-flow.png)',
  dualTwoTapDelaySignalFlow: '![Dual 2tap Delay — схема сигналу Delay Line, Pan і Levels](images/dual-two-tap-delay-signal-flow.png)',
  quadTapDelaySignalFlow: '![Quad Tap Delay — схема сигналу 4tap Delay Line, Filters і Pan](images/quad-tap-delay-signal-flow.png)',
  chorusSignalFlow: '![Chorus — схема сигналу Chorus і LFO](images/chorus-signal-flow.png)',
  chorusLfoPhase: '![LFO Phase — 90 degree phase change](images/chorus-lfo-phase.png)',
  flangerClassicSignalFlow: '![Flanger Classic — схема сигналу Flanger і LFO](images/flanger-classic-signal-flow.png)',
  reverbBlockSignalFlow: '![Reverb Block — схема сигналу Hicut, Initial Reflect і Reverb](images/reverb-block-signal-flow.png)',
  resetMenuDisplay: '![Reset Menu — LOAD USER DEFAULTS, STORE USER DEFAULTS, SET USER INFO](images/reset-menu-display.png)',
  resetUserDataDisplay: '![User Data — NAME, PHONE та клавіатура введення](images/reset-user-data-display.png)',
};

const VOLTAGE_TABLE = `| Напруга | Вилка згідно зі стандартом |
| :--- | :--- |
| 110–125 V | UL817 and CSA C22.2 no 42. |
| 220–230 V | CEE 7 page VII, SR section 107-2-D1/IEC 83 page C4. |
| 240 V | BS 1363 of 1984. Specification for 13A fused plugs and switched and unswitched socket outlets. |`;

const MIDI_EXTERNAL_MAP_TABLE = `| Controller | Value | Призначення |
| :--- | :--- | :--- |
| 0 | 0 | \`Rom\` bank preset 1 to 100 |
| 0 | 1 | \`Rom\` bank preset 101 to 200 |
| 0 | 2 | \`Rom\` bank preset 201 to 225 |
| 0 | 3 | \`User\` bank preset 1 to 100 |
| 0 | 4 | \`Card\` Bank 1 preset 1 to 100 |
| 0 | 5 | \`Card\` Bank 2 preset 1 to 100 |
| -- | -- | -- |
| 0 | 9 | \`Card\` Bank 6 preset 1 to 99 |`;

const BILLBOARD_MENU_TABLE = `| Розділ | Параметри |
| :--- | :--- |
| **Scrolling** | Speed, Activity |
| **Activity** | \`Preset\` change, Always show \`tuner\`, Run message |
| **Message string** | \`Edit\` message |`;

const UTILITY_MENU_TABLE = `| Розділ | Параметри |
| :--- | :--- |
| **User Interaction** | Display viewing angle, Parameter Dial Direction |
| **Preset Change** | Effect Muting, Extern Modifier Input |
| **Environment** | Pedal Type, Pedal Calibration, Pedal Curve, \`Tuner\` \`MIDI\` Out |
| **User bank protect** | Protect, Protect Lo-limit, Protect Hi-limit |
| **User bank backup** | \`User\` bank to \`Card\`, \`Card\` to \`User\` bank, \`User\` bank to \`MIDI\`, \`MIDI\` to \`User\` Bank |`;

const TECHNICAL_SPECS_MARKDOWN = `**Analog Inputs**

| Параметр | Значення |
| :--- | :--- |
| Connectors | 1/4" phone jack, unbalanced (Ring: grounded) |
| Impedance | 1 MOhm |
| Max. Input Level | +21 dBu |
| Sensitivity | @ 15 dB headroom: -26 dBu to +6 dBu |
| A to D Conversion | 24 bit (1 bit, 128 times oversampling) |
| A to D Delay | 0,9 ms @ 44.1 kHz |
| Dynamic Range | >105 dB |
| THD | 0.003% @ 1 kHz, 6 dB below full scale |
| Frequency Response | +0/-0.5 dB (20 Hz - 20 kHz) |
| Crosstalk | <-60 dB (20 Hz - 20 kHz) |

**Analog Outputs**

| Параметр | Значення |
| :--- | :--- |
| Connectors | 1/4" phone jack, balanced |
| Impedance | 100 Ohm (active transformer) |
| Max. Output Level | +22 dBu |
| Full Scale Output Range | -10 dBu to +22 dBu |
| D to A Conversion | 24 bit (1 bit, 128 times oversampling) |
| D to A Delay | 0.6 ms @ 44.1 kHz |
| Dynamic Range | >100 dB |
| THD | 0.005% @ 1 kHz, 6 dB below full scale |
| Frequency Response | +0/-0.5 dB (20 Hz - 20 kHz) |
| Crosstalk | <-60 dB (20 Hz - 20 kHz) |

**Digital Inputs and Outputs**

| Параметр | Значення |
| :--- | :--- |
| S/PDIF In/Out | Coaxial, RCA Type |
| Formats | EIAJ CP-340, IEC 958, S/PDIF (24 bit) |
| Sample Rate | 44.1 kHz |

**PCMCIA Interface**

| Параметр | Значення |
| :--- | :--- |
| Connector | PCMCIA Type 1 cards |
| Standards | PCMCIA 2.0, JEIDA 4.0 |
| Card Format | Supports up to 2 MB SRAM |

**Control Interface**

| Параметр | Значення |
| :--- | :--- |
| MIDI | In/Out/Thru: 5 Pin DIN |
| External control | 1/4" phone jack |

**General**

| Параметр | Значення |
| :--- | :--- |
| Finish | Лицьова панель із анодованого алюмінію. Шасі з покритої сталі. |
| LED | 3 LED meters, 5 x 14 dot LED-matrix |
| LCD | 56 x 128 dot graphic LCD-display |
| Dimensions | 19" x 1.75" x 8.2" (483 x 44 x 208 mm) |
| Weight | 5.0 lb. (2.25 kg) |
| Mains Voltage | 100 to 240 VAC, 50 to 60 Hz (auto-select) |
| Power Consumption | <20 W |
| Backup Battery Life | >10 years |

**EMC**

| Параметр | Значення |
| :--- | :--- |
| Complies with | EN 55103-1, EN 55103-2 and Class B limits of FCC rules, part 15 |

**Safety**

| Параметр | Значення |
| :--- | :--- |
| Certified to | EN 60065, UL 1419 |

**Environment**

| Параметр | Значення |
| :--- | :--- |
| Operating Temperature | 32 °F to 122 °F (0 °C to 50 °C) |
| Storage Temperature | -22 °F to 167 °F (-30 °C to 70 °C) |
| Humidity | Max. 90% non-condensing |

> **NOTE:** У зв'язку з постійним розвитком і стандартизацією всі специфікації можуть змінюватися без повідомлення.`;

function tocSectionMarkdown() {
  return `Цей посібник описує кнопки, ручки, контролери, входи та виходи, створення User preset, підключення Modifiers, налаштування Expression pedal, виклик і збереження preset, I/O, MIDI та системні параметри.

| Розділ | Опис | Стор. |
| :--- | :--- | ---: |
| **ВІТАЄМО** | *Про цей посібник* | 7 |
| **З ТОЧКИ ЗОРУ КОРИСТУВАЧА** | *Передмова Palle Schultz* | 7 |
| **КОРОТКИЙ ДОВІДНИК** | *Кнопки, ручки, контролери та інші функції* | 9 |
| **ПЕРЕДНЯ ПАНЕЛЬ** | | 10 |
| **ЗАДНЯ ПАНЕЛЬ** | *Входи, виходи* | 12 |
| **СХЕМА СИГНАЛУ** | | 13 |
| **ЯК…** | *Створення User Preset, підключення Modifiers, налаштування Expression Pedal тощо* | 14 |
| **ПІДКЛЮЧЕННЯ** | *Системи підключення гітари* | 18 |
| **RECALL** | *Виклик Preset, Factory/User presets, memory card* | 19 |
| **STORE** | *Збереження нового preset, Letterbox* | 19 |
| **EFFECTS** | *Effects, Routing та Layout* | 22 |
| **I/O MENU** | *I/O, Input selector, Sample Rate, Mix, MIDI setup* | 29 |
| **MODIFIERS** | | 25 |
| **UTILITY** | *Системні параметри, налаштування Billboard* | 48 |
| **TEMPO** | | 48 |
| **TUNER** | | 48 |
| **БЛОКИ** | *Опис блоків ефектів* | 34 |
| **RESET PAGE** | | 48 |
| **ТЕХНІЧНІ ХАРАКТЕРИСТИКИ** | | 53 |
| **УСУНЕННЯ НЕСПРАВНОСТЕЙ** | | 55 |
| **MIDI IMPLEMENTATION CHART** | | 55 |
| **SELF TEST** | | 57 |
| **СПИСОК PRESETS** | | 59 |

**Виробник:** TC Electronic, Sindalsvej 34, DK-8240 Risskov — tcdk@tcelectronic.com  
**Rev** 1.01 — SW V 2.04 — Prod No: 606055012`;
}

function injectManualAssets(markdown) {
  let result = markdown;

  result = result.replace(
    /(- Перевірте напругу у вашому регіоні та використовуйте правильний тип\.)\s*\n(?:.*\n)*?(?=Part 1: Emission|EN 55103-2|З посиланням на положення)/,
    `$1 Див. таблицю нижче:\n\n${VOLTAGE_TABLE}\n\n`
  );
  result = result.replace(
      /(багатьма параметрами G-Force\.)\n\n(### Про цей посібник)/,
      `$1\n\n${MANUAL_IMAGES.welcomeControls}\n\n$2`
    );
    result = result.replace(
      /(G-Force за замовчуванням пропонує той самий номер `User` `preset`\.)\n\n(#### Editing)/,
      `$1\n\n${MANUAL_IMAGES.storeDisplay}\n\n$2`
    );
    result = result.replace(
      /(## Передня панель\n\n)(#### POWER)/,
      `$1${MANUAL_IMAGES.frontPanelTop}\n\n$2`
    );
    result = result.replace(
      /(зміни діапазону input gain\.)\n\n(#### OVERALL BYPASS)/,
      `$1\n\n${MANUAL_IMAGES.frontPanelControls}\n\n$2`
    );
    result = result.replace(
      /(## Задня панель\n\n)(Main `Power Switch`|!\[Задня панель|\*\*Примітки:\*\*)/,
      `$1${MANUAL_IMAGES.rearPanel}\n\n**Примітки:**\n\n`
    );
    result = result.replace(
      /## Задня панель\n\n!\[Задня панель G-Force[^\n]+\n\n\*\*Примітки:\*\*\n\nMain `Power Switch`[^\n]+\n\n\*\*Примітки:\*\*\n\n/,
      `## Задня панель\n\n${MANUAL_IMAGES.rearPanel}\n\n**Примітки:**\n\n`
    );
    result = result.replace(
      /(## Задня панель\n\n(?:!\[[^\n]+\n\n)?\*\*Примітки:\*\*\n\n)(?:Main `Power Switch`|Hi-Z Unbalanced|(?:- )?Вхідні роз’єми)[\s\S]*?(?=\n## Схема сигналу)/,
      `$1Вхідні роз’єми G-Force незбалансовані. Вихідні роз’єми — збалансовані. Якщо ви під’єднуєте Outputs стереороз’ємами до незбалансованого обладнання, потрібно з’єднати ring і sleeve разом на кінцях кабелів на відстані від G-Force.\n\nВи завжди можете використовувати стандартні моно гітарні кабелі для під’єднання G-Force.\n\nВхід \`External Control\` може використовувати momentary, alternating і continuous type pedals.\n\nБлок живлення G-Force здатний працювати при будь-якій мережевій напрузі від 100–240 V, 50–60 Hz.\n\n`
    );
    result = result.replace(
      /## Схема сигналу\n\n[\s\S]*?(?=\n## Як налаштувати ефекти)/,
      `## Схема сигналу\n\n${MANUAL_IMAGES.signalFlow}\n\n**Примітки щодо signal flow:**\n\n- Сигнал завжди присутній на Analog і Digital outputs.\n- G-Force обмежений частотою дискретизації 44.1 kHz на Analog і Digital inputs.\n- Input level G-Force автоматично оптимізує співвідношення сигнал/шум за допомогою невеликого реле у вхідній секції. На дисплеї з’явиться підказка, і ви можете почути невеликий клацання під час зміни діапазону input gain.\n\n`
    );
    result = result.replace(
      /## Системи підключення гітари\n\n[\s\S]*?(?=\n## Виклик та збереження preset)/,
      `## Системи підключення гітари\n\nG-Force ретельно спроєктований для виконання всіх базових ефектів, потрібних у гітарній конфігурації. Оскільки G-Force можна використовувати в різних застосуваннях, ми пропонуємо кілька різних setups.\n\nПереконайтеся, що підсилювачі вимкнені під час під’єднання G-Force. Увімкніть G-Force перед підсилювачами.\n\n### Stereo гітарна система\n\n${MANUAL_IMAGES.guitarSetupStereo}\n\nУ конфігурації з кількома Combo amps або stereo stack ви отримуєте повну перевагу stereo \`effects\` у G-Force. Розмістіть G-Force після pre-amp або в effect loops.\n\n### Serial setup\n\nЦе найкраща конфігурація для G-Force. Високоякісні 24-бітні конвертери дозволяють використовувати G-Force без line mixer. Serial setup використовує потужність G-Force на повну. Пам’ятайте: G-Force дає можливість робити блоки ефектів parallel внутрішньо.\n\n### Parallel setup\n\nВикористання G-Force у поєднанні з line mixer. Пам’ятайте використовувати функцію \`Killdry\`, щоб уникнути прямого гітарного сигналу через G-Force.\n\n### Підключення\n\nВхідні роз’єми G-Force незбалансовані, а вихідні — збалансовані. Це означає, що можна використовувати стандартні гітарні кабелі для під’єднання G-Force до незбалансованого обладнання та стереокабелі для під’єднання G-Force до збалансованого обладнання.\n\n#### Input/Output\n\nВстановіть Input level G-Force за допомогою ручки In у верхньому лівому куті передньої панелі. Для максимальної якості 24-бітного AD converter input meter має показувати приблизно -6 до -3 dB. Відрегулюйте Output level G-Force за допомогою ручки Output. Окрім ручки Output, є master level, яким можна керувати через \`MIDI\`/Pedal, розташований у секції Out (\`Effects\` \`Edit\` display).\n\n### Моно гітарна система\n\n${MANUAL_IMAGES.guitarSetupMono}\n\nУ конфігурації з Combo amp або mono stack потрібно використовувати лівий input і output (пам’ятайте вибрати L-only у дисплеї \`I/O Setup\` \`Audio\`). G-Force можна розмістити в effect loop або після pre-amp (це також може означати після вашого Distortion stomp box).\n\n`
    );
    result = result.replace(
      /## Виклик та збереження preset\n\n[\s\S]*?(?=\n### Виклик Preset)/,
      `## Виклик та збереження preset\n\n${MANUAL_IMAGES.recallDisplay}\n\n**General**\n\n- **Select section** — використовується для вказівки певного блоку, який ви хочете викликати окремо. Має бути встановлено на «All», коли ви хочете викликати повний \`preset\` (налаштування за замовчуванням).\n- **Bank** — використовується для вибору банку, з якого ви хочете виконати \`Recall\`: \`ROM\` (factory presets), \`User\` або \`Card\` (доступно лише при вставленій pc-\`card\`).\n- **Preset** — обертайте \`Value wheel\` для попереднього перегляду presets. Натисніть \`ENTER\` для \`Recall\`.\n\n`
    );
    result = result.replace(
      /(повернеться до поточного `preset`\.)\s*\n\n(?:- Натисніть клавішу `Store`|### Збереження нового)[\s\S]*?(?=\n### Використання memory card)/,
      `$1\n\n### Збереження нового User preset\n\n- Натисніть клавішу \`Store\`.\n- Виберіть місце для нового \`preset\`. (G-Force може зберігати 100 \`User\` presets).\n- Перемістіть курсор на рядок нового імені та введіть нове ім’я \`Preset\` (знайдіть літеру або цифру за допомогою \`Value wheel\` і підтвердіть клавішею \`Enter\`).\n- Встановіть курсор на DONE і натисніть \`Enter\`, щоб завершити операцію \`Store\`.\n\n### Збереження з тим самим ім’ям\n\nЯкщо ви хочете зберегти відредагований Factory \`preset\` з тим самим ім’ям, просто натисніть \`Store\` і \`Enter\`. G-Force автоматично збереже \`preset\` у першому порожньому \`User\` space.\n\nЯкщо ви хочете зберегти відредагований \`User\` \`preset\` з тим самим ім’ям, просто натисніть \`Store\` і \`Enter\`. G-Force запропонує ту саму позицію \`User\` \`preset\` як місце збереження.\n\n${MANUAL_IMAGES.storeDisplay}\n\n- **Bank Indicator** — індикатор банку (\`ROM\` / \`USER\` / \`CARD\`).\n- **Store location** — місце збереження \`preset\`.\n- **New preset name** — нове ім’я \`preset\`.\n- **CAPS lock indicator** — індикатор регістру літер (CAP).\n- **Letterbox** — розмістіть курсор на DONE і натисніть \`Enter\`, щоб завершити операцію \`Store\`.\n\n**Letterbox**\n\nКоли ви хочете змінити ім’я \`preset\` для \`Store\`, обертайте \`Parameter wheel\`. Тепер ви можете написати нове ім’я за допомогою Letterbox: обертайте \`Value wheel\` і натисніть \`Enter\`, щоб вибрати літери або цифри. Виберіть CAP, натиснувши \`Enter\`, щоб змінити регістр літер. Після зміни імені виберіть DONE у Letterbox і натисніть \`Enter\` для \`Store\`. Натисніть будь-яку клавішу, щоб вийти з дисплею \`Store\`.\n\n`
    );
    result = result.replace(
      /(Обертайте `Value wheel`, щоб вибрати `preset` для видалення, і натисніть `Enter` для видалення\.)\s*\n\n(?:- Bank Indicator|Input meter|!\[Дисплей Effects)[\s\S]*?(?=\n## Effects, Routing)/,
      `$1\n\n${MANUAL_IMAGES.effectsEdit}\n\n${MANUAL_IMAGES.effectsRouting}\n\n${MANUAL_IMAGES.effectsMix}\n\n`
    );
    result = result.replace(
      /## Effects, Routing та Layout\n\n(?:!\[[^\n]+\n\n)+/,
      `## Effects, Routing та Layout\n\n`
    );
    result = result.replace(
      /## Effects, Routing та Layout\n\n(?:!\[[^\n]+\n\n)?(?:Bank Indicator[\s\S]*?Bypassed block\n\n|`Editing` directly)/,
      `## Effects, Routing та Layout\n\n\`Editing\` directly`
    );
    result = result.replace(
      /(будь-де в матриці\.)\s*(?:Digital clock indicator[\s\S]*?`Arrow keys`\.|!\[Дисплей I\/O Setup[\s\S]*?`Arrow keys`\.)\s*/,
      `$1\n\n${MANUAL_IMAGES.ioSetupAudio}\n\nПараметри в \`I/O Setup\` містять налаштування всіх зовнішніх підключень G-Force:\n\n- \`MIDI\`, Pedal, Digital і Analog \`Audio\`. У дисплеї \`I/O Setup\` можна вибрати \`MIDI\`, \`Control\` і \`Audio\` за допомогою клавіш \`Arrow keys\`.\n- **Input selector** — вибір джерела: Digital In або Analog In.\n- **Input signal** — режим входу: L-Only, LR-Sum або Stereo.\n- **Killdry** — приглушує весь dry signal.\n- **Digital clock indicator** — частота дискретизації digital input.\n\n`
    );
    result = result.replace(
      /(Зверніть увагу: «Coarse» має бути вибрано, коли G•Minor використовується як пристрій, що надсилає\.)\s*[\s\S]*?(?=Custom Map)/,
      `$1\n\n${MIDI_EXTERNAL_MAP_TABLE}\n\nКількість \`card\` banks залежить від розміру PCMCIA \`card\`.\n\n`
    );
    result = result.replace(
      /(не виконуватиме program change на G-Force\.)(?:\s*!\[Modifiers[\s\S]*?)?(?:\s*Базовий потік внутрішніх і зовнішніх контролерів пояснюється в цьому розділі\.\s*)?/,
      `$1\n\nБазовий потік внутрішніх і зовнішніх контролерів пояснюється в цьому розділі.\n\n`
    );
    result = result.replace(
      /(### (?:Setting up an Expression pedal|Налаштування Expression Pedal)\n\n)(?:(?:!\[[^\n]+\]\(images\/modifiers-overview\.png\)\n\n)|(?:!\[Modifiers[^\n]+\n\n)|(?:\*\*ПРИМІТКА:\*\*[^\n]+\n\n))*(### Приклад:|Ви хочете під’єднати)/,
      `$1${MANUAL_IMAGES.modifiersOverview}\n\n**ПРИМІТКА:** Якщо параметр не реагує правильно, спробуйте відкалібрувати педаль (див. \`Utility\`, Pedal Calibration).\n\n$2`
    );
    result = result.replace(
      /(з’єднати Ext\. 1 з `Delay` In Level\.)\s*\n(?:!\[Modifier Matrix[\s\S]*?|Matrix — це місце[\s\S]*?)(?=Коли два рядки з’єднані)/,
      `$1\n\n${MANUAL_IMAGES.modifierMatrix}\n\nMatrix — це місце, де ви під’єднуєте зовнішні педалі (налаштовані в \`I/O Setup\`, Ext. Input) або внутрішні Modifiers до параметрів, якими хочете керувати.\n\nОбертайте \`Parameter wheel\` для вертикального переміщення курсора і \`Value wheel\` — для горизонтального.\n\nНатисніть \`Enter\`, щоб з’єднати два рядки.\n\nНатисніть \`Exit\`, щоб видалити з’єднання.\n\nОсновна ідея: у верхньому рядку Matrix є кілька Modifiers (додаткові LFO, ADSRs, ENV і ваші Ext. Inputs).\n\nПраворуч у Matrix — список параметрів, доступних у поточному \`preset\`.\n\nЦе означає, що ефект має бути присутнім у \`preset\`, перш ніж він з’явиться в списку параметрів.\n\nНе всі параметри ефекту доступні.\n\nЩоб під’єднати Modifier до параметра, перемістіть курсор на точку перетину їхніх рядків і натисніть \`Enter\`.\n\n`
    );
    result = result.replace(
      /(увійти в дисплей Link\.)\s*\n(?:Cursor\s+Slope[\s\S]*?|!\[Дисплей Link[\s\S]*?)(?=У дисплеї Link|### ПРИМІТКА:)/,
      `$1\n\n${MANUAL_IMAGES.modifierLink}\n\n`
    );
    result = result.replace(
      /(Маленька крапка вказує, що LFO і Tremolo speed з’єднані\.)(?:\s*Це дисплей, де налаштовуються параметри внутрішніх modifiers\.)?\s*\n(?:Використовуйте|Pressing Enter|Натискання `Enter`|!\[Дисплей Modifiers)[\s\S]*?(?=Envelope Follower|Envelope follower)/,
      `$1\n\nЦе дисплей, де налаштовуються параметри внутрішніх modifiers.\n\n${MANUAL_IMAGES.modifiersDisplay}\n\nВикористовуйте \`Parameter wheel\`, щоб вибрати modifier для редагування, і натисніть \`Enter\` для доступу до параметрів поточного modifier.\n\nНижче — пояснення параметрів у Modifiers.\n\n`
    );
    result = result.replace(
      /(Вибір між: Square, Sine і Triangle\.)\s*\n(?:Pulsewidth\s+Керує|!\[LFO waveforms)[\s\S]*?(?=### Out2 phase|Out2 phase -)/,
      `$1\n\n${MANUAL_IMAGES.lfoWaveforms}\n\n### Pulsewidth\n\n- Керує поділом верхньої та нижньої частин поточної кривої, тобто якщо Pulsewidth встановлено на 75%, верхня половина кривої буде увімкнена 75% часу.\n\n${MANUAL_IMAGES.lfoPulsewidth}\n\n`
    );
    result = result.replace(
      /(?:^### Dials\n\n(?:!\[Дисплей Mod Dials[^\n]+\n\n)?|Dials\s+)Натисніть клавішу `Mod` і використовуйте клавіші `Arrow keys`, щоб вибрати Dials\.(?: \(див\. малюнок на стор\. 25\)\.)?/m,
      `### Dials\n\n${MANUAL_IMAGES.modifierDials}\n\nНатисніть клавішу \`Mod\` і використовуйте клавіші \`Arrow keys\`, щоб вибрати Dials.`
    );
    result = result.replace(
      /(?:#### Config\.|#### Config)\n\n(?:`User` Interaction\s+)?У дисплеї [Cc]onfig[^\n]*\n\n(?:\*\*Utility\*\*\n\n\| Розділ[\s\S]*?\n\n)?/,
      `#### Config\n\nУ дисплеї Config можна налаштувати кілька глобальних параметрів для G-Force, наприклад memory protect, backup \`User\` bank тощо.\n\n**Utility**\n\n${UTILITY_MENU_TABLE}\n\n`
    );
    result = result.replace(
      /(«`FX In`\/Out» утримуватиме рівень прямого сигналу)\s+(?:`Utility`[\s\S]*?заглушить прямий сигнал під час зміни `preset`\.|під час зміни `preset`\.)/,
      `$1 під час зміни \`preset\`.`
    );
    result = result.replace(
      /(### УВАГА:\n\nЦя дія перезапише ВСІ `User` presets\.)\s+G-Force містить глобальне повідомлення, яке завжди можна показувати або використовувати як screensaver\.\n\nЦей параметр визначає, як часто активне Global message\.\n\nMessage String\s+`Edit` message Натисніть `Enter` при виборі цього параметра, щоб змінити текст глобального повідомлення\.\n\nВиберіть DONE і натисніть `Enter` для завершення\.\n\n`Billboard`\s+Speed Activity[\s\S]*?У дисплеї `Billboard` можна налаштувати кілька параметрів для `Billboard`\.\n\nScrolling\s+Speed Встановлює швидкість прокручування `Billboard`\.\n\nActivity\s+`Preset` change/,
      `$1\n\n#### Billboard\n\nУ дисплеї \`Billboard\` можна налаштувати кілька параметрів для \`Billboard\`.\n\n**Billboard**\n\n${BILLBOARD_MENU_TABLE}\n\n**Scrolling**\n\nSpeed Встановлює швидкість прокручування \`Billboard\`.\n\nActivity G-Force містить глобальне повідомлення, яке завжди можна показувати або використовувати як screensaver. Цей параметр визначає, як часто активне Global message.\n\n**Activity**\n\n\`Preset\` change`
    );
    result = result.replace(
      /(Цей параметр також можна встановити з дисплею `Tuner`\.)\s+`Tempo`\s+Встановіть глобальний `tempo`/,
      `$1\n\n**Message string**\n\n\`Edit\` message Натисніть \`Enter\` при виборі цього параметра, щоб змінити текст глобального повідомлення.\n\nВиберіть DONE і натисніть \`Enter\` для завершення.\n\n## Tempo\n\nВстановіть глобальний \`tempo\``
    );
    result = result.replace(
      /(Алгоритми, які можуть використовувати глобальний `tempo`: `Delay` `Chorus` Flanger Phaser Tremolo Panner і modifiers LFO 1 LFO 2)\s+`Tempo` display\s+Натискання клавіші `Tempo` відкриває `Tempo` display/,
      `$1.\n\n### Tempo display\n\n${MANUAL_IMAGES.tempoDisplay}\n\n- **TEMPO** — введений натисканням або встановлений BPM.\n- **AT PRESET CHANGE OVERRIDE PRESET TEMPO** — увімкнення/вимкнення override.\n- **TEMPO TIME INTERVAL** — tempo натисканням у мс.\n\nНатискання клавіші \`Tempo\` відкриває \`Tempo\` display`
    );
    result = result.replace(
      /(Це налаштовується в `I\/O Setup`, `control` display\.)\n\n(?:Tapped or dialed BPM Set override On\/Off Tapped `tempo` in ms\.\n\n)?## Блоки ефектів\n\n(?:The `Tuner` display\s+)?Натискання клавіші `Tuner` відкриває `Tuner` display\. У `Tuner` display є чотири параметри налаштування\./,
      `$1\n\n## Tuner\n\n### Tuner display\n\n${MANUAL_IMAGES.tunerDisplay}\n\n- **TUNING NOTE** — вибір Detect або ручного вибору ноти.\n- **MASTER TUNE** — Master Tune.\n- **SHOW ALWAYS** — \`Billboard\` завжди показує \`Tuner\`.\n- **MUTE IN TUNER** — заглушення, коли \`Tuner\` активний.\n\nНатискання клавіші \`Tuner\` відкриває \`Tuner\` display. У \`Tuner\` display є чотири параметри налаштування.`
    );
    result = result.replace(
      /(Mute in `Tuner`\s+Цей параметр дозволяє заглушити виходи G-Force, коли `Tuner` активовано\.\n\n)Це означає, що ви\s+Choose Detect or manual note selection Master Tune Mute when `Tuner` is active `Billboard` is always `Tuner`\s+32\s+можете налаштовувати гітару на сцені без жодного звуку\./,
      `$1Це означає, що ви можете налаштовувати гітару на сцені без жодного звуку.`
    );
    result = result.replace(
      /(`Tuner` activated via pedal\/`MIDI`\s+`Tuner` можна активувати через роз’єм External input на задній панелі G-Force або через `MIDI`\.\n\nЦе налаштовується в `I\/O Setup`, `Control` display\.)\s+У цьому розділі розглянуто/,
      `$1\n\n## Блоки ефектів\n\nУ цьому розділі розглянуто`
    );
    result = result.replace(
      /(Використання `Input\/Output` mute modes означає, що під час `bypass` через поточний блок не проходить жодного сигналу\.)\s+33\s+(Базова ідея Gate)/,
      `$1\n\n### Noise gate\n\n$2`
    );
    result = result.replace(
      /(### Приклад:\n\nВи встановлюєте Threshold на -25dB і Max\. damping на 30dB\.\n\n)(?:Коли ви подаєте сигнал у G-Force, Gate нічого не робить, але коли вхідний сигнал нижчий за -25dB \(на input meter\), Gate починає приглушувати до максимуму 30dB \(див\.\n\n### Noise Gate meter\)\.\n\nШвидкість приглушування встановлюється параметром Release rate \(Rel\.rate\)\. |Коли ви подаєте сигнал у G-Force, Gate нічого не робить, але коли вхідний сигнал нижчий за -25dB \(на input meter\), Gate починає приглушувати до максимуму 30dB \(див\. Noise Gate meter\)\. Швидкість приглушування встановлюється параметром Release rate \(Rel\.rate\)\.\n\n)(?:!\[Noise Gate[^\n]+\n\n)?(У In-section G-Force знаходиться `Noise Gate`\.)/,
      `$1Коли ви подаєте сигнал у G-Force, Gate нічого не робить, але коли вхідний сигнал нижчий за -25dB (на input meter), Gate починає приглушувати до максимуму 30dB (див. Noise Gate meter). Швидкість приглушування встановлюється параметром Release rate (Rel.rate).\n\n${MANUAL_IMAGES.noiseGateSignalFlow}\n\n$2`
    );
    result = result.replace(
      /(Attack time масштабується автоматично залежно від динамічного вмісту вхідного сигналу\.)\s*(?:#### COMPRESSOR\s+)?(?:!\[Compressor[^\n]+\n\n)?(?:`COMPRESSOR`\s+)?Threshold\s+(Коли вхідний рівень перевищує Threshold, `Compressor` активується\.)/,
      `$1\n\n#### COMPRESSOR\n\n${MANUAL_IMAGES.compressorSignalFlow}\n\nThreshold $2`
    );
    result = result.replace(
      /(Кількість сусідніх частот, на які впливає фільтр, регулюється параметром BW \(bandwidth\)\.)\s*(?:#### PARAMETRIC EQ\s+)?(?:!\[Parametric EQ[^\n]+\n\n)?(?:PARAMETRIC EQ\s+)?Freq\s+(Використовуйте параметр freq, щоб встановити target frequency поточної смуги\.)/,
      `$1\n\n#### PARAMETRIC EQ\n\n${MANUAL_IMAGES.parametricEqSignalFlow}\n\nFreq $2`
    );
    result = result.replace(
      /(Щоб уникнути цього, зменшіть input level блоку Filter\.)\s*(?:#### RESONANCE\s+)?(?:!\[Resonance filters[^\n]+\n\n)?(?:RESONANCE\s+)?Order\s+(Параметр Order фільтрів resonance змінює крутизну фільтрів\.)/,
      `$1\n\n#### RESONANCE\n\n${MANUAL_IMAGES.resonanceFiltersSignalFlow}\n\nOrder $2`
    );
    result = result.replace(
      /(### Wah Wah)\s+(?:#### WAH WAH\s+)?(?:!\[Wah Wah[^\n]+\n\n)?(?:WAH WAH\s+)?Freq\s+(Частота Wah Wah\.)/,
      `### Wah Wah\n\n#### WAH WAH\n\n${MANUAL_IMAGES.wahWahSignalFlow}\n\nFreq $2`
    );
    result = result.replace(
      /(Базова ідея полягає в тому, що ви встановлюєте три координати — Start, Thru і End — у частотній області, а потім переміщуєте свій звук вгору й вниз по кривій, яку створили цими координатами\.)\s*(?:#### FORMANT CURVE\s+)?(?:!\[Formant filters[^\n]+\n\n)?(?:FORMANT CURVE\s+)?Start\s+(Початкова точка formant curve\.)/,
      `$1\n\n#### FORMANT CURVE\n\n${MANUAL_IMAGES.formantFiltersSignalFlow}\n\nStart $2`
    );
    result = result.replace(
      /(`Mute mode` у вступі цього розділу\.)\s*(?:#### PHASER\s+)?(?:!\[Phaser[^\n]+\n\n)?(?:PHASER\s+)?Speed\s+(Керує швидкістю Phaser\.)/,
      `$1\n\n#### PHASER\n\n${MANUAL_IMAGES.phaserSignalFlow}\n\nSpeed $2`
    );
    result = result.replace(
      /(Tremolo має гнучкість, якої ви не побачите в жодному stomp box\.)\s*(?:#### TREMOLO \/ PAN\s+)?(?:!\[Pan\+Trem[^\n]+\n\n)?(?:TREMOLO \/ PAN\s+)?Tremolo\s+Speed\s+(Керує тим, наскільки швидко Tremolo пульсує\.)/,
      `$1\n\n#### TREMOLO / PAN\n\n${MANUAL_IMAGES.panTremSignalFlow}\n\nTremolo Speed $2`
    );
    result = result.replace(
      /(Depth\s+Встановлює інтенсивність Tremolo або те, наскільки глибоко він sweep\.)\s+Curve\s+(Встановлює curve LFO\.)/,
      `$1\n\nCurve $2`
    );
    result = result.replace(
      /(Спробуйте Square waveform з 100% Depth, щоб отримати .{1,3}дірки.{1,3} у звуці гітари \(це називається Transforming\)\.)\n\n(?:!\[LFO curves[^\n]+\n\n)?(?:### Pulsewidth \(only in Advanced\)\n\n(?:!\[Pulsewidth[^\n]+\n\n)?)?Pulsewidth\s+\(only in Advanced\)\s+Керує поділом верхньої та нижньої частини поточної waveform, наприклад, якщо Pulsewidth встановлено на 75%, верхня половина waveform буде увімкнена 75% часу\.\s+(?:### LFO Phase \(only in Advanced\)\n\n)?LFO Phase\s+\(only in Advanced\)\s+(Зміна LFO phase спричиняє)/,
      `$1\n\n${MANUAL_IMAGES.panTremLfoCurves}\n\n### Pulsewidth (only in Advanced)\n\n${MANUAL_IMAGES.panTremPulsewidth}\n\nКерує поділом верхньої та нижньої частини поточної waveform, наприклад, якщо Pulsewidth встановлено на 75%, верхня половина waveform буде увімкнена 75% часу.\n\n### LFO Phase (only in Advanced)\n\n$2`
    );
    result = result.replace(
      /(?:Pulsewidth\s+Square Triangle Sine\s+)?Speed\s+(Керує швидкістю Panner\.)/,
      `Speed $1`
    );
    result = result.replace(
      /(Curve\s+\(only in Advanced\)\s+Встановлює curve LFO\.)/,
      `### Curve (only in Advanced)\n\nВстановлює curve LFO.`
    );
    result = result.replace(
      /(Найпоширеніша curve в Panning — Sine\.)\s*(?:### Pulsewidth \(only in Surround Panner\)\s+)?(?:Pulsewidth\s+\(only in Surround Panner\)\s+)?Керує поділом лівої та правої частини поточної waveform, тобто якщо Pulsewidth встановлено на 75%, left channel буде увімкнений 75% часу\. \(див\. pulsewidth figure в Tremolo\)\.\s*(?:### LFO Phase \(only in Surround Panner\)\s+)?(?:LFO Phase\s+\(only in Surround Panner\)\s+)?(Зміна LFO phase)/,
      `$1\n\n### Pulsewidth (only in Surround Panner)\n\nКерує поділом лівої та правої частини поточної waveform, тобто якщо Pulsewidth встановлено на 75%, left channel буде увімкнений 75% часу. (див. pulsewidth figure в Tremolo).\n\n### LFO Phase (only in Surround Panner)\n\n$2`
    );
    result = result.replace(
      /(Якщо LFO phase встановлено на 180º, left і right будуть точно протилежними\.)\s*(?:!\[LFO Phase[^\n]+\n\n)?(?:LFO PHASE\s+)?Pan Center\s+(За допомогою цього параметра ви можете перемістити center Panner\.)\s*(?:90 phase change\s+)?(у поєднанні з широким Depth змушує Panner pan за межі звичайного stereo image\.)/,
      `$1\n\n${MANUAL_IMAGES.panTremLfoPhase}\n\nPan Center $2\n\n90 phase change $3`
    );
    result = result.replace(
      /(Для цього використовуйте `Tuner`\.)\s*(?:#### INTELLIGENT PITCHER\s+)?(?:!\[Pitcher[^\n]+\n\n)?(?:INTELLIGENT PITCHER\s+)?Key\s+(За допомогою цього параметра ви можете вказати G-Force, у якій key ви граєте\.)/,
      `$1\n\n#### INTELLIGENT PITCHER\n\n${MANUAL_IMAGES.pitcherSignalFlow}\n\nKey $2`
    );
    result = result.replace(
      /(Зміна параметрів, таких як Feedback або `Mix`, під час зміни `preset` може знищити `Delay`\.)\s*(?:### Stereo Delay\s+)?(?:#### STEREO DELAY\s+)?(?:!\[Stereo Delay[^\n]+\n\n)?(?:Stereo `Delay`\s+)?(?:STEREO `DELAY`\s+)?Time\s+(Встановлює `delay` time обох каналів Left і Right\.)/,
      `$1\n\n### Stereo Delay\n\n#### STEREO DELAY\n\n${MANUAL_IMAGES.stereoDelaySignalFlow}\n\nTime $2`
    );
    result = result.replace(
      /(Out Level\s+Керує вихідним рівнем блоку `Delay`\. `Mute mode`\s+Див\.\n\n`Mute mode` у вступі цього розділу\.)\s*(?:### Dual Delay\s+)?(?:#### DUAL DELAY\s+)?(?:!\[Dual Delay[^\n]+\n\n)?DUAL `DELAY`\s+Time\s+(?:1\.\s+)?Встановлює `delay` time першого `Delay` tap\.\n(?:### Maximum delay time — 740 ms\.\n\n)?Time\s+(?:2\.\s+)?(Встановлює `delay` time другого `Delay` tap\.)(?:\n### Maximum delay time — 740 ms\.)?/,
      `$1\n\n### Dual Delay\n\n#### DUAL DELAY\n\n${MANUAL_IMAGES.dualDelaySignalFlow}\n\nTime 1 Встановлює \`delay\` time першого \`Delay\` tap.\n\nMaximum delay time — 740 ms.\n\nTime 2 $2\n\nMaximum delay time — 740 ms.`
    );
    result = result.replace(
      /(Time 2 Встановлює `delay` time другого `Delay` tap\.\n\nMaximum delay time — 740 ms\.)\n### Maximum delay time — 740 ms\./,
      `$1`
    );
    result = result.replace(
      /(`Mute mode` у вступі цього розділу\.)\s*(?:### Dual Two Tap Delay\s+)?(?:#### DUAL TWO TAP DELAY\s+)?(?:!\[Dual 2tap Delay[^\n]+\n\n)?DUAL TWO TAP `DELAY`\s+Dual Two Tap `Delay`\s+(Dual Two Tap `Delay` здатний виконувати два `delay` taps на кожній з двох `delay` lines\.)/,
      `$1\n\n### Dual Two Tap Delay\n\n#### DUAL TWO TAP DELAY\n\n${MANUAL_IMAGES.dualTwoTapDelaySignalFlow}\n\n$2`
    );
    result = result.replace(
      /(`Mute mode` у вступі цього розділу\.)\s*(?:### Quad Tap Delay\s+)?(?:#### QUAD TAP DELAY\s+)?(?:!\[Quad Tap Delay[^\n]+\n\n)?QUAD TAP `DELAY`\s+Quad Tap `Delay`\s+(Tap 1-4\s+Встановлює `delay` time чотирьох taps\.)(?:\s+Maximum delay time на tap — 1480 ms\.)?(?:\n### Maximum delay time на tap — 1480 ms\.)?/,
      `$1\n\n### Quad Tap Delay\n\n#### QUAD TAP DELAY\n\n${MANUAL_IMAGES.quadTapDelaySignalFlow}\n\n$2\n\nMaximum delay time на tap — 1480 ms.`
    );
    result = result.replace(
      /(Maximum delay time на tap — 1480 ms\.)\n\n### Maximum delay time на tap — 1480 ms\./,
      `$1`
    );
    result = result.replace(
      /(Модуляція короткого `delay` створює дуже невеликі варіації `pitch`; ці зміни `pitch`, змішані з direct sound, дають звук `Chorus`, тоді як лише modulated signal дасть `Pitch` modulator, також відомий як Vibrato\.)\s*(?:!\[Chorus[^\n]+\n\n)?(?:#### CHORUS\/FLANGER\s+)?`CHORUS`\/FLANGER\s+Classic `Chorus`\s+(використовує зв’язок між Speed і Depth, який називається Golden Ratio\. G-Force успадкував цю функцію від TC 2290\.)/,
      `$1\n\n${MANUAL_IMAGES.chorusSignalFlow}\n\n#### CHORUS/FLANGER\n\nClassic \`Chorus\` $2`
    );
    result = result.replace(
      /(Створіть Vibrato, встановивши `Mix` на 100%, Depth на 5-10% і Speed на 1-2 Hz\. right outputs починають поточну waveform у двох різних точках\.\n\n### Приклад:\n\nЯкщо LFO phase встановлено на 180º, left і right будуть точно протилежними\.)\s*(?:!\[LFO Phase[^\n]+\n\n)?(?:#### LFO PHASE\s+)?(?:LFO PHASE\s+)?`Mix`\s+`Mix` між direct sound і effect\./,
      `$1\n\n${MANUAL_IMAGES.chorusLfoPhase}\n\n#### LFO PHASE\n\nMix між direct sound і effect.`
    );
    result = result.replace(
      /(Flanger Classic\s+Classic Flanger використовує зв.{1,3}язок між Speed і Depth, який називається Golden Ratio\. G-Force успадкував це від TC 2290\.)\s*(?:!\[Flanger Classic[^\n]+\n\n)?(?:#### FLANGER CLASSIC\s+)?(?:FLANGER CLASSIC\s+)?Speed\s+Швидкість Flanger/,
      `$1\n\n${MANUAL_IMAGES.flangerClassicSignalFlow}\n\n#### FLANGER CLASSIC\n\nSpeed  Швидкість Flanger`
    );
    result = result.replace(
      /(Якщо LFO встановлено на 180º, left і right будуть точно протилежними\. \(Див\. LFO phase figure в розділі `Chorus`\)\.\n\n### Mix  Mix між direct sound і effect\.\n\nIn Level\s+Керує вхідним рівнем блоку\. `Mute mode`\s+Див\.\n\n`Mute mode` у вступі цього розділу\.)\s*`Reverb` у G-Force базується на спадщині M5000 і M2000 і налаштований для використання з гітарою\.\s*(?:### Блок Reverb\s+)?(?:!\[Reverb Block[^\n]+\n\n)?(?:#### REVERB\s+)?`REVERB`\s+(Секція `Reverb` G-Force може створювати різноманітні `Reverb` `effects`, включно з емуляцією initial reflections кімнати, що створює вражаючі просторові effect, досі доступні лише в TC M5000\.)/,
      `$1\n\n### Блок Reverb\n\n\`Reverb\` у G-Force базується на спадщині M5000 і M2000 і налаштований для використання з гітарою.\n\n${MANUAL_IMAGES.reverbBlockSignalFlow}\n\n#### REVERB\n\n$2`
    );
    result = result.replace(
      /(Hicut\s+Частота зрізу Hicut може бути 2,5kHz, 3kHz, 3,5kHz, 4kHz, 4,5kHz або 5kHz\.)\s*(?:## Сторінка Reset\s+)?(?:### Як відкрити Reset page\s+)?(?:Як відкрити Reset page\s+)?(Утримуйте `Overall Bypass` key під час включення\.\n\nПереміщуйте маркер `Parameter wheel` і натисніть `Enter`, щоб вибрати потрібний тип RESET\.)\s*(?:!\[Reset Menu[^\n]+\n\n)?(Load `User` Defaults)/,
      `$1\n\n## Сторінка Reset\n\n### Як відкрити Reset page\n\n$2\n\n${MANUAL_IMAGES.resetMenuDisplay}\n\n$3`
    );
    result = result.replace(
      /(Ваше ім'я та номер телефону відображатимуться під час включення\.)\s*(?:!\[User Data[^\n]+\n\n)?(Reset System Setup)/,
      `$1\n\n${MANUAL_IMAGES.resetUserDataDisplay}\n\n$2`
    );
    result = result.replace(
      /(Run Test Program\s+Див\. опис на сторінці 53\.)\n\nЗбереження та завантаження власних default settings\n\nВідкриття `User` Data page\n\nСкидання системних параметрів\n\nВидалення всіх `user` presets\n\n(?:### Test Programs\n\n)?Введіть тут ваше ім'я та номер телефону\n\n/,
      `$1\n\n### Test Programs\n\n`
    );
    result = result.replace(
      /(`Mute mode` у вступі цього розділу\.)\n\n## Технічні характеристики\n\n(Simple `Reverb` базується)/,
      `$1\n\n### Simple Reverb\n\n$2`
    );
    result = result.replace(
      /(### Test Programs\n\n)(?:## Технічні характеристики\n\n(?:\*\*Analog Inputs\*\*[\s\S]*?>\s*\*\*NOTE:\*\*[^\n]+\n\n)?)?(?:## Усунення несправностей та MIDI\n\n)?(?:Connectors:[\s\S]*?(?:### ПРИМІТКА:|NOTE:)\n\nУ зв.{1,3}язку з постійним розвитком і стандартизацією всі специфікації можуть змінюватися без повідомлення\.\n\n)?/,
      `$1## Технічні характеристики\n\n${TECHNICAL_SPECS_MARKDOWN}\n\n## Усунення несправностей та MIDI\n\n`
    );
    result = result.replace(
      /(- Переконайтеся, що G-Force налаштовано на правильний pedal type і педаль коректно калібрована в `Utility` menu\.)\n\n(?:## MIDI Implementation Chart\n\n[\s\S]*?)?(?:## Self Test\n\n)?(?:Function[\s\S]*?)(?:Notes[\s\S]*?(?:O:ТАК X:НІ|O:YES)[^\n]*\n\n)?(?:ДОСТУП ДО SELF-TEST[^\n]*\n\n)?(?:Обертайте `Value Wheel`[\s\S]*?|<div class="self-test-page">[\s\S]*?)(?=## Список presets)/,
      `$1\n\n## MIDI Implementation Chart\n\n${midiImplementationChartMarkdown()}\n\n## Self Test\n\n`
    );
    result = result.replace(
      /(## Self Test\n\n)(?=## Список presets)/,
      `$1${selfTestMarkdown()}\n\n`
    );
    result = result.replace(
      /(## Список presets\n\n)[\s\S]*$/,
      `$1${presetsListMarkdown()}\n`
    );

  return result;
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

  const manual = buildPart(
    'TC Electronic G-Force — Посібник користувача',
    'Український переклад оригінального посібника TC Electronic G-Force. Назви меню, кнопок, параметрів і presets залишені англійською, як у оригіналі.',
    MANUAL_SECTIONS
  );

  const manualPath = path.join(OUT_DIR, 'GForce.ua.md');
  fs.writeFileSync(manualPath, injectManualAssets(manual), 'utf8');
  console.log('Written:', manualPath);
  console.log('chars:', manual.length);
}

main();
