# Development Guide

## Prerequisites

- [VS Code](https://code.visualstudio.com/) ^1.70.0
- [Node.js](https://nodejs.org/) — provides `node` and `npm`; used for `npm ci`, `npm run build:landing`, and packaging with vsce. CI pins Node 24 (Active LTS, declared as `engines.node >=24` in `package.json`); local development may run newer (e.g. Node 26)
- [Python 3](https://www.python.org/) — provides `python3`, required for the theme generators under `scripts/` (`make-pi-themes.py`, `make-opencode-theme.py`)

## Setup

```bash
git clone https://github.com/luongnv89/vscode-theme-neon-green.git
cd vscode-theme-neon-green
npm ci   # install dependencies from package-lock.json (same command CI runs)
code .
```

Recorded commands an agent can run from a fresh checkout:

- `npm ci` — reproducible dependency install
- `npm run build:landing` — regenerate the landing page via `scripts/generate-landing.mjs`
- `npm test` — run the smoke test suite (`node --test` over `tests/*.test.mjs`, with a coverage table). The generator characterization tests spawn `python3`; they are skipped when it is not on PATH

## Testing

Automated smoke tests live in `tests/` and run with `npm test` (`node --test`,
no extra dependencies):

- `tests/theme-schema.test.mjs` — every `contributes.themes[].path` exists and
  each registered theme JSON parses with `name`, `colors`, and `tokenColors`
- `tests/generators.test.mjs` — characterization tests for the `remap`/`walk`
  functions in the Python generators (spawned via `python3`; skipped when it is
  not on PATH)

Manual visual check:

1. Open the project in VS Code
2. Press `F5` to launch the **Extension Development Host**
3. In the new window, open `Preferences: Color Theme` (`Ctrl+K Ctrl+T`)
4. Select a theme variant (any of the 13 themes across the 8 families)
5. Open files in various languages to verify syntax highlighting
6. Use `examples/theme-showcase.md` for comprehensive multi-language testing

## Editing Themes

Theme files are in `themes/`. Each is a JSON file with two sections:

### `colors` — UI Elements

```json
{
  "editor.background": "#0a0f0a",
  "editor.foreground": "#c8d6c8"
}
```

See the full list of [VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color).

### `tokenColors` — Syntax Highlighting

```json
{
  "name": "Keywords",
  "scope": ["keyword", "storage.type"],
  "settings": {
    "foreground": "#39ff14",
    "fontStyle": "bold"
  }
}
```

See the [TextMate scope naming conventions](https://macromates.com/manual/en/language_grammars).

## Debugging Colors

Use **Developer: Inspect Editor Tokens and Scopes** (`Ctrl+Shift+P`) to identify which TextMate scopes apply to any token in the editor.

## Packaging

```bash
npm install -g @vscode/vsce
vsce package
```

This creates a `.vsix` file that can be installed locally or published to the marketplace.
