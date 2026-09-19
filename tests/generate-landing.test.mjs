import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  escapeAttr,
  escapeHtml,
  sanitizeCssColor,
  sanitizeUrl,
  serializeJsonLd,
  slugify,
} from '../scripts/generate-landing.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generatedHtml = readFileSync(join(REPO_ROOT, 'docs', 'index.html'), 'utf8');

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
