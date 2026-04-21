import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

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

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}<>]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeLang = (lang) => {
  if (!lang) return 'text';
  const value = lang.toLowerCase();
  if (['ts', 'typescript'].includes(value)) return 'ts';
  if (['js', 'javascript'].includes(value)) return 'js';
  if (['py', 'python'].includes(value)) return 'python';
  if (['rs', 'rust'].includes(value)) return 'rust';
  if (['sh', 'bash', 'shell', 'zsh'].includes(value)) return 'bash';
  if (['json'].includes(value)) return 'json';
  if (['md', 'markdown'].includes(value)) return 'markdown';
  if (['html'].includes(value)) return 'html';
  if (['css'].includes(value)) return 'css';
  return value;
};

const themeLabelFromFilename = (filename) => {
  if (filename.includes('soft-glow-dark')) return 'Soft Glow — Dark';
  if (filename.includes('soft-glow-light')) return 'Soft Glow — Light';
  if (filename.includes('liquid-glass')) return 'Liquid Glass';
  if (filename.includes('midnight')) return 'Midnight';
  if (filename.includes('neon-green-light')) return 'Light';
  return 'Dark Terminal';
};

const humanDescription = (filename) => {
  if (filename.includes('soft-glow-dark')) return 'Warm, cozy dark theme with amber accents and desaturated syntax.';
  if (filename.includes('soft-glow-light')) return 'Gentle cream background with muted jewel-tone highlights.';
  if (filename.includes('liquid-glass')) return 'Modern translucent feel with glass-like editor surfaces.';
  if (filename.includes('midnight')) return 'Softer blue-black base for a calmer late-night editor.';
  if (filename.includes('neon-green-light')) return 'Clean daytime version with neon accents still doing the heavy lifting.';
  return 'Classic hacker-terminal energy with deep contrast and sharp green accents.';
};

const buildVariantCards = (themes) => {
  return `
<div class="variant-grid">
${themes
  .map((theme) => {
    const bg = theme.colors['editor.background'] || theme.colors.background || '#111111';
    const panel = theme.colors['sideBar.background'] || theme.colors['panel.background'] || '#181818';
    const surface = theme.colors['tab.activeBackground'] || theme.colors['input.background'] || '#202020';
    const accent =
      theme.colors['activityBar.foreground'] ||
      theme.colors['editorCursor.foreground'] ||
      theme.colors['textLink.foreground'] ||
      '#39ff14';
    const text = theme.colors['editor.foreground'] || theme.colors.foreground || '#e6e6e6';
    const muted = theme.colors['descriptionForeground'] || theme.colors['sideBar.foreground'] || '#8c8c8c';
    const line = theme.colors['panel.border'] || theme.colors['editorGroup.border'] || '#2a2a2a';
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
      <h3>${label}</h3>
      <p>${humanDescription(theme.sourcePath)}</p>
      <dl>
        <div><dt>Background</dt><dd><code>${bg}</code></dd></div>
        <div><dt>Accent</dt><dd><code>${accent}</code></dd></div>
      </dl>
    </div>
  </article>`;
  })
  .join('\n')}
</div>`;
};

const buildPaletteSwatches = (theme) => {
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
    <div class="swatch-chip" style="--chip:${value}"></div>
    <div class="swatch-copy">
      <strong>${label}</strong>
      <code>${value}</code>
    </div>
  </div>`,
  )
  .join('\n')}
