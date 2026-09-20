// Landing-page stylesheet — the palette variables are extracted from the
// dark theme and every value passes through sanitizeCssColor before it lands
// in a declaration. Moved verbatim from generate-landing.mjs's buildPage.

import { sanitizeCssColor } from './sanitize.mjs';

export const themeCssVars = (theme) => ({
  bg: sanitizeCssColor(theme.colors['editor.background'], '#0e0e1a'),
  bgSoft: sanitizeCssColor(theme.colors['sideBar.background'], '#0b0b16'),
  panel: sanitizeCssColor(theme.colors['panel.background'], '#111120'),
  surface: sanitizeCssColor(theme.colors['tab.activeBackground'], '#131322'),
  surfaceMuted: sanitizeCssColor(theme.colors['input.background'], '#111120'),
  line: sanitizeCssColor(theme.colors['panel.border'], '#1e1e30'),
  text: sanitizeCssColor(theme.colors['editor.foreground'], '#d5dce8'),
  muted: sanitizeCssColor(theme.colors['descriptionForeground'], '#7a8599'),
  accent: sanitizeCssColor(theme.colors['activityBar.foreground'], '#39ff14'),
  accentStrong: sanitizeCssColor(theme.colors['tab.activeForeground'], '#4dff4d'),
  selection: sanitizeCssColor(theme.colors['editor.selectionBackground'], '#39ff1425'),
  warning: sanitizeCssColor(theme.colors['terminal.ansiYellow'], '#ffb347'),
  danger: sanitizeCssColor(theme.colors['errorForeground'], '#ff5555'),
  info: sanitizeCssColor(theme.colors['terminal.ansiBlue'], '#82aaff'),
  shadow: sanitizeCssColor(theme.colors['widget.shadow'], '#00000066'),
});

export const buildCss = ({ bg, bgSoft, panel, surface, surfaceMuted, line, text, muted, accent, accentStrong, selection, warning, danger, info, shadow }) => `
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
  `;
