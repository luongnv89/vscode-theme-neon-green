// Shiki highlighter setup and the marked renderer plumbing — moved verbatim
// from generate-landing.mjs's buildPage.

import { marked } from 'marked';
import { createHighlighter } from 'shiki';

import { escapeAttr, sanitizeUrl, slugify } from './sanitize.mjs';

const SHIKI_LANGS = ['text', 'markdown', 'ts', 'js', 'python', 'rust', 'json', 'bash', 'html', 'css'];

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

export const createLandingHighlighter = (themes) =>
  createHighlighter({
    themes: themes.map((theme) => ({ ...theme })),
    langs: SHIKI_LANGS,
  });

export const renderMarkdown = async (markdown, { highlighter, themeName }) => {
  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens);
        const raw = token.text || text.replace(/<[^>]+>/g, '');
        const id = slugify(raw);
        return `<h${token.depth} id="${escapeAttr(id)}">${text}</h${token.depth}>`;
      },
      code(token) {
        const lang = normalizeLang(token.lang);
        const code = token.text.replace(/\n$/, '');
        try {
          return highlighter.codeToHtml(code, {
            lang,
            theme: themeName,
          });
        } catch {
          return highlighter.codeToHtml(code, {
            lang: 'text',
            theme: themeName,
          });
        }
      },
      link(token) {
        const title = token.title ? ` title="${escapeAttr(token.title)}"` : '';
        const href = sanitizeUrl(token.href || '#');
        const text = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//.test(href);
        const target = external ? ' target="_blank" rel="noreferrer"' : '';
        return `<a href="${escapeAttr(href)}"${title}${target}>${text}</a>`;
      },
      image: (() => {
        let imageIndex = 0;
        return (token) => {
          const title = token.title ? ` title="${escapeAttr(token.title)}"` : '';
          const alt = token.text || '';
          const href = sanitizeUrl(token.href || '');
          const isFirst = imageIndex === 0;
          imageIndex++;
          const loading = isFirst ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
          return `<img src="${escapeAttr(href)}" alt="${escapeAttr(alt)}"${title}${loading} width="1200" height="800" />`;
        };
      })(),
    },
  });

  return marked.parse(markdown);
};
