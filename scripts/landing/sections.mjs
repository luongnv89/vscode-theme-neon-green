// Theme-card, palette-swatch and hero-CTA section builders injected into
// docs/landing.md placeholders — moved verbatim from generate-landing.mjs.

import { escapeAttr, escapeHtml, sanitizeCssColor, sanitizeUrl } from './sanitize.mjs';

// Card blurbs keyed by the contributes.themes label — the same identifier
// package.json registers. Theme JSON carries no description field, so the copy
// lives here as data rather than a filename heuristic.
const VARIANT_DESCRIPTIONS = new Map([
  ['Neon Green — Dark Terminal', 'Classic hacker-terminal energy with deep contrast and sharp green accents.'],
  ['Neon Green — Midnight', 'Softer blue-black base for a calmer late-night editor.'],
  ['Neon Green — Light', 'Clean daytime version with neon accents still doing the heavy lifting.'],
  ['Neon Green — Liquid Glass', 'Modern translucent feel with glass-like editor surfaces.'],
  ['Soft Glow — Dark', 'Warm, cozy dark theme with amber accents and desaturated syntax.'],
  ['Soft Glow — Light', 'Gentle cream background with muted jewel-tone highlights.'],
  ['OpenCode — Dark', 'Minimal terminal-agent look on a flat near-black canvas — warm peach accent with purple keywords.'],
  ['Hermes Agent — Dark', 'Warm gold-on-navy — cornsilk text, gold brand accent, purple suggestions.'],
  ['Aura — Dark', 'Purple haze on a deep purple-black canvas — violet keywords, mint types, amber functions.'],
  ['Omarchy — Dark', 'Minimal DHH-style slate theme — neon green strings with cyan keywords.'],
  ["Synthwave '84 — Dark", 'Retro outrun neon — hot pink keywords, cyan types, sunset orange functions.'],
  ['Zed — Dark', 'Zed-inspired neutral dark — blue functions, purple keywords, green strings.'],
  ['Zed — Light', 'Zed-inspired neutral light — the same palette tuned for daylight.'],
]);

const FALLBACK_VARIANT_DESCRIPTION = 'A variant from the Neon Green Theme Collection.';

export const variantDescription = (label) =>
  VARIANT_DESCRIPTIONS.get(label) ?? FALLBACK_VARIANT_DESCRIPTION;

// contributes.themes labels carry the family prefix ("Neon Green — Dark
// Terminal") while cards show the variant alone. The collection's own family
// is the first registered theme's label stem, so the shortener stays
// data-driven — it never inspects the theme filename.
export const collectionFamily = (themes) =>
  String(themes[0]?.label ?? themes[0]?.name ?? '').split(/\s+—\s+/)[0];

export const shortVariantLabel = (label, family) => {
  const prefix = `${family} — `;
  return family && String(label).startsWith(prefix) ? String(label).slice(prefix.length) : label;
};

export const buildVariantCards = (themes) => {
  const family = collectionFamily(themes);
  return `
<div class="variant-grid">
${themes
  .map((theme) => {
    const bg = sanitizeCssColor(theme.colors['editor.background'] || theme.colors.background, '#111111');
    const panel = sanitizeCssColor(
      theme.colors['sideBar.background'] || theme.colors['panel.background'],
      '#181818',
    );
    const surface = sanitizeCssColor(
      theme.colors['tab.activeBackground'] || theme.colors['input.background'],
      '#202020',
    );
    const accent = sanitizeCssColor(
      theme.colors['activityBar.foreground'] ||
        theme.colors['editorCursor.foreground'] ||
        theme.colors['textLink.foreground'],
      '#39ff14',
    );
    const text = sanitizeCssColor(theme.colors['editor.foreground'] || theme.colors.foreground, '#e6e6e6');
    const muted = sanitizeCssColor(
      theme.colors['descriptionForeground'] || theme.colors['sideBar.foreground'],
      '#8c8c8c',
    );
    const line = sanitizeCssColor(theme.colors['panel.border'] || theme.colors['editorGroup.border'], '#2a2a2a');
    const label = theme.label ?? theme.name ?? '';
    const cardLabel = shortVariantLabel(label, family);

    return `
  <article class="variant-card" style="--variant-bg:${bg};--variant-panel:${panel};--variant-surface:${surface};--variant-accent:${accent};--variant-text:${text};--variant-muted:${muted};--variant-line:${line};">
    <div class="variant-window">
      <div class="variant-window-bar">
        <span></span><span></span><span></span>
      </div>
      <div class="variant-window-body">
        <div class="variant-sidebar"></div>
        <div class="variant-editor">
          <div class="variant-line variant-line-1"></div>
          <div class="variant-line variant-line-2"></div>
          <div class="variant-line variant-line-3"></div>
          <div class="variant-line variant-line-4"></div>
        </div>
      </div>
    </div>
    <div class="variant-meta">
      <h3>${escapeHtml(cardLabel)}</h3>
      <p>${escapeHtml(variantDescription(label))}</p>
      <dl>
        <div><dt>Background</dt><dd><code>${escapeHtml(bg)}</code></dd></div>
        <div><dt>Accent</dt><dd><code>${escapeHtml(accent)}</code></dd></div>
      </dl>
    </div>
  </article>`;
  })
  .join('\n')}
</div>`;
};

// Hero call-to-action injected at the <!-- HERO_CTA --> placeholder: a single
// dominant Marketplace install button, with GitHub/README demoted to plain
// secondary text links (#30). The emitted markup contains no blank lines so it
// stays one HTML block for marked, and every interpolated URL routes through
// sanitizeUrl + escapeAttr like the rest of the page.
export const buildHeroCta = ({ marketplaceUrl, repoUrl }) => {
  const readmeUrl = `${String(repoUrl ?? '').replace(/\.git$/, '')}/blob/main/README.md`;
  return `
<div class="hero-cta">
  <a class="hero-cta-btn" href="${escapeAttr(sanitizeUrl(marketplaceUrl))}">Install from Marketplace</a>
  <p class="hero-cta-alt"><a href="${escapeAttr(sanitizeUrl(repoUrl))}">View on GitHub</a> &middot; <a href="${escapeAttr(sanitizeUrl(readmeUrl))}">Read the README</a></p>
</div>`;
};

export const buildPaletteSwatches = (theme) => {
  const picks = [
    ['Editor background', theme.colors['editor.background']],
    ['Editor foreground', theme.colors['editor.foreground']],
    ['Accent', theme.colors['activityBar.foreground'] || theme.colors['editorCursor.foreground']],
    ['Selection', theme.colors['editor.selectionBackground']],
    ['Sidebar', theme.colors['sideBar.background']],
    ['Panel', theme.colors['panel.background']],
    ['Status bar', theme.colors['statusBar.background']],
    ['Error', theme.colors['errorForeground']],
    ['Warning', theme.colors['terminal.ansiYellow'] || theme.colors['statusBarItem.warningBackground']],
    ['Info', theme.colors['terminal.ansiBlue'] || theme.colors['badge.background']],
  ].filter(([, value]) => Boolean(value));

  return `
<div class="swatch-grid">
${picks
  .map(
    ([label, value]) => `
  <div class="swatch-card">
    <div class="swatch-chip" style="--chip:${sanitizeCssColor(value)}"></div>
    <div class="swatch-copy">
      <strong>${escapeHtml(label)}</strong>
      <code>${escapeHtml(value)}</code>
    </div>
  </div>`,
  )
  .join('\n')}
</div>`;
};
