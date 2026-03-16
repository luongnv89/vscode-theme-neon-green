# Release v1.2.0 — Mobile Nav, SEO & Light Theme Refresh

## What's Changed

### Features

- **Responsive mobile navigation** — added hamburger menu that appears on screens under 980px with smooth toggle and auto-close on link tap
- **Full SEO optimization** — OpenGraph tags, Twitter Cards, JSON-LD structured data (SoftwareApplication schema), canonical URL, and optimized meta description
- **AI discoverability** — added `robots.txt` (allows all bots), `sitemap.xml`, and `llms.txt` for AI crawler and LLM consumption
- **Light theme background update** — warm off-white (`#efe9e5`) with matching secondary surfaces (`#e9e3df`)

### Bug Fixes

- Fixed CI failure from trailing whitespace in generated HTML
- Fixed missing trailing newline in `docs/landing.md`
- First image now uses `loading="eager"` with `fetchpriority="high"` (was lazy)
- All images include `width`/`height` attributes to prevent layout shift

### CI / Infrastructure

- Updated GitHub Pages workflow to deploy SEO files (`robots.txt`, `sitemap.xml`, `llms.txt`)

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/compare/v1.1.0...v1.2.0
