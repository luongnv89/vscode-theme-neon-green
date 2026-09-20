import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildCss, themeCssVars } from './landing/css.mjs';
import { createLandingHighlighter, renderMarkdown } from './landing/highlight.mjs';
import { buildNav } from './landing/nav.mjs';
import { buildHtml } from './landing/page.mjs';
import { buildHeroCta, buildPaletteSwatches, buildVariantCards } from './landing/sections.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const readJson = async (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  return JSON.parse(await fs.readFile(fullPath, 'utf8'));
};

const readText = async (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  return fs.readFile(fullPath, 'utf8');
};

// Landing variants are driven by package.json → contributes.themes — the same
// registry VS Code reads — so registering a theme there adds a card here.
export const contributedThemes = (pkg) =>
  (pkg.contributes?.themes ?? []).map((entry) => ({
    sourcePath: String(entry.path ?? '').replace(/^\.\//, ''),
    label: entry.label,
    uiTheme: entry.uiTheme,
  }));

const buildPage = async () => {
  const pkg = await readJson('package.json');
  const landingMarkdown = await readText('docs/landing.md');

  const themes = await Promise.all(
    contributedThemes(pkg).map(async (ref) => ({
      ...(await readJson(ref.sourcePath)),
      ...ref,
    })),
  );

  const darkTheme = themes.find((theme) => theme.uiTheme === 'vs-dark') ?? themes[0];
  const highlighter = await createLandingHighlighter(darkTheme);

  const repoUrl = pkg.repository?.url?.replace(/\.git$/, '') || 'https://github.com/luongnv89/vscode-theme-neon-green';
  const marketplaceUrl = `https://marketplace.visualstudio.com/items?itemName=${pkg.publisher}.${pkg.name}`;

  const markdown = landingMarkdown
    .replace('<!-- HERO_CTA -->', buildHeroCta({ marketplaceUrl, repoUrl }))
    .replace('<!-- VARIANT_CARDS -->', buildVariantCards(themes))
    .replace('<!-- PALETTE_SWATCHES -->', buildPaletteSwatches(darkTheme))
    .replaceAll('{{VERSION}}', String(pkg.version));

  const contentHtml = await renderMarkdown(markdown, {
    highlighter,
    themeName: darkTheme.name,
  });

  const html = buildHtml({
    pkg,
    navHtml: buildNav(markdown),
    contentHtml,
    css: buildCss(themeCssVars(darkTheme)),
    repoUrl,
    marketplaceUrl,
  });

  const cleaned = html.replace(/[^\S\n]+$/gm, '').replace(/\n*$/, '\n');
  await fs.writeFile(path.join(repoRoot, 'docs', 'index.html'), cleaned, 'utf8');
  console.log('Generated docs/index.html');
};

// Only run the build when executed as a script — importing this module (e.g.
// from the unit tests) must not regenerate docs/index.html as a side effect.
const isMainModule = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  buildPage().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { escapeAttr, escapeHtml, sanitizeCssColor, sanitizeUrl, serializeJsonLd, slugify } from './landing/sanitize.mjs';
