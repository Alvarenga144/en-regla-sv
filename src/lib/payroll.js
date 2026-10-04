// Monthly payroll for one salaried employer; sources are linked on /salario/.
export const SECTORS = {
  comercio: { name: 'comercio, servicios e industria', monthly: 408.8, daily: 13.44, hourly: 1.68 },
  maquila: { name: 'maquila textil y confección', monthly: 402.32, daily: 13.227, hourly: 1.653 },
  cana: { name: 'beneficios de café y recolección de caña', monthly: 305.23, daily: 10.035, hourly: 1.254 },
  agro: { name: 'agropecuario, pesca y recolección de café', monthly: 272.53, daily: 8.96, hourly: 1.12 },
};
export const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
export function isrMonthly(base) {
  if (base <= 550) return 0;
  if (base <= 895.24) return money((base - 550) * .1 + 17.67);
  if (base <= 2038.1) return money((base - 895.24) * .2 + 60);
  return money((base - 2038.1) * .3 + 288.57);
}
export function payroll(gross) {
  if (!Number.isFinite(gross) || gross < 0) throw new RangeError('Invalid salary');
  gross = money(gross);
  const isss = money(Math.min(gross, 1000) * .03);
  const afp = money(gross * .0725);
  const base = money(gross - isss - afp);
  const deduction = gross > 0 && gross * 12 <= 9100 ? 1600 / 12 : 0;
  const taxable = Math.max(0, base - deduction);
  const tax = isrMonthly(taxable);
  return { gross, isss, afp, base, taxable, deduction, tax, net: money(gross - isss - afp - tax) };
}
export function compareDeposits(result, first, second, fortnightly = false) {
  if (first === null || (fortnightly && second === null)) return null;
  const total = money(first + (fortnightly ? second : 0));
  return { total, difference: money(total - result.net) };
}
export function benefits(gross, tenure, months, includeQ25) {
  const known = ['lt1', 'y1', 'y3', 'y10'].includes(tenure);
  const factor = tenure === 'lt1' ? Math.min(11, Math.max(0, months)) / 12 : 1;
  const days = tenure === 'y10' ? 21 : tenure === 'y3' ? 19 : 15;
  return { known, days, aguinaldo: known ? money(gross / 30 * days * factor) : 0, vacation: known && tenure !== 'lt1' ? money(gross / 30 * 15 * .3) : 0, q25: known && includeQ25 && gross <= 1500 ? money(gross * .5 * factor) : 0 };
}
