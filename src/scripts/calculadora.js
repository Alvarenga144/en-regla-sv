import { payroll, benefits, compareDeposits, SECTORS, money } from '../lib/payroll.js';

const $ = id => document.getElementById(id);
const KEY = 'en-regla-salario.opt-in.v1';
const OLD_KEYS = ['calculadora-salario-sv', 'en-regla-salario', 'en-regla-salario.v2', 'en-regla-salario.v3'];
const format = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
const fmt = value => format.format(value);
const fields = ['gross', 'deposit', 'deposit-second', 'pay-frequency', 'months', 'hours', 'days', 'sector', 'extra', 'employment', 'year-choice'];
let tenure = null;
const num = id => Number($(id).value);
const text = (id, value) => { $(id).textContent = value; };
const item = (label, value, note = '') => '<li><div>' + label + '<small>' + note + '</small></div><strong>' + fmt(value) + '</strong></li>';

function setTenure(value) {
  tenure = ['lt1', 'y1', 'y3', 'y10'].includes(value) ? value : null;
  document.querySelectorAll('[data-tenure]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tenure === tenure)));
  $('months-wrap').hidden = tenure !== 'lt1';
}
function save() {
  try {
    if (!$('remember').checked) { localStorage.removeItem(KEY); return; }
    const values = Object.fromEntries(fields.map(id => [id, $(id).value]));
    localStorage.setItem(KEY, JSON.stringify({remember: true, values, tenure, q25: $('q25-voluntary').checked}));
    text('storage-note', 'Tus datos se recuerdan únicamente en este navegador.');
  } catch {
    text('storage-note', 'Este navegador no permite guardar los datos. Puedes seguir calculando.');
  }
}
function chart(c) {
  const parts = [['Neto', c.net, '#b4d9be'], ['ISSS', c.isss, '#abcce9'], ['AFP', c.afp, '#c7b6e5'], ['Renta', c.tax, '#e9b4bd']];
  let cursor = 0;
  const stops = parts.map(([, value, color]) => {
    const start = cursor; cursor += value / c.gross * 100;
    return color + ' ' + start + '% ' + cursor + '%';
  });
  $('donut').style.background = 'conic-gradient(' + stops.join(',') + ')';
  text('net-percent', (c.net / c.gross * 100).toFixed(1) + '%');
  $('chart-legend').innerHTML = parts.map(([label, value, color]) => '<li><span class="swatch" style="background:' + color + '"></span><span>' + label + '<small>' + (value / c.gross * 100).toFixed(2) + '% del bruto</small></span><strong>' + fmt(value) + '</strong></li>').join('');
}
function render() {
  const fortnightly = $('pay-frequency').value === 'fortnight';
  $('deposit-second-wrap').hidden = !fortnightly;
  text('deposit-label', fortnightly ? 'Primer depósito del mes' : 'Depósito del mes completo');
  const private2026 = $('employment').value === 'private' && $('year-choice').value === '2026';
  $('q25-voluntary-wrap').hidden = !private2026;
  const sector = SECTORS[$('sector').value] || SECTORS.comercio;
  text('sector-hint', sector.name + ': ' + fmt(sector.monthly) + ' al mes de referencia; ' + sector.hourly.toFixed(3) + ' USD por hora ordinaria.');
  text('storage-note', $('remember').checked ? 'Tus datos se recuerdan únicamente en este navegador.' : 'No se guardan tus datos al salir.');
  const invalid = [...document.querySelectorAll('input[type="number"]')].find(input => !input.closest('[hidden]') && !input.validity.valid);
  save();
  $('results').hidden = Boolean(invalid) || !(num('gross') > 0);
  $('banner').className = 'banner';
  $('floor').hidden = true;
  if ($('results').hidden) {
    text('banner-title', invalid ? 'Revisa el dato ingresado' : 'Empieza con el salario del contrato');
    text('banner-text', invalid ? 'Usa cantidades positivas y respeta los límites indicados en los campos.' : 'Escribe el bruto mensual o usa el mínimo del sector. El depósito es opcional.');
    return;
  }
  const c = payroll(num('gross'));
  const deposit = $('deposit').value === '' ? null : num('deposit');
  const second = $('deposit-second').value === '' ? null : num('deposit-second');
  const comparison = compareDeposits(c, deposit, second, fortnightly);
  text('banner-title', 'Neto mensual estimado');
  text('banner-text', fortnightly && !comparison ? 'Ingresa ambos depósitos del mismo mes para comparar su suma. No multiplicamos una sola quincena por dos.' : 'Puedes comparar un mes completo sin bonos, anticipos ni ausencias.');
  if (comparison) {
    const {difference, total} = comparison;
    text('banner-title', Math.abs(difference) < .02 ? 'Coincide con esta estimación' : 'Tu depósito es ' + fmt(Math.abs(difference)) + (difference < 0 ? ' menor' : ' mayor'));
    text('banner-text', 'Comparaste ' + fmt(total) + ' con ' + fmt(c.net) + ' estimados. Revisa el boleto para explicar diferencias. Coincidir no confirma que ISSS y AFP estén pagados.');
    if (Math.abs(difference) >= .02) $('banner').classList.add(difference < 0 ? 'short' : 'over');
  }
  const hours = num('hours') || 8;
  const days = num('days') || 5;
  const partial = hours <= 5 || days < 5;
  if (partial || c.gross < sector.monthly) {
    $('floor').hidden = false;
    text('floor-title', partial ? 'Tu jornada necesita una revisión particular' : 'El monto está bajo la referencia mensual');
    text('floor-text', partial ? 'La referencia de jornada completa es ' + fmt(sector.monthly) + '. Una jornada parcial también requiere revisar descansos, distribución y actividad; esta calculadora no determina su mínimo legal.' : 'Para ' + sector.name + ', la referencia mensual es ' + fmt(sector.monthly) + '. Confirma que el salario cubre un mes completo y que elegiste el sector correcto antes de concluir que hay una infracción.');
  }
  text('hero-net', fmt(c.net));
  text('hero-sub', fmt(c.gross) + ' brutos − ' + fmt(money(c.isss + c.afp + c.tax)) + ' de descuentos estimados.');
  text('reading', (c.isss === 30 ? 'ISSS llegó al tope de $30. ' : 'ISSS representa el 3% del bruto. ') + 'La AFP es una cotización previsional. ' + (c.tax === 0 ? 'En este escenario no hay retención mensual de renta.' : 'El porcentaje del tramo de renta no se aplica a todo el salario.'));
  chart(c);
  $('receipt').innerHTML = item('Salario bruto', c.gross, 'Mes ordinario completo.') + item('ISSS', -c.isss, '3% hasta una base de $1,000.') + item('AFP', -c.afp, '7.25% del salario cotizable.') + item('Renta', -c.tax, 'Base tras ISSS y AFP: ' + fmt(c.base) + '.' + (c.deduction ? ' Se considera la deducción fija para el supuesto de ingreso anual de hasta $9,100.' : '')) + item('Neto estimado', c.net);
  $('periods').innerHTML = [['Mes', 1], ['Quincena promedio', .5], ['Semana promedio', 12 / 52], ['Día de referencia', 1 / 30], ['Hora de referencia', 1 / 30 / hours]].map(([label, scale]) => '<div class="period"><span class="k">' + label + '</span><div class="b">Bruto <b>' + fmt(c.gross * scale) + '</b></div><div class="n">Neto <b>' + fmt(c.net * scale) + '</b></div></div>').join('');
  text('period-note', 'Semana: mes × 12 ÷ 52. Día: mes ÷ 30. Hora: día ÷ horas ingresadas. Son equivalencias; las dos quincenas reales pueden diferir por retenciones y redondeos.');
  text('jornada-hint', hours * days + ' horas por semana. No calculamos horas extra ni recargos nocturnos.');
  const q25 = !private2026 || $('q25-voluntary').checked;
  const b = benefits(c.gross, tenure, num('months'), q25);
  $('benefits').classList.toggle('waiting', !b.known);
  $('benefits').innerHTML = !b.known ? '<article class="benefit lilac"><h3>Elige cuánto llevas en este trabajo</h3><p>Con eso se estiman las prestaciones. No se suman como si ya hubieras cumplido un año.</p></article>' :
    '<article class="benefit rose"><span class="k">Aguinaldo bruto</span><div class="v">' + fmt(b.aguinaldo) + '</div><p>' + b.days + ' días por año completo; con menos de un año usamos meses ÷ 12 como aproximación. La fecha de ingreso y de corte determinan el proporcional real. La exención de renta debe confirmarse para el año elegido.</p></article>' +
    '<article class="benefit butter"><span class="k">Quincena 25 · ' + $('year-choice').value + '</span><div class="v">' + fmt(b.q25) + '</div><p>' + (c.gross > 1500 ? 'El bruto supera el límite de $1,500.' : !q25 ? 'En empresa privada es voluntaria en 2026. No la sumamos si no confirmas que la recibirás.' : '50% del salario elegible, sin ISSS, AFP ni renta. Para menos de un año, el proporcional mostrado requiere confirmar los días a la fecha de pago de enero.') + '</p></article>' +
    '<article class="benefit sky"><span class="k">Prima vacacional bruta</span><div class="v">' + fmt(b.vacation) + '</div><p>' + (tenure === 'lt1' ? 'No sumamos prima pagadera antes de cumplir el año.' : '30% de quince días. Los días de descanso ya están dentro del salario ordinario. Las cotizaciones y renta de la planilla de vacaciones pueden cambiar el neto.') + '</p></article>';
  const extras = money(c.gross * num('extra'));
  const annualGross = money(c.gross * 12 + b.aguinaldo + b.vacation + b.q25 + extras);
  $('year').innerHTML = item('12 salarios brutos', c.gross * 12) + item('Aguinaldo bruto', b.aguinaldo) + item('Prima vacacional bruta', b.vacation) + item('Quincena 25 del escenario', b.q25) + item('Salarios extra brutos', extras, 'Cantidad pactada para este año. La ley determina el tratamiento tributario y previsional, no la elección del empleador.') + item('Total anual bruto del escenario', annualGross) + item('12 netos ordinarios, por separado', c.net * 12, 'No es el neto anual final: excluye prestaciones, bonos y recálculos.');
  text('year-note', 'Proyección de doce meses al mismo salario, no una liquidación del año en que ingresaste. No sumamos bonos brutos a un total neto. Las prestaciones dependen de sus fechas de corte y condiciones.');
  $('tax-copy').innerHTML = '<p>El monto mensual por sí solo no determina si debes declarar. Importan todos tus ingresos, las retenciones y el impuesto anual que corresponde.</p><p>El art. 38 contempla excepciones a la no declaración de asalariados: ingresos superiores a $60,000, falta de retenciones o diferencias con el impuesto correspondiente. Revisa tu constancia y el ejercicio fiscal en Hacienda.</p><a class="chip" href="/renta/">Entender mi declaración →</a>';
  const employer = money(Math.min(c.gross, 1000) * .075 + c.gross * .0875);
  $('employer').innerHTML = item('ISSS patronal mensual', money(Math.min(c.gross, 1000) * .075), '7.5% hasta base de $1,000.') + item('AFP patronal mensual', money(c.gross * .0875), '8.75% adicional al aporte del trabajador.') + item('Salario y estos aportes al mes', money(c.gross + employer), 'Subtotal: no incluye todas las obligaciones ni prestaciones del empleador.');
  $('also').innerHTML = '<li>El aguinaldo y la prima vacacional son prestaciones; no son descuentos de tu salario ordinario.</li><li>Los bonos, comisiones y horas extra pueden cambiar la base de cotización y la renta del período.</li><li>Los recálculos de renta y un primer mes incompleto pueden explicar diferencias.</li><li>Para confirmar cotizaciones pagadas, consulta al ISSS y tu AFP, además del boleto.</li><li><a href="/boleto/">Mira un boleto explicado</a> o <a href="/ayuda/">revisa qué hacer si algo no cuadra</a>.</li>';
}
function defaults() {
  const values = {gross: '', deposit: '', 'deposit-second': '', 'pay-frequency': 'month', months: '0', hours: '8', days: '5', sector: 'comercio', extra: '0', employment: 'private', 'year-choice': '2026'};
  fields.forEach(id => { $(id).value = values[id]; });
  $('remember').checked = false;
  $('q25-voluntary').checked = false;
  setTenure(null);
}
defaults();
try {
  OLD_KEYS.forEach(key => localStorage.removeItem(key));
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved?.remember === true && saved.values) {
    for (const id of fields) if (typeof saved.values[id] === 'string') $(id).value = saved.values[id];
    for (const id of ['sector', 'pay-frequency', 'employment', 'year-choice']) if (!$(id).value) $(id).selectedIndex = 0;
    $('remember').checked = true;
    $('q25-voluntary').checked = saved.q25 === true;
    setTenure(saved.tenure);
  }
} catch { /* Remains usable when storage is unavailable or malformed. */ }
document.querySelectorAll('input, select').forEach(input => input.addEventListener('input', render));
document.querySelectorAll('[data-tenure]').forEach(button => button.addEventListener('click', () => { setTenure(button.dataset.tenure); render(); }));
$('min-wage').addEventListener('click', () => { $('gross').value = SECTORS[$('sector').value].monthly; render(); });
$('clear-calculator').addEventListener('click', () => { defaults(); render(); $('gross').focus(); });
window.addEventListener('pageshow', event => { if (event.persisted && !$('remember').checked) { defaults(); render(); } });
render();
