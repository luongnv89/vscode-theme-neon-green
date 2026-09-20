# Architecture

## Overview

Neon Green Theme Collection is a VS Code color theme extension that provides thirteen themes across eight families: Neon Green (4 variants), Soft Glow (2 variants), OpenCode (1 variant), Hermes Agent (1 variant), Aura (1 variant), Omarchy (1 variant), Synthwave '84 (1 variant), and Zed (2 variants). The extension is purely declarative — it contains no executable extension code, only JSON theme definitions.

## Components

### Theme Files (`themes/`)

Each theme variant is a standalone JSON file following the [VS Code Color Theme](https://code.visualstudio.com/api/extension-guides/color-theme) specification:

- **`neon-green-color-theme.json`** — Dark Terminal variant with pure dark background (`#0e0e1a`)
- **`neon-green-midnight-color-theme.json`** — Midnight variant with deep blue-black background (`#0b1014`)
- **`neon-green-light-color-theme.json`** — Light variant for daytime use
- **`neon-green-liquid-glass-color-theme.json`** — Liquid Glass variant with modern translucent feel
- **`soft-glow-dark-color-theme.json`** — Soft Glow Dark with warm charcoal background (`#12100e`)
- **`soft-glow-light-color-theme.json`** — Soft Glow Light with warm cream background (`#faf7f4`)
- **`opencode-color-theme.json`** — OpenCode Dark with minimal flat near-black canvas (`#0a0a0a`) and warm peach accents (`#fab283`)
- **`hermes-agent-dark-color-theme.json`** — Hermes Agent Dark with deep midnight navy canvas (`#0b0b16`) and warm gold accents
- **`aura-color-theme.json`** — Aura Dark with deep purple-black canvas (`#15141b`), violet keywords and mint types
- **`omarchy-color-theme.json`** — Omarchy Dark with slate gray-black canvas (`#101315`), neon green strings and cyan keywords
- **`synthwave-84-color-theme.json`** — Synthwave '84 Dark with retro purple dusk canvas (`#262335`) and hot pink keywords
- **`zed-dark-color-theme.json`** — Zed Dark with neutral editor gray canvas (`#282c33`)
- **`zed-light-color-theme.json`** — Zed Light with clean neutral white canvas (`#fafafa`)

Each theme file contains two main sections:

1. **`colors`** — Workbench UI colors (editor, sidebar, terminal, status bar, etc.)
2. **`tokenColors`** — Syntax highlighting rules using [TextMate scopes](https://macromates.com/manual/en/language_grammars)

### Companion Ports (`themes/`)

Alongside the VS Code themes, `themes/` carries matching ports generated or maintained per family:

- **`*.itermcolors`** — iTerm2 color profiles
- **`terminal/`** — macOS Terminal.app `.terminal` profiles
- **`warp/`** — Warp terminal `.yaml` themes
- **`ghostty/`** — Ghostty theme files
- **`cmux/`** — cmux (Ghostty-rendered) theme configs
- **`claude-code/`** — Claude Code theme ports covering all eight families
- **`firefox/`** — Firefox browser theme port

### Extension Manifest (`package.json`)

Defines the extension metadata and registers all thirteen themes via the `contributes.themes` section. Every `themes/*.json` theme must be registered there to ship.

### Generators (`scripts/`)

Two generator toolchains produce derivable artifacts from the theme palettes:

- **Landing page** — `scripts/generate-landing.mjs` renders `docs/index.html` from `docs/landing.md`, `package.json` (`contributes.themes`, version, repo URLs), and the live theme JSON files. It is split into focused modules under `scripts/landing/` (`page.mjs`, `sections.mjs`, `nav.mjs`, `css.mjs`, `highlight.mjs`, `sanitize.mjs`) and is run via `npm run build:landing` — the repo's build/CI stand-in.
- **Theme generators** — `scripts/make-pi-themes.py` and `scripts/make-opencode-theme.py` are palette-driven generators that port external theme palettes (e.g. Pi agent themes) onto the VS Code theme skeleton. Both share `scripts/hex_remap.py`, the role-table hex-remap engine that maps a source palette onto the `colors`/`tokenColors` structure. Generated output must stay consistent with the hand-written themes in structure and naming.

### Tests (`tests/`)

`npm test` runs the `node --test` smoke suite: theme-JSON schema checks against `contributes.themes`, plus characterization tests for the Python generators' `remap`/`walk` functions (spawned via `python3`, skipped when it is not on PATH).

### Assets

- **`icon.png` / `icon.svg`** — Extension icon displayed in the VS Code Marketplace
- **`assets/`** — Logo kit and preview images used by the README and landing page
- **`examples/theme-showcase.md`** — Multi-language code samples for testing syntax highlighting

## Design Decisions

### Color Palettes

Each family is centered on its own accent palette: Neon Green around neon green (`#39ff14`), Soft Glow around warm amber (`#d4a87a`), OpenCode around warm peach (`#fab283`) with soft purple keywords, Hermes Agent around gold on midnight navy, Aura around violet (`#a277ff`) and mint (`#61ffca`), Omarchy around neon green (`#00ff99`) on slate, Synthwave '84 around hot pink (`#ff7edb`) and cyan (`#03edf9`), and Zed around a neutral blue/purple editor palette. All families share these principles:

- Maintain readability with sufficient contrast ratios
- Provide distinct semantic meaning (errors = red, warnings = orange, etc.)
- Keep colors cohesive within each family's aesthetic
- Keep every companion port in sync with its source VS Code theme

### TextMate Scope Strategy

Token colors target both broad scopes (e.g., `keyword`, `string`) for universal coverage and specific scopes (e.g., `entity.name.function.decorator.python`) for language-specific refinement.
