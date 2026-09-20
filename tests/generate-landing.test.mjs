import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  contributedThemes,
  escapeAttr,
  escapeHtml,
  sanitizeCssColor,
  sanitizeUrl,
  serializeJsonLd,
  slugify,
} from '../scripts/generate-landing.mjs';
import { buildNav } from '../scripts/landing/nav.mjs';
import { buildHeroCta, shortVariantLabel, variantDescription } from '../scripts/landing/sections.mjs';
import {
  createLandingHighlighter,
  normalizeLang,
  SHIKI_LANGS,
} from '../scripts/landing/highlight.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generatedHtml = readFileSync(join(REPO_ROOT, 'docs', 'index.html'), 'utf8');
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));

test('escapeHtml escapes the five HTML-significant characters', () => {
  assert.equal(escapeHtml('a & b'), 'a &amp; b');
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(escapeHtml('"quoted"'), '&quot;quoted&quot;');
  assert.equal(escapeHtml("it's"), 'it&#39;s');
});

test('escapeHtml leaves safe text untouched', () => {
  assert.equal(escapeHtml('Neon Green — Dark'), 'Neon Green — Dark');
  assert.equal(escapeHtml(''), '');
});

test('escapeHtml coerces non-string input', () => {
  assert.equal(escapeHtml(42), '42');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

test('escapeAttr escapes attribute-breaking characters', () => {
  assert.equal(escapeAttr('"><img src=x onerror=alert(1)>'), '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(escapeAttr("a'b\"c&d<e>f"), 'a&#39;b&quot;c&amp;d&lt;e&gt;f');
});

test('sanitizeCssColor accepts hex colors', () => {
  for (const hex of ['#fff', '#ffff', '#39ff14', '#39ff1425', '#ABCDEF12']) {
    assert.equal(sanitizeCssColor(hex), hex, `${hex} must pass the allowlist`);
  }
});

test('sanitizeCssColor accepts functional and named colors', () => {
  assert.equal(sanitizeCssColor('rgb(1, 2, 3)'), 'rgb(1, 2, 3)');
  assert.equal(sanitizeCssColor('rgba(1, 2, 3, 0.5)'), 'rgba(1, 2, 3, 0.5)');
  assert.equal(sanitizeCssColor('hsl(120, 50%, 50%)'), 'hsl(120, 50%, 50%)');
  assert.equal(sanitizeCssColor('rebeccapurple'), 'rebeccapurple');
});

test('sanitizeCssColor rejects values that could break out of CSS', () => {
  for (const evil of [
    '#fff;}</style><script>alert(1)</script>',
    'red; position: fixed',
    'url(https://evil.example/x)',
    'expression(alert(1))',
    '"></style><script>',
    '#12345', // invalid hex length
    '',
    '  ',
  ]) {
    assert.equal(sanitizeCssColor(evil), '#000000', `${JSON.stringify(evil)} must fall back`);
  }
  assert.equal(sanitizeCssColor('red;}</style>', '#123456'), '#123456');
  assert.equal(sanitizeCssColor(null), '#000000');
  assert.equal(sanitizeCssColor(undefined, '#abc'), '#abc');
});

test('sanitizeUrl allows https, http, mailto, fragments and relative paths', () => {
  for (const ok of [
    'https://example.com/x?y=1',
    'http://example.com',
    'mailto:a@b.c',
    '#section',
    '/absolute/path.png',
    './rel.png',
    '../screenshot-dark.png',
    'plain/relative.png',
  ]) {
    assert.equal(sanitizeUrl(ok), ok, `${ok} must pass`);
  }
});

test('sanitizeUrl rejects scriptable schemes', () => {
  for (const evil of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
  ]) {
    assert.equal(sanitizeUrl(evil), '#', `${JSON.stringify(evil)} must collapse to '#'`);
  }
  assert.equal(sanitizeUrl('javascript:x', 'about:blank'), 'about:blank');
  assert.equal(sanitizeUrl(null), '#');
});

test('serializeJsonLd emits parseable JSON', () => {
  const out = serializeJsonLd({ '@type': 'Thing', name: 'Neon "Green"' });
  const parsed = JSON.parse(out);
  assert.equal(parsed.name, 'Neon "Green"');
  assert.equal(parsed['@type'], 'Thing');
});

