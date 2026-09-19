#!/usr/bin/env python3
"""Generate VS Code themes from Pi agent theme palettes.

Same technique as make-opencode-theme.py: transform the Neon Green base
themes (dark base for dark themes, light base for light themes) by
replacing every color *value* via section-scoped maps (UI vs syntax),
preserving all UI keys, token scopes, font styles, and alpha suffixes.

Role tables below map each slot name to the source hexes that play that
role in the base theme. Each theme's palette assigns a target hex per
slot. Palette values are taken from ../pi-extensions/themes/*.json
(vars resolved through the colors section) with minimally derived
elevation/text tiers where the Pi theme does not define enough steps.

After remapping, the named tokenColor entries "Diff Added/Removed/Changed"
are pinned to explicit diff colors (their source hexes are shared with
unrelated roles like keywords, so a blind remap would mis-color them).
"""
import json
import sys
from collections import OrderedDict
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))  # sibling import when loaded by path (tests)

from hex_remap import HEX_RE, leftover_hexes, remap, walk  # noqa: E402

THEMES = HERE.parent / "themes"
DARK_BASE = THEMES / "neon-green-color-theme.json"
LIGHT_BASE = THEMES / "neon-green-light-color-theme.json"

# ---------------------------------------------------------------------------
# Role tables: slot -> source hexes in the base theme
# ---------------------------------------------------------------------------

DARK_UI = {
    "accent":     ["#39ff14", "#4dff4d"],
    "green":      ["#4dbd74"],
    "info":       ["#18ffdc", "#4dd9c0", "#22d3ee", "#33ffeb", "#00ffe2", "#00e5ff"],
    "ink":        ["#d5dce8", "#d9e0eb"],
    "bright":     ["#f0f3fa"],
    "inactive":   ["#b0b8cc"],
    "mid":        ["#8a95aa"],
    "muted":      ["#7a8599", "#6a7590", "#6a8a6a"],
    "subtle":     ["#505370", "#3a3d55"],
    "editorBg":   ["#0e0e1a"],
    "surface":    ["#0b0b16", "#111120"],
    "surfaceAlt": ["#080812"],
    "elevated":   ["#131322", "#191930", "#222238"],
    "hover":      ["#0f0f1c", "#141425"],
    "border":     ["#2b2c45", "#2d2d48", "#1b1a2e"],
    "borderSoft": ["#1e1e30", "#252540"],
    "red":        ["#ff5555", "#ff6b81"],
    "brightRed":  ["#ff7777"],
    "yellow":     ["#ffb347"],
    "warm2":      ["#ffc87d", "#f0c674"],
    "orange":     ["#ff9e64", "#ff9944"],
    "blue":       ["#5599ff", "#8394ff", "#a1afff"],
    "purple":     ["#bf41ff", "#d770ff", "#c47dff", "#c792ea"],
    "errBg":      ["#2a0a0a"],
    "warnBg":     ["#2a1a0a"],
    "infoBg":     ["#0a1a2a"],
}

DARK_SYN = {
    "comment":    ["#546e54"],
    "docComment": ["#6a8e6a"],
    "jsdoc":      ["#80a880"],
    "string":     ["#c3e88d"],
    "escape":     ["#f07178"],
    "number":     ["#ff5370"],
    "variable":   ["#c8d6c8"],
    "regexMain":  ["#f78c6c"],
    "regexAcc":   ["#ffcb6b"],
    "type":       ["#00e5ff"],
    "type2":      ["#18ffdc"],
    "langVar":    ["#ff6b81"],
    "keyword":    ["#39ff14"],
    "operator":   ["#89ddff"],
    "function":   ["#82aaff"],
    "parameter":  ["#ffd700"],
    "constVar":   ["#d4bfff"],
    "property":   ["#b8e986"],
    "punct":      ["#6a8a6a"],
    "punct2":     ["#8aaa8a"],
    "decorator":  ["#c792ea"],
    "namespace":  ["#4dbd74"],
    "diffDel":    ["#ff5555"],
    "diffChg":    ["#ffb347"],
}

