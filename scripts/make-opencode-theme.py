#!/usr/bin/env python3
"""Generate the OpenCode VS Code theme by transforming the existing
Neon Green dark theme: preserve every UI key and token scope, replace
only color *values* via two section-scoped maps (UI vs syntax).

Why two maps: the source uses one hex (#39ff14) for both the UI accent
and for keywords, but opencode uses peach for the UI accent and purple
for keywords. A single global hex-swap would not read like opencode.

Palette source: sst/opencode default "opencode" theme (dark mode).
"""
import json
import re
from collections import OrderedDict
from pathlib import Path

HERE = Path(__file__).resolve().parent
THEMES = HERE.parent / "themes"
SRC = THEMES / "neon-green-color-theme.json"
DST = THEMES / "opencode-color-theme.json"

# ---- opencode dark palette (fetched from source) -------------------------
OC = {
    "bg":        "#0a0a0a",  # neutral / editor background
    "ink":       "#eeeeee",  # foreground / ink
    "peach":     "#fab283",  # primary  (UI accent, functions, numbers, primitives)
    "purple":    "#9d7cd8",  # accent   (keywords, decorators)
    "green":     "#7fd88f",  # success / strings
    "yellow":    "#f5a742",  # warning / constants
    "softyellow":"#e5c07b",  # types
    "red":       "#e06c75",  # error / variables.language
    "cyan":      "#56b6c2",  # info / properties
    "diffadd":   "#b8db87",
    "diffdel":   "#e26a75",
    "muted":     "#808080",  # text-weak / comments
}

# Derived flat near-black elevation set (opencode's layered surfaces are
# computed by its engine and not in the source JSON; derive minimally off bg
# rather than carrying over Neon Green's blue-blacks).
ELEV = {
    "editorBg":   "#0a0a0a",
    "surface":    "#141414",  # sidebar / panel / tabs / widgets
    "surfaceAlt": "#0d0d0d",  # title bar / activity bar (deepest)
    "elevated":   "#1a1a1a",  # list selection / hover-active
    "hover":      "#161616",
    "border":     "#2a2a2a",
    "borderSoft": "#1f1f1f",
    "muted":      "#808080",
    "subtle":     "#5a5a5a",
}

# ---- UI map: applied to the "colors" block only --------------------------
# Maps every distinct base hex used in Neon Green's UI to an opencode value.
UI_MAP = {
    # accent greens -> peach
    "#39ff14": OC["peach"],
    "#4dff4d": OC["peach"],
    "#4dbd74": OC["green"],
    "#18ffdc": OC["cyan"],
    "#4dd9c0": OC["cyan"],
    # foreground / text tiers
    "#d5dce8": OC["ink"],
    "#d9e0eb": OC["ink"],
    "#f0f3fa": "#ffffff",
    "#b0b8cc": "#c8c8c8",
    "#8a95aa": "#a0a0a0",
    "#7a8599": ELEV["muted"],
    "#6a7590": ELEV["muted"],
    "#505370": ELEV["subtle"],
    "#3a3d55": ELEV["subtle"],
    "#6a8a6a": ELEV["muted"],
    # blue-black backgrounds / surfaces -> flat near-black elevation set
    "#0e0e1a": ELEV["editorBg"],
    "#0b0b16": ELEV["surface"],
    "#080812": ELEV["surfaceAlt"],
    "#131322": ELEV["elevated"],
    "#0f0f1c": ELEV["hover"],
    "#111120": ELEV["surface"],
    "#141425": ELEV["hover"],
    "#191930": ELEV["elevated"],
    "#222238": ELEV["elevated"],
    "#1e1e30": ELEV["borderSoft"],
    "#2b2c45": ELEV["border"],
    "#2d2d48": ELEV["border"],
    "#252540": ELEV["borderSoft"],
    "#1e1e3080": ELEV["borderSoft"],
    # semantic UI colors
    "#ff5555": OC["red"],
    "#ff7777": "#e8838b",
    "#ffb347": OC["yellow"],
    "#ffc87d": OC["softyellow"],
    "#ff9e64": OC["peach"],
    "#ff9944": OC["peach"],
    "#22d3ee": OC["cyan"],
    "#33ffeb": OC["cyan"],
    "#00ffe2": OC["cyan"],
    "#00e5ff": OC["cyan"],
    "#f0c674": OC["softyellow"],
    "#ff6b81": OC["red"],
    "#5599ff": OC["peach"],
    "#8394ff": OC["peach"],
    "#a1afff": OC["peach"],
    "#bf41ff": OC["purple"],
    "#d770ff": OC["purple"],
    "#c47dff": OC["purple"],
    "#c792ea": OC["purple"],
    "#1b1a2e": ELEV["border"],
    # validation backgrounds (keep dark, just neutralize hue)
    "#2a0a0a": "#1f1212",
    "#2a1a0a": "#1f1810",
    "#0a1a2a": "#10171f",
}

