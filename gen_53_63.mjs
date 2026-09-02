import fs from 'fs';
import path from 'path';

const base = 'C:\\Users\\Vortex\\AppData\\Local\\Temp\\pdf_translate';

function escJs(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
}

const pages = {};

pages[53] = `51  Simple Reverb базується на тому самому алгоритмі, що й Advanced, але число параметрів зменшено до 5. Це дає змогу легко і швидко налаштувати Reverb.

Type  Задає тип Reverb, тобто автоматично визначає розмір і співвідношення між Predelay, Early reflections і Decay. (Див. Advanced Reverb для додаткового пояснення). Types: Room, Club, Hall, Church, Cathedral, Grand Hall, Fast Decay, Slow Decay, Plate, Spring.

Decay time  Задає тривалість затухання reverb від 0.01 - 20.0 seconds.

Predelay  Дозволяє регулювати predelay (час до появлення першого відбиття), який автоматично задається при виборі Type. Range +/-50.

Reverb level  Регулює сумарний Room level і Decay level; його можна розглядати як master level. Room level і Decay можна індивідуально налаштувати на інше співвідношення у розділі Room and Decay алгоритму. Range +/-50.

Color  Задає тональний Color початкових відбиттів. При значенні Auto він пов'язаний із High color. Wool - Warm - Real - Clear - Bright - Crisp - Glass - Extreme.

Mix  Цей параметр задає співвідношення між dry (прямим) і wet сигналом. Якщо ви використовуєте G-Force як insert effect, це означає, що ваш прямий сигнал проходить через G-Force.

In Level  Регулює In Level блоку.

Out Level  Регулює Out Level блоку Reverb.

Mute mode  Див. Mute mode у вступі до цього розділу.

Output  Розділ Output містить master output level і набір Speaker Filters. Усі параметри Out Section є лише глобальними, тобто не включаються під час збереження preset.

Level  У блокі Output, окрім потенціометра на передній панелі, є overall Outlevel. Цей Outlevel можна контролювати через MIDI або педаль, налаштовуючи його в I/O Setup, Control display через параметр Main Volume. Outlevel не включається в preset.

Speaker Filters  Speaker Filters призначені для зрізу частини високих і низьких частот, як це робить кабінет гітарного усилювача. Це дає змогу репетирувати з G-Force на домашній стереосистемі з preamp або педаллю та навушниками.

Filters  Вмикає/вимикає Speaker Filter On/Off.

Locut  Частота зрізу Locut filter може бути 40 або 80Hz.

Hicut  Частота зрізу Hicut може бути 2,5kHz, 3kHz, 3,5kHz, 4kHz, 4,5kHz або 5kHz.`;

pages[54] = `52  Як відкрити Reset page

Утримуйте Overall Bypass key під час включення. Переміщуйте маркер Parameter wheel і натисніть Enter, щоб вибрати потрібний тип RESET.

Load User Defaults  Це скидає всі системні параметри до default setup, створеного вами (Див. Store User Def). Це скидання НЕ видаляє User presets G-Force.

Store User Defaults  Коли у вас ідеальне налаштування G-Force, ви можете зберегти його як свій default setup. Ця функція, наприклад, дуже зручна, коли ви завершили спеціальне продюсування і хочете повернутися до нормального режиму. Коли у вас ідеальне налаштування G-Force, просто виберіть цей параметр і натисніть Enter, щоб зберегти ваші default settings.

Set User Info  Ця функція дозволяє зберегти ваше ім'я та номер телефону в G-Force. Натисніть Enter, щоб відкрити User data menu. Використовуйте Value wheel і Parameter wheel, щоб ввести ім'я та номер телефону в G-Force. Натисніть Enter, щоб підтвердити. Ваше ім'я та номер телефону відображатимуться під час включення.

Reset System Setup  Це скидає всі системні параметри до factory default. Це скидання НЕ видаляє User presets G-Force.

Clear all Presets  Це видаляє всі User presets.

Run Test Program  Див. опис на сторінці 53.

Збереження та завантаження власних default settings
Відкриття User Data page
Скидання системних параметрів
Видалення всіх user presets
Test Programs
Введіть тут ваше ім'я та номер телефону`;

pages[55] = `53  Connectors:   1/4" phone jack, unbalanced (Ring: grounded)
Impedance:   1 MOhm
Max. Input Level:   +21 dBu
Sensitivity:   @ 15 dB headroom: -26 dBu to +6 dBu
A to D Conversion:   24 bit (1 bit, 128 times oversampling)
A to D Delay:   0,9 ms @ 44.1 kHz
Dynamic Range:   >105 dB
THD:   0.003% @ 1 kHz, 6 dB below full scale
Frequency Response:   +0/-0.5 dB (20 Hz - 20 kHz)
Crosstalk:   <-60 dB (20 Hz - 20 kHz)

Analog Outputs
Connectors:   1/4" phone jack, balanced
Impedance:   100 Ohm (active transformer)
Max. Output Level:   +22 dBu
Full Scale Output Range:   -10 dBu to +22 dBu
D to A Conversion:   24 bit (1 bit, 128 times oversampling)
D to A Delay:   0.6 ms @ 44.1 kHz
Dynamic Range:   >100 dB
THD:   0.005% @ 1 kHz, 6 dB below full scale
Frequency Response:   +0/-0.5 dB (20 Hz - 20 kHz)
Crosstalk:   <-60 dB (20 Hz - 20 kHz)

Digital Inputs and Outputs
S/PDIF In/Out:   Coaxial, RCA Type
Formats:   EIAJ CP-340, IEC 958, S/PDIF (24 bit)
Sample Rate:   44.1 kHz

PCMCIA Interface
Connector:   PCMCIA Type 1 cards
Standards:   PCMCIA 2.0, JEIDA 4.0
Card Format:   Supports up to 2 MB SRAM

Control Interface
MIDI:   In/Out/Thru: 5 Pin DIN
External control:   1/4" phone jack

General
Finish:   Лицьова панель із анодованого алюмінію. Шасі з покритої сталі.
LED:   3 LED meters, 5 x 14 dot LED-matrix
LCD:   56 x 128 dot graphic LCD-display
Dimensions:   19" x 1.75" x 8.2" (483 x 44 x 208 mm)
Weight:   5.0 lb. (2.25 kg)
Mains Voltage:   100 to 240 VAC, 50 to 60 Hz (auto-select)
Power Consumption:   <20 W
Backup Battery Life:   >10 years

EMC
Complies with:   EN 55103-1, EN 55103-2 and Class B limits of FCC rules, part 15

Safety
Certified to:   EN 60065, UL 1419

Environment
Operating Temperature:   32 °F to 122 °F (0 °C to 50 °C)
Storage Temperature:   -22 °F to 167 °F (-30 °C to 70 °C)
Humidity:   Max. 90% non-condensing

NOTE: У зв'язку з постійним розвитком і стандартизацією всі специфікації можуть змінюватися без повідомлення.`;

