// Full-document HTML assembly: head meta, JSON-LD, stylesheet, topbar/body
// markup and the inline nav script. Moved verbatim from buildPage.

import { buildStatusCluster } from './nav.mjs';
import { escapeAttr, escapeHtml, sanitizeUrl, serializeJsonLd } from './sanitize.mjs';

export const buildHtml = ({ pkg, navHtml, contentHtml, css, repoUrl, marketplaceUrl }) => {
  const seoDescription = '13 VS Code themes in 8 families: Neon Green (Dark Terminal, Midnight, Light, Liquid Glass), Soft Glow (Dark, Light), OpenCode (Dark), Hermes Agent (Dark), Aura (Dark), Omarchy (Dark), Synthwave \'84 (Dark), and Zed (Dark, Light). Vivid accents, warm pastels, and a minimal flat-black canvas for long coding sessions.';
  const siteUrl = 'https://luongnv89.github.io/vscode-theme-neon-green';
  const ogImage = `${siteUrl}/screenshot-dark.png`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: pkg.displayName,
    description: seoDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    url: `${siteUrl}/`,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: pkg.author?.name,
      url: pkg.author?.url,
    },
    license: 'https://opensource.org/licenses/MIT',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    downloadUrl: marketplaceUrl,
    softwareVersion: pkg.version,
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pkg.displayName)}</title>
  <meta name="description" content="${escapeAttr(seoDescription)}" />
  <link rel="canonical" href="${escapeAttr(siteUrl)}/" />
  <meta property="og:title" content="${escapeAttr(pkg.displayName)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeAttr(siteUrl)}/" />
  <meta property="og:image" content="${escapeAttr(ogImage)}" />
  <meta property="og:description" content="${escapeAttr(seoDescription)}" />
  <meta property="og:site_name" content="${escapeAttr(pkg.displayName)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(pkg.displayName)}" />
  <meta name="twitter:description" content="${escapeAttr(seoDescription)}" />
  <meta name="twitter:image" content="${escapeAttr(ogImage)}" />
  <meta name="twitter:image:alt" content="Neon Green Theme Collection screenshot" />
  <script type="application/ld+json">
${serializeJsonLd(jsonLd).replace(/^/gm, '  ')}
  </script>
  <style>${css}</style>
</head>
<body>
  <div class="site-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="${escapeAttr(pkg.displayName)} home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-word">
          <span>NG</span><span class="brand-slash">//</span><span class="brand-long">THEMES</span>
        </span>
        <span class="brand-caret" aria-hidden="true"></span>
      </a>
      <nav class="topnav" id="primary-nav" aria-label="Primary">${navHtml}</nav>
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
    <span><a href="${escapeAttr(sanitizeUrl(repoUrl))}">GitHub</a> · <a href="${escapeAttr(sanitizeUrl(marketplaceUrl))}">Marketplace</a></span>
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
};
