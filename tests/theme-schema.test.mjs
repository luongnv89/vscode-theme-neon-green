import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
const themes = pkg.contributes?.themes;

const UI_THEMES = new Set(['vs', 'vs-dark', 'hc-black', 'hc-light']);
const THEME_TYPES = new Set(['dark', 'light', 'hc-dark', 'hc-light']);

test('contributes.themes is a non-empty array', () => {
  assert.ok(Array.isArray(themes), 'package.json contributes.themes must be an array');
  assert.ok(themes.length > 0, 'contributes.themes must not be empty');
});

test('every contributes.themes entry declares label, uiTheme and path', () => {
  for (const entry of themes) {
    assert.equal(typeof entry.label, 'string', `${JSON.stringify(entry)}: label must be a string`);
    assert.notEqual(entry.label.trim(), '', `${entry.path}: label must not be empty`);
    assert.ok(UI_THEMES.has(entry.uiTheme), `${entry.path}: uiTheme "${entry.uiTheme}" must be one of ${[...UI_THEMES].join(', ')}`);
    assert.equal(typeof entry.path, 'string', `${entry.label}: path must be a string`);
    assert.match(entry.path, /^\.\/themes\/[^/]+\.json$/, `${entry.label}: path "${entry.path}" must point at a top-level themes/*.json file`);
  }
});

test('contributes.themes paths are unique', () => {
  const paths = themes.map((entry) => entry.path);
  assert.equal(new Set(paths).size, paths.length, 'duplicate theme path registered');
});

test('every contributes.themes[].path exists on disk', () => {
  for (const entry of themes) {
    const file = join(REPO_ROOT, entry.path);
    assert.ok(existsSync(file), `registered theme path missing on disk: ${entry.path}`);
  }
});

test('every registered theme JSON parses with name, colors and tokenColors', async (t) => {
  for (const entry of themes) {
    await t.test(entry.path, () => {
      const file = join(REPO_ROOT, entry.path);
      const theme = JSON.parse(readFileSync(file, 'utf8'));
      assert.equal(typeof theme.name, 'string', 'theme.name must be a string');
      assert.notEqual(theme.name.trim(), '', 'theme.name must not be empty');
      assert.ok(theme.colors && typeof theme.colors === 'object' && !Array.isArray(theme.colors), 'theme.colors must be an object');
      assert.ok(Object.keys(theme.colors).length > 0, 'theme.colors must not be empty');
      assert.ok(Array.isArray(theme.tokenColors), 'theme.tokenColors must be an array');
      assert.ok(theme.tokenColors.length > 0, 'theme.tokenColors must not be empty');
      assert.ok(THEME_TYPES.has(theme.type), `theme.type "${theme.type}" must be one of ${[...THEME_TYPES].join(', ')}`);
    });
  }
});

test('every top-level themes/*.json is registered in contributes.themes', () => {
  const onDisk = readdirSync(join(REPO_ROOT, 'themes'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => `./themes/${name}`)
    .sort();
  const registered = themes.map((entry) => entry.path).sort();
  assert.deepEqual(registered, onDisk, 'registered themes and themes/*.json on disk differ — every VS Code theme must be registered under contributes.themes');
});
