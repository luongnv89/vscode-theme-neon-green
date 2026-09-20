// Top-navigation helpers — primary/overflow link split, status cluster.
// Moved verbatim from generate-landing.mjs.

import { escapeAttr, escapeHtml, sanitizeUrl, slugify } from './sanitize.mjs';

const NAV_PRIMARY = new Set([
  'Theme variants',
  'Screenshots',
  'Installation',
  'Warp terminal themes',
  'iTerm2 terminal themes',
  'Syntax showcase',
]);

const NAV_LABELS = {
  'Theme variants': 'Variants',
  'Screenshots': 'Screenshots',
  'Installation': 'Install',
  'Warp terminal themes': 'Warp',
  'iTerm2 terminal themes': 'iTerm',
  'Syntax showcase': 'Showcase',
};

export const buildNav = (markdown) => {
  const headings = markdown
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').trim());

  const primary = [];
  const overflow = [];
  for (const heading of headings) {
    if (NAV_PRIMARY.has(heading)) primary.push(heading);
    else overflow.push(heading);
  }

  const primaryHtml = primary
    .map(
      (heading) =>
        `<a class="topnav-link" href="#${slugify(heading)}">${escapeHtml(NAV_LABELS[heading] || heading)}</a>`,
    )
    .join('');

  const overflowHtml = overflow
    .map((heading) => `<a href="#${slugify(heading)}">${escapeHtml(heading)}</a>`)
    .join('');

  const overflowMenu = overflow.length
    ? `<div class="topnav-more" data-more>
        <button class="topnav-more-btn" type="button" aria-haspopup="true" aria-expanded="false">
          <span>More</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="topnav-more-panel" role="menu">${overflowHtml}</div>
      </div>`
    : '';

  return `${primaryHtml}${overflowMenu}`;
};

export const buildStatusCluster = ({ version, license, marketplaceUrl, repoUrl }) => `
<div class="topbar-status">
  <span class="status-chip status-version" title="Version">
    <span class="status-dot" aria-hidden="true"></span>v${escapeHtml(version)}
  </span>
  <span class="status-chip status-license" title="License">${escapeHtml(license)}</span>
  <a class="status-chip status-link" href="${escapeAttr(sanitizeUrl(marketplaceUrl))}" aria-label="View on VS Code Marketplace">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3 6 14h4v7l11-11h-4V3z"/></svg>
    <span>Marketplace</span>
  </a>
  <a class="status-chip status-link status-link-ghost" href="${escapeAttr(sanitizeUrl(repoUrl))}" aria-label="View GitHub repository">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.55 9.55 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
    <span>GitHub</span>
  </a>
</div>`;