pages[56] = `54  - Ви вибрали Killdry ON у I/O Setup, Audio menu.

Ви натискаєте Power switch, але нічого не відбувається.
- Вимикач на задній панелі вимкнено.

Ви не можете вимкнути пристрій.
- Натисніть і утримуйте Power switch 3 seconds, потім відпустіть, щоб вимкнути.

Немає звуку через G-Force.
- Ви використовуєте Analog input, але input selector у I/O Setup, Audio menu встановлено на Digital.

Звук фазується з вашим прямим сигналом.
- Ви використовуєте G-Force у parallel setup, але killdry function у I/O Setup, Audio menu встановлено на Off.

Правий input meter не показує сигнал.
- Ви вибрали L-Only у I/O Setup, Audio menu.

Ефекти лише в Left Output
- Ви використовуєте лише Left input, але Input selector у I/O Setup встановлено на Stereo.

Ваша Expression pedal не працює належним чином
- Переконайтеся, що G-Force налаштовано на правильний pedal type і педаль коректно калібрована в Utility menu.`;

pages[57] = `55  Function   Transmitted   Recognized   Remarks
Basic Channel   Default   1   1
Changed   1-16   1-16
Mode   Default Messages   X   X
Altered  Note Number   X   O
True Voice   X   X
Velocity   Note ON   X   X
Note OFF   X   X
After Touch   Key's   X   O
Ch's   X   X
Pitch Bend   X   O
Control Change   0-127   0-127
Prog Change   O   O
True#   0-127   0-127
System Exclusive   O
Bulkdump   O
Bulkdump
Common   :Song Pos   X   X
:Song Sel   X   X
:Tune   X   X
System real time   :Clock   X   X
:Commands   X   X
Aux Messages   :Local ON/OFF   X   X
:All Notes OFF   X   X
:Active Sense   X   X
:Reset   X   X

Notes  O:ТАК X:НІ`;

pages[58] = `56  ДОСТУП ДО SELF-TEST І ВИБІР »RUN TEST PROGRAM«

Обертайте Value Wheel для переміщення між Self tests.

Key test  Виберіть Key test, натиснувши Enter. Ключі мають бути натиснуті у порядку, який запитує G-Force, щоб пройти тест. Натисніть Exit, щоб вийти з Key test.

In/Out knobs test  Виберіть In/Out knobs test, натиснувши Enter. Обертайте In/Out knobs до 30 і назад до 0, щоб пройти тест. Натисніть Exit, щоб вийти з In/Out test.

Parameter + Value Wheel test  Виберіть тест, натиснувши Enter. Обертайте Value and Parameter wheel до 30 і назад до 0, щоб пройти тест. Натисніть Exit, щоб вийти з Adjust Wheel test.

LED test  Виберіть LEDs test, натиснувши Enter. Обертайте Adjust Wheel, щоб перевірити LEDs. Тест «ok», коли не горить жоден Led. Натисніть Exit, щоб вийти з Led test.

Display test  Виберіть Display test, натиснувши Enter. Натисніть Enter, щоб перевірити, що всі пікселі світяться. Натисніть будь-який key, щоб вийти з pixel test. Натисніть Exit, щоб вийти з Display test.

Analog I/O test  Виберіть Analog I/O test, натиснувши Enter. Підключіть Analog Output до Analog Input, який потрібно перевірити, і натисніть Enter. PPM має показувати -12 dB, щоб пройти тест. Натисніть Exit, щоб вийти з Analog I/O test.

Digital I/O test  Виберіть Digital I/O test, натиснувши Enter. Підключіть Digital Output до Digital Input, який потрібно перевірити, і натисніть Enter. AES/EBU output також можна підключити до S/PDIF input і навпаки. Натисніть Exit, щоб вийти з Digital I/O test.

MIDI I/O test  Виберіть Midi I/O test, натиснувши Enter. Підключіть Midi Out до Midi In. Prg change 1-128 передається на Midi Thru. Підключіть цей роз'єм до Midi compatible device і підтвердьте Prg. changes. Натисніть Exit, щоб вийти з Midi I/O test.

Pedal socket test  Виберіть Pedal test, натиснувши Enter. Підключіть momentary pedal до Pedal socket. При натисканні Pedal Result має бути OK. При відпусканні Result має бути Not OK. Натисніть Exit, щоб вийти з Pedal test. NOTE: Result тесту має бути OK, якщо jack не вставлено.

PCMCIA test  Виберіть PCMCIA test, натиснувши Enter. Вставте PCMCIA card. Увага: усі Data на PCMCIA card будуть знищені. Натисніть Enter для тесту. Result показує: Low battery — час замінити батарею у вашій PCMCIA card. Not OK — спробуйте тест з іншою PCMCIA card. Натисніть Exit, щоб вийти з PCMCIA test.

Battery test  Виберіть Battery test, натиснувши Enter. Підтвердьте, що Result є OK. Натисніть Exit, щоб вийти з Battery test.

System test  Виберіть System test, натиснувши Enter. Підтвердьте, що Result є OK. Result показує: Eeprom Not OK — пристрій, найімовірно, працюватиме нормально; це повідомлення лише для сервісних цілей. DSP Not OK — зверніться до місцевого дилера. Натисніть Exit, щоб вийти з System test.

Power Off - On, щоб запустити стандартне програмне забезпечення. Build in test v.2.07`;

