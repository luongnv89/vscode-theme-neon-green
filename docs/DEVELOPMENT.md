# Development Guide

## Prerequisites

- [VS Code](https://code.visualstudio.com/) ^1.70.0
- [Node.js](https://nodejs.org/) (for packaging with vsce)

## Setup

```bash
git clone https://github.com/luongnv89/vscode-theme-neon-green.git
cd vscode-theme-neon-green
code .
```

## Testing

1. Open the project in VS Code
2. Press `F5` to launch the **Extension Development Host**
3. In the new window, open `Preferences: Color Theme` (`Ctrl+K Ctrl+T`)
4. Select one of the Neon Green variants
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