LIGHT_UI = {
    "accent":      ["#0d9e00"],
    "accentHi":    ["#0bb500"],
    "ink":         ["#2a2d3e"],
    "bright":      ["#ffffff"],
    "sidebar":     ["#3a6a3c"],
    "statusFg":    ["#3a6a4c"],
    "desc":        ["#4a7a4c"],
    "inact":       ["#5a8a5c"],
    "gutter":      ["#5e8a60"],
    "placeholder": ["#7a9e7c"],
    "lineNo":      ["#8cb58e"],
    "kbdBtm":      ["#98cc9a"],
    "indentAct":   ["#a8d4a9"],
    "findMatch":   ["#a8e6a9"],
    "inputB":      ["#b0d8b1"],
    "lineHlB":     ["#b8dbb9"],
    "whitespace":  ["#bedabe"],
    "indent":      ["#c0ddc1"],
    "findHi":      ["#c2f0c3"],
    "selBg":       ["#c5e8c6"],
    "border":      ["#c8e6c9"],
    "inactSel":    ["#d0ead1"],
    "tabB":        ["#d4edd5"],
    "secHead":     ["#ddf0de"],
    "hover":       ["#e0f2e1"],
    "surface":     ["#e2f5e3"],
    "surfaceAlt":  ["#e5f4e6"],
    "tabsBg":      ["#e8f6e8"],
    "unfAct":      ["#eaf8eb"],
    "rangeHl":     ["#ebebf3"],
    "editorBg":    ["#f0faf0"],
    "ansiW":       ["#d9e0eb"],
    "ansiBW":      ["#f0f3fa"],
    "ansiBlk":     ["#1b1a2e"],
    "red":         ["#c4284a"],
    "brightRed":   ["#e8405a"],
    "yellow":      ["#b37800"],
    "brightYel":   ["#d09000"],
    "orange":      ["#c75000"],
    "brown":       ["#866810"],
    "blue":        ["#1a6fa0"],
    "ansiBlue":    ["#8394ff"],
    "ansiBBlue":   ["#a1afff"],
    "magenta":     ["#bf41ff"],
    "ansiBMag":    ["#d770ff"],
    "purple":      ["#8a5cb0"],
    "cyan":        ["#00c8b4"],
    "ansiBCyn":    ["#33ead0"],
    "teal":        ["#0e7a7a"],
    "brBlue":      ["#0065a9"],
    "ansiBGreen":  ["#18b818"],
    "ansiBBlk":    ["#3e6e40"],
    "untracked":   ["#1a8a3e"],
    "errBg":       ["#fff0f0"],
    "warnBg":      ["#fff8e0"],
    "infoBg":      ["#e8f5ff"],
}

LIGHT_SYN = {
    "comment":     ["#7a9a7a"],
    "docComment":  ["#5e8a60"],
    "jsdoc":       ["#4a8a4a"],
    "string":      ["#0b7a29"],
    "stringAlt":   ["#3a7a1a"],
    "number":      ["#d32f2f"],
    "langVar":     ["#c4284a"],
    "regexMain":   ["#c9510c"],
    "regexAcc":    ["#e67e22"],
    "type":        ["#0065a9"],
    "type2":       ["#007c6e"],
    "keyword":     ["#0d9e00"],
    "operator":    ["#4a7e8f"],
    "function":    ["#6f42c1"],
    "parameter":   ["#b35900"],
    "constVar":    ["#5b3e99"],
    "property":    ["#2e7d32"],
    "supportConst": ["#b37800"],
    "punct":       ["#5a8a5c"],
    "punct2":      ["#4a7a4c"],
    "attr":        ["#866810"],
    "decorator":   ["#8e44ad"],
    "namespace":   ["#1a8a3e"],
    "entity":      ["#c75000"],
    "linkBlue":    ["#1a6fa0"],
    "variable":    ["#2a2d3e", "#24292e"],
}

# ---------------------------------------------------------------------------
# Theme palettes: slot -> target hex (derived from pi-extensions/themes/*.json)
# ---------------------------------------------------------------------------

