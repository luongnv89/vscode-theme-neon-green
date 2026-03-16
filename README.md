<p align="center">
  <img src="icon.png" alt="Neon Green Logo" width="128" height="128" />
</p>

<h1 align="center">Neon Green — VS Code Theme</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
  <a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/VS%20Code-^1.70.0-blue.svg" alt="VS Code"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=luongnv89.neon-green-theme"><img src="https://img.shields.io/badge/Marketplace-Neon%20Green-brightgreen.svg" alt="Marketplace"></a>
</p>

<p align="center">A meticulously crafted VS Code theme featuring deep charcoal/midnight backgrounds with vivid neon green (<code>#39ff14</code>) accents.</p>

## Screenshots

### Dark Theme

![Dark Theme](screenshot-dark.png)

### Light Theme

![Light Theme](screenshot-light.png)

## Three Variants

| Variant | Base | Vibe |
|---------|------|------|
| **Dark Terminal** | Pure dark green-black (`#0a0f0a`) | Classic hacker terminal |
| **Midnight** | Deep blue-black (`#0b1014`) | Softer, midnight coding |
| **Light** | Clean light background | Daytime-friendly neon green |

## Key Features

- Vivid neon green accents throughout the UI
- Carefully tuned multicolor syntax for long coding sessions
- Three variants for different moods and environments
- Broad language support: JavaScript, TypeScript, Python, Rust, Go, HTML/CSS, JSON, YAML, Markdown, Shell, and more
- Custom terminal colors, bracket colorization, and git decoration colors

## Quick Start

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Neon Green — Dark Terminal"**
4. Click **Install**
5. Select the theme via `Preferences: Color Theme` (`Ctrl+K Ctrl+T`)

### From VSIX

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension neon-green-theme-1.0.0.vsix
```

### Manual Installation

Copy this folder to your VS Code extensions directory:

- **macOS/Linux**: `~/.vscode/extensions/neon-green-theme`
- **Windows**: `%USERPROFILE%\.vscode\extensions\neon-green-theme`

Then reload VS Code and select the theme via `Preferences: Color Theme`.

## iTerm2 Terminal Themes

Matching iTerm2 color profiles are included for a consistent look across your editor and terminal.

| File | Variant |
|------|---------|
| `themes/Neon Green Dark.itermcolors` | Dark Terminal — deep midnight background with neon green cursor |
| `themes/Neon Green Light.itermcolors` | Light — mint-green background with green accents |

**Install:** Double-click the `.itermcolors` file to auto-import, or go to iTerm2 → Settings → Profiles → Colors → Color Presets → Import.

## Color Palette

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#0a0f0a` | Deep charcoal |
| Foreground | `#c8d6c8` | Soft green-white |
| Neon Green (accent) | `#39ff14` | Keywords, cursor, active elements |
| Bright Green | `#4dff4d` | Active tab text, selection |
| Soft Green | `#7dcea0` | Strings, attributes |
| Teal | `#4dd9c0` | Numbers, types, links |
| Mint | `#66d9a0` | Classes, constants |
| Forest | `#4dbd74` | Namespaces, untracked files |
| Red | `#ff5555` | Errors, deletions |
| Orange | `#ffb347` | Warnings, modifications |
| Blue | `#5599ff` | Debug, info accents |
| Purple | `#c47dff` | Lifetimes, conflicts |

## Syntax Highlights

- **Keywords** — Bold neon green `#39ff14`
- **Strings** — Warm soft green `#7dcea0`
- **Functions** — Bright white-green `#b5e8c8`
- **Types/Classes** — Mint green `#66d9a0`
- **Numbers** — Teal `#4dd9c0`
- **Comments** — Muted forest italic `#3a5a3a`
- **Operators** — Emerald `#00e676`
- **Properties** — Sea green `#8acea0`

## Language Support

Carefully tuned token colors for:

- JavaScript / TypeScript / JSX / TSX
- Python (decorators, f-strings, magic methods)
- Rust (lifetimes, macros)
- Go (packages)
- HTML / CSS / SCSS
- JSON / YAML
- Markdown
- Shell / Bash
- And all languages via TextMate scopes

## Project Structure

```
vscode-theme-neon-green/
├── assets/logo/                          # Brand assets (full logo kit)
│   ├── logo-full.svg                     # Mark + wordmark (horizontal)
│   ├── logo-mark.svg                     # Symbol only
│   ├── logo-wordmark.svg                 # Text only
│   ├── logo-icon.svg                     # App icon (512x512)
│   ├── favicon.svg                       # 16x16 optimized
│   ├── logo-white.svg                    # White version (dark backgrounds)
│   └── logo-black.svg                    # Black version (light backgrounds)
├── themes/
│   ├── neon-green-color-theme.json       # Dark Terminal variant
│   ├── neon-green-midnight-color-theme.json  # Midnight variant
│   ├── neon-green-light-color-theme.json     # Light variant
│   ├── Neon Green Dark.itermcolors       # iTerm2 Dark Terminal profile
│   └── Neon Green Light.itermcolors      # iTerm2 Light profile
├── examples/
│   └── theme-showcase.md                 # Multi-language syntax showcase
├── icon.png                              # Extension icon
├── icon.svg                              # Extension icon (SVG source)
├── package.json                          # Extension manifest
└── README.md
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) - Luong Nguyen
