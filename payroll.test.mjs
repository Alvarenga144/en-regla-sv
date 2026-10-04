import test from 'node:test';
import assert from 'node:assert/strict';
import { payroll, benefits, compareDeposits, isrMonthly, money, SECTORS } from './src/lib/payroll.js';

test('Known monthly payslip: 1500 gross and 1208.05 net', () => {
  const actual = payroll(1500);
  assert.equal(actual.isss, 30);
  assert.equal(actual.afp, 108.75);
  assert.equal(actual.tax, 153.20);
  assert.equal(actual.net, 1208.05);
});
test('ISSS cap and low-salary scenario', () => {
  assert.equal(payroll(1000).isss, 30);
  assert.equal(payroll(12000).isss, 30);
  assert.equal(payroll(408.80).net, 366.90);
  assert.equal(payroll(408.80).tax, 0);
});
test('Retention bracket boundaries', () => {
  for (const [base, expected] of [[0,0],[550,0],[550.01,17.67],[895.24,52.19],[895.25,60],[2038.10,288.57],[2038.11,288.57]]) {
    assert.equal(isrMonthly(base), expected, String(base));
  }
});
test('All chart amounts reconcile with gross without NaN', () => {
  for (const salary of [0,.01,100,408.8,550,700,758.33,758.34,1000,1500,5000,1000000]) {
    const c = payroll(salary);
    assert.equal(money(c.net+c.isss+c.afp+c.tax), money(salary));
    assert.ok([c.net,c.isss,c.afp,c.tax].every(value => Number.isFinite(value) && value >= 0));
  }
  assert.throws(() => payroll(NaN));
  assert.throws(() => payroll(-1));
});
test('Two deposits are added; an absent second payment is never doubled', () => {
  const c = payroll(1500);
  assert.equal(compareDeposits(c,604.03,null,true),null);
  assert.equal(compareDeposits(c,604.03,604.02,true).difference,0);
  assert.equal(compareDeposits(c,0,0,true).difference,-1208.05);
  assert.equal(compareDeposits(c,null,null),null);
});
test('Tenure and voluntary benefit rules', () => {
  assert.equal(benefits(1500,null,0,true).aguinaldo,0);
  assert.equal(benefits(1500,'lt1',6,true).aguinaldo,375);
  assert.equal(benefits(1500,'lt1',6,true).vacation,0);
  assert.equal(benefits(1500,'y3',0,false).aguinaldo,950);
  assert.equal(benefits(1500,'y10',0,true).aguinaldo,1050);
  assert.equal(benefits(1500,'y1',0,false).q25,0);
  assert.equal(benefits(1500,'y1',0,true).q25,750);
  assert.equal(benefits(1500.01,'y1',0,true).q25,0);
});
test('Agriculture and coffee/cane processing are separate references', () => {
  assert.equal(SECTORS.agro.monthly,272.53);
  assert.equal(SECTORS.cana.monthly,305.23);
});