AURA = {
    "name": "Aura — Dark",
    "file": "aura-color-theme.json",
    "base": "dark",
    "palette": {
        # UI slots
        "accent": "#a277ff", "green": "#61ffca", "info": "#82e2ff",
        "ink": "#edecee", "bright": "#ffffff", "inactive": "#b8b5c4",
        "mid": "#9a97a8", "muted": "#6d6d6d", "subtle": "#5f5f6e",
        "editorBg": "#15141b", "surface": "#1a1922", "surfaceAlt": "#0f0e14",
        "elevated": "#232130", "hover": "#1e1d28",
        "border": "#2a2936", "borderSoft": "#1f1e28",
        "red": "#ff6767", "brightRed": "#ff8585",
        "yellow": "#ffca85", "warm2": "#ffca85", "orange": "#ffca85",
        "blue": "#82e2ff", "purple": "#f694ff",
        "errBg": "#1f0a0a", "warnBg": "#20180c", "infoBg": "#12202a",
        # syntax slots
        "keyword": "#a277ff", "function": "#ffca85", "string": "#a277ff",
        "number": "#ffca85", "variable": "#edecee",
        "regexMain": "#f694ff", "regexAcc": "#82e2ff",
        "type": "#61ffca", "type2": "#82e2ff",
        "langVar": "#ff6767", "operator": "#61ffca",
        "parameter": "#f694ff", "constVar": "#f694ff", "property": "#82e2ff",
        "punct": "#6d6d6d", "punct2": "#9a97a8",
        "decorator": "#f694ff", "namespace": "#61ffca",
        "comment": "#5f5f6e", "docComment": "#6d6d6d", "jsdoc": "#8a8a96",
        "escape": "#ff6767",
        "diffAdd": "#61ffca", "diffDel": "#ff6767", "diffChg": "#ffca85",
    },
}

OMARCHY = {
    "name": "Omarchy — Dark",
    "file": "omarchy-color-theme.json",
    "base": "dark",
    "palette": {
        "accent": "#00ff99", "green": "#00ff99", "info": "#33ccff",
        "ink": "#cacccc", "bright": "#eeeeee", "inactive": "#a3a7a8",
        "mid": "#8b9295", "muted": "#707880", "subtle": "#4d555a",
        "editorBg": "#101315", "surface": "#181c1f", "surfaceAlt": "#0c0e10",
        "elevated": "#22272b", "hover": "#1d2226",
        "border": "#3d4449", "borderSoft": "#2a3034",
        "red": "#b85f5f", "brightRed": "#cc7070",
        "yellow": "#b36d43", "warm2": "#b36d43", "orange": "#b36d43",
        "blue": "#33ccff", "purple": "#33ccff",
        "errBg": "#2a1818", "warnBg": "#241a10", "infoBg": "#12242e",
        "keyword": "#33ccff", "function": "#33ccff", "string": "#00ff99",
        "number": "#b36d43", "variable": "#00ff99",
        "regexMain": "#b36d43", "regexAcc": "#33ccff",
        "type": "#33ccff", "type2": "#33ccff",
        "langVar": "#b36d43", "operator": "#33ccff",
        "parameter": "#cacccc", "constVar": "#00ff99", "property": "#cacccc",
        "punct": "#707880", "punct2": "#9aa0a3",
        "decorator": "#33ccff", "namespace": "#00ff99",
        "comment": "#555555", "docComment": "#707880", "jsdoc": "#8b9295",
        "escape": "#b36d43",
        "diffAdd": "#00ff99", "diffDel": "#b85f5f", "diffChg": "#b36d43",
    },
}

SYNTHWAVE = {
    "name": "Synthwave '84 — Dark",
    "file": "synthwave-84-color-theme.json",
    "base": "dark",
    "palette": {
        "accent": "#ff7edb", "green": "#72f1b8", "info": "#03edf9",
        "ink": "#b6b1b1", "bright": "#ffffff", "inactive": "#a5a1ae",
        "mid": "#8f8aa3", "muted": "#848bbd", "subtle": "#6b6380",
        "editorBg": "#262335", "surface": "#241b2f", "surfaceAlt": "#171520",
        "elevated": "#2a2139", "hover": "#2b2540",
        "border": "#495495", "borderSoft": "#34294f",
        "red": "#fe4450", "brightRed": "#ff6a75",
        "yellow": "#fede5d", "warm2": "#fede5d", "orange": "#f97e72",
        "blue": "#03edf9", "purple": "#b893ce",
        "errBg": "#2a1620", "warnBg": "#33291c", "infoBg": "#16283a",
        "keyword": "#ff7edb", "function": "#f97e72", "string": "#ff7edb",
        "number": "#fede5d", "variable": "#b6b1b1",
        "regexMain": "#f97e72", "regexAcc": "#fede5d",
        "type": "#03edf9", "type2": "#03edf9",
        "langVar": "#fe4450", "operator": "#03edf9",
        "parameter": "#72f1b8", "constVar": "#b893ce", "property": "#72f1b8",
        "punct": "#848bbd", "punct2": "#b6b1b1",
        "decorator": "#b893ce", "namespace": "#72f1b8",
        "comment": "#6b6380", "docComment": "#848bbd", "jsdoc": "#8a83b0",
        "escape": "#fe4450",
        "diffAdd": "#72f1b8", "diffDel": "#fe4450", "diffChg": "#fede5d",
    },
}

