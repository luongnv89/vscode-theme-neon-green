# Changelog

## v1.7.0 — 2026-09-20

### Features

- **Aura — Dark** theme: deep purple-black canvas (`#15141b`) with violet keywords (`#a277ff`), mint types (`#61ffca`), and warm amber functions — ported from the Pi agent `aura` theme
- **Omarchy — Dark** theme: slate gray-black canvas (`#101315`) with neon green strings (`#00ff99`) and cyan keywords (`#33ccff`) — ported from the Pi agent `omarchy` theme
- **Synthwave '84 — Dark** theme: retro purple dusk canvas (`#262335`) with hot pink keywords (`#ff7edb`), cyan types (`#03edf9`), and sunset orange functions — ported from the Pi agent `synthwave-84` theme
- **Zed — Dark** and **Zed — Light** themes: Zed editor's neutral palette (`#282c33` / `#fafafa`) with blue functions, purple keywords, and green strings — ported from the Pi agent `zed-dark` / `zed-light` themes, bringing the collection to thirteen themes
- Added `scripts/make-pi-themes.py` generator: role-table hex remapper that ports any Pi agent theme palette onto the full VS Code theme skeleton (dark and light bases)
- **Hermes Agent — Dark** theme: warm gold-on-navy palette for VS Code, iTerm2, Warp, Ghostty (cmux), and Claude Code (#3)
- **Claude Code palette family** under `themes/claude-code/` — ports for all thirteen themes across all 8 families (#27)
- **Ghostty themes** and **macOS Terminal.app profiles** for all 8 theme variants
- Landing page: one dominant **Install from Marketplace** CTA in the hero, Screenshots promoted into the primary nav, and a per-family schematic gallery drawn from each family's real palette (#30, #31, #33)
- Landing variant cards are now driven by `contributes.themes` instead of a hardcoded list (#24)

### Fixed

- Restored the documented `F5` Extension Development Host workflow: `.vscode/launch.json` is now committed (`.gitignore` narrowed to un-ignore it) (#11)
- Mobile nav toggle's `aria-controls` now points at a real `id="primary-nav"` element (#14)
- Firefox preview page scrolls on short viewports instead of clipping (#34)
- Palette generators now exit non-zero on unmapped leftover hexes; CI regenerates themes and fails on drift (#29)
- VSIX no longer ships companion theme trees (`claude-code`, `firefox`, `ghostty`, `cmux`, `terminal`), tests, or `.gitissue/` (#26)
- VSIX version examples in docs are generated from `package.json` instead of hardcoded (#32)

### Security

- Landing generator escapes all HTML, attribute, URL, and CSS interpolation and serializes JSON-LD safely — closing a stored-XSS path through theme content (#17)
- GitHub Actions pinned to commit SHAs in all workflows (#16)
- `npm audit --audit-level=high` runs in CI and fails on high/critical advisories (#15)

### Documentation

- Aligned the docs with the 13-theme, 8-family collection: `docs/ARCHITECTURE.md` now describes all families plus the landing/Python generators, `CONTRIBUTING.md` lists every registered theme, `docs/llms.txt` and the bug-report template enumerate all variants, and `docs/CHANGELOG.md` is now a pointer to this file (#35)
- Added `docs/DEVELOPMENT.md` toolchain guide, `CLAUDE.md`, and `AGENTS.md` agent-environment docs (#7, #8, #9)

### Tests

- Added the `npm test` smoke suite (`node --test`, no new dependencies): theme-JSON schema checks against `contributes.themes` and characterization tests for the Python generators' `remap`/`walk` functions (#10)
- Suite now covers generator escaping helpers, contributes-driven variant parity, Shiki lang invariants, hero CTA, and the family gallery — 79 tests (#44, #52, #53, #54, #55)

### Maintenance

- CI moved to **Node 24 LTS** and `engines.node >= 24` declared (#18)
- Upgraded `marked` 15 → 18 and `shiki` 3 → 4 (#19, #20, #21, #22)
- CI validates all `themes/**/*.json` recursively (incl. nested families), excludes `node_modules`, and runs the test suite (#13)
- Extracted the duplicated Python hex-remap logic into `scripts/hex_remap.py` (#25)
- Split the 1,345-line landing generator into focused modules under `scripts/landing/` (#23)
- Landing Shiki highlighter now loads a single theme and only the languages used (#36)

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.6.0...v1.7.0

## v1.6.0 — 2026-06-02

### Features

- **OpenCode — Dark** theme: minimal flat near-black canvas (`#0a0a0a`) with warm peach accents (`#fab283`) and soft purple keywords (`#9d7cd8`) — a third theme family alongside Neon Green and Soft Glow, bringing the collection to seven themes
- **Warp terminal themes** for all six (now seven) variants — matching `.yaml` configs for every theme, including the new `themes/warp/opencode.yaml`
- Redesigned landing page top navigation as a terminal HUD bar

### Documentation

- Updated README and landing page to document the OpenCode family, its palette, and Warp install steps
- Added `scripts/make-opencode-theme.py` generator for the OpenCode theme

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.5.0...v1.6.0

## v1.5.0 — 2026-03-21

### Rebrand

- Renamed display name from "Neon Green — Dark Terminal" to **"Neon Green Theme Collection"**
- Updated description, keywords, and all documentation to present both theme families equally
- Updated landing page generator to include all 6 themes (was 3)
- Updated issue templates, contributing guide, and architecture docs

## v1.4.0 — 2026-03-21

### Features

- **Soft Glow — Dark** theme: warm, eye-friendly dark theme with deep charcoal background (`#12100e`) and high-contrast desaturated syntax colors — designed for long coding sessions in any lighting
- **Soft Glow — Light** theme: warm cream background (`#faf7f4`) with muted jewel-tone syntax highlighting — comfortable for daylight coding
- **Neon Green — Liquid Glass** dark variant

### Design Highlights

- Follows "Don't Make Me Think" principles: semantic color consistency, clear visual hierarchy, no cognitive overload
- Warm undertones throughout — no pure black or white
- Distinct hue separation between syntax elements (strings are yellow-green, properties are true green, functions are blue, keywords are purple)
- WCAG AA contrast compliance while remaining soft on the eyes

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.3.0...v1.4.0

## v1.3.0 — 2026-03-16

### Features

- **iTerm2 terminal themes** — added `Neon Green Dark.itermcolors` and `Neon Green Light.itermcolors` matching the VS Code theme palette

### Documentation

- Added iTerm2 section to README with install instructions and project structure update
- Added iTerm2 section to landing page with download links

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.2.1...v1.3.0

## v1.2.1 — 2026-03-16

### Changes

- **Light theme**: refreshed to mint-green palette — editor background `#f0faf0`, sidebar `#e2f5e3`, green-tinted borders and muted text throughout
- **Description**: removed "inspired by luongnv.com" from package.json
- **llms.txt**: updated light theme color description

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.2.0...v1.2.1

## v1.2.0 — 2026-03-16

### Features

- **Responsive mobile navigation** — added hamburger menu for screens under 980px with smooth open/close animation and auto-close on link tap
- **SEO & AI bot optimization** — added OpenGraph tags, Twitter Cards, JSON-LD structured data (SoftwareApplication schema), canonical URL, and shortened meta description
- **AI discoverability files** — added `robots.txt` (allows all bots), `sitemap.xml`, and `llms.txt` for AI crawler and LLM consumption
- **Light theme update** — changed background color to warm off-white (`#efe9e5`) with matching secondary surfaces (`#e9e3df`)

### Bug Fixes

- Fixed CI trailing whitespace failure caused by template indentation in generated HTML
- Fixed missing trailing newline in `docs/landing.md`
- Added post-processing step to strip trailing whitespace from all generated HTML lines

### CI / Infrastructure

- Updated GitHub Pages workflow to deploy `robots.txt`, `sitemap.xml`, and `llms.txt` alongside the landing page
- First image now uses `loading="eager"` with `fetchpriority="high"` instead of lazy loading
- All images now include `width` and `height` attributes to prevent CLS

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.1.0...v1.2.0

## v1.1.0 — 2026-03-13

### Features

- Redesigned extension icon with a new neon "N" mark featuring a layered glow effect
- Added a full logo kit in `assets/logo/` with 7 SVG variants
- Generated landing page for GitHub Pages with syntax highlighting

### Documentation

- Centered README header with the new logo, badges, and description
- Updated project structure section to include `assets/logo/`

### CI / Infrastructure

- Added pre-commit hooks and GitHub Actions workflow
- Added GitHub Pages deployment for landing page

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.0.0...v1.1.0
