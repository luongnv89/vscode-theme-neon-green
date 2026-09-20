// Theme-card and palette-swatch section builders injected into docs/landing.md
// placeholders — moved verbatim from generate-landing.mjs.

import { escapeHtml, sanitizeCssColor } from './sanitize.mjs';

const themeLabelFromFilename = (filename) => {
  if (filename.includes('opencode')) return 'OpenCode — Dark';
  if (filename.includes('hermes-agent')) return 'Hermes Agent — Dark';
  if (filename.includes('aura')) return 'Aura — Dark';
  if (filename.includes('omarchy')) return 'Omarchy — Dark';
  if (filename.includes('synthwave-84')) return "Synthwave '84 — Dark";
  if (filename.includes('zed-dark')) return 'Zed — Dark';
  if (filename.includes('zed-light')) return 'Zed — Light';
  if (filename.includes('soft-glow-dark')) return 'Soft Glow — Dark';
  if (filename.includes('soft-glow-light')) return 'Soft Glow — Light';
  if (filename.includes('liquid-glass')) return 'Liquid Glass';
  if (filename.includes('midnight')) return 'Midnight';
  if (filename.includes('neon-green-light')) return 'Light';
  return 'Dark Terminal';
};

const humanDescription = (filename) => {
  if (filename.includes('opencode')) return 'Minimal terminal-agent look on a flat near-black canvas — warm peach accent with purple keywords.';
  if (filename.includes('hermes-agent')) return 'Warm gold-on-navy — cornsilk text, gold brand accent, purple suggestions.';
  if (filename.includes('aura')) return 'Purple haze on a deep purple-black canvas — violet keywords, mint types, amber functions.';
  if (filename.includes('omarchy')) return 'Minimal DHH-style slate theme — neon green strings with cyan keywords.';
  if (filename.includes('synthwave-84')) return 'Retro outrun neon — hot pink keywords, cyan types, sunset orange functions.';
  if (filename.includes('zed-dark')) return 'Zed-inspired neutral dark — blue functions, purple keywords, green strings.';
  if (filename.includes('zed-light')) return 'Zed-inspired neutral light — the same palette tuned for daylight.';
  if (filename.includes('soft-glow-dark')) return 'Warm, cozy dark theme with amber accents and desaturated syntax.';
  if (filename.includes('soft-glow-light')) return 'Gentle cream background with muted jewel-tone highlights.';
  if (filename.includes('liquid-glass')) return 'Modern translucent feel with glass-like editor surfaces.';
  if (filename.includes('midnight')) return 'Softer blue-black base for a calmer late-night editor.';
  if (filename.includes('neon-green-light')) return 'Clean daytime version with neon accents still doing the heavy lifting.';
  return 'Classic hacker-terminal energy with deep contrast and sharp green accents.';
};

export const buildVariantCards = (themes) => {
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
    const label = themeLabelFromFilename(theme.sourcePath);

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
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(humanDescription(theme.sourcePath))}</p>
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
