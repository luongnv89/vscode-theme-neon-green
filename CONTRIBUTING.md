# Contributing to Neon Green Theme

Thank you for your interest in contributing! This guide will help you get started.

## How to Contribute

### Reporting Issues

- Use the [GitHub Issues](https://github.com/luongnv89/vscode-theme-neon-green/issues) to report bugs or request features
- Check existing issues before opening a new one
- Use the provided issue templates

### Submitting Changes

1. **Fork** the repository
2. **Create a branch** from `main` (`git checkout -b feat/your-feature`)
3. **Make your changes** (see development setup below)
4. **Test** your changes in VS Code
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push** your branch and open a **Pull Request**

## Development Setup

### Prerequisites

- [VS Code](https://code.visualstudio.com/) ^1.70.0
- [Node.js](https://nodejs.org/) (for packaging)
- [@vscode/vsce](https://github.com/microsoft/vscode-vsce) (optional, for packaging)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/luongnv89/vscode-theme-neon-green.git
cd vscode-theme-neon-green

# Open in VS Code
code .
```

### Testing Your Changes

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new window, select the theme via `Preferences: Color Theme`
4. Open files in different languages to verify syntax highlighting
5. Use the `examples/theme-showcase.md` file for comprehensive testing

### Theme Files

Theme JSON files are located in `themes/`:

- `neon-green-color-theme.json` — Dark Terminal variant
- `neon-green-midnight-color-theme.json` — Midnight variant
- `neon-green-light-color-theme.json` — Light variant

Each file contains:
- `colors` — UI element colors (editor, sidebar, terminal, etc.)
- `tokenColors` — Syntax highlighting rules using TextMate scopes

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new color for bracket matching
fix: correct comment color contrast ratio
docs: update installation instructions
style: adjust sidebar background opacity
```

## Branching Strategy

- `main` — stable, release-ready code
- `feat/*` — new features or color additions
- `fix/*` — bug fixes and color corrections
- `docs/*` — documentation changes

## Coding Standards

- Use descriptive hex color comments in theme JSON files
- Test changes across multiple languages using the showcase file
- Ensure sufficient contrast ratios for accessibility
- Keep the color palette consistent across all three variants

## Pull Request Process

1. Fill out the PR template completely
2. Ensure the theme renders correctly in VS Code
3. Include screenshots showing before/after if changing colors
4. Wait for at least one maintainer review before merging

## Questions?

Feel free to open an issue or reach out to the maintainer at [luongnv.com](https://luongnv.com).
