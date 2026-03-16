# Changelog

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