const DESC_REPLACEMENTS = [
  ["A straight Chorus preset suitable for any mono setup.", "Простий Chorus preset, підходящий для будь-якого mono setup."],
  ["A Dynamic Delay preset suitable for any mono setup. Input level independent.", "Dynamic Delay preset, підходящий для будь-якого mono setup. Input level independent."],
  ["A preset with Intelligent Pitch-shift in C-major suitable for any mono setup.", "Preset з Intelligent Pitch-shift у C-major, підходящий для будь-якого mono setup."],
  ["A Detuned setting producing a doubler effect suitable for any mono setup.", "Detuned setting, що створює doubler effect, підходящий для будь-якого mono setup."],
  ["A straight Tremolo preset suitable for any mono setup.", "Простий Tremolo preset, підходящий для будь-якого mono setup."],
  ["A straight Touch Wah preset suitable for any mono setup.", "Простий Touch Wah preset, підходящий для будь-якого mono setup."],
  ["A straight Phaser preset suitable for any mono setup.", "Простий Phaser preset, підходящий для будь-якого mono setup."],
  ["A slightly cranked setting suitable for any mono setup.", "Легко «накручений» setting, підходящий для будь-якого mono setup."],
  ["Pedal to toe feeds the Delay input. Suitable for any mono setup.", "Pedal to toe підключає Delay input. Підходить для будь-якого mono setup."],
  ["Pedal adds a lower octave. Suitable for any mono setup.", "Pedal додає нижчу octave. Підходить для будь-якого mono setup."],
  ["A Phaser with an LFO controlled speed, really weird. Suitable for any mono setup.", "Phaser з LFO controlled speed, дійсно незвичний. Підходить для будь-якого mono setup."],
  ["A straight Reverb preset suitable for any stereo setup.", "Простий Reverb preset, підходящий для будь-якого stereo setup."],
  ["A straight Chorused preset suitable for any stereo setup.", "Простий Chorused preset, підходящий для будь-якого stereo setup."],
  ["A Panner that pans beyond a normal stereo image.", "Panner, що панорамує за межі нормального stereo image."],
  ["A Dynamic Delay preset suitable for any stereo setup. Input level independent.", "Dynamic Delay preset, підходящий для будь-якого stereo setup. Input level independent."],
  ["A preset with Intelligent Pitch-shift in A-major suitable for any stereo setup.", "Preset з Intelligent Pitch-shift у A-major, підходящий для будь-якого stereo setup."],
  ["A Detuned setting producing a doubler effect suitable for any stereo setup.", "Detuned setting, що створює doubler effect, підходящий для будь-якого stereo setup."],
  ["A subtle Tremolo preset suitable for any stereo setup.", "Легкий Tremolo preset, підходящий для будь-якого stereo setup."],
  ["Great chorused, shimmery doubler, delay and reverb similar to sound used by ex- Police guitarist.", "Чудовий chorused, shimmery doubler, delay і reverb, подібний до звуку гітариста ex-Police."],
  ["A clean preset with detuned pitch and chorus.", "Clean preset із detuned pitch і chorus."],
  ["A slightly cranked setting suitable for any stereo setup.", "Легко «накручений» setting, підходящий для будь-якого stereo setup."],
  ["An input sensitive Wah preset suitable for any stereo setup.", "Input sensitive Wah preset, підходящий для будь-якого stereo setup."],
  ["Pedal feeds the Delay input. Suitable for any stereo setup.", "Pedal підключає Delay input. Підходить для будь-якого stereo setup."],
  ["Pedal adds a lower octave. Suitable for any mono setup.", "Pedal додає нижчу octave. Підходить для будь-якого mono setup."],
  ["A straight Reverb preset suitable for any 3-way or parallel setup.", "Простий Reverb preset, підходящий для будь-якого 3-way або parallel setup."],
  ["A straight Chorus preset suitable for any 3-way or parallel setup.", "Простий Chorus preset, підходящий для будь-якого 3-way або parallel setup."],
  ["A short delay making a doubler effect suitable for any 3-way or parallel setup.", "Короткий delay, що створює doubler effect, підходящий для будь-якого 3-way або parallel setup."],
  ["A simultaneous slapback delay plus long delay suitable for any 3-way or parallel setup.", "Симультанний slapback delay плюс long delay, підходящий для будь-якого 3-way або parallel setup."],
  ["A Dynamic Delay preset suitable for any 3-way or parallel setup. Input level independent.", "Dynamic Delay preset, підходящий для будь-якого 3-way або parallel setup. Input level independent."],
  ["A preset with Intelligent Pitch-shift in A-major, suitable for any 3-way or parallel setup.", "Preset з Intelligent Pitch-shift у A-major, підходящий для будь-якого 3-way або parallel setup."],
  ["A Detuned setting producing a doubler effect, suitable for any 3-way or parallel setup.", "Detuned setting, що створює doubler effect, підходящий для будь-якого 3-way або parallel setup."],
  ["Adds an octave higher voice to your lead sound. Suitable for any 3-way or parallel setup.", "Додає octave higher voice до вашого lead sound. Підходить для будь-якого 3-way або parallel setup."],
  ["A subtle slow panning effect. Suitable for any 3-way or parallel setup.", "Легкий slow panning effect. Підходить для будь-якого 3-way або parallel setup."],
  ["An LA like lead sound, suitable for any 3-way or parallel setup.", "Lead sound у стилі LA, підходящий для будь-якого 3-way або parallel setup."],
  ["Pedal controls the level of the Reverb. Suitable for any 3-way or parallel setup.", "Pedal контролює level Reverb. Підходить для будь-якого 3-way або parallel setup."],
  ["Pedal adds an octave voice to your sound. Suitable for any 3-way or parallel setup.", "Pedal додає octave voice до вашого звуку. Підходить для будь-якого 3-way або parallel setup."],
  ["EQ & Compression. Short room and a touch of Chorus.", "EQ & Compression. Short room і легкий Chorus."],
  ["Rhythm type preset. Pedal is attached to volume.", "Rhythm type preset. Pedal підключено до volume."],
  ["Dark, earthy, big-bodied acoustic guitar sound.", "Темний, земний, насичений звук акустичної гітари."],
  ["Lush, compressed, organic sounding and lightly chorused. Plug your acoustic in direct and go.", "Насичений, compressed, органічний звук із легким chorus. Підключіть акустику напряму — і вперед."],
  ["A Vibrato-like Chorus + Compression, optional Reverb.", "Vibrato-like Chorus + Compression, optional Reverb."],
  ["Optimized for power chords, with some flanging thrown in. Drive is ready to go.", "Оптимізовано для power chords, із доданим flanging. Drive готовий до роботи."],
  ["Set for high-end Acoustic direct into input.", "Налаштовано для high-end Acoustic напряму в input."],
  ["Great solo acoustic sound, very pure, punchy and tight. Great for sitting properly in recorded tracks.", "Чудовий solo acoustic sound, чистий, punchy і tight. Ідеально «сидить» у записаних треків."],
  ["Out of phase, dominant sound. VERY articulate. Great for muted heavy rhythm/picking style.", "Out of phase, dominant sound. ДУЖЕ articulate. Чудово для muted heavy rhythm/picking style."],
  ["A tight, fat effect great for giving space to staccato rhythm guitar.", "Tight, fat effect, чудовий для додавання простору staccato rhythm guitar."],
  ["A straight sine Chorus effect in combination with a hall-like Reverb.", "Простий sine Chorus effect у комбінації з hall-like Reverb."],
  ["Lush Chorus setting, good for coloring a clean sound.", "Lush Chorus setting, добре підфарбовує clean sound."],
  ["A slapback Delay and a room Reverb.", "Slapback Delay і room Reverb."],
  ["Compressor with optional EQ and Doubler.", "Compressor із optional EQ і Doubler."],
  ["EQ + Chorus. A bright rhythm sound with a slap Delay and a reverb.", "EQ + Chorus. Яскравий rhythm sound із slap Delay і reverb."],
  ["Death Metal Stereo Detuning with a little slap added. Try this one on Metallica's \"Enter Sandman\"", "Death Metal Stereo Detuning із легким slap. Спробуйте на Metallica's \"Enter Sandman\""],
  ["Classic 50's echo sound, set to emulate the time delay on a standard reel-to-reel recorder.", "Classic 50's echo sound, налаштований імітувати time delay стандартного reel-to-reel recorder."],
  ["Detuned, warm,   ducked Delays. Input level dependent.", "Detuned, warm, ducked Delays. Input level dependent."],
  ["Pretty much what the tittle says.", "По суті, саме те, що написано в назві."],
];