ZED_DARK = {
    "name": "Zed — Dark",
    "file": "zed-dark-color-theme.json",
    "base": "dark",
    "palette": {
        "accent": "#74ade8", "green": "#a1c181", "info": "#6eb4bf",
        "ink": "#dce0e5", "bright": "#f2f4f7", "inactive": "#c0c5cc",
        "mid": "#a9afbc", "muted": "#878a98", "subtle": "#5d636f",
        "editorBg": "#282c33", "surface": "#2f343e", "surfaceAlt": "#23272d",
        "elevated": "#3a4048", "hover": "#363c46",
        "border": "#464b57", "borderSoft": "#363c46",
        "red": "#d07277", "brightRed": "#e0888d",
        "yellow": "#dec184", "warm2": "#dec184", "orange": "#bf956a",
        "blue": "#74ade8", "purple": "#b477cf",
        "errBg": "#382a2e", "warnBg": "#38322a", "infoBg": "#2a3442",
        "keyword": "#b477cf", "function": "#73ade9", "string": "#a1c181",
        "number": "#bf956a", "variable": "#acb2be",
        "regexMain": "#bf956a", "regexAcc": "#dec184",
        "type": "#6eb4bf", "type2": "#6eb4bf",
        "langVar": "#d07277", "operator": "#6eb4bf",
        "parameter": "#bf956a", "constVar": "#b477cf", "property": "#d07277",
        "punct": "#b2b9c6", "punct2": "#8f96a3",
        "decorator": "#dec184", "namespace": "#dec184",
        "comment": "#70788a", "docComment": "#878a98", "jsdoc": "#8a9098",
        "escape": "#6eb4bf",
        "diffAdd": "#98c379", "diffDel": "#e06c75", "diffChg": "#dec184",
    },
}

ZED_LIGHT = {
    "name": "Zed — Light",
    "file": "zed-light-color-theme.json",
    "base": "light",
    "palette": {
        # UI slots (light base)
        "accent": "#5c78e2", "accentHi": "#4a68d8",
        "ink": "#242529", "bright": "#ffffff",
        "sidebar": "#58585a", "statusFg": "#58585a", "desc": "#7e8086",
        "inact": "#7e8086", "gutter": "#7e8086", "placeholder": "#a2a3a7",
        "lineNo": "#b9b9bc", "kbdBtm": "#c9c9ca",
        "indentAct": "#cacaca", "findMatch": "#c5caf5", "inputB": "#c9c9ca",
        "lineHlB": "#dbdbdd", "whitespace": "#dcdcdc", "indent": "#e0e0e1",
        "findHi": "#d8dbf8", "selBg": "#e0e1e5", "border": "#dfdfe0",
        "inactSel": "#e9e9ec", "tabB": "#e4e4e6", "secHead": "#ebebec",
        "hover": "#efeff0", "surface": "#f3f3f4", "surfaceAlt": "#ebebec",
        "tabsBg": "#ebebec", "unfAct": "#f0f0f1", "rangeHl": "#eeeef1",
        "editorBg": "#fafafa",
        "ansiW": "#e8e8ea", "ansiBW": "#ffffff", "ansiBlk": "#3a3b40",
        "red": "#d36151", "brightRed": "#e45649",
        "yellow": "#a48819", "brightYel": "#b9971f",
        "orange": "#ad6e25", "brown": "#ad6e25",
        "blue": "#5c78e2", "ansiBlue": "#5c78e2", "ansiBBlue": "#7289e8",
        "magenta": "#a449ab", "ansiBMag": "#b55bbb", "purple": "#a449ab",
        "cyan": "#3882b7", "ansiBCyn": "#4395c9", "teal": "#3882b7",
        "brBlue": "#5c78e2", "ansiBGreen": "#57a64f", "ansiBBlk": "#7e8086",
        "untracked": "#50a14f",
        "errBg": "#f5e0de", "warnBg": "#f6ecd2", "infoBg": "#e5e9fa",
        # syntax slots (light base)
        "keyword": "#a449ab", "function": "#5b79e3", "string": "#649f57",
        "stringAlt": "#4f8f43", "number": "#ad6e25", "variable": "#242529",
        "regexMain": "#ad6e25", "regexAcc": "#a48819",
        "type": "#3882b7", "type2": "#3882b7",
        "langVar": "#d36151", "operator": "#3882b7",
        "parameter": "#ad6e25", "constVar": "#a449ab", "property": "#d36151",
        "supportConst": "#a48819",
        "punct": "#4d4f52", "punct2": "#6e7076",
        "attr": "#ad6e25", "decorator": "#a449ab", "namespace": "#a48819",
        "entity": "#ad6e25", "linkBlue": "#5c78e2",
        "comment": "#8b8d93", "docComment": "#7e8086", "jsdoc": "#58585a",
        "diffAdd": "#50a14f", "diffDel": "#e45649", "diffChg": "#a48819",
    },
}