test('serializeJsonLd escapes < so </script> cannot break out', () => {
  const out = serializeJsonLd({ name: 'x</script><script>alert(1)</script>' });
  assert.ok(!out.includes('</script>'), 'serialized JSON-LD must not contain a literal </script>');
  assert.ok(out.includes('\\u003c/script>'), '< must be serialized as \\u003c');
  assert.equal(JSON.parse(out).name, 'x</script><script>alert(1)</script>');
});

test('slugify produces id-safe slugs', () => {
  assert.equal(slugify('Theme Variants'), 'theme-variants');
  assert.equal(slugify('iTerm2 terminal themes!'), 'iterm2-terminal-themes');
  assert.equal(slugify("What's new?"), 'what-s-new');
});

test('generated docs/index.html nav carries id="primary-nav" matching aria-controls (#14)', () => {
  assert.match(generatedHtml, /<nav[^>]*\bid="primary-nav"/, 'primary <nav> must carry id="primary-nav"');
  assert.match(generatedHtml, /aria-controls="primary-nav"/, 'nav toggle must keep aria-controls="primary-nav"');
});

test('generated docs/index.html JSON-LD block is parseable JSON', () => {
  const match = generatedHtml.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  assert.ok(match, 'docs/index.html must contain an application/ld+json script');
  const parsed = JSON.parse(match[1]);
  assert.equal(parsed['@type'], 'SoftwareApplication');
});

test('contributedThemes maps package.json contributes.themes one-to-one (#24)', () => {
  const refs = contributedThemes(pkg);
  assert.equal(refs.length, pkg.contributes.themes.length);
  pkg.contributes.themes.forEach((entry, index) => {
    assert.equal(refs[index].sourcePath, entry.path.replace(/^\.\//, ''));
    assert.equal(refs[index].label, entry.label);
    assert.equal(refs[index].uiTheme, entry.uiTheme);
  });
});

test('generated docs/index.html renders one variant card per contributes.themes entry (#24)', () => {
  const cardCount = (generatedHtml.match(/class="variant-card"/g) ?? []).length;
  assert.equal(cardCount, pkg.contributes.themes.length);
});

test('variant card headings come from the contributes.themes label (#24)', () => {
  const family = pkg.contributes.themes[0].label.split(/\s+—\s+/)[0];
  for (const entry of pkg.contributes.themes) {
    const expected = escapeHtml(shortVariantLabel(entry.label, family));
    assert.ok(
      generatedHtml.includes(`<h3>${expected}</h3>`),
      `variant card heading missing for label ${JSON.stringify(entry.label)}`,
    );
  }
});

test('shortVariantLabel strips only the collection family prefix (#24)', () => {
  assert.equal(shortVariantLabel('Neon Green — Dark Terminal', 'Neon Green'), 'Dark Terminal');
  assert.equal(shortVariantLabel('Soft Glow — Dark', 'Neon Green'), 'Soft Glow — Dark');
  assert.equal(shortVariantLabel('Neon Green — Light', ''), 'Neon Green — Light');
});

test('SHIKI_LANGS registers exactly the docs/landing.md fence langs plus text (#36)', () => {
  const landingMd = readFileSync(join(REPO_ROOT, 'docs', 'landing.md'), 'utf8');
  const fenceLangs = new Set(
    [...landingMd.matchAll(/^```([^\s`]*)/gm)].map((m) => normalizeLang(m[1])),
  );
  for (const lang of fenceLangs) {
    assert.ok(SHIKI_LANGS.includes(lang), `fence lang ${JSON.stringify(lang)} is not registered`);
  }
  for (const lang of SHIKI_LANGS) {
    assert.ok(
      lang === 'text' || fenceLangs.has(lang),
      `registered lang ${JSON.stringify(lang)} is not used by any docs/landing.md fence`,
    );
  }
});

