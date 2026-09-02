function testBlock(title, lines) {
  const body = lines.map((line) => `<p>${line}</p>`).join('\n');
  return `<div class="self-test-item"><h4>${title}</h4>${body}</div>`;
}

const LEFT_TESTS = [
  testBlock('Key test', [
    'Виберіть Key test, натиснувши <code>Enter</code>.',
    'Ключі мають бути натиснуті у порядку, який запитує G-Force, щоб пройти тест.',
    'Натисніть <code>Exit</code>, щоб вийти з Key test.',
  ]),
  testBlock('In/Out knobs test', [
    'Виберіть In/Out knobs test, натиснувши <code>Enter</code>.',
    'Обертайте <code>In/Out knobs</code> до 30 і назад до 0, щоб пройти тест.',
    'Натисніть <code>Exit</code>, щоб вийти з In/Out test.',
  ]),
  testBlock('Parameter + Value Wheel test', [
    'Виберіть тест, натиснувши <code>Enter</code>.',
    'Обертайте <code>Value</code> і <code>Parameter wheel</code> до 30 і назад до 0, щоб пройти тест.',
    'Натисніть <code>Exit</code>, щоб вийти з Adjust Wheel test.',
  ]),
  testBlock('LED test', [
    'Виберіть LEDs test, натиснувши <code>Enter</code>.',
    'Обертайте Adjust Wheel, щоб перевірити LEDs.',
    'Тест «ok», коли не горить жоден LED.',
    'Натисніть <code>Exit</code>, щоб вийти з Led test.',
  ]),
  testBlock('Display test', [
    'Виберіть Display test, натиснувши <code>Enter</code>.',
    'Натисніть <code>Enter</code>, щоб перевірити, що всі пікселі світяться.',
    'Натисніть будь-який key, щоб вийти з pixel test.',
    'Натисніть <code>Exit</code>, щоб вийти з Display test.',
  ]),
  testBlock('Analog I/O test', [
    'Виберіть Analog I/O test, натиснувши <code>Enter</code>.',
    'Підключіть Analog Output до Analog Input, який потрібно перевірити, і натисніть <code>Enter</code>.',
    'PPM має показувати -12 dB, щоб пройти тест.',
    'Натисніть <code>Exit</code>, щоб вийти з Analog I/O test.',
  ]),
  testBlock('Digital I/O test', [
    'Виберіть Digital I/O test, натиснувши <code>Enter</code>.',
    'Підключіть Digital Output до Digital Input, який потрібно перевірити, і натисніть <code>Enter</code>.',
    'AES/EBU output також можна підключити до S/PDIF input і навпаки.',
  ]),
].join('\n');

const RIGHT_TESTS = [
  testBlock('Digital I/O test', [
    'PPM має показувати 0 dB, щоб пройти тест.',
    'Натисніть <code>Exit</code>, щоб вийти з Digital I/O test.',
  ]),
  testBlock('MIDI I/O test', [
    'Виберіть Midi I/O test, натиснувши <code>Enter</code>.',
    'Підключіть <code>Midi Out</code> до <code>Midi In</code>.',
    'Prg change 1–128 передається на <code>Midi Thru</code>.',
    'Підключіть цей роз\'єм до Midi compatible device і підтвердьте Prg. changes.',
    'Натисніть <code>Exit</code>, щоб вийти з Midi I/O test.',
  ]),
  testBlock('Pedal socket test', [
    'Виберіть Pedal test, натиснувши <code>Enter</code>.',
    'Підключіть momentary pedal до Pedal socket.',
    'При натисканні Pedal Result має бути OK.',
    'При відпусканні Result має бути Not OK.',
    'Натисніть <code>Exit</code>, щоб вийти з Pedal test.',
    '<strong>NOTE:</strong> Result тесту має бути OK, якщо jack не вставлено.',
  ]),
  testBlock('PCMCIA test', [
    'Виберіть PCMCIA test, натиснувши <code>Enter</code>.',
    'Вставте PCMCIA <code>card</code>. <em>Увага: усі Data на PCMCIA card будуть знищені.</em>',
    'Натисніть <code>Enter</code> для тесту.',
    'Result показує: Low battery — час замінити батарею у вашій PCMCIA card.',
    'Not OK — спробуйте тест з іншою PCMCIA card.',
    'Натисніть <code>Exit</code>, щоб вийти з PCMCIA test.',
  ]),
  testBlock('Battery test', [
    'Виберіть Battery test, натиснувши <code>Enter</code>.',
    'Підтвердьте, що Result є OK.',
    'Натисніть <code>Exit</code>, щоб вийти з Battery test.',
  ]),
  testBlock('System test', [
    'Виберіть System test, натиснувши <code>Enter</code>.',
    'Підтвердьте, що Result є OK.',
    'Result показує: Eeprom Not OK — пристрій, найімовірно, працюватиме нормально; це повідомлення лише для сервісних цілей.',
    'DSP Not OK — зверніться до місцевого дилера.',
    'Натисніть <code>Exit</code>, щоб вийти з System test.',
  ]),
].join('\n');

export function selfTestMarkdown() {
  return `<div class="self-test-page">

<p class="self-test-lead"><strong>НАТИСНІТЬ <code>OVERALL BYPASS</code> KEY ПІД ЧАС УВІМКНЕННЯ, ЩОБ ДОСТУПИТИСЯ SELF-TEST І ВИБРАТИ »RUN TEST PROGRAM«</strong></p>

<p class="self-test-intro"><em>Обертайте <code>Value Wheel</code> для переміщення між Self tests.</em></p>

<div class="self-test-columns">
<div class="self-test-col">
${LEFT_TESTS}
</div>
<div class="self-test-col">
${RIGHT_TESTS}
</div>
</div>

<p class="self-test-footer"><em><code>Power</code> Off — On, щоб запустити стандартне програмне забезпечення.</em></p>
<p class="self-test-footer"><em>Build in test v.2.07</em></p>

</div>`;
}