// ... PAGE60, PAGE61, PAGE62, PAGE63 replacements - truncated in write, need full file

function translatePresetPage(text, extra) {
  const all = [...DESC_REPLACEMENTS, ...extra];
  for (const [en, uk] of all) {
    text = text.split(en).join(uk);
  }
  return text;
}

// Load remaining replacements from separate approach - include all PAGE60-63 in file
// For brevity run with embedded full replacements below

const PAGE60_REPLACEMENTS = [
  ["U2 inspired Delays like on \"Where The Streets Have No Name\".", "U2 inspired Delays, як у \"Where The Streets Have No Name\"."],
  ["Sting's \"Fortress Around Your Heart\" or Andy Summer's sound on \"Every Breath You Take\".", "Sting's \"Fortress Around Your Heart\" або звук Andy Summer's у \"Every Breath You Take\"."],
  ["The Delay plays with you, but not without you.", "Delay «грає» з вами, але не без вас."],
  ["Actually Flanges through zero by delaying the straight signal though the Delay block in parallel.", "Фактично Flanges through zero, затримуючи straight signal через Delay block у parallel."],
  ["Good for R&B on a clean setting.", "Добре для R&B на clean setting."],
  ["All purpose Flanger, great for guitar and vocal effects.", "Універсальний Flanger, чудовий для guitar і vocal effects."],
  ["Super for acoustic guitar.", "Супер для acoustic guitar."],
  ["Ambient, spacey, stereo Phase-Shifting sound.", "Ambient, spacey, stereo Phase-Shifting sound."],
  ["Slow sweeping resonant Flanger, Phaser with Chorus, Pitch Detune and slap Delay into small Room.", "Slow sweeping resonant Flanger, Phaser із Chorus, Pitch Detune і slap Delay у small Room."],
  ["A simple Tremolo, but opposite in left and right.", "Простий Tremolo, але протилежний у left і right."],
  ["Pedal to heel = Stereo guitar / Pedal to toe = Fast rotating cabinet effect.", "Pedal to heel = Stereo guitar / Pedal to toe = Fast rotating cabinet effect."],
  ["Great for folk ballads or Tex-Mex tunes on clean setting.", "Чудово для folk ballads або Tex-Mex tunes на clean setting."],
  ["Heavy on Tremolo.", "Сильний Tremolo."],
  ["Clean surf guitar sound reminiscent of Beach Boys' ballads, The Surfaris or The Ventures.", "Clean surf guitar sound, що нагадує ballads Beach Boys', The Surfaris або The Ventures."],
  ["Rotary effect. Use Ext. 1 to control the speed.", "Rotary effect. Використовуйте Ext. 1 для контролю speed."],
  ["Fast Vibrato from Chorus with dual detune and room reverb.", "Fast Vibrato з Chorus із dual detune і room reverb."],
  ["Pedal slows Vibrato and lowers Reverb.", "Pedal уповільнює Vibrato і знижує Reverb."],
  ["Pretty straight preset with a classic Tremolo and a Hall.", "Досить простий preset із classic Tremolo і Hall."],
  ["Pedal to heel = Surfers dream / Pedal to toe = Tremolo.", "Pedal to heel = Surfers dream / Pedal to toe = Tremolo."],
  ["Pedal to hell = Direct guitar / Pedal to toe = Spinning guitar.", "Pedal to heel = Direct guitar / Pedal to toe = Spinning guitar."],
  ["A fast Wah Filter into a Chorus and Gate-like reverb, good for anything funky.", "Fast Wah Filter у Chorus і Gate-like reverb, добре для чогось funky."],
  ["Pedal to heel lowers Wah.", "Pedal to heel знижує Wah."],
  ["Envelope controlled fast downward-sliding Wah Filter with slow rise time + some Chorus and a small Reverb Hall.", "Envelope controlled fast downward-sliding Wah Filter із slow rise time + Chorus і small Reverb Hall."],
  ["A parked Wah effect.", "Parked Wah effect."],
  ["Sounds like Dire Strait's \"Money for Nothing\", or Boston's \"Long Time\".", "Звучить як Dire Strait's \"Money for Nothing\" або Boston's \"Long Time\"."],
  ["Pedal to heel = Clean rhythm sound, Pedal to toe = Vintage Tube screamer + Room.", "Pedal to heel = Clean rhythm sound, Pedal to toe = Vintage Tube screamer + Room."],
  ["Basic grunge rhythm guitar patch.", "Базовий grunge rhythm guitar patch."],
  ["Great rhythm sound, useful with multiple guitar players in one band.", "Чудовий rhythm sound, зручний із кількома гітаристами в одній групі."],
  ["Great overall rock/blues sound.", "Чудовий overall rock/blues sound."],
  ["Smooth Drive fuzz with dynamic Chorus, smooth Phaser, a Detuner and a nice Room.", "Smooth Drive fuzz із dynamic Chorus, smooth Phaser, Detuner і nice Room."],
  ["Good for comping Chord work.", "Добре для comping Chord work."],
  ["A thick, fuzzed and phased effect, good for choppy comping chords.", "Thick, fuzzed and phased effect, добре для choppy comping chords."],
  ["Pedal controls the amount of low end.", "Pedal контролює amount of low end."],
  ["Set pedal to toe for thin fuzzed sound.", "Встановіть pedal to toe для thin fuzzed sound."],
  ["Feed the G-Force with a clean setting, and have a little crunch.", "Подайте на G-Force clean setting — і отримайте легкий crunch."],
  ["Good for rhythm.", "Добре для rhythm."],
  ["Gives you that crunch with a loose bottom that you know from older tube amps.", "Дає той crunch із loose bottom, знайомий із older tube amps."],
  ["Gets that mid-rangy sound.", "Дає mid-rangy sound."],
  ["Great rhythm sound.", "Чудовий rhythm sound."],
  ["Compressed Country twang.", "Compressed Country twang."],
  ["Slow semi-resonant Flange in a very small \"box\" like reverb.", "Slow semi-resonant Flange у very small \"box\" like reverb."],
  ["Good for distorted chunks.", "Добре для distorted chunks."],
  ["Slow rolling Flanger with feedback.", "Slow rolling Flanger із feedback."],
  ["Slow moving reverb.", "Slow moving reverb."],
  ["Great for clean ballad leads.", "Чудово для clean ballad leads."],
  ["Steve Lukather, Mike Landau, Dan Huff. Think big 80's sound.", "Steve Lukather, Mike Landau, Dan Huff. Великий 80's sound."],
  ["Add major solo overdrive.", "Додайте major solo overdrive."],
  ["LA studio session player's clean sound.", "Clean sound LA studio session player."],
  ["Smooth, pretty, Clean Shaven !!", "Smooth, pretty, Clean Shaven !!"],
  ["Van Halen Present = Pitch-shift / Past = Phaser. Select either Pitch or Filter effect button for era.", "Van Halen Present = Pitch-shift / Past = Phaser. Виберіть Pitch або Filter effect button для епохи."],
  ["Inspired by Miles Davis' guitarist Mike Stern.", "Натхненний гітаристом Miles Davis — Mike Stern."],
  ["Jazzy Ultra \"Womanizer\" effect.", "Jazzy Ultra \"Womanizer\" effect."],
  ["A bright \"LA-like\" lead preset.", "Яскравий \"LA-like\" lead preset."],
  ["Optional Pitch octave up.", "Optional Pitch octave up."],
  ["An all purpose preset ready for pop leadlines.", "Універсальний preset для pop leadlines."],
  ["A nice tail of Delay and Reverb.", "Гарний tail Delay і Reverb."],
  ["A bit of Delay reverb and chorus.", "Трохи Delay, reverb і chorus."],
  ["Add a crunchy tone and enjoy the California feel.", "Додайте crunchy tone і насолоджуйтеся California feel."],
  ["A Chorused lead sound inspired by guys like Mike Stern.", "Chorused lead sound, натхненний такими, як Mike Stern."],
  ["A Reverb and Chorused Delay that will Chorus only your long notes.", "Reverb і Chorused Delay, що Chorus лише ваші long notes."],
  ["Dynamic Delays.", "Dynamic Delays."],
  ["The classic dull sound of an Echoplex with a slight moving detune to create flutter.", "Classic dull sound Echoplex із легким moving detune для flutter."],
  ["Pedal to heel = no Delay / Pedal to toe = feeds the Delay input.", "Pedal to heel = no Delay / Pedal to toe = feeds the Delay input."],
  ["Good for dream like application on clean sound.", "Добре для dream like application на clean sound."],
  ["Fast subtle Phaser into detune and Dly/Verb wash + Chorus.", "Fast subtle Phaser у detune і Dly/Verb wash + Chorus."],
  ["Good for clean chords, fuzzed lead.", "Добре для clean chords, fuzzed lead."],
  ["Feed with a dirty setting.", "Подайте dirty setting."],
  ["Chorus and a Delay slap makes it wide and full.", "Chorus і Delay slap роблять звук wide і full."],
  ["Bryan May in Brighton Rock or Steve Vai on David Lee Roth's \"Skyscraper\" album.", "Bryan May у Brighton Rock або Steve Vai на альбомі David Lee Roth's \"Skyscraper\"."],
  ["For Octave lead jazz lines a la Wes Montgomery.", "Для Octave lead jazz lines à la Wes Montgomery."],
  ["Pedal to heel = shimmering rhythm guitar / Pedal to toe = Added low octave.", "Pedal to heel = shimmering rhythm guitar / Pedal to toe = Added low octave."],
];

