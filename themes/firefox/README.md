# 🏛️ Hermes Agent — Firefox Theme

> Gold-on-midnight Firefox theme, inspired by the [Hermes Agent VS Code theme](https://github.com/luongnv89/vscode-theme-neon-green).

A deep navy-black canvas with warm gold accents — designed for focus, elegance, and that subtle divine glow.

## ✨ Color Palette

| Role | Color | Hex |
|------|-------|-----|
| **Canvas** | Deep navy-black | `#0b0b16` |
| **Surface** | Dark navy | `#1a1a2e` |
| **Elevated** | Lighter navy | `#1e1e35` |
| **Primary** | Gold | `#FFD700` |
| **Secondary** | Purple | `#B28DFF` |
| **Text** | Cornsilk | `FFF8DC` |
| **Muted** | Warm gray | `#8B8682` |
| **Accent** | Cyan | `#6ED7D2` |
| **Success** | Green | `#4CAF50` |
| **Danger** | Red | `#EF5350` |
| **Warning** | Orange | `#FFA726` |

## 📦 Installation

### Option 1: Load as Temporary Theme (Dev)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select the `manifest.json` file in this directory
4. The theme activates immediately

### Option 2: Load as Permanent Theme

1. Open Firefox and navigate to `about:support`
2. Click **Open Profile Folder**
3. Create a folder named `extensions` if it doesn't exist
4. Copy this entire folder into `extensions/`
5. Rename it to a unique UUID (e.g., `hermes-agent@luongnv.com`)
6. Add `"applications": {"gecko": {"id": "hermes-agent@luongnv.com"}}` to `manifest.json`
7. Restart Firefox
8. Go to **Settings → Theme → Customize** and select **Hermes Agent — Dark**

### Option 3: Install via Firefox Add-ons (Future)

Publish to [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/hermes-agent-dark/) for one-click install.

## 🎨 What's Themed

- **Tab bar** — Selected tabs glow gold, inactive tabs recede
- **Toolbar** — Dark surface with gold accents on hover
- **Address bar** — Deep canvas with gold focus ring
- **Popup menus** — Navy surface with gold highlights
- **Sidebar** — Subtle borders, gold selection
- **New Tab Page** — Dark background with gold links
- **Buttons & Inputs** — Matching navy-gold hierarchy
- **Context menus** — Consistent throughout

## 🔄 Sync with VS Code Theme

This Firefox theme mirrors the exact color tokens from `themes/hermes-agent-dark-color-theme.json` in the parent VS Code theme repository. When the VS Code theme is updated, the Firefox theme should be audited for color consistency.

## 📁 Files

```
firefox-theme-hermes-agent/
├── manifest.json        # WebExtension manifest with all theme colors
├── icon.svg             # Source icon (Hermes caduceus)
├── icon-48.png          # 48×48 icon
├── icon-96.png          # 96×96 icon
└── README.md            # This file
```

## 🪪 License

MIT — same as the parent [Neon Green Theme Collection](https://github.com/luongnv89/vscode-theme-neon-green).

## 👤 Author

**Luong Nguyen** — [luongnv.com](https://luongnv.com)

---

*Ἑρμῆς σωτῆρ — Hermes the deliverer.*
