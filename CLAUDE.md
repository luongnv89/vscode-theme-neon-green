# CLAUDE.md

Agent-facing quick reference for this repository. The full development guide
lives in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md); subagent roles and
coordination rules live in [AGENTS.md](AGENTS.md).

## Project

Neon Green Theme Collection — a VS Code theme extension shipping 13 JSON color
themes in 8 families (Neon Green, Soft Glow, OpenCode, Hermes Agent, Aura,
Omarchy, Synthwave '84, Zed) plus matching ports for iTerm2, Warp, Ghostty,
macOS Terminal, cmux, Claude Code, and Firefox.

There is no extension host code and no compile step: themes are data.

## Commands

Recorded commands an agent can run from a fresh checkout:

- `npm ci` — reproducible dependency install (same command CI runs)
- `npm run build:landing` — regenerate the landing page
  (`scripts/generate-landing.mjs` → `docs/index.html`); the build/CI stand-in
- `npm test` — **does not exist yet**; the suite arrives with Task 0.1. After
  0.1 this is the required test command; until then do not invoke it
- `python3 scripts/make-pi-themes.py`, `python3 scripts/make-opencode-theme.py`
  — palette-driven theme generators (require Python 3)
- `vsce package` — build the `.vsix` artifact (needs `@vscode/vsce`, optional)

## Repository layout

| Path | Contents |
|------|----------|
| `themes/*.json` | VS Code color themes (registered in `package.json` → `contributes.themes`) |
| `themes/*.itermcolors`, `themes/terminal/`, `themes/warp/`, `themes/ghostty/`, `themes/cmux/` | Terminal emulator ports |
| `themes/claude-code/`, `themes/firefox/` | Claude Code and Firefox theme ports |
| `scripts/` | Generators — Node (`generate-landing.mjs`) and Python (`make-*.py`) |
| `docs/` | DEVELOPMENT.md (toolchain + recorded commands), ARCHITECTURE.md, generated landing page |
| `examples/` | `theme-showcase.md` for manual multi-language visual checks |

## Conventions

- Commits: [Conventional Commits](https://www.conventionalcommits.org/) —
  `type(scope): description (#issue)`; branches: `<type>/<issue>-<slug>`
- Pre-commit hooks (`pre-commit install` once): trailing whitespace, EOF
  fixer, YAML/JSON validation, `check-added-large-files` (2048 KB),
  `detect-private-key`, merge-conflict check
- CI (`.github/workflows/ci.yml`): Node 20 → `npm ci` → JSON-validate
  `package.json` and every `themes/*.json` → `npm run build:landing`
- Manual theme check: VS Code `F5` → Extension Development Host →
  `Preferences: Color Theme` (`Ctrl+K Ctrl+T`)

## Guardrails

- Every `themes/*.json` must parse — CI validates all of them
- Never commit `.vsix` artifacts, `node_modules/`, `.env*`, `.gstack/`,
  `.gitissue/`, or `__pycache__/`
- Local audit files (`CODE_REVIEW.md`, `MODERNIZATION_PLAN.md`,
  `MODERNIZATION_REPORT.md`) are untracked working context — do not commit them
- New VS Code themes must also be registered under `contributes.themes` in
  `package.json`
