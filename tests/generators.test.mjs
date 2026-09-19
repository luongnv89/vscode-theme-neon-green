import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const GENERATORS = [
  'scripts/make-pi-themes.py',
  'scripts/make-opencode-theme.py',
];

// Loads a generator module by path (its main() is __main__-guarded, so importing
// has no side effects) and evaluates a batch of calls, returning JSON results.
const DRIVER = `
import importlib.util
import json
import sys

spec = importlib.util.spec_from_file_location("generator_under_test", sys.argv[1])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

results = []
for call in json.load(sys.stdin):
    if call["fn"] == "__callable__":
        results.append(callable(getattr(mod, call["name"], None)))
    else:
        results.append(getattr(mod, call["fn"])(*call["args"]))
print(json.dumps(results))
`;

function python3Available() {
  const r = spawnSync('python3', ['--version'], { encoding: 'utf8' });
  return !r.error && r.status === 0;
}

const SKIP = python3Available() ? false : 'python3 not on PATH';

// Drives a generator's real main() with every repo path redirected into a temp
// dir, so the leftover-hex exit gate is exercised without rewriting the real
// theme files. The pi generator gets a single-theme THEME_LIST, a tmp THEMES
// dir and a fixture DARK_BASE; the opencode generator gets fixture SRC/DST.
const MAIN_DRIVER = `
import importlib.util
import json
import sys
import tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location("generator_under_test", sys.argv[1])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

cfg = json.load(sys.stdin)
tmp = Path(tempfile.mkdtemp())
src = tmp / "base.json"
src.write_text(json.dumps(cfg["source"]) + "\\n")

if cfg["generator"] == "pi":
    mod.THEMES = tmp
    mod.DARK_BASE = src
    mod.LIGHT_BASE = src
    palette = {slot: "#112233" for slot in set(mod.DARK_UI) | set(mod.DARK_SYN)}
    mod.THEME_LIST = [{
        "name": "Fixture — Dark",
        "file": "fixture-color-theme.json",
        "base": "dark",
        "palette": palette,
    }]
else:
    mod.SRC = src
    mod.DST = tmp / "fixture-color-theme.json"

mod.main()
`;

