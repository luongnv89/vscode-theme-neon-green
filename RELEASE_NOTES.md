# Release v1.0.0 — Neon Green VS Code Theme

**Initial release** of the Neon Green VS Code color theme.

## What's New

### Three Theme Variants

- **Neon Green — Dark Terminal**: Pure dark green-black background (`#0a0f0a`) with classic hacker terminal aesthetics
- **Neon Green — Midnight**: Deep blue-black background (`#0b1014`) for softer, late-night coding sessions
- **Neon Green — Light**: Clean light background with neon green accents for daytime use

### Syntax Highlighting

- Vivid neon green (`#39ff14`) keywords and accent elements
- Carefully tuned multicolor syntax for long coding sessions
- Broad language support:
  - JavaScript / TypeScript / JSX / TSX
  - Python (decorators, f-strings, magic methods)
  - Rust (lifetimes, macros)
  - Go (packages)
  - HTML / CSS / SCSS
  - JSON / YAML / Markdown
  - Shell / Bash
  - C / C++ / Java / SQL
  - All languages via TextMate scopes

### UI Customization

- Custom editor, sidebar, terminal, and status bar colors
- Bracket pair colorization
- Git decoration colors (modified, untracked, conflict indicators)
- Custom terminal ANSI color palette

### Project Resources

- Multi-language theme showcase file for testing (`examples/theme-showcase.md`)
- Full OSS documentation (Contributing, Code of Conduct, Security Policy)
- GitHub issue and PR templates

## Installation

### VS Code Marketplace

Search for **"Neon Green — Dark Terminal"** in VS Code Extensions.

### From VSIX

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension neon-green-theme-1.0.0.vsix
```

### Manual

Copy to `~/.vscode/extensions/neon-green-theme` and reload VS Code.

## Contributors

- @luongnv89 — Luong Nguyen

**Full Changelog**: https://github.com/luongnv89/vscode-theme-neon-green/commits/v1.0.0