test('createLandingHighlighter loads a single theme and renders every fence lang (#36)', async () => {
  const darkRef = pkg.contributes.themes.find((entry) => entry.uiTheme === 'vs-dark');
  const darkTheme = JSON.parse(
    readFileSync(join(REPO_ROOT, darkRef.path.replace(/^\.\//, '')), 'utf8'),
  );
  const highlighter = await createLandingHighlighter(darkTheme);
  assert.deepEqual(highlighter.getLoadedThemes(), [darkTheme.name]);
  for (const lang of [...SHIKI_LANGS, 'txt']) {
    const html = highlighter.codeToHtml('echo hi', { lang, theme: darkTheme.name });
    assert.ok(html.includes('<pre'), `no highlighted output for lang ${JSON.stringify(lang)}`);
  }
});

test('variantDescription returns copy keyed by the contributes.themes label (#24)', () => {
  for (const entry of pkg.contributes.themes) {
    assert.ok(variantDescription(entry.label).length > 0, `no description for ${entry.label}`);
  }
  assert.equal(variantDescription('No Such Theme — X'), variantDescription('Another Missing — Y'));
});

test('buildHeroCta renders one primary Marketplace CTA plus secondary text links (#30)', () => {
  const html = buildHeroCta({
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=pub.name',
    repoUrl: 'https://github.com/owner/repo',
  });
  assert.equal((html.match(/class="hero-cta-btn"/g) ?? []).length, 1, 'exactly one primary CTA');
  assert.ok(
    html.includes('class="hero-cta-btn" href="https://marketplace.visualstudio.com/items?itemName=pub.name"'),
    'primary CTA must point at the Marketplace',
  );
  const alt = html.match(/<p class="hero-cta-alt">([\s\S]*?)<\/p>/);
  assert.ok(alt, 'secondary links container missing');
  assert.ok(alt[1].includes('>View on GitHub<'));
  assert.ok(alt[1].includes('>Read the README<'));
  assert.ok(!alt[1].includes('hero-cta-btn'), 'secondary links must not be styled as buttons');
  assert.ok(html.includes('https://github.com/owner/repo/blob/main/README.md'), 'README link derives from repoUrl');
});

test('buildHeroCta sanitizes interpolated URLs (#30)', () => {
  const html = buildHeroCta({ marketplaceUrl: 'javascript:alert(1)', repoUrl: 'https://github.com/owner/repo' });
  assert.ok(!html.includes('javascript:'), 'unsafe scheme must collapse to the sanitizeUrl fallback');
});

test('generated docs/index.html hero has a single dominant install CTA (#30)', () => {
  assert.equal(
    (generatedHtml.match(/class="hero-cta-btn"/g) ?? []).length,
    1,
    'hero must render exactly one primary install control',
  );
  assert.match(
    generatedHtml,
    /<a class="hero-cta-btn" href="https:\/\/marketplace\.visualstudio\.com\//,
    'primary CTA must link to the Marketplace',
  );
  assert.match(generatedHtml, /class="hero-cta-alt"/, 'secondary text links must be present');
});

test('buildNav promotes the Screenshots heading into the primary nav (#33)', () => {
  const html = buildNav('## Theme variants\n\n## Screenshots\n\n## Installation\n\n## Final call\n');
  const primary = html.split('<div class="topnav-more"')[0];
  assert.match(primary, /<a class="topnav-link" href="#screenshots">Screenshots<\/a>/);
});

test('generated docs/index.html primary nav links to #screenshots (#33)', () => {
  const nav = generatedHtml.match(/<nav class="topnav" id="primary-nav"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(nav, 'primary nav markup missing');
  assert.match(nav[1], /<a class="topnav-link" href="#screenshots">Screenshots<\/a>/);
});

test('generated docs/index.html VSIX examples carry the package.json version (#32)', () => {
  const filenames = generatedHtml.match(/neon-green-theme-\d+\.\d+\.\d+\.vsix/g) ?? [];
  assert.ok(filenames.length > 0, 'expected at least one VSIX filename in the generated page');
  for (const name of filenames) {
    assert.equal(name, `neon-green-theme-${pkg.version}.vsix`, 'VSIX filename must match package.json version');
  }
});

test('docs/landing.md and README.md pin no VSIX version (#32)', () => {
  const landingMd = readFileSync(join(REPO_ROOT, 'docs', 'landing.md'), 'utf8');
  const readme = readFileSync(join(REPO_ROOT, 'README.md'), 'utf8');
  for (const [name, text] of [
    ['docs/landing.md', landingMd],
    ['README.md', readme],
  ]) {
    assert.ok(
      !/neon-green-theme-\d+\.\d+\.\d+\.vsix/.test(text),
      `${name} must not hardcode a VSIX version`,
    );
  }
  assert.ok(
    landingMd.includes('neon-green-theme-{{VERSION}}.vsix'),
    'docs/landing.md must use the {{VERSION}} token injected from package.json',
  );
});