function callGenerator(scriptRel, calls) {
  const script = join(REPO_ROOT, scriptRel);
  const r = spawnSync('python3', ['-c', DRIVER, script], {
    input: JSON.stringify(calls),
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  assert.equal(r.status, 0, `python driver failed for ${scriptRel}:\n${r.stderr}`);
  return JSON.parse(r.stdout);
}

// Runs a generator's main() against fixture input in a temp dir; returns the
// raw spawnSync result so tests can assert on the process exit code.
function runGeneratorMain(scriptRel, source) {
  const script = join(REPO_ROOT, scriptRel);
  const generator = scriptRel.includes('pi') ? 'pi' : 'opencode';
  const r = spawnSync('python3', ['-c', MAIN_DRIVER, script], {
    input: JSON.stringify({ generator, source }),
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  return r;
}

test('hex-remap engine lives only in scripts/hex_remap.py', () => {
  const ENGINE_PIECES = ['HEX_RE = re.compile', 'def remap(', 'def walk('];
  const defsIn = (file) =>
    ENGINE_PIECES.filter((piece) =>
      readFileSync(join(REPO_ROOT, file), 'utf8').includes(piece));
  for (const script of GENERATORS) {
    assert.deepEqual(defsIn(script), [], `${script} still defines engine pieces`);
    assert.match(
      readFileSync(join(REPO_ROOT, script), 'utf8'),
      /from hex_remap import/,
      `${script} does not import the shared module`,
    );
  }
  assert.deepEqual(defsIn('scripts/hex_remap.py').sort(), [...ENGINE_PIECES].sort());
});

for (const script of GENERATORS) {
  test(`generator characterization — ${script}`, { skip: SKIP }, async (t) => {
    await t.test('module exposes callable remap and walk', () => {
      const [remapOk, walkOk] = callGenerator(script, [
        { fn: '__callable__', name: 'remap' },
        { fn: '__callable__', name: 'walk' },
      ]);
      assert.equal(remapOk, true, 'remap is not callable');
      assert.equal(walkOk, true, 'walk is not callable');
    });

    await t.test('remap maps a table hit', () => {
      const [got] = callGenerator(script, [
        { fn: 'remap', args: ['#ff5555', { '#ff5555': '#112233' }] },
      ]);
      assert.equal(got, '#112233');
    });

    await t.test('remap lowercases the base hex before lookup', () => {
      const [got] = callGenerator(script, [
        { fn: 'remap', args: ['#FF5555', { '#ff5555': '#112233' }] },
      ]);
      assert.equal(got, '#112233');
    });

    await t.test('remap preserves an 8-digit alpha suffix', () => {
      const [got] = callGenerator(script, [
        { fn: 'remap', args: ['#ff555580', { '#ff5555': '#112233' }] },
      ]);
      assert.equal(got, '#11223380');
    });

    await t.test('remap leaves unmapped hexes untouched (leftover-hex contract)', () => {
      const [got] = callGenerator(script, [
        { fn: 'remap', args: ['#123abc', { '#ff5555': '#112233' }] },
      ]);
      // Unmapped values pass through unchanged so the generator's own
      // leftover-hex verification can flag them and fail the run.
      assert.equal(got, '#123abc');
    });

    await t.test('remap passes non-hex and non-string values through', () => {
      const table = { '#ff5555': '#112233' };
      const got = callGenerator(script, [
        { fn: 'remap', args: ['not a color', table] },
        { fn: 'remap', args: ['#fff', table] },
        { fn: 'remap', args: ['#ff555', table] },
        { fn: 'remap', args: [42, table] },
        { fn: 'remap', args: [null, table] },
        { fn: 'remap', args: [['#ff5555'], table] },
      ]);
      assert.deepEqual(got, ['not a color', '#fff', '#ff555', 42, null, ['#ff5555']]);
    });

    await t.test('walk remaps hex leaves inside nested dicts and lists', () => {
      const table = { '#ff5555': '#112233' };
      const input = {
        a: '#ff5555',
        b: { c: ['#ff5555', 'keep', 7] },
        d: '#123abc',
      };
      const [got] = callGenerator(script, [{ fn: 'walk', args: [input, table] }]);
      assert.deepEqual(got, {
        a: '#112233',
        b: { c: ['#112233', 'keep', 7] },
        d: '#123abc', // unmapped leaf survives — the leftover hexes the verifier warns about
      });
    });

    await t.test('walk preserves mapping key order', () => {
      const [got] = callGenerator(script, [
        { fn: 'walk', args: [{ z: '#ff5555', a: '#ff5555', m: 'x' }, { '#ff5555': '#112233' }] },
      ]);
      assert.deepEqual(Object.keys(got), ['z', 'a', 'm']);
    });

    await t.test('walk remaps a root-level list', () => {
      const [got] = callGenerator(script, [
        { fn: 'walk', args: [['#ff5555', '#123abc'], { '#ff5555': '#112233' }] },
      ]);
      assert.deepEqual(got, ['#112233', '#123abc']);
    });

    await t.test('main() exits non-zero when leftover hexes remain', () => {
      // #123456 is covered by no role table / map, so it survives the walk and
      // the written theme's leftover-hex verification must fail the process.
      const source = { name: 'Fixture', colors: { unmapped: '#123456' }, tokenColors: [] };
      const r = runGeneratorMain(script, source);
      assert.notEqual(r.status, 0, `${script} exited 0 despite leftover hexes`);
      assert.match(`${r.stdout}\n${r.stderr}`, /leftover/i);
    });

    await t.test('main() exits 0 when every base hex maps', () => {
      // #39ff14 is covered by the real maps; the output must verify clean.
      const source = { name: 'Fixture', colors: { accent: '#39ff14' }, tokenColors: [] };
      const r = runGeneratorMain(script, source);
      assert.equal(r.status, 0, `${script} failed on a fully mapped fixture:\n${r.stderr}`);
    });
  });
}
