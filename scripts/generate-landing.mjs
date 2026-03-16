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
  if (filename.includes('midnight')) return 'Midnight';
  if (filename.includes('light')) return 'Light';
  return 'Dark Terminal';
};

const humanDescription = (filename) => {
  if (filename.includes('midnight')) return 'Softer blue-black base for a calmer late-night editor.';
  if (filename.includes('light')) return 'Clean daytime version with neon accents still doing the heavy lifting.';
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

const buildBadges = ({ version, license, publisher, marketplaceUrl, repoUrl }) => `
<div class="hero-badges">
  <a href="${marketplaceUrl}">Marketplace</a>
  <span>v${version}</span>
  <span>${license}</span>
  <span>by ${publisher}</span>
  <a href="${repoUrl}">GitHub repository</a>
</div>`;

const buildNav = (markdown) => {
  const headings = markdown
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').trim());

  return headings
    .map((heading) => `<a href="#${slugify(heading)}">${heading}</a>`)
    .join('');
};

const buildPage = async () => {
  const pkg = await readJson('package.json');
  const landingMarkdown = await readText('docs/landing.md');

  const themeFiles = [
    'themes/neon-green-color-theme.json',
    'themes/neon-green-midnight-color-theme.json',
    'themes/neon-green-light-color-theme.json',
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

  const seoDescription = 'Neon green VS Code theme with three variants: Dark Terminal, Midnight, and Light. Vivid accents and tuned syntax for long coding sessions.';
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
  <meta name="twitter:image:alt" content="Neon Green VS Code theme screenshot" />
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
      top: 16px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 14px 18px;
      margin-bottom: 28px;
      background: color-mix(in srgb, var(--panel) 82%, transparent);
      backdrop-filter: blur(20px);
      border: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
      border-radius: 999px;
      box-shadow: 0 20px 80px color-mix(in srgb, var(--shadow) 55%, transparent);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .brand-mark {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--panel) 86%, black));
      border: 1px solid color-mix(in srgb, var(--accent) 42%, transparent);
      display: grid;
      place-items: center;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent);
    }

    .brand-mark::before {
      content: "▣";
      color: var(--accent);
      font-size: 18px;
      line-height: 1;
    }

    .topnav {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 14px;
    }

    .topnav a {
      color: var(--muted);
      font-size: 14px;
      padding: 8px 10px;
      border-radius: 999px;
    }

    .topnav a:hover {
      color: var(--text);
      background: color-mix(in srgb, var(--selection) 95%, transparent);
    }

    .nav-toggle {
      display: none;
      background: none;
      border: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
      border-radius: 12px;
      padding: 8px;
      cursor: pointer;
      color: var(--muted);
      line-height: 0;
    }

    .nav-toggle svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .nav-toggle:hover {
      color: var(--text);
      background: color-mix(in srgb, var(--selection) 95%, transparent);
    }

    main {
      background: linear-gradient(180deg, color-mix(in srgb, var(--panel) 88%, transparent), color-mix(in srgb, var(--bg-soft) 92%, transparent));
      border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
      border-radius: 34px;
      overflow: hidden;
      box-shadow: 0 30px 120px color-mix(in srgb, var(--shadow) 72%, transparent);
    }

    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 28px 28px 0;
    }

    .hero-badges > * {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface) 82%, transparent);
      border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
      color: var(--muted);
      font-size: 13px;
      letter-spacing: 0.01em;
    }

    .markdown-body {
      padding: 24px 28px 42px;
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
        border-radius: 24px;
        padding: 16px;
        flex-wrap: wrap;
      }
      .brand {
        flex: 1;
      }
      .nav-toggle {
        display: inline-flex;
      }
      .topnav {
        display: none;
        width: 100%;
        justify-content: flex-start;
        padding-top: 12px;
        border-top: 1px solid color-mix(in srgb, var(--line) 60%, transparent);
        margin-top: 12px;
      }
      .topnav.open {
        display: flex;
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
      .hero-badges,
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
  </style>
</head>
<body>
  <div class="site-shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark"></div>
        <div>
          <div>${pkg.displayName}</div>
        </div>
      </div>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <nav class="topnav">${navHtml}</nav>
    </header>

    <main>
      ${buildBadges({
        version: pkg.version,
        license: pkg.license,
        publisher: pkg.publisher,
        marketplaceUrl,
        repoUrl,
      })}
      <article class="markdown-body">
        ${contentHtml}
      </article>
    </main>
  </div>

  <footer>
    <span>Generated from <code>docs/landing.md</code> using the Neon Green theme JSON for syntax highlighting.</span>
    <span><a href="${repoUrl}">GitHub</a> · <a href="${marketplaceUrl}">Marketplace</a></span>
  </footer>
  <script>
    document.querySelector('.nav-toggle').addEventListener('click', function () {
      var nav = document.querySelector('.topnav');
      var open = nav.classList.toggle('open');
      this.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.topnav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.querySelector('.topnav').classList.remove('open');
        document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
      });
    });
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
