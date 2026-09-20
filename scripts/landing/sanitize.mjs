// HTML/attribute/URL/CSS/JSON-LD sanitizers and slugify — security-critical
// helpers shared by every landing-page module. Moved verbatim from
// generate-landing.mjs; all interpolation in the page must route through them.

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}<>]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Escape a value before it lands in HTML text or a double-quoted attribute —
// every interpolated attribute in the page template is double-quoted, so the
// same five-character set covers both contexts.
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);

export const escapeAttr = escapeHtml;

const CSS_HEX_COLOR = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const CSS_NAMED_COLOR = /^[a-zA-Z]{3,20}$/;
const CSS_FUNCTIONAL_COLOR =
  /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(\s*[0-9a-zA-Z.,%\s/-]+\s*\)$/i;

// Allowlist a theme color before it is interpolated into a CSS declaration or
// a style attribute. Anything outside the allowlist falls back so `;`, `}`,
// `<` or quotes can never break out of the stylesheet/attribute.
export const sanitizeCssColor = (value, fallback = '#000000') => {
  const text = String(value ?? '').trim();
  if (CSS_HEX_COLOR.test(text) || CSS_NAMED_COLOR.test(text) || CSS_FUNCTIONAL_COLOR.test(text)) {
    return text;
  }
  return fallback;
};

// Allowlist link/image targets: http(s), mailto, fragments and relative
// paths. Any other scheme (javascript:, data:, vbscript:, …) collapses to the
// fallback. Control characters and spaces are stripped for the scheme check
// only, so `java\tscript:` cannot slip past.
export const sanitizeUrl = (value, fallback = '#') => {
  const text = String(value ?? '').trim();
  if (!text) return fallback;
  const collapsed = text.replace(/[\u0000-\u0020]+/g, '');
  const scheme = collapsed.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !/^(?:https?|mailto)$/i.test(scheme[1])) return fallback;
  return text;
};

// JSON-LD must be real JSON, never interpolated markup: serialize the object
// and escape `<` so a literal `</script>` inside a value cannot close the tag.
export const serializeJsonLd = (value) => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
