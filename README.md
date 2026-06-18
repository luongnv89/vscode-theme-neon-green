<p align="center">
  <img src="icon.png" alt="Neon Green Theme Collection" width="128" height="128" />
</p>

<h1 align="center">Neon Green Theme Collection</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
  <a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/VS%20Code-^1.70.0-blue.svg" alt="VS Code"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=luongnv89.neon-green-theme"><img src="https://img.shields.io/badge/Marketplace-Theme%20Collection-brightgreen.svg" alt="Marketplace"></a>
</p>

<p align="center">7 meticulously crafted VS Code themes in 3 families: vivid <strong>Neon Green</strong> with electric accents, warm <strong>Soft Glow</strong> with eye-friendly pastels, and minimal <strong>OpenCode</strong> with a flat-black canvas.</p>

## Screenshots

### Dark Theme

![Dark Theme](screenshot-dark.png)

### Light Theme

![Light Theme](screenshot-light.png)

## Theme Variants

### Neon Green Family

| Variant | Base | Vibe |
|---------|------|------|
| **Dark Terminal** | Pure dark green-black (`#0a0f0a`) | Classic hacker terminal |
| **Midnight** | Deep blue-black (`#0b1014`) | Softer, midnight coding |
| **Light** | Clean light background | Daytime-friendly neon green |
| **Liquid Glass** | Dark with glass effects | Modern translucent feel |

### Soft Glow Family

| Variant | Base | Vibe |
|---------|------|------|
| **Dark** | Deep warm charcoal (`#12100e`) | Cozy, eye-friendly dark — warm amber accents |
| **Light** | Warm cream (`#faf7f4`) | Gentle daylight theme — muted jewel tones |

### OpenCode Family

| Variant | Base | Vibe |
|---------|------|------|
| **Dark** | Flat near-black (`#0a0a0a`) | Minimal terminal-agent look — warm peach accent, purple keywords |

### Hermes Agent Family

| Variant | Base | Vibe |
|---------|------|------|
| **Dark** | Deep midnight navy (`#0b0b16`) | Warm gold-on-navy — cornsilk text, gold brand accent, purple suggestions |

## Key Features

- **Three distinct aesthetics**: vivid neon green accents (Neon Green family), warm amber/pastel tones (Soft Glow family), and the minimal flat-black OpenCode look (warm peach + purple)
- 7 themes across 3 families for different moods and lighting conditions
- Carefully tuned multicolor syntax for long coding sessions
- Broad language support: JavaScript, TypeScript, Python, Rust, Go, HTML/CSS, JSON, YAML, Markdown, Shell, and more
- Custom terminal colors, bracket colorization, and git decoration colors

## Quick Start

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Neon Green Theme Collection"**
4. Click **Install**
5. Select the theme via `Preferences: Color Theme` (`Ctrl+K Ctrl+T`)

### From VSIX

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension neon-green-theme-1.6.0.vsix
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
| `themes/Hermes Agent Dark.itermcolors` | Hermes Agent — cornsilk text on midnight navy with gold cursor |

### Install in iTerm2 (manual)

1. Download or clone this repo so you have the `.itermcolors` files locally.
2. Open **iTerm2 → Settings** (`⌘,`) → **Profiles** → **Colors** tab.
3. Click the **Color Presets…** dropdown at the bottom right → **Import…**.
4. Select `themes/Neon Green Dark.itermcolors` (or `Neon Green Light.itermcolors`) and click **Open**.
5. Open the **Color Presets…** dropdown again and pick the imported preset by name (e.g. *Neon Green Dark*).
6. The new colors apply immediately to the active profile. Repeat for any other iTerm2 profiles you want themed.

> Tip: double-clicking a `.itermcolors` file in Finder will also import it, but the manual route above lets you apply it to the exact profile you want.

## Warp Terminal Themes

Matching Warp themes are included for every variant. YAML files live in `themes/warp/`.

![Warp showing all six Neon Green / Soft Glow themes in the Themes picker](assets/warp-themes-preview.png)

| File | Variant |
|------|---------|
| `themes/warp/neon-green-dark.yaml` | Neon Green — Dark Terminal |
| `themes/warp/neon-green-midnight.yaml` | Neon Green — Midnight |
| `themes/warp/neon-green-liquid-glass.yaml` | Neon Green — Liquid Glass |
| `themes/warp/neon-green-light.yaml` | Neon Green — Light |
| `themes/warp/soft-glow-dark.yaml` | Soft Glow — Dark |
| `themes/warp/soft-glow-light.yaml` | Soft Glow — Light |
| `themes/warp/opencode.yaml` | OpenCode — Dark |
| `themes/warp/hermes-agent-dark.yaml` | Hermes Agent — Dark |