const PAGE61_REPLACEMENTS = [
  ["Play single-note runs for instant twangy Georgian C&W harmonies. Works best on higher strings.", "Play single-note runs для миттєвих twangy Georgian C&W harmonies. Найкраще на higher strings."],
  ["Envelope controlled input volume. Will perform the Volume knob trick automatically.", "Envelope controlled input volume. Автоматично виконує Volume knob trick."],
  ["Pedal performs a Whammy down when set to heel.", "Pedal виконує Whammy down при heel."],
  ["Pedal performs a Whammy up when set to toe.", "Pedal виконує Whammy up при toe."],
  ["Single note lead. Play in D-minor with a third and a fifth added.", "Single note lead. Play у D-minor із third і fifth."],
  ["Pedal to heel = crunchy lead sound, Pedal to toe = adds an octave voice.", "Pedal to heel = crunchy lead sound, Pedal to toe = adds octave voice."],
  ["Dense, thick reverb with medium long decay through a slow flanger. Good for leads and chords.", "Dense, thick reverb із medium long decay через slow flanger. Добре для leads і chords."],
  ["An Envelope controlled crossfade between Reverb and Delay. Reverb when you play, Delay when you stop.", "Envelope controlled crossfade між Reverb і Delay. Reverb, коли ви граєте; Delay, коли зупиняєтеся."],
  ["Pedal to heel = Phased guitar /   Pedal to toe = Room spinning.", "Pedal to heel = Phased guitar / Pedal to toe = Room spinning."],
  ["Pedal pans from left to right.", "Pedal панорамує з left до right."],
  ["Input sensitive parallel Wah Filter, great for picking guitar.", "Input sensitive parallel Wah Filter, чудовий для picking guitar."],
  ["Envelope Filter effect. Input level threshold dependent.", "Envelope Filter effect. Input level threshold dependent."],
  ["Fluttery Phaser and Panning with Chorus and Pitch-shifter doubles. Good on both lead and chords.", "Fluttery Phaser і Panning із Chorus і Pitch-shifter doubles. Добре для lead і chords."],
  ["Nice for blues.", "Добре для blues."],
  ["Totally dominant distorted main rhythm guitar sound, inspired by the famed Queen song.", "Totally dominant distorted main rhythm guitar sound, натхненний відомою піснею Queen."],
  ["The Ultimate power chord sound.", "The Ultimate power chord sound."],
  ["Metallica, saturated, ominous.", "Metallica, saturated, ominous."],
  ["Check the tittle, need we say more?", "Перевірте назву — треба ще щось додавати?"],
  ["Nice greasy lead.", "Nice greasy lead."],
  ["Gives you that drive with a loose bottom that you know from older tube amps.   Good for lead.", "Дає drive із loose bottom, знайомий із older tube amps. Добре для lead."],
  ["Quacks like a duck, thanks to a Wah-Wah. Brings back the 70's.", "«Крякає» як duck завдяки Wah-Wah. Повертає 70's."],
  ["Feed the G-Force with a clean tone and Wah away with your pedal. Great for leads.", "Подайте на G-Force clean tone і Wah away педаллю. Чудово для leads."],
  ["Feed the G-Force with a clean tone and Wah away with your picking power. Great for leads.", "Подайте на G-Force clean tone і Wah away picking power. Чудово для leads."],
  ["Feed the G-Force with a dirty tone and talk away with your pedal.", "Подайте на G-Force dirty tone і talk away педаллю."],
  ["Very special lead sound.", "Дуже спеціальний lead sound."],
  ["Overdriven lead sound with an octave shifter feed into a big hall. Works well on distortion setting for wild \"Yes\"   type solos.", "Overdriven lead sound із octave shifter у big hall. Добре на distortion setting для wild \"Yes\" type solos."],
  ["Wide tremolo sound on top of a punchy distorted sound. Inspired by .....guess who!", "Wide tremolo sound поверх punchy distorted sound. Натхненний... здогадайтеся ким!"],
  ["Fast Panning Chorus, sweeping Phaser and Pitch-shifter doubles into filtered slap Delays and very small Reverb.", "Fast Panning Chorus, sweeping Phaser і Pitch-shifter doubles у filtered slap Delays і very small Reverb."],
  ["Stepped Formant Filter that steps in time with repeating Delays. Play along with Delay time for best effect.", "Stepped Formant Filter, що крокує в часі з repeating Delays. Play along із Delay time для найкращого ефекту."],
  ["Slow echoes and a big Reverb.", "Slow echoes і big Reverb."],
  ["Pedal controls Phaser level.", "Pedal контролює Phaser level."],
  ["The kitchen sink, full fuzz, deep Phaser, pitch at -12 and -5, panned echo and Chorus. Good on leads.", "The kitchen sink: full fuzz, deep Phaser, pitch at -12 and -5, panned echo і Chorus. Добре на leads."],
  ["Smooth chorus, echo + a long hall Verb makes you sound like an ECM artist.", "Smooth chorus, echo + long hall Verb — звучите як ECM artist."],
  ["Two separate effect chains.", "Два separate effect chains."],
  ["Pedal controls the speed and level of the Phaser.", "Pedal контролює speed і level Phaser."],
  ["Play melodically in time with the echoes for fun and turn on the Drive for a fuzzed sound.", "Play melodically в часі з echoes для fun і ввімкніть Drive для fuzzed sound."],
  ["Dreamy \"attack free\" sound designed for slow chord or melody passages.", "Dreamy \"attack free\" sound для slow chord або melody passages."],
  ["Input level dependent First four repeats become increasingly louder before subsequent repeats decrease in volume.", "Input level dependent. Перші чотири repeats стають increasingly louder, потім subsequent repeats зменшуються в volume."],
  ["Long Reverb and Delays.", "Long Reverb і Delays."],
  ["Highly compressed bass sound, designed for ambient/Techno/TR303 emulation.", "Highly compressed bass sound для ambient/Techno/TR303 emulation."],
  ["Pedal controls the speed of the Flanger.", "Pedal контролює speed Flanger."],
  ["Pedal to heel = Moderately normal guitar / Pedal to toe = Dynamically contr. duck (1 Octave up).", "Pedal to heel = Moderately normal guitar / Pedal to toe = Dynamically contr. duck (1 Octave up)."],
  ["Dual Shifters add a fourth and a fifth creating a sus4 chord with lots of Chorus, Delay and Reverb Sounds best on leads.", "Dual Shifters додають fourth і fifth, створюючи sus4 chord із Chorus, Delay і Reverb. Найкраще на leads."],
  ["Shifter adds Octave up and down with a crazed Pan and Phaser.", "Shifter додає Octave up і down із crazed Pan і Phaser."],
  ["Dynamic Delay.", "Dynamic Delay."],
  ["Dual shifters at a 5th and octave above feed into a chorus + a very wet long Reverb. Good for slow leads.", "Dual shifters на 5th і octave above у chorus + very wet long Reverb. Добре для slow leads."],
  ["Crashy fuzz into dual Pitch-shifters set an octave up with sweeping high feedback Flanger. Great for leads.", "Crashy fuzz у dual Pitch-shifters на octave up із sweeping high feedback Flanger. Чудово для leads."],
  ["Fuzz, pitched an octave up and down into Compressor with Touchwah and slap Delays. Good on soft leads.", "Fuzz, pitched octave up і down у Compressor із Touchwah і slap Delays. Добре на soft leads."],
  ["A complex distorted effect with an octave + a fifth feeding a Chorus and some tap Delays.", "Complex distorted effect із octave + fifth у Chorus і tap Delays."],
  ["Pedal controls the Formant filters.", "Pedal контролює Formant filters."],
  ["Touchwah and a low octave shifter. Input level dependent. Removes your attack. Sounds very synth-like. For single note lines.", "Touchwah і low octave shifter. Input level dependent. Removes your attack. Звучить synth-like. Для single note lines."],
  ["Use Ext. 1 to morph from Flanger to Detuned Octaver to Touchwah and vice-versa.", "Використовуйте Ext. 1 для morph від Flanger до Detuned Octaver до Touchwah і навпаки."],
];

