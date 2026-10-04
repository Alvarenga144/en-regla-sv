// Optional browser checks. Set EN_REGLA_PLAYWRIGHT to an installed Playwright module.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { tmpdir } from 'node:os';
const { chromium } = await import(process.env.EN_REGLA_PLAYWRIGHT || 'playwright');
const root = resolve('dist');
const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.xml':'application/xml','.txt':'text/plain','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[extname(file)] || 'application/octet-stream');
    res.end(content);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({channel: 'msedge', headless:true});
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const routes = ['/', '/contrato/', '/isss/', '/afp/', '/banco/', '/salario/', '/renta/', '/boleto/', '/ayuda/'];
  for (const route of routes) {
    const response = await page.goto(base+route);
    assert.equal(response.status(),200,route);
    await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('main').count(),1);
    const socialUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
    const socialImage = await context.request.get(base + new URL(socialUrl).pathname);
    assert.equal(socialImage.status(),200);
    assert.ok(socialImage.headers()['content-type'].includes('image/jpeg'));
    const graph = await page.locator('script[type="application/ld+json"]').textContent();
    assert.equal(JSON.parse(graph)['@context'],'https://schema.org');
    assert.equal(await page.locator('.site-links [aria-current="page"]').count(),1);
    const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node=>node.getAttribute('href')))]);
    for (const link of links) assert.equal((await context.request.get(base+link)).status(),200,link);
    for (const width of [360,390,768,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
    }
  }
  await page.goto(base+'/salario/');
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#gross').inputValue(),'');
  assert.equal(await page.locator('#remember').isChecked(),false);
  await page.locator('#gross').fill('1500');
  await page.waitForFunction(()=>document.querySelector('#hero-net').textContent==='$1,208.05');
  assert.equal(await page.locator('#chart-legend li').count(),4);
  assert.ok((await page.locator('#donut').getAttribute('style')).includes('conic-gradient'));
  await page.reload();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#gross').inputValue(),'');
  await page.locator('#min-wage').click();
  assert.equal(await page.locator('#gross').inputValue(),'408.8');
  assert.equal(await page.locator('#deposit').inputValue(),'');
  await page.locator('#gross').fill('1500');
  await page.getByText('Comparar con lo que recibí',{exact:true}).click();
  for (const amount of ['1208.05', '1208,05', '1,208.05', '1.208,05']) {
    await page.locator('#deposit').fill(amount);
    assert.equal(await page.locator('#banner-title').textContent(),'Coincide con esta estimación');
    await page.locator('#deposit').blur();
    assert.equal(await page.locator('#deposit').inputValue(),'1208.05');
  }
  await page.locator('#deposit').fill('12..05');
  assert.equal(await page.locator('#deposit').getAttribute('aria-invalid'),'true');
  assert.equal(await page.locator('#results').isVisible(),false);
  await page.locator('#deposit').fill('');
  await page.locator('#pay-frequency').selectOption('fortnight');
  await page.locator('#deposit').fill('604.03');
  assert.ok((await page.locator('#banner-text').textContent()).includes('ambos depósitos'));
  await page.locator('#deposit-second').fill('604.02');
  assert.equal(await page.locator('#banner-title').textContent(),'Coincide con esta estimación');
  await page.locator('#remember').check();
  await page.reload();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#gross').inputValue(),'1500.00');
  assert.equal(await page.locator('#pay-frequency').inputValue(),'fortnight');
  assert.equal(await page.locator('#deposit-second').inputValue(),'604.02');
  await page.getByText('Prestaciones y salarios extra',{exact:true}).click();
  await page.locator('[data-tenure="y1"]').click();
  await page.getByText('Aguinaldo, quincena 25 y vacaciones',{exact:true}).click();
  assert.ok((await page.locator('#benefits').textContent()).includes('voluntaria'));
  await page.locator('#year-choice').selectOption('2027');
  assert.ok((await page.locator('#benefits').textContent()).includes('$750.00'));
  await page.locator('#extra').fill('1');
  await page.getByText('Un año con este salario',{exact:true}).click();
  assert.ok((await page.locator('#year').textContent()).includes('Total anual bruto'));
  assert.ok((await page.locator('#year').textContent()).includes('$21,225.00'));
  for (const width of [360,390,768,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'calculated overflow '+width);
  }
  await page.setViewportSize({width:1440,height:1050});
  await page.evaluate(()=>window.scrollTo(0,0));
  const desktop = resolve(tmpdir(),'en-regla-salario-desktop.png');
  await page.screenshot({path:desktop,fullPage:true});
  await page.setViewportSize({width:390,height:844});
  const mobile = resolve(tmpdir(),'en-regla-salario-mobile.png');
  await page.locator('#hero-net').scrollIntoViewIfNeeded();
  await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  await page.screenshot({path:mobile});
  assert.ok(await page.locator('#donut').isVisible());
  assert.ok(await page.locator('#chart-legend').isVisible());
  await page.locator('#clear-calculator').click();
  assert.equal(await page.locator('#gross').inputValue(),'');
  assert.equal(await page.locator('#remember').isChecked(),false);
  await page.reload();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#gross').inputValue(),'');
  await page.locator('#gross').fill('999999999');
  assert.equal(await page.locator('#results').isVisible(),false);
  await page.goto(base+'/');
  await page.locator('.menu-toggle').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  await page.goto(base+'/boleto/');
  await page.locator('.payslip-row summary').first().click();
  assert.ok(await page.locator('.payslip-row p').first().isVisible());
  const nojs = await browser.newContext({javaScriptEnabled:false});
  const plain = await nojs.newPage();
  await plain.goto(base+'/isss/');
  assert.ok(await plain.locator('h1').isVisible());
  assert.ok(await plain.locator('.guide .card').first().isVisible());
  await plain.goto(base+'/salario/');
  assert.ok(await plain.locator('#calculator-explainer-title').isVisible());
  assert.ok(await plain.locator('.calculator-explainer a[href="/boleto/"]').isVisible());
  const blocked = await browser.newContext();
  await blocked.addInitScript(()=>{Storage.prototype.getItem = ()=>{throw new Error('disabled')};Storage.prototype.setItem = ()=>{throw new Error('disabled')};Storage.prototype.removeItem = ()=>{throw new Error('disabled')};});
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base+'/salario/');
  await blockedPage.waitForLoadState('networkidle');
  await blockedPage.locator('#gross').fill('1500');
  await blockedPage.waitForFunction(()=>document.querySelector('#hero-net').textContent==='$1,208.05');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,routes:routes.length,widths:[360,390,768,1440,1920],desktop,mobile}));
} finally {
  await browser?.close();
  await new Promise(done=>server.close(done));
}