THEME_LIST = [AURA, OMARCHY, SYNTHWAVE, ZED_DARK, ZED_LIGHT]

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

DIFF_NAMES = {
    "Diff Added": "diffAdd",
    "Diff Removed": "diffDel",
    "Diff Changed": "diffChg",
}


def build_map(roles, palette):
    """Invert slot->[source hexes] into source hex -> target hex."""
    m = {}
    for slot, srcs in roles.items():
        target = palette[slot]
        for src in srcs:
            m[src.lower()] = target
    return m


def fix_diff_entries(token_colors, palette):
    """Pin the named diff entries to explicit diff colors."""
    for entry in token_colors:
        slot = DIFF_NAMES.get(entry.get("name"))
        if slot and slot in palette:
            entry["settings"]["foreground"] = palette[slot]


def _palette_base_green(palette):
    if "green" in palette:
        return palette["green"]
    if "ansiBGreen" in palette:
        return palette["ansiBGreen"]
    if "diffAdd" in palette:
        return palette["diffAdd"]
    raise KeyError("palette has no green slot")


def _palette_added_green(palette):
    return palette.get("diffAdd") or _palette_base_green(palette)


def _palette_bright_green(palette):
    green = _palette_base_green(palette)
    accent = palette.get("accent")
    if accent and accent.lower() == green.lower():
        return palette.get("accentHi", accent)
    return palette.get("ansiBGreen", green)


def fix_terminal_git_green(colors, palette):
    """Pin terminal/git added greens after UI remap (accent shares source hexes)."""
    green = _palette_added_green(palette)
    bright = _palette_bright_green(palette)
    colors["terminal.ansiGreen"] = green
    colors["terminal.ansiBrightGreen"] = bright
    colors["editorGutter.addedBackground"] = green
    colors["gitDecoration.addedResourceForeground"] = green
    if "minimapGutter.addedBackground" in colors:
        colors["minimapGutter.addedBackground"] = green
    if "editorOverviewRuler.addedForeground" in colors:
        colors["editorOverviewRuler.addedForeground"] = green + "80"


def main():
    for theme in THEME_LIST:
        is_dark = theme["base"] == "dark"
        src = DARK_BASE if is_dark else LIGHT_BASE
        ui_roles = DARK_UI if is_dark else LIGHT_UI
        syn_roles = DARK_SYN if is_dark else LIGHT_SYN
        pal = theme["palette"]

        missing = [s for s in set(ui_roles) | set(syn_roles) if s not in pal]
        if missing:
            raise SystemExit(f"{theme['name']}: missing palette slots {missing}")

        ui_map = build_map(ui_roles, pal)
        syn_map = build_map(syn_roles, pal)

        data = json.loads(src.read_text(), object_pairs_hook=OrderedDict)
        data["name"] = theme["name"]

        out = OrderedDict()
        for key, val in data.items():
            if key == "colors":
                out[key] = walk(val, ui_map)
            elif key in ("tokenColors", "semanticTokenColors"):
                out[key] = walk(val, syn_map)
            else:
                out[key] = val

        out["colors"]["editor.background"] = pal["editorBg"]
        out["colors"]["editor.foreground"] = pal["ink"]
        out["colors"]["foreground"] = pal["ink"]
        fix_terminal_git_green(out["colors"], pal)
        fix_diff_entries(out["tokenColors"], pal)

        dst = THEMES / theme["file"]
        dst.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
        print(f"Wrote {dst.name}")

        # ---- verification: no base-theme hue should survive ---------------
        allowed = {v.lower() for v in pal.values()} | {"#000000", "#ffffff"}
        leftover = leftover_hexes(dst.read_text(), allowed)
        if leftover:
            print(f"  WARNING leftover unmapped hexes: {leftover}")
        else:
            print("  OK: all base hexes map to the palette.")


if __name__ == "__main__":
    main()