const PAGE62_REPLACEMENTS = [
  ["If you weren't using the G-Force, you might need two racks of gear to create this sound.", "Без G-Force, можливо, знадобилися б два racks gear для цього звуку."],
  ["Funky bass rig.", "Funky bass rig."],
  ["Play single note melodies to create instant cheesy Sci-fi tones.", "Play single note melodies для миттєвих cheesy Sci-fi tones."],
  ["Slow Panner speeds up as signal fades.", "Slow Panner прискорюється, коли signal fades."],
  ["You're sitting far away with your Vibrato sound.", "Ви «далеко» із Vibrato sound."],
  ["Spins fast with louder signals.", "Крутиться fast із louder signals."],
  ["This Phaser changes speed all the time.", "Цей Phaser постійно змінює speed."],
  ["Compressed Envelope-Filtered Reverb. Input level dependent.", "Compressed Envelope-Filtered Reverb. Input level dependent."],
  ["Pretty much what the name says.", "По суті, саме те, що в назві."],
  ["One octave up and a Touchwah.", "One octave up і Touchwah."],
  ["Square Tremolo and an Autowah.", "Square Tremolo і Autowah."],
  ["Transistor radio guitar.", "Transistor radio guitar."],
  ["An input level dependent Resonance Filter and some Delay.", "Input level dependent Resonance Filter і Delay."],
  ["Create a 1000ms loop and jam over it.", "Створіть 1000ms loop і jam over it."],
  ["Ext. 1 controls the looping, Ext. 2 controls the adding of the loop/ playing on top of the loop.", "Ext. 1 контролює looping, Ext. 2 — adding loop/playing on top of the loop."],
  ["Strike a chord, move the pedal to toe, and you have a nice background to play on.", "Strike a chord, pedal to toe — і є nice background для play on."],
  ["Push the pedal back and forth while playing, but watch out for the Demons.", "Push pedal back and forth під час play, але watch out for the Demons."],
  ["Push your pedal gently while playing long sustaining notes and listen to the talking whales.", "Push pedal gently під час long sustaining notes і listen to the talking whales."],
  ["Heeellllp meee!!.", "Heeellllp meee!!."],
  ["A fly caught in the sound!", "Муха, що застрягла в звуку!"],
  ["Chorused doubled sound into long Reverb, shifted an octave and into Phaser. Good leads.", "Chorused doubled sound у long Reverb, shifted octave і Phaser. Good leads."],
  ["Pedal to heel = Mono guitar signal / Pedal to toe = Stereo octave up.", "Pedal to heel = Mono guitar signal / Pedal to toe = Stereo octave up."],
  ["A single block with an all-purpose Reverb Room.", "Single block із all-purpose Reverb Room."],
  ["A single block with an all-purpose Church Reverb.", "Single block із all-purpose Church Reverb."],
  ["A single block with an all-purpose Grand Hall Reverb.", "Single block із all-purpose Grand Hall Reverb."],
  ["A single block with an all-purpose Cathedral Reverb.", "Single block із all-purpose Cathedral Reverb."],
  ["A single block with an all-purpose Spring Reverb.", "Single block із all-purpose Spring Reverb."],
  ["A single block with an all-purpose slow-reacting Reverb.", "Single block із all-purpose slow-reacting Reverb."],
  ["A single block with an all-purpose straight Chorus.", "Single block із all-purpose straight Chorus."],
  ["A single block with an all-purpose straight Chorus a bit faster.", "Single block із all-purpose straight Chorus, трохи faster."],
  ["A single block with an all-purpose straight Flanger.", "Single block із all-purpose straight Flanger."],
  ["A single block with an all-purpose straight Flanger a bit faster.", "Single block із all-purpose straight Flanger, трохи faster."],
  ["A single block with an all-purpose Vibrato (100% Chorus).", "Single block із all-purpose Vibrato (100% Chorus)."],
  ["A single block with an all-purpose Classic Tremolo.", "Single block із all-purpose Classic Tremolo."],
  ["A single block with an all-purpose Tremolo, opposite in left and right.", "Single block із all-purpose Tremolo, opposite у left і right."],
  ["A single block with an all-purpose Square Tremolo also known as transforming.", "Single block із all-purpose Square Tremolo, також known as transforming."],
  ["A single block with an all-purpose Panner.", "Single block із all-purpose Panner."],
  ["Tap the tempo that you want.", "Tap the tempo, який вам потрібен."],
  ["A single block with an all-purpose Panner that pans past normal stereo image.", "Single block із all-purpose Panner, що pans past normal stereo image."],
  ["A single block with an all-purpose 500ms Delay.", "Single block із all-purpose 500ms Delay."],
  ["A single block with an all-purpose Delay.", "Single block із all-purpose Delay."],
  ["Left = 500ms / Right = 400ms.", "Left = 500ms / Right = 400ms."],
  ["A single block with an all-purpose Highcut Filtered Delay, like an old tape Delay.", "Single block із all-purpose Highcut Filtered Delay, як old tape Delay."],
  ["A single block with an all-purpose Ping-Pong Delay.", "Single block із all-purpose Ping-Pong Delay."],
  ["A single block with an all-purpose 4-tap Delay.", "Single block із all-purpose 4-tap Delay."],
  ["Pedal controls the mix level of the Delay.", "Pedal контролює mix level Delay."],
  ["A single block with an all-purpose Delay. Input level dependent, plays when you stop playing.", "Single block із all-purpose Delay. Input level dependent, plays, коли ви stop playing."],
  ["A single block with an all-purpose Soft Compressor.", "Single block із all-purpose Soft Compressor."],
  ["A single block with an all-purpose Hard Compressor.", "Single block із all-purpose Hard Compressor."],
  ["A single block with an all-purpose Limiter.", "Single block із all-purpose Limiter."],
  ["A single block with an all-purpose Pitch Detune setting.", "Single block із all-purpose Pitch Detune setting."],
  ["Pedal controls the detuning of Voice 1.", "Pedal контролює detuning Voice 1."],
  ["A single block with an all-purpose octave down Pitch-shifter.", "Single block із all-purpose octave down Pitch-shifter."],
  ["Pedal controls the pitch.", "Pedal контролює pitch."],
  ["A single block with an all-purpose octave up Pitch-shifter.", "Single block із all-purpose octave up Pitch-shifter."],
  ["A single block with an Intelligent Pitch-shifter set for G-major.", "Single block із Intelligent Pitch-shifter для G-major."],
  ["Pedal controls the level of the third.", "Pedal контролює level third."],
  ["A single block with an Intelligent Pitch-shifter set for D-minor with a fifth and a third added.", "Single block із Intelligent Pitch-shifter для D-minor із fifth і third."],
  ["A single block with an Octave down Pitch-shift.", "Single block із Octave down Pitch-shift."],
  ["A single block with an all-purpose Phaser.", "Single block із all-purpose Phaser."],
  ["A single block with another all-purpose Phaser.", "Single block із another all-purpose Phaser."],
  ["Pedal controls the speed of the Phaser.", "Pedal контролює speed Phaser."],
  ["A single block with an all-purpose Wah Wah.", "Single block із all-purpose Wah Wah."],
  ["Pedal controls the Wah frequency.", "Pedal контролює Wah frequency."],
  ["A single block with an all-purpose Touchwah.   Input level dependent.", "Single block із all-purpose Touchwah. Input level dependent."],
  ["A single block with an all-purpose Autowah.", "Single block із all-purpose Autowah."],
  ["An external LFO controls the Wah frequency.", "External LFO контролює Wah frequency."],
  ["A single block with an all-purpose touch-sensitive Formant Filter.", "Single block із all-purpose touch-sensitive Formant Filter."],
  ["Input level dependent.", "Input level dependent."],
  ["A single block with an all-purpose Formant Filter.", "Single block із all-purpose Formant Filter."],
  ["Pedal controls the Formant frequency.", "Pedal контролює Formant frequency."],
  ["A single block with an all-purpose Resonance Filter.", "Single block із all-purpose Resonance Filter."],
  ["Pedal controls the Resonance frequency.", "Pedal контролює Resonance frequency."],
];

const PAGE63_REPLACEMENTS = [
  ["the Resonance filter.", "Resonance filter."],
  ["A single block with an all-purpose Drive.", "Single block із all-purpose Drive."],
  ["Pretty much what the title says.", "По суті, саме те, що в назві."],
  ["An Empty Routing, good for beginning building your own presets.", "Empty Routing, добре для початку створення власних presets."],
];

const presetExtras = {
  59: [],
  60: PAGE60_REPLACEMENTS,
  61: PAGE61_REPLACEMENTS,
  62: PAGE62_REPLACEMENTS,
  63: PAGE63_REPLACEMENTS,
};

const out = [];
for (let n = 53; n <= 58; n++) {
  out.push(`  ${n}: \`${escJs(pages[n])}\`,`);
}

for (let n = 59; n <= 63; n++) {
  const text = fs.readFileSync(path.join(base, `page_${n}.txt`), 'utf8');
  pages[n] = translatePresetPage(text, presetExtras[n]);
  out.push(`  ${n}: \`${escJs(pages[n])}\`,`);
}

fs.writeFileSync(path.join(base, 'pages_53_63_fragment.mjs'), out.join('\n') + '\n');
console.log('done', out.length);
