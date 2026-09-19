#!/usr/bin/env python3
"""Shared hex-remap engine for the palette-driven theme generators.

make-pi-themes.py and make-opencode-theme.py transform a base VS Code
theme by replacing every color *value* through section-scoped maps (UI vs
syntax), preserving keys, order, and 8-digit alpha suffixes. This module
owns the primitives they previously duplicated: HEX_RE, remap, walk, and
the leftover-hex verifier.
"""
import re
from collections import OrderedDict

# A color value: #RRGGBB with an optional AA alpha suffix.
HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$")

# Any 6-digit hex occurrence inside serialized theme text (unanchored —
# also matches the base of an 8-digit value like "#aabbcc80").
_HEX_IN_TEXT_RE = re.compile(r"#[0-9a-fA-F]{6}")


def remap(value, table):
    """Replace a hex value via table, preserving any 8-digit alpha suffix."""
    if not isinstance(value, str) or not HEX_RE.match(value):
        return value
    base = value[:7].lower()
    alpha = value[7:]
    if base in table:
        return table[base] + alpha
    return value  # leave unmapped (leftover_hexes flags it)


def walk(node, table):
    """Deep-remap every hex leaf in a JSON-like dict/list structure."""
    if isinstance(node, dict):
        return OrderedDict((k, walk(v, table)) for k, v in node.items())
    if isinstance(node, list):
        return [walk(x, table) for x in node]
    return remap(node, table)


def leftover_hexes(text, allowed):
    """Sorted base hexes present in *text* but absent from *allowed*."""
    found = {m.group(0).lower()[:7] for m in _HEX_IN_TEXT_RE.finditer(text)}
    return sorted(found - {a.lower() for a in allowed})
