function row(fn, tx = '', rx = '', remarks = '', { sub = false, main = false } = {}) {
  const fnClass = sub ? 'midi-fn-sub' : main ? 'midi-fn-main' : '';
  return `<tr>
<td class="midi-fn ${fnClass}">${fn}</td>
<td class="midi-tx">${tx}</td>
<td class="midi-rx">${rx}</td>
<td class="midi-remarks">${remarks}</td>
</tr>`;
}

function divider() {
  return '<tr class="midi-section-divider"><td colspan="4"></td></tr>';
}

export function midiImplementationChartMarkdown() {
  return `<div class="midi-chart-page">

<table class="midi-chart-table">
<thead>
<tr>
<th>Function</th>
<th>Transmitted</th>
<th>Recognized</th>
<th>Remarks</th>
</tr>
</thead>
<tbody>
${row('Basic Channel', '', '', '', { main: true })}
${row('Default', '1', '1', '', { sub: true })}
${row('Changed', '1-16', '1-16', '', { sub: true })}
${row('Mode', '', '', '', { main: true })}
${row('Default', '', '', '', { sub: true })}
${row('Messages', 'X', 'X', '', { sub: true })}
${row('Altered', '', '', '', { sub: true })}
${row('Note Number', 'X', 'O', '', { main: true })}
${row('True Voice', 'X', 'X', '', { sub: true })}
${row('Velocity', '', '', '', { main: true })}
${row('Note ON', 'X', 'X', '', { sub: true })}
${row('Note OFF', 'X', 'X', '', { sub: true })}
${row('After Touch', '', '', '', { main: true })}
${row("Key's", 'X', 'O', '', { sub: true })}
${row("Ch's", 'X', 'X', '', { sub: true })}
${row('Pitch Bend', 'X', 'O', '', { main: true })}
${row('Control Change', '0-127', '0-127', '', { main: true })}
${divider()}
${row('Prog Change', 'O', 'O', '', { main: true })}
${row('True #', '0-127', '0-127', '', { sub: true })}
${row('System Exclusive', 'O Bulkdump', 'O Bulkdump', '', { main: true })}
${row('Common', '', '', '', { main: true })}
${row(':Song Pos', 'X', 'X', '', { sub: true })}
${row(':Song Sel', 'X', 'X', '', { sub: true })}
${row(':Tune', 'X', 'X', '', { sub: true })}
${row('System real time', '', '', '', { main: true })}
${row(':Clock', 'X', 'X', '', { sub: true })}
${row(':Commands', 'X', 'X', '', { sub: true })}
${row('Aux Messages', '', '', '', { main: true })}
${row(':Local ON/OFF', 'X', 'X', '', { sub: true })}
${row(':All Notes OFF', 'X', 'X', '', { sub: true })}
${row(':Active Sense', 'X', 'X', '', { sub: true })}
${row(':Reset', 'X', 'X', '', { sub: true })}
${row('Notes', '', '', '', { main: true })}
${divider()}
</tbody>
</table>

<p class="midi-chart-legend"><strong>O</strong>:YES &nbsp;&nbsp; <strong>X</strong>:NO</p>

</div>`;
}