# ---- Syntax map: applied to semanticTokenColors + tokenColors -------------
# Built from opencode's syntax "overrides" role targets.
SYNTAX_MAP = {
    # keywords / control flow / storage -> purple
    "#39ff14": OC["purple"],
    # strings -> green
    "#c3e88d": OC["green"],
    # numbers / primitives / spread / template-punctuation -> peach
    "#ff5370": OC["peach"],
    # functions / methods / function-calls -> peach
    "#82aaff": OC["peach"],
    # types / classes / enums -> soft yellow
    "#00e5ff": OC["softyellow"],
    "#18ffdc": OC["softyellow"],
    # operators / accessors / modifiers -> cyan
    "#89ddff": OC["cyan"],
    # properties / object keys -> cyan
    "#b8e986": OC["cyan"],
    # parameters / html-attrs / shell-vars -> peach (kept warm, distinct)
    "#ffd700": OC["peach"],
    # regex char-classes / units / inline-code / jsx-braces -> soft yellow
    "#ffcb6b": OC["softyellow"],
    # regex / other-constants / css-id / namespaces-orange -> peach
    "#f78c6c": OC["peach"],
    # language vars (this/self), booleans, null, tags, special vars -> red
    "#ff6b81": OC["red"],
    # constant vars (UPPER_CASE), readonly -> purple
    "#d4bfff": OC["purple"],
    # plain variables -> ink
    "#c8d6c8": OC["ink"],
    # template-expression interpolation -> ink
    # escape chars / string-punct emphasis -> red
    "#f07178": OC["red"],
    # decorators / annotations / preprocessor -> purple
    # (#c792ea already covered below)
    "#c792ea": OC["purple"],
    # namespaces / packages / go-package -> green
    "#4dbd74": OC["green"],
    # comments -> muted
    "#546e54": OC["muted"],
    "#6a8e6a": "#6f7a6f",
    "#80a880": "#7f8a7f",
    # punctuation tiers -> ink / muted
    "#6a8a6a": OC["muted"],
    "#8aaa8a": "#9a9a9a",
    # diff
    "#ff5555": OC["diffdel"],
    "#ffb347": OC["yellow"],
}

HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$")


def remap(value, table):
    """Replace a hex value via table, preserving any 8-digit alpha suffix."""
    if not isinstance(value, str) or not HEX_RE.match(value):
        return value
    base = value[:7].lower()
    alpha = value[7:]
    if base in table:
        return table[base] + alpha
    return value  # leave unmapped (verifier will flag leftovers)


def walk(node, table):
    if isinstance(node, dict):
        return OrderedDict((k, walk(v, table)) for k, v in node.items())
    if isinstance(node, list):
        return [walk(x, table) for x in node]
    return remap(node, table)


def main():
    data = json.loads(SRC.read_text(), object_pairs_hook=OrderedDict)
    data["name"] = "OpenCode — Dark"

    out = OrderedDict()
    for key, val in data.items():
        if key == "colors":
            out[key] = walk(val, UI_MAP)
        elif key in ("tokenColors", "semanticTokenColors"):
            out[key] = walk(val, SYNTAX_MAP)
        else:
            out[key] = val

    # Top-level editor background/foreground come from "colors"; also set the
    # global accent-y bits explicitly to opencode values for safety.
    out["colors"]["editor.background"] = OC["bg"]
    out["colors"]["editor.foreground"] = OC["ink"]
    out["colors"]["foreground"] = OC["ink"]

    DST.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {DST}")

    # ---- verification: no Neon Green hue should survive ------------------
    text = DST.read_text()
    found = set(m.group(0).lower()[:7] for m in re.finditer(r"#[0-9a-fA-F]{6}", text))
    allowed = {v.lower() for v in OC.values()}
    allowed |= {v.lower() for v in ELEV.values()}
    allowed |= {
        "#ffffff", "#000000", "#c8c8c8", "#a0a0a0", "#e8838b",
        "#6f7a6f", "#7f8a7f", "#9a9a9a", "#1f1212", "#1f1810", "#10171f",
    }
    leftover = sorted(found - allowed)
    if leftover:
        print("WARNING leftover unmapped hexes:", leftover)
    else:
        print("OK: all base hexes map to the opencode palette.")


if __name__ == "__main__":
    main()
