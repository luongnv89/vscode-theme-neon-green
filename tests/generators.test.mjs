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
      // "WARNING leftover unmapped hexes" verification can flag them.
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
  });
}