</div>`;
};

const NAV_PRIMARY = new Set([
  'Theme variants',
  'Installation',
  'Warp terminal themes',
  'iTerm2 terminal themes',
  'Syntax showcase',
]);

const NAV_LABELS = {
  'Theme variants': 'Variants',
  'Installation': 'Install',
  'Warp terminal themes': 'Warp',
  'iTerm2 terminal themes': 'iTerm',
  'Syntax showcase': 'Showcase',
};

const buildNav = (markdown) => {
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
        `<a class="topnav-link" href="#${slugify(heading)}">${NAV_LABELS[heading] || heading}</a>`,
    )
    .join('');

  const overflowHtml = overflow
    .map((heading) => `<a href="#${slugify(heading)}">${heading}</a>`)
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

const buildStatusCluster = ({ version, license, marketplaceUrl, repoUrl }) => `
<div class="topbar-status">
  <span class="status-chip status-version" title="Version">
    <span class="status-dot" aria-hidden="true"></span>v${version}
  </span>
  <span class="status-chip status-license" title="License">${license}</span>
  <a class="status-chip status-link" href="${marketplaceUrl}" aria-label="View on VS Code Marketplace">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3 6 14h4v7l11-11h-4V3z"/></svg>
    <span>Marketplace</span>
  </a>
  <a class="status-chip status-link status-link-ghost" href="${repoUrl}" aria-label="View GitHub repository">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.55 9.55 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
    <span>GitHub</span>
  </a>
