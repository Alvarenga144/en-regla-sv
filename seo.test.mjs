// Check generated HTML, not template strings. Run the build before these tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = 'https://enreglasv.com';
const routes = ['/', '/contrato/', '/isss/', '/afp/', '/banco/', '/salario/', '/renta/', '/boleto/', '/ayuda/'];
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attribute = (tag, key) => decode(tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1] ?? '');
const meta = (html, key) => {
  const tags = html.match(/<meta\b[^>]*>/g) ?? [];
  const matches = tags.filter(tag => attribute(tag, 'name') === key || attribute(tag, 'property') === key);
  assert.equal(matches.length, 1, `Exactly one ${key}`);
  return attribute(matches[0], 'content');
};
const title = html => decode(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '');
const pages = await Promise.all(routes.map(async route => ({ route, html: await readFile(resolve('dist', '.' + route, 'index.html'), 'utf8') })));

test('All pages have unique search metadata, canonical URLs and one main landmark', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const { route, html } of pages) {
    assert.match(html, /<html[^>]*lang="es-SV"/);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, route);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, route);
    assert.ok(title(html).includes(' · En regla'), route);
    const description = meta(html, 'description');
    assert.ok(description.length >= 100 && description.length <= 190, route);
    titles.add(title(html));
    descriptions.add(description);
    const canonicals = (html.match(/<link\b[^>]*>/g) ?? []).filter(tag => attribute(tag, 'rel') === 'canonical');
    assert.equal(canonicals.length, 1, route);
    assert.equal(attribute(canonicals[0], 'href'), origin + route);
    assert.equal(meta(html, 'og:url'), origin + route);
    assert.ok(meta(html, 'robots').startsWith('index, follow'));
    assert.ok(meta(html, 'robots').includes('max-image-preview:large'));
  }
  assert.equal(titles.size, routes.length);
  assert.equal(descriptions.size, routes.length);
});

test('Social previews use the same accessible, optimized JPEG on every page', async () => {
  const images = new Set();
  for (const { html } of pages) {
    assert.equal(meta(html, 'og:title'), title(html));
    assert.equal(meta(html, 'twitter:title'), title(html));
    assert.equal(meta(html, 'og:description'), meta(html, 'description'));
    assert.equal(meta(html, 'twitter:description'), meta(html, 'description'));
    assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
    const image = meta(html, 'og:image');
    assert.equal(meta(html, 'twitter:image'), image);
    assert.equal(meta(html, 'og:image:secure_url'), image);
    assert.equal(meta(html, 'og:image:type'), 'image/jpeg');
    assert.equal(meta(html, 'og:image:width'), '1200');
    assert.equal(meta(html, 'og:image:height'), '630');
    assert.ok(meta(html, 'og:image:alt').includes('En regla'));
    assert.equal(meta(html, 'twitter:image:alt'), meta(html, 'og:image:alt'));
    assert.equal(new URL(image).origin, origin);
    images.add(image);
  }
  assert.equal(images.size, 1);
  const file = resolve('dist', '.' + new URL([...images][0]).pathname);
  const bytes = await readFile(file);
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'JPEG signature');
  assert.ok((await stat(file)).size < 300000, 'Social image stays below 300 KB');
});

test('Structured entities and breadcrumbs describe the visible page and author', () => {
  for (const { route, html } of pages) {
    const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
    assert.equal(scripts.length, 1, route);
    const data = JSON.parse(scripts[0][1]);
    assert.equal(data['@context'], 'https://schema.org');
    const graph = data['@graph'];
    const webPage = graph.find(node => node['@type'] === 'WebPage');
    assert.equal(webPage.url, origin + route);
    assert.equal(webPage.name, title(html));
    assert.equal(webPage.description, meta(html, 'description'));
    assert.equal(webPage.inLanguage, 'es-SV');
    assert.equal(graph.find(node => node['@type'] === 'WebSite').url, origin + '/');
    assert.equal(graph.find(node => node['@type'] === 'Person').name, meta(html, 'author'));
    const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList');
    if (route !== '/') {
      assert.ok(html.includes('aria-label="Ruta de navegación"'));
      assert.equal(breadcrumb.itemListElement[0].item, origin + '/');
      assert.equal(breadcrumb.itemListElement[1].item, origin + route);
    } else assert.equal(breadcrumb, undefined);
    const article = graph.find(node => node['@type'] === 'Article');
    if (!['/', '/salario/'].includes(route)) {
      assert.equal(article.headline, decode(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? ''));
      assert.equal(meta(html, 'og:type'), 'article');
    } else assert.equal(article, undefined);
    const ids = new Set(graph.map(node => node['@id']));
    const checkRefs = value => {
      if (Array.isArray(value)) value.forEach(checkRefs);
      else if (value && typeof value === 'object') {
        if (Object.keys(value).length === 1 && value['@id']) assert.ok(ids.has(value['@id']), value['@id']);
        Object.values(value).forEach(checkRefs);
      }
    };
    checkRefs(graph);
  }
});

test('Robots and sitemap expose all guides, while the error page stays out of search', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.ok(robots.includes(origin + '/sitemap-index.xml'));
  const index = await readFile('dist/sitemap-index.xml', 'utf8');
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  assert.ok(index.includes(origin + '/sitemap-0.xml'));
  for (const route of routes) assert.ok(sitemap.includes(`<loc>${origin + route}</loc>`), route);
  assert.ok(!sitemap.includes('/404'));
  const missing = await readFile('dist/404.html', 'utf8');
  assert.equal(meta(missing, 'robots'), 'noindex, follow');
  assert.ok(!missing.includes('application/ld+json'));
  assert.ok((await readFile('dist/favicon.svg', 'utf8')).includes('<svg'));
  const calculator = pages.find(page => page.route === '/salario/').html;
  assert.ok(calculator.includes('Cómo calcular tu salario neto en El Salvador'));
  assert.ok(calculator.includes('sin subir documentos'));
});