### Install in Warp

Warp loads custom themes from `~/.warp/themes/`. Copy the YAML files there and they show up in the theme picker.

1. Clone or download this repo.
2. Create the themes directory if it doesn't exist and copy the files over:

   ```bash
   mkdir -p ~/.warp/themes
   cp themes/warp/*.yaml ~/.warp/themes/
   ```

   Prefer only one variant? Copy a single file instead, e.g. `cp themes/warp/neon-green-dark.yaml ~/.warp/themes/`.
3. Open **Warp → Settings** (`⌘,`) → **Appearance**.
4. Under **Themes**, scroll the left panel (or type in the search box) and pick one of:
   - **Neon Green Dark**
   - **Neon Green Midnight**
   - **Neon Green Liquid Glass**
   - **Neon Green Light**
   - **Soft Glow Dark**
   - **Soft Glow Light**
   - **OpenCode Dark**
   - **Hermes Agent Dark**
5. The theme applies instantly. If the list doesn't refresh, close and reopen the Settings window (no Warp restart required).

> Uninstall: delete the YAML files from `~/.warp/themes/` and switch Warp back to a built-in theme.

## cmux Terminal Themes

[cmux](https://cmux.com) renders terminal colors through [Ghostty](https://ghostty.org), so the cmux companion theme is a Ghostty theme file. It lives in `themes/cmux/`.

| File | Variant |
|------|---------|
| `themes/cmux/hermes-agent-dark.conf` | Hermes Agent — Dark (gold cursor on midnight navy, cornsilk text) |

### Install in cmux

1. Clone or download this repo.
2. Copy the theme into Ghostty's themes directory (the theme name is the filename, so drop the `.conf` extension and use a friendly name):

   ```bash
   mkdir -p ~/.config/ghostty/themes
   cp "themes/cmux/hermes-agent-dark.conf" ~/.config/ghostty/themes/"Hermes Agent Dark"
   ```

3. Add the theme to your Ghostty config (`~/.config/ghostty/config`):

   ```
   theme = Hermes Agent Dark
   ```

4. Reload open cmux terminals so the theme takes effect.

> Note: cmux's built-in **Dark**/**Light** theme picker writes a managed Ghostty theme that overrides custom terminal colors. To keep this theme, set it via the Ghostty `config` above rather than the cmux Dark/Light toggle.

## Firefox Theme

A matching Firefox WebExtension theme brings the Hermes Agent gold-on-midnight aesthetic to your browser — address bar, tab bar, sidebar, and popups all styled to the same palette.

### Installation

#### Temporary (testing)

1. Open Firefox and navigate to `about:debugging#addons`
2. Click **This Firefox** → **Load Temporary Add-on…**
3. Select `themes/firefox/manifest.json` from this repository
4. The theme activates immediately — browse around to verify

> Temporary add-ons are removed when Firefox closes. Use the permanent method below for a lasting install.

#### Permanent

1. Open Firefox and navigate to `about:debugging#addons`
2. Click **This Firefox** → **Load Temporary Add-on…**
3. Select `themes/firefox/manifest.json` — this registers the add-on persistently
4. Open `about:preferences#appearance` → set the theme to **Hermes Agent**

Alternatively, package the add-on and install from `about:addons` → ⚙️ → **Install Add-on From File…**

### Screenshot

![Firefox Hermes Agent Theme](themes/firefox/screenshot-dark.png)

### VS Code → Firefox Color Mapping

| VS Code Token | Firefox Surface | Hex |
|---------------|----------------|-----|
| Background | `theme.background` | `#0b0b16` |
| Surface | `theme.toolbarBackground` | `#1a1a2e` |
| Elevated | `theme.tabBackground` | `#1e1e35` |
| Gold (brand) | `theme.toolbarColor` | `#FFD700` |
| Cornsilk text | `theme.toolbarForeground` | `#FFF8DC` |
| Muted gray | `theme.tabForeground` | `#8B8682` |
| Purple | `theme.popupBackground` | `#B28DFF` |
| Teal | `theme.sidebarBackground` | `#6ED7D2` |
| Green | `theme.tabSelectedBackground` | `#4CAF50` |
| Red | `theme.tabSelectedForeground` | `#EF5350` |

> **Note:** This theme uses Manifest V2 and is compatible with Firefox 89+. Some deprecated color properties have been dropped to keep the manifest clean.

## Color Palettes

### Neon Green Family

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#0a0f0a` | Deep charcoal |
| Foreground | `#c8d6c8` | Soft green-white |
| Neon Green (accent) | `#39ff14` | Keywords, cursor, active elements |
| Bright Green | `#4dff4d` | Active tab text, selection |
| Soft Green | `#7dcea0` | Strings, attributes |
| Teal | `#4dd9c0` | Numbers, types, links |
| Mint | `#66d9a0` | Classes, constants |
| Red | `#ff5555` | Errors, deletions |
| Orange | `#ffb347` | Warnings, modifications |

### Soft Glow Family

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#12100e` | Deep warm charcoal |
| Foreground | `#c8c0b8` | Warm gray |
| Amber (accent) | `#d4a87a` | UI accents, cursor, active elements |
| Keywords | `#c090e0` | Soft purple |
| Functions | `#70a0e0` | Muted blue |
| Strings | `#b8cc70` | Yellow-green |
| Properties | `#90c880` | True green |
| Types | `#5cb8d0` | Soft cyan |
| Numbers | `#e08070` | Warm coral |
| Parameters | `#e0c060` | Golden yellow |

### OpenCode Family

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#0a0a0a` | Flat near-black |
| Foreground | `#eeeeee` | Soft off-white ink |
| Peach (accent) | `#fab283` | UI accents, cursor, functions, numbers |
| Keywords | `#9d7cd8` | Soft purple |
| Strings | `#7fd88f` | Green |
| Properties | `#56b6c2` | Cyan |
| Types | `#e5c07b` | Soft yellow |
| Variables | `#e06c75` | Red |
| Constants | `#f5a742` | Amber |
| Comments | `#808080` | Muted gray |

### Hermes Agent Family

| Role | Hex | Preview |
|------|-----|---------|
| Background | `#0b0b16` | Deep midnight navy |
| Foreground | `#FFF8DC` | Warm cornsilk text |
| Gold (brand accent) | `#FFD700` | Cursor, functions, keywords, numbers |
| Purple (suggestions) | `#B28DFF` | Plan mode, suggestions, readonly vars |
| Teal (permission) | `#6ED7D2` | IDE, properties, types |
| Green (success) | `#4CAF50` | Strings, namespaces, git untracked |
| Goldenrod (memory) | `#DAA520` | Decorators, annotations |
| Red (error) | `#EF5350` | Errors, variable defaults |
| Orange (warning) | `#FFA726` | Arrays, warnings |
| Gray (inactive) | `#8B8682` | Comments, inactive elements |

## Syntax Highlights

### Neon Green

- **Keywords** — Bold neon green `#39ff14`
- **Strings** — Warm soft green `#7dcea0`
- **Functions** — Bright white-green `#b5e8c8`
- **Types/Classes** — Mint green `#66d9a0`
- **Numbers** — Teal `#4dd9c0`
- **Comments** — Muted forest italic `#3a5a3a`

### Soft Glow

- **Keywords** — Soft purple `#c090e0`
- **Strings** — Yellow-green `#b8cc70`
- **Functions** — Muted blue `#70a0e0`
- **Types/Classes** — Soft cyan `#5cb8d0`
- **Numbers** — Warm coral `#e08070`

### OpenCode

- **Keywords** — Soft purple `#9d7cd8`
- **Strings** — Green `#7fd88f`
- **Functions** — Warm peach `#fab283`
- **Types/Classes** — Soft yellow `#e5c07b`
- **Numbers** — Warm peach `#fab283`
- **Comments** — Muted gray `#808080`
- **Comments** — Warm gray italic `#5a5248`

### Hermes Agent

- **Keywords** — Gold `#FFD700`
- **Strings** — Green `#4CAF50`
- **Functions** — Gold `#FFD700`
- **Types/Classes** — Gold `#FFD700`
- **Numbers** — Gold `#FFD700`
- **Suggestions** — Purple `#B28DFF`
- **Permissions** — Teal `#6ED7D2`
- **Comments** — Warm gray `#8B8682`

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
│   ├── neon-green-liquid-glass-color-theme.json  # Liquid Glass variant
│   ├── soft-glow-dark-color-theme.json       # Soft Glow Dark variant
│   ├── soft-glow-light-color-theme.json      # Soft Glow Light variant
│   ├── Neon Green Dark.itermcolors       # iTerm2 Dark Terminal profile
│   ├── Neon Green Light.itermcolors      # iTerm2 Light profile
│   └── hermes-agent-dark.yaml          # Warp Hermes Agent theme
│   ├── warp/                             # Warp terminal themes (all 8 variants)
│   ├── cmux/                             # cmux (Ghostty) terminal themes
│   │   └── hermes-agent-dark.conf        # cmux Hermes Agent theme
│   └── firefox/                          # Firefox WebExtension theme (Hermes Agent)
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
