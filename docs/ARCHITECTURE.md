# Architecture

## Overview

Neon Green Theme Collection is a VS Code color theme extension that provides six themes across two families: Neon Green (4 variants) and Soft Glow (2 variants). The extension is purely declarative — it contains no executable code, only JSON theme definitions.

## Components

### Theme Files (`themes/`)

Each theme variant is a standalone JSON file following the [VS Code Color Theme](https://code.visualstudio.com/api/extension-guides/color-theme) specification:

- **`neon-green-color-theme.json`** — Dark Terminal variant with pure dark green-black background (`#0a0f0a`)
- **`neon-green-midnight-color-theme.json`** — Midnight variant with deep blue-black background (`#0b1014`)
- **`neon-green-light-color-theme.json`** — Light variant for daytime use
- **`neon-green-liquid-glass-color-theme.json`** — Liquid Glass variant with modern translucent feel
- **`soft-glow-dark-color-theme.json`** — Soft Glow Dark with warm charcoal background (`#12100e`)
- **`soft-glow-light-color-theme.json`** — Soft Glow Light with warm cream background (`#faf7f4`)

Each theme file contains two main sections:

1. **`colors`** — Workbench UI colors (editor, sidebar, terminal, status bar, etc.)
2. **`tokenColors`** — Syntax highlighting rules using [TextMate scopes](https://macromates.com/manual/en/language_grammars)

### Extension Manifest (`package.json`)

Defines the extension metadata and registers all six themes via the `contributes.themes` section.

### Assets

- **`icon.png` / `icon.svg`** — Extension icon displayed in the VS Code Marketplace
- **`examples/theme-showcase.md`** — Multi-language code samples for testing syntax highlighting

## Design Decisions

### Color Palette

The Neon Green family is centered around neon green (`#39ff14`) as the primary accent, staying within the green/teal color family. The Soft Glow family uses warm amber (`#d4a87a`) as its accent with a desaturated jewel-tone palette. Both families share these principles:

- Maintain readability with sufficient contrast ratios
- Provide distinct semantic meaning (errors = red, warnings = orange, etc.)
- Keep colors cohesive within each family's aesthetic

### TextMate Scope Strategy

Token colors target both broad scopes (e.g., `keyword`, `string`) for universal coverage and specific scopes (e.g., `entity.name.function.decorator.python`) for language-specific refinement.
