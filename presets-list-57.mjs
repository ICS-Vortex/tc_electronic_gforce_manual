/** ROM presets 1–58 (printed manual page 57). */
import { PRESETS_59_160 } from './presets-list-59-160.mjs';
import { PRESETS_161_218 } from './presets-list-161-218.mjs';

export const PRESETS_57 = [
  // Mono 1–12
  { n: 1, name: 'Mono Reverb', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Простий Reverb preset, підходящий для будь-якого mono setup.' },
  { n: 2, name: 'Mono Chorus', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Простий Chorus preset, підходящий для будь-якого mono setup.' },
  { n: 3, name: 'Mono Dyn Delay', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Dynamic Delay preset, підходящий для будь-якого mono setup. Input level independent.' },
  { n: 4, name: 'Mono Harmony C-Maj', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Preset з Intelligent Pitch-shift у C-major, підходящий для будь-якого mono setup.' },
  { n: 5, name: 'Mono Doubler', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Detuned setting, що створює doubler effect, підходящий для будь-якого mono setup.' },
  { n: 6, name: 'Mono Tremolo', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Простий Tremolo preset, підходящий для будь-якого mono setup.' },
  { n: 7, name: 'Mono Touchwah', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Простий Touch Wah preset, підходящий для будь-якого mono setup.' },
  { n: 8, name: 'Mono Phaser', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Простий Phaser preset, підходящий для будь-якого mono setup.' },
  { n: 9, name: 'Mono Crank It Up', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Легко «накручений» setting, підходящий для будь-якого mono setup.' },
  { n: 10, name: 'Mono Pedal Delay', tone: 'Clean / Dirty', pedal: 'X', setup: 'Mono', desc: 'Pedal to toe підключає Delay input. Підходить для будь-якого mono setup.' },
  { n: 11, name: 'Mono Pedal Pitch', tone: 'Clean / Dirty', pedal: 'X', setup: 'Mono', desc: 'Pedal додає нижчу octave. Підходить для будь-якого mono setup.' },
  { n: 12, name: 'Mono Farout Phaser', tone: 'Clean / Dirty', pedal: '', setup: 'Mono', desc: 'Phaser з LFO controlled speed, дійсно незвичний. Підходить для будь-якого mono setup.' },
  // Stereo 13–25
  { n: 13, name: 'Stereo Reverb', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Простий Reverb preset, підходящий для будь-якого stereo setup.' },
  { n: 14, name: 'Stereo Chorus', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Простий Chorused preset, підходящий для будь-якого stereo setup.' },
  { n: 15, name: 'Stereo Wide Panner', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Panner, що панорамує за межі нормального stereo image.' },
  { n: 16, name: 'Stereo Dyn Delay', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Dynamic Delay preset, підходящий для будь-якого stereo setup. Input level independent.' },
  { n: 17, name: 'Stereo Harmony C-Maj', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Preset з Intelligent Pitch-shift у A-major, підходящий для будь-якого stereo setup.' },
  { n: 18, name: 'Stereo Doubler', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Detuned setting, що створює doubler effect, підходящий для будь-якого stereo setup.' },
  { n: 19, name: 'Stereo Light Tremolo', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Легкий Tremolo preset, підходящий для будь-якого stereo setup.' },
  { n: 20, name: 'Stereo Summers Strum', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Чудовий chorused, shimmery doubler, delay і reverb, подібний до звуку гітариста ex-Police.' },
  { n: 21, name: 'Stereo Clean Lead', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Clean preset із detuned pitch і chorus.' },
  { n: 22, name: 'Stereo Crank It Up', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Легко «накручений» setting, підходящий для будь-якого stereo setup.' },
  { n: 23, name: 'Stereo Touchwah', tone: 'Clean / Dirty', pedal: '', setup: 'Stereo', desc: 'Input sensitive Wah preset, підходящий для будь-якого stereo setup.' },
  { n: 24, name: 'Stereo Pedal Delay', tone: 'Clean / Dirty', pedal: 'X', setup: 'Stereo', desc: 'Pedal підключає Delay input. Підходить для будь-якого stereo setup.' },
  { n: 25, name: 'Stereo Pedal Pitch', tone: 'Clean / Dirty', pedal: 'X', setup: 'Stereo', desc: 'Pedal додає нижчу octave. Підходить для будь-якого mono setup.' },
  // 3-Way 26–37
  { n: 26, name: '3-Way Reverb', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Простий Reverb preset, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 27, name: '3-Way Chorus', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Простий Chorus preset, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 28, name: '3-Way Delay Doubler', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Короткий delay, що створює doubler effect, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 29, name: '3-Way Slap+Slow Dly', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Симультанний slapback delay плюс long delay, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 30, name: '3-Way Dyn Delay', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Dynamic Delay preset, підходящий для будь-якого 3-way або parallel setup. Input level independent.' },
  { n: 31, name: '3-Way Harmony A-maj', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Preset з Intelligent Pitch-shift у A-major, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 32, name: '3-Way Doubler', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Detuned setting, що створює doubler effect, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 33, name: '3-Way Lead Octave up', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Додає octave higher voice до вашого lead sound. Підходить для будь-якого 3-way або parallel setup.' },
  { n: 34, name: '3-Way Panner', tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Легкий slow panning effect. Підходить для будь-якого 3-way або parallel setup.' },
  { n: 35, name: "3-Way LA's Favored", tone: 'Clean / Dirty', pedal: '', setup: '3-Way', desc: 'Lead sound у стилі LA, підходящий для будь-якого 3-way або parallel setup.' },
  { n: 36, name: '3-Way Pedal Reverb', tone: 'Clean / Dirty', pedal: 'X', setup: '3-Way', desc: 'Pedal контролює level Reverb. Підходить для будь-якого 3-way або parallel setup.' },
  { n: 37, name: '3-Way Pedal Octaver', tone: 'Clean / Dirty', pedal: 'X', setup: '3-Way', desc: 'Pedal додає octave voice до вашого звуку. Підходить для будь-якого 3-way або parallel setup.' },
  // Rhythm 38–58
  { n: 38, name: 'Go Direct', tone: 'Clean', pedal: '', setup: 'Rhythm', desc: 'EQ & Compression.' },
  { n: 39, name: 'Clean Rhythm Room', tone: 'Clean', pedal: '', setup: 'Rhythm', desc: 'Short room і легкий Chorus.' },
  { n: 40, name: 'Clean Notes n Chords', tone: 'Clean / Dirty', pedal: 'X', setup: 'Rhythm', desc: 'Rhythm type preset. Pedal підключено до volume.' },
  { n: 41, name: 'Garden Party', tone: 'None', pedal: '', setup: 'Rhythm', desc: 'Темний, земний, насичений звук акустичної гітари.' },
  { n: 42, name: 'Love and Affection', tone: 'None', pedal: '', setup: 'Rhythm', desc: 'Насичений, compressed, органічний звук із легким chorus. Підключіть акустику напряму — і вперед.' },
  { n: 43, name: 'Arpeggiators Dream', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Vibrato-like Chorus + Compression, optional Reverb.' },
  { n: 44, name: 'Power Chord', tone: 'Driven', pedal: '', setup: 'Rhythm', desc: 'Оптимізовано для power chords, із доданим flanging. Drive готовий до роботи.' },
  { n: 45, name: 'For Acoustic Guitar', tone: 'None', pedal: '', setup: 'Rhythm', desc: 'Налаштовано для high-end Acoustic напряму в input.' },
  { n: 46, name: 'Troubadour', tone: 'None', pedal: '', setup: 'Rhythm', desc: 'Чудовий solo acoustic sound, чистий, punchy і tight. Ідеально «сидить» у записаних треків.' },
  { n: 47, name: 'Sunset Groove', tone: 'Driven', pedal: '', setup: 'Rhythm', desc: 'Out of phase, dominant sound. ДУЖЕ articulate. Чудово для muted heavy rhythm/picking style.' },
  { n: 48, name: 'Lipstick Color', tone: 'Clean/Dirty', pedal: 'X', setup: 'Rhythm', desc: 'Tight, fat effect, чудовий для додавання простору staccato rhythm guitar.' },
  { n: 49, name: 'Nice Chorus', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Простий sine Chorus effect у комбінації з hall-like Reverb.' },
  { n: 50, name: 'Lush Chorus', tone: 'Clean', pedal: '', setup: 'Rhythm', desc: 'Lush Chorus setting, добре підфарбовує clean sound.' },
  { n: 51, name: 'Double Jeopardy', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Slapback Delay і room Reverb.' },
  { n: 52, name: 'Tone Girdle', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Compressor із optional EQ і Doubler.' },
  { n: 53, name: 'Phat Chorus', tone: 'Distorted', pedal: '', setup: 'Rhythm', desc: 'EQ + Chorus.' },
  { n: 54, name: 'Crowded House', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Яскравий rhythm sound із slap Delay і reverb.' },
  { n: 55, name: 'Captain Crunch', tone: 'Heavy OD', pedal: '', setup: 'Rhythm', desc: 'Death Metal Stereo Detuning із легким slap. Спробуйте на Metallica\'s "Enter Sandman".' },
  { n: 56, name: 'Rockabilly Boogie', tone: 'Driven', pedal: '', setup: 'Rhythm', desc: 'Classic 50\'s echo sound, налаштований імітувати time delay стандартного reel-to-reel recorder.' },
  { n: 57, name: 'Thick Ducktape Delay', tone: 'Clean / Dirty', pedal: '', setup: 'Rhythm', desc: 'Detuned, warm, ducked Delays. Input level dependent.' },
  { n: 58, name: 'Slap Back Delay', tone: 'Clean/Dirty', pedal: '', setup: 'Rhythm', desc: 'По суті, саме те, що написано в назві.' },
];

export const PRESETS = [...PRESETS_57, ...PRESETS_59_160, ...PRESETS_161_218];

function escapeTableCell(text) {
  return String(text).replace(/\|/g, '\\|');
}

const SETUP_SECTIONS = [
  { setup: 'Mono', title: 'Mono', range: '1–12' },
  { setup: 'Stereo', title: 'Stereo', range: '13–25' },
  { setup: '3-Way', title: '3-Way', range: '26–37' },
  { setup: 'Rhythm', title: 'Rhythm', range: '38–88' },
  { setup: 'Lead', title: 'Lead', range: '89–137' },
  { setup: 'Wacky', title: 'Wacky', range: '138–179' },
  { setup: 'Block', title: 'Block', range: '180–225' },
];

function tableForSetup(setup) {
  const rows = PRESETS.filter((p) => p.setup === setup).map((p) => {
    const pedal = p.pedal ? '**X**' : '';
    return `| ${p.n} | ${escapeTableCell(p.name)} | ${p.tone} | ${pedal} | ${escapeTableCell(p.desc)} |`;
  });

  return `| # | Preset | Tone | Pedal | Description |
| :---: | :--- | :--- | :---: | :--- |
${rows.join('\n')}`;
}

export function presetsListMarkdown() {
  const sections = SETUP_SECTIONS.map(
    ({ setup, title, range }) => `### ${title} (${range})\n\n${tableForSetup(setup)}`
  );

  return `**Presets List** — ROM presets 1–225 (оригінал, стор. 57–61)

${sections.join('\n\n')}

**Pedal:** **X** = expression pedal preset`;
}

/** @deprecated Use presetsListMarkdown */
export const presetsList57Markdown = presetsListMarkdown;