</div>`;

const buildPage = async () => {
  const pkg = await readJson('package.json');
  const landingMarkdown = await readText('docs/landing.md');

  const themeFiles = [
    'themes/neon-green-color-theme.json',
    'themes/neon-green-midnight-color-theme.json',
    'themes/neon-green-light-color-theme.json',
    'themes/neon-green-liquid-glass-color-theme.json',
    'themes/soft-glow-dark-color-theme.json',
    'themes/soft-glow-light-color-theme.json',
  ];

  const themes = await Promise.all(
    themeFiles.map(async (sourcePath) => ({
      ...(await readJson(sourcePath)),
      sourcePath,
    })),
  );

  const darkTheme = themes[0];
  const darkThemeName = darkTheme.name;

  const highlighter = await createHighlighter({
    themes: themes.map((theme) => ({ ...theme })),
    langs: ['text', 'markdown', 'ts', 'js', 'python', 'rust', 'json', 'bash', 'html', 'css'],
  });

  const markdownWithInjectedBlocks = landingMarkdown
    .replace('<!-- VARIANT_CARDS -->', buildVariantCards(themes))
    .replace('<!-- PALETTE_SWATCHES -->', buildPaletteSwatches(darkTheme));

  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens);
        const raw = token.text || text.replace(/<[^>]+>/g, '');
        const id = slugify(raw);
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
      },
      code(token) {
        const lang = normalizeLang(token.lang);
        const code = token.text.replace(/\n$/, '');
        try {
          return highlighter.codeToHtml(code, {
            lang,
            theme: darkThemeName,
          });
        } catch {
          return highlighter.codeToHtml(code, {
            lang: 'text',
            theme: darkThemeName,
          });
        }
      },
      link(token) {
        const title = token.title ? ` title="${token.title}"` : '';
        const href = token.href || '#';
        const text = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//.test(href);
        const target = external ? ' target="_blank" rel="noreferrer"' : '';
        return `<a href="${href}"${title}${target}>${text}</a>`;
      },
      image: (() => {
        let imageIndex = 0;
        return (token) => {
          const title = token.title ? ` title="${token.title}"` : '';
          const alt = token.text || '';
          const href = token.href || '';
          const isFirst = imageIndex === 0;
          imageIndex++;
          const loading = isFirst ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
          return `<img src="${href}" alt="${alt}"${title}${loading} width="1200" height="800" />`;
        };
      })(),
    },
  });

  const contentHtml = await marked.parse(markdownWithInjectedBlocks);

  const repoUrl = pkg.repository?.url?.replace(/\.git$/, '') || 'https://github.com/luongnv89/vscode-theme-neon-green';
  const marketplaceUrl = `https://marketplace.visualstudio.com/items?itemName=${pkg.publisher}.${pkg.name}`;
  const navHtml = buildNav(markdownWithInjectedBlocks);

  const bg = darkTheme.colors['editor.background'] || '#0e0e1a';
  const bgSoft = darkTheme.colors['sideBar.background'] || '#0b0b16';
  const panel = darkTheme.colors['panel.background'] || '#111120';
  const surface = darkTheme.colors['tab.activeBackground'] || '#131322';
  const surfaceMuted = darkTheme.colors['input.background'] || '#111120';
  const line = darkTheme.colors['panel.border'] || '#1e1e30';
  const text = darkTheme.colors['editor.foreground'] || '#d5dce8';
  const muted = darkTheme.colors['descriptionForeground'] || '#7a8599';
  const accent = darkTheme.colors['activityBar.foreground'] || '#39ff14';
  const accentStrong = darkTheme.colors['tab.activeForeground'] || '#4dff4d';
  const selection = darkTheme.colors['editor.selectionBackground'] || '#39ff1425';
  const warning = darkTheme.colors['terminal.ansiYellow'] || '#ffb347';
  const danger = darkTheme.colors['errorForeground'] || '#ff5555';
  const info = darkTheme.colors['terminal.ansiBlue'] || '#82aaff';
  const shadow = darkTheme.colors['widget.shadow'] || '#00000066';

  const seoDescription = '6 VS Code themes in 2 families: Neon Green (Dark Terminal, Midnight, Light, Liquid Glass) and Soft Glow (Dark, Light). Vivid accents and warm pastels for long coding sessions.';
  const siteUrl = 'https://luongnv89.github.io/vscode-theme-neon-green';
  const ogImage = `${siteUrl}/screenshot-dark.png`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pkg.displayName}</title>
  <meta name="description" content="${seoDescription}" />
  <link rel="canonical" href="${siteUrl}/" />
  <meta property="og:title" content="${pkg.displayName}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}/" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:description" content="${seoDescription}" />
  <meta property="og:site_name" content="${pkg.displayName}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pkg.displayName}" />
  <meta name="twitter:description" content="${seoDescription}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:image:alt" content="Neon Green Theme Collection screenshot" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${pkg.displayName}",
    "description": "${seoDescription}",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Windows, macOS, Linux",
    "url": "${siteUrl}/",
    "image": "${ogImage}",
    "author": {
      "@type": "Person",
      "name": "${pkg.author.name}",
      "url": "${pkg.author.url}"
    },
    "license": "https://opensource.org/licenses/MIT",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "downloadUrl": "${marketplaceUrl}",
    "softwareVersion": "${pkg.version}"
  }
  </script>
  <style>
    :root {
      --bg: ${bg};
      --bg-soft: ${bgSoft};
      --panel: ${panel};
      --surface: ${surface};
      --surface-muted: ${surfaceMuted};
      --line: ${line};
      --text: ${text};
      --muted: ${muted};
      --accent: ${accent};
      --accent-strong: ${accentStrong};
      --selection: ${selection};
      --warning: ${warning};
      --danger: ${danger};
      --info: ${info};
      --shadow: ${shadow};
      --radius: 24px;
      --radius-sm: 16px;
      --content-width: 1180px;
      --measure: 72ch;
      --mono: "Iosevka", "IBM Plex Mono", "SFMono-Regular", "JetBrains Mono", ui-monospace, monospace;
      --sans: "Satoshi", "Avenir Next", "IBM Plex Sans", "Segoe UI", sans-serif;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--text);
      background:
        radial-gradient(circle at top, color-mix(in srgb, var(--accent) 12%, transparent), transparent 26%),
        linear-gradient(180deg, color-mix(in srgb, var(--bg-soft) 65%, black) 0%, var(--bg) 100%);
      font-family: var(--sans);
      line-height: 1.68;
      min-height: 100vh;
    }

    a {
      color: var(--accent-strong);
      text-decoration: none;
    }
    a:hover { color: var(--accent); }

    code, pre, .shiki { font-family: var(--mono) !important; }

    .site-shell {
      width: min(calc(100% - 32px), var(--content-width));
      margin: 0 auto;
      padding: 24px 0 80px;
    }

    .topbar {
      position: sticky;
      top: 14px;
      z-index: 20;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 20px;
      padding: 10px 14px 10px 16px;
      margin-bottom: 28px;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--panel) 94%, transparent) 0%,
          color-mix(in srgb, var(--bg-soft) 90%, transparent) 100%);
      backdrop-filter: blur(18px) saturate(140%);
      -webkit-backdrop-filter: blur(18px) saturate(140%);
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      border-radius: 14px;
      box-shadow:
        0 1px 0 color-mix(in srgb, var(--accent) 6%, transparent) inset,
        0 20px 60px color-mix(in srgb, var(--shadow) 50%, transparent);
    }

    .topbar::before {
      content: "";
      position: absolute;
      left: 20px;
      right: 20px;
      top: 0;
      height: 1px;
      pointer-events: none;
      background: linear-gradient(90deg,
        transparent,
        color-mix(in srgb, var(--accent) 60%, transparent),
        transparent);
      opacity: 0.7;
    }

    .topbar { position: sticky; overflow: visible; }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 4px 2px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 14px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .brand:hover { color: var(--text); }

    .brand-mark {
      position: relative;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--accent) 18%, transparent),
          color-mix(in srgb, var(--bg) 94%, black));
      border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
      border-radius: 8px;
      box-shadow:
        inset 0 0 14px color-mix(in srgb, var(--accent) 14%, transparent),
        0 0 0 1px color-mix(in srgb, var(--bg) 82%, transparent);
      font-family: var(--mono);
      font-weight: 700;
      font-size: 13px;
      color: var(--accent);
      text-shadow: 0 0 10px color-mix(in srgb, var(--accent) 60%, transparent);
    }

    .brand-mark::before {
      content: "NG";
      letter-spacing: 0.02em;
    }

    .brand-word {
      display: inline-flex;
      align-items: baseline;
      gap: 2px;
      color: var(--text);
      font-weight: 700;
    }

    .brand-word .brand-slash {
      color: var(--accent);
      opacity: 0.85;
    }

    .brand-caret {
      display: inline-block;
      width: 7px;
      height: 14px;
      margin-left: 2px;
      background: var(--accent);
      transform: translateY(1px);
      box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 70%, transparent);
      animation: brand-blink 1.15s steps(2, end) infinite;
    }

    @keyframes brand-blink {
      0%, 55% { opacity: 1; }
      60%, 100% { opacity: 0; }
    }

    .topnav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-family: var(--mono);
      font-size: 12.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .topnav a,
    .topnav-more-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      color: var(--muted);
      border-radius: 8px;
      transition: color 160ms ease;
    }

    .topnav a::after,
    .topnav-more-btn::after {
      content: "";
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 4px;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 240ms cubic-bezier(.2,.7,.2,1);
      box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent);
    }

    .topnav a:hover,
    .topnav-more-btn:hover,
    .topnav-more[data-open="true"] .topnav-more-btn {
      color: var(--text);
    }

    .topnav a:hover::after,
    .topnav-more-btn:hover::after,
    .topnav-more[data-open="true"] .topnav-more-btn::after {
      transform: scaleX(1);
    }

    .topnav-more {
      position: relative;
    }

    .topnav-more-btn {
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
    }

    .topnav-more-btn svg {
      width: 12px;
      height: 12px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 180ms ease;
    }

    .topnav-more[data-open="true"] .topnav-more-btn svg {
      transform: rotate(180deg);
    }

    .topnav-more-panel {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 240px;
      padding: 8px;
      display: grid;
      gap: 2px;
      background: color-mix(in srgb, var(--panel) 96%, black);
      border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
      border-radius: 12px;
      box-shadow:
        0 20px 50px color-mix(in srgb, var(--shadow) 70%, transparent),
        inset 0 1px 0 color-mix(in srgb, var(--accent) 10%, transparent);
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
      pointer-events: none;
      transition: opacity 160ms ease, transform 160ms ease;
      z-index: 30;
    }

    .topnav-more[data-open="true"] .topnav-more-panel {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .topnav-more-panel a {
      padding: 10px 12px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 12.5px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 8px;
      border: 1px solid transparent;
    }

    .topnav-more-panel a::after { display: none; }

    .topnav-more-panel a:hover {
      color: var(--text);
      background: color-mix(in srgb, var(--accent) 8%, transparent);
      border-color: color-mix(in srgb, var(--accent) 24%, transparent);
    }

    .topbar-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--mono);
      font-size: 11.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      color: var(--muted);
      background: color-mix(in srgb, var(--bg-soft) 60%, transparent);
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      border-radius: 7px;
      transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
    }

    .status-version {
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 32%, transparent);
      background: color-mix(in srgb, var(--accent) 8%, transparent);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
      animation: status-pulse 1.8s ease-in-out infinite;
    }

    @keyframes status-pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.45; }
    }

    a.status-link {
      color: var(--muted);
    }
    a.status-link:hover {
      color: var(--text);
      border-color: color-mix(in srgb, var(--accent) 55%, transparent);
      background: color-mix(in srgb, var(--accent) 10%, transparent);
    }

    .status-link svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }

    .nav-toggle {
      display: none;
      background: none;
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      border-radius: 8px;
      padding: 7px;
      cursor: pointer;
      color: var(--muted);
      line-height: 0;
    }

    .nav-toggle svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .nav-toggle:hover {
      color: var(--accent);
      border-color: color-mix(in srgb, var(--accent) 45%, transparent);
    }

    main {
      background: linear-gradient(180deg, color-mix(in srgb, var(--panel) 88%, transparent), color-mix(in srgb, var(--bg-soft) 92%, transparent));
      border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
      border-radius: 34px;
      overflow: hidden;
      box-shadow: 0 30px 120px color-mix(in srgb, var(--shadow) 72%, transparent);
    }

    .markdown-body {
      padding: 38px 28px 42px;
    }

    .markdown-body > h1:first-child {
      margin: 12px 0 18px;
      max-width: 12ch;
      font-size: clamp(3rem, 10vw, 5.6rem);
      line-height: 0.92;
      letter-spacing: -0.05em;
      text-transform: uppercase;
      color: var(--text);
      text-wrap: balance;
    }

    .markdown-body > p:first-of-type {
      max-width: 60ch;
      margin: 0 0 18px;
      font-size: clamp(1.12rem, 2vw, 1.35rem);
      color: color-mix(in srgb, var(--text) 88%, var(--muted));
    }

    .markdown-body > blockquote:first-of-type {
      margin: 0 0 24px;
      padding: 18px 22px;
      max-width: 64ch;
      border-left: 3px solid var(--accent);
      background: linear-gradient(180deg, color-mix(in srgb, var(--selection) 72%, transparent), color-mix(in srgb, var(--surface) 64%, transparent));
      border-radius: 18px;
      color: var(--text);
      font-size: 1rem;
    }

    .markdown-body > p:nth-of-type(2) {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 0 0 30px;
    }

    .markdown-body > p:nth-of-type(2) a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      background: color-mix(in srgb, var(--surface) 72%, transparent);
      color: var(--text);
      font-weight: 700;
    }

    .markdown-body > p:nth-of-type(2) a:first-child {
      background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--surface) 88%, transparent));
      color: var(--accent-strong);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);
    }

    .markdown-body > hr:first-of-type {
      display: none;
    }

    .markdown-body > :not(h1):not(p):not(blockquote):not(hr):not(:nth-of-type(2)) {
      max-width: 100%;
    }

    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4 {
      scroll-margin-top: 110px;
      line-height: 1.08;
      letter-spacing: -0.03em;
      margin-top: 54px;
      margin-bottom: 16px;
    }

    .markdown-body h2 {
      font-size: clamp(2rem, 4vw, 3.15rem);
      max-width: 16ch;
    }

    .markdown-body h3 {
      font-size: clamp(1.35rem, 2.8vw, 1.9rem);
    }

    .markdown-body h4 {
      font-size: 1.05rem;
      color: var(--accent-strong);
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .markdown-body p,
    .markdown-body ul,
    .markdown-body ol,
    .markdown-body blockquote,
    .markdown-body table,
    .markdown-body .shiki,
    .markdown-body pre,
    .markdown-body img {
      max-width: var(--measure);
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-left: 1.35rem;
    }

    .markdown-body li + li {
      margin-top: 0.45rem;
    }

    .markdown-body strong {
      color: var(--accent-strong);
      font-weight: 800;
    }

    .markdown-body em {
      color: color-mix(in srgb, var(--text) 92%, var(--info));
    }

    .markdown-body code:not(pre code) {
      display: inline-block;
      padding: 0.18rem 0.48rem;
      border-radius: 10px;
      background: color-mix(in srgb, var(--surface) 88%, transparent);
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      color: var(--accent-strong);
      font-size: 0.92em;
    }

    .markdown-body hr {
      border: 0;
      height: 1px;
      margin: 42px 0;
      background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent);
    }

    .markdown-body img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 22px;
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      background: color-mix(in srgb, var(--surface) 58%, transparent);
      box-shadow: 0 22px 60px color-mix(in srgb, var(--shadow) 52%, transparent);
    }

    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 18px;
      border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
      background: color-mix(in srgb, var(--surface) 56%, transparent);
      margin: 16px 0 26px;
    }

    .markdown-body th,
    .markdown-body td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    }

    .markdown-body th {
      color: var(--accent-strong);
      background: color-mix(in srgb, var(--surface) 82%, transparent);
    }

    .markdown-body blockquote {
      margin: 18px 0;
      padding: 16px 20px;
      border-left: 3px solid color-mix(in srgb, var(--accent) 88%, transparent);
      background: color-mix(in srgb, var(--surface) 72%, transparent);
      border-radius: 16px;
      color: color-mix(in srgb, var(--text) 92%, var(--muted));
    }

    .shiki {
      width: 100%;
      overflow: auto;
      padding: 22px 24px !important;
      margin: 18px 0 28px !important;
      border-radius: 22px;
      border: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
      background: color-mix(in srgb, var(--bg) 78%, black) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 8%, transparent);
    }

    .shiki code {
      counter-reset: step;
      display: grid;
      gap: 2px;
      min-width: 100%;
    }

    .variant-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      max-width: 100%;
    }

    .variant-card,
    .swatch-card {
      border-radius: 24px;
      border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
      background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 78%, transparent), color-mix(in srgb, var(--panel) 92%, transparent));
      box-shadow: 0 18px 42px color-mix(in srgb, var(--shadow) 42%, transparent);
    }

    .variant-card {
      padding: 16px;
    }

    .variant-window {
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--variant-line) 85%, transparent);
      background: var(--variant-bg);
      margin-bottom: 16px;
    }

    .variant-window-bar {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 12px 14px;
      background: color-mix(in srgb, var(--variant-panel) 90%, black);
      border-bottom: 1px solid color-mix(in srgb, var(--variant-line) 86%, transparent);
    }

    .variant-window-bar span {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--variant-accent) 24%, white);
      opacity: 0.8;
    }

    .variant-window-body {
      display: grid;
      grid-template-columns: 70px 1fr;
      min-height: 190px;
    }

    .variant-sidebar {
      background: var(--variant-panel);
      border-right: 1px solid color-mix(in srgb, var(--variant-line) 76%, transparent);
    }

    .variant-editor {
      padding: 18px;
      background: var(--variant-bg);
    }

    .variant-line {
      height: 11px;
      border-radius: 999px;
      margin-bottom: 12px;
      background: color-mix(in srgb, var(--variant-text) 16%, transparent);
      position: relative;
      overflow: hidden;
    }

    .variant-line::after {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 38%;
      background: color-mix(in srgb, var(--variant-accent) 66%, transparent);
      opacity: 0.7;
    }

    .variant-line-2::after { width: 62%; }
    .variant-line-3::after { width: 28%; }
    .variant-line-4::after { width: 54%; }

    .variant-meta h3 {
      margin: 0 0 8px;
      font-size: 1.2rem;
    }

    .variant-meta p {
      margin: 0 0 12px;
      color: var(--muted);
      max-width: none;
    }

    .variant-meta dl {
      display: grid;
      gap: 10px;
      margin: 0;
    }

    .variant-meta dl div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding-top: 10px;
      border-top: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    }

    .variant-meta dt {
      color: var(--muted);
    }

    .swatch-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      max-width: 100%;
    }

    .swatch-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
    }

    .swatch-chip {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      border: 1px solid color-mix(in srgb, white 8%, var(--line));
      background: var(--chip);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, white 8%, transparent);
      flex: 0 0 auto;
    }

    .swatch-copy {
      display: grid;
      gap: 4px;
    }

    .swatch-copy strong {
      color: var(--text);
    }

    footer {
      width: min(calc(100% - 32px), var(--content-width));
      margin: 16px auto 32px;
      padding: 0 6px;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      gap: 18px;
      font-size: 14px;
    }

    @media (max-width: 980px) {
      .topbar {
        grid-template-columns: auto auto auto;
        padding: 10px 12px;
      }
      .nav-toggle {
        display: inline-flex;
        order: 3;
        justify-self: end;
      }
      .topbar-status {
        order: 2;
        justify-self: end;
      }
      .topnav {
        display: none;
        grid-column: 1 / -1;
        order: 4;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 2px;
        padding: 10px 4px 4px;
        margin-top: 6px;
        border-top: 1px solid color-mix(in srgb, var(--line) 55%, transparent);
      }
      .topnav.open {
        display: flex;
      }
      .topnav-more {
        flex: 1 1 100%;
      }
      .topnav-more-panel {
        position: static;
        min-width: 0;
        opacity: 1;
        transform: none;
        pointer-events: auto;
        display: none;
        background: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .topnav-more[data-open="true"] .topnav-more-panel {
        display: grid;
      }
      .variant-grid,
      .swatch-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .site-shell {
        width: min(calc(100% - 18px), var(--content-width));
        padding-top: 12px;
      }
      .topbar-status .status-chip span { display: none; }
      .topbar-status .status-chip.status-version span { display: inline; }
      .topbar-status .status-chip.status-license { display: none; }
      .markdown-body {
        padding-left: 18px;
        padding-right: 18px;
      }
      .markdown-body > h1:first-child {
        max-width: 8.5ch;
      }
      footer {
        flex-direction: column;
      }
    }

    @media (max-width: 460px) {
      .brand-word .brand-long { display: none; }
      .topbar { gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="site-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="${pkg.displayName} home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-word">
          <span>NG</span><span class="brand-slash">//</span><span class="brand-long">THEMES</span>
        </span>
        <span class="brand-caret" aria-hidden="true"></span>
      </a>
      <nav class="topnav" aria-label="Primary">${navHtml}</nav>
      ${buildStatusCluster({
        version: pkg.version,
        license: pkg.license,
        marketplaceUrl,
        repoUrl,
      })}
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-nav">
        <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </header>

    <main id="top">
      <article class="markdown-body">
        ${contentHtml}
      </article>
    </main>
  </div>

  <footer>
    <span>Generated from <code>docs/landing.md</code> using theme JSON for syntax highlighting.</span>
    <span><a href="${repoUrl}">GitHub</a> · <a href="${marketplaceUrl}">Marketplace</a></span>
  </footer>
  <script>
    (function () {
      var nav = document.querySelector('.topnav');
      var toggle = document.querySelector('.nav-toggle');
      var more = document.querySelector('.topnav-more');
      var moreBtn = more ? more.querySelector('.topnav-more-btn') : null;

      function setMore(state) {
        if (!more) return;
        more.setAttribute('data-open', state ? 'true' : 'false');
        if (moreBtn) moreBtn.setAttribute('aria-expanded', state ? 'true' : 'false');
      }

      function closeMobile() {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        setMore(false);
      }

      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) setMore(false);
      });

      if (more && moreBtn) {
        moreBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var open = more.getAttribute('data-open') !== 'true';
          setMore(open);
        });
        document.addEventListener('click', function (e) {
          if (!more.contains(e.target)) setMore(false);
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') setMore(false);
        });
      }

      document.querySelectorAll('.topnav a').forEach(function (a) {
        a.addEventListener('click', closeMobile);
      });
    })();
  </script>
</body>
</html>`;

  const cleaned = html.replace(/[^\S\n]+$/gm, '').replace(/\n*$/, '\n');
  await fs.writeFile(path.join(repoRoot, 'docs', 'index.html'), cleaned, 'utf8');
  console.log('Generated docs/index.html');
};

buildPage().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
