# AGENTS.md

Subagent and agent-configuration guide for this repository. It defines **who**
does the work — roles, file ownership, boundaries, and handoffs. Recorded
install/build/test commands are deliberately **not** duplicated here: they live
in [CLAUDE.md](CLAUDE.md) and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Agent roles

### Theme author

- **Scope:** `themes/*.json`, `package.json` (`contributes.themes`)
- Creates or edits VS Code color themes; keeps the `colors` (UI elements) and
  `tokenColors` (syntax highlighting) sections consistent with the family's
  palette
- Registers every new theme in `contributes.themes`
- **Handoff:** a new or changed theme → *Terminal porter* and *Landing
  generator*

### Terminal porter

- **Scope:** `themes/*.itermcolors`, `themes/terminal/`, `themes/warp/`,
  `themes/ghostty/`, `themes/cmux/`, `themes/claude-code/`, `themes/firefox/`
- Ports a VS Code theme's palette to each terminal-emulator/app format without
  drifting from the source palette
- **Must not** modify the VS Code theme JSON files

### Generator maintainer

- **Scope:** `scripts/make-pi-themes.py`, `scripts/make-opencode-theme.py`,
  `scripts/hex_remap.py` (shared hex-remap engine both generators import)
- Owns the palette-driven generators; output must stay consistent with
  hand-written themes in structure and naming

### Landing generator

- **Scope:** `scripts/generate-landing.mjs`, `scripts/landing/`,
  `docs/index.html`, `docs/landing.md`
- Regenerates the landing page when the theme set, descriptions, or README
  change

### Reviewer

- **Scope:** read-only across the repo
- Verifies every `themes/*.json` parses, palette consistency within a family,
  naming/registration completeness, and Conventional Commits messages
- Reports findings; never edits

## Boundaries (all agents)

- Commands and toolchain come from `CLAUDE.md` / `docs/DEVELOPMENT.md`
  verbatim — never invent install, build, or test steps; if a needed command is
  not recorded there, stop and report rather than improvise
- Themes are data: there is no extension host code — do not create `src/`,
  activation code, or a build pipeline
- Never commit `.vsix`, `node_modules/`, `.env*`, `.gstack/`, `.gitissue/`, or
  `__pycache__/`; never commit the local audit files (`CODE_REVIEW.md`,
  `MODERNIZATION_PLAN.md`, `MODERNIZATION_REPORT.md`)
- No secrets, keys, or credentials in the repo — the pre-commit
  `detect-private-key` hook is the floor, not the target

## Coordination

- One logical change per commit; branches follow `<type>/<issue>-<slug>`;
  commits follow `type(scope): description (#issue)`
- Keep a port in sync with its source theme in the same change — a palette
  update that only lands in one format is an incomplete change
- Escalate to the human maintainer for: palette/design decisions, marketplace
  publishing (`vsce publish`), and anything requiring credentials
