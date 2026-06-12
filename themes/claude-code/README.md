# Neon Green — Claude Code themes

Custom color themes for [Claude Code](https://docs.anthropic.com/claude-code), the
Anthropic CLI. Same DNA as the VS Code collection: the signature `#39ff14` neon green
drives the brand accent on the Neon Green variants, plus a warm-peach OpenCode
companion — palettes mapped straight from their VS Code counterparts.

Requires Claude Code **v2.1.118+** (custom themes).

## Variants

| File | Display name | Base |
| --- | --- | --- |
| `neon-green-dark.json` | Neon Green — Dark | `dark` |
| `neon-green-midnight.json` | Neon Green — Midnight | `dark` |
| `neon-green-liquid-glass.json` | Neon Green — Liquid Glass | `dark` |
| `neon-green-light.json` | Neon Green — Light | `light` |
| `soft-glow-dark.json` | Soft Glow — Dark | `dark` |
| `soft-glow-light.json` | Soft Glow — Light | `light` |
| `opencode-dark.json` | OpenCode — Dark | `dark` |

Three families, matching the VS Code collection: **Neon Green** (Dark, Midnight,
Liquid Glass, Light), **Soft Glow** (warm eye-friendly pastels — Dark, Light), and
**OpenCode** (Dark).

## Install

Copy the theme file(s) into your Claude Code themes directory:

```bash
mkdir -p ~/.claude/themes
cp themes/claude-code/*.json ~/.claude/themes/
```

Then select it inside Claude Code:

```
/theme
```

Pick any of the seven (e.g. **Neon Green — Dark**, **Soft Glow — Light**, **OpenCode — Dark**) from the list. Claude Code watches the
themes directory, so edits to the JSON apply to the running session immediately — no
restart needed.

## Customize

Each file is a small JSON with three fields:

```json
{
  "name": "Neon Green — Dark",
  "base": "dark",
  "overrides": { "claude": "#39ff14", "...": "..." }
}
```

- `name` — label shown in the `/theme` picker.
- `base` — the built-in preset to start from (`dark` or `light`); anything not
  overridden inherits from it.
- `overrides` — token → color map. Tweak any value and save; the change is live.

## Palette

Mapped from the Neon Green Dark VS Code theme:

| Role | Color |
| --- | --- |
| Brand accent / success | `#39ff14` |
| Foreground text | `#d5dce8` |
| Permission / IDE | `#00ffe2` |
| Plan mode / suggestions | `#8394ff` |
| Memory / fast mode | `#bf41ff` |
| Warning / bash | `#ffb347` |
| Error | `#ff5555` |

Other variants keep the same token roles, recolored from their VS Code counterparts:

| Variant | Brand accent | Success | Permission / IDE | Error |
| --- | --- | --- | --- | --- |
| Neon Green — Midnight | `#39ff14` | `#39ff14` | `#00ffe2` | `#ff5555` |
| Neon Green — Liquid Glass | `#39ff14` | `#39ff14` | `#00ffe2` | `#ff5555` |
| Neon Green — Light | `#0d9e00` | `#0d9e00` | `#00a896` | `#c4284a` |
| Soft Glow — Dark | `#d4a87a` | `#8bab8b` | `#7fb5a5` | `#c97070` |
| Soft Glow — Light | `#a07838` | `#467046` | `#3a756a` | `#a04545` |
| OpenCode — Dark | `#fab283` | `#7fd88f` | `#56b6c2` | `#e06c75` |
