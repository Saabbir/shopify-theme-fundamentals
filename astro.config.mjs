// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';

const base = '/shopify-theme-fundamentals';

/** Prefix root-relative hrefs with Astro `base` (Starlight does not do this for Markdown). */
function rehypeBaseLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (!href.startsWith('/') || href.startsWith('//')) return;
      if (href === base || href.startsWith(`${base}/`)) return;
      node.properties.href = `${base}${href}`;
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://saabbir.github.io',
  base,
  markdown: {
    // Every external link (http/https) in the docs opens in a new tab.
    // rel: noopener/noreferrer prevents the new tab from getting a handle
    // back to this page via window.opener (a known security/perf risk of
    // target="_blank").
    // Root-relative internal links (/start-here/) are rewritten to include
    // `base`, otherwise GitHub Pages would resolve them at saabbir.github.io/.
    rehypePlugins: [
      rehypeBaseLinks,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'Shopify Theme Fundamentals',
      description:
        'Learn Shopify theme development from scratch — Liquid, theme architecture, blocks, sections, design tokens, and the mental model for turning a design into working theme code.',
      favicon: '/favicon.svg',
      head: [
        // ICO fallback for browsers that don't support SVG favicons (e.g. Safari).
        {
          tag: 'link',
          attrs: { rel: 'icon', href: `${base}/favicon.ico`, sizes: '32x32' },
        },
        // Explicit PNG fallbacks.
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: `${base}/favicon-32x32.png`, sizes: '32x32' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: `${base}/favicon-16x16.png`, sizes: '16x16' },
        },
        // iOS/iPadOS home screen bookmark icon.
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png`, sizes: '180x180' },
        },
        // Makes GFM task-list checkboxes clickable, adds strikethrough + a
        // per-list progress bar. See public/scripts/checklist.js.
        {
          tag: 'script',
          attrs: { src: `${base}/scripts/checklist.js`, defer: true },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        // Adds the current section name to the document <title> (browser
        // tab / bookmark name) without touching the on-page H1. See
        // src/components/Head.astro for why.
        Head: './src/components/Head.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Saabbir/shopify-theme-fundamentals',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/Saabbir/shopify-theme-fundamentals/edit/main/',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: '1. Start Here',
          items: [
            { label: 'Overview', slug: 'start-here' },
            { label: '1.1. How to Use This Site', slug: 'start-here/how-to-use-this-site' },
            { label: '1.2. What You Need Before You Start', slug: 'start-here/what-you-need-before-you-start' },
          ],
        },
        {
          label: '2. Theme Architecture & Files',
          items: [
            { label: 'Overview', slug: 'theme-architecture' },
            { label: '2.1. What Is a Shopify Theme?', slug: 'theme-architecture/what-is-a-shopify-theme' },
            { label: '2.2. The Theme Folder Structure', slug: 'theme-architecture/the-theme-folder-structure' },
            { label: '2.3. How a Page Gets Rendered', slug: 'theme-architecture/how-a-page-gets-rendered' },
            { label: '2.4. theme.liquid Explained', slug: 'theme-architecture/theme-liquid-explained' },
            { label: '2.5. Templates: JSON vs. Liquid', slug: 'theme-architecture/templates-json-vs-liquid' },
          ],
        },
        {
          label: '3. Sections, Blocks & Snippets',
          items: [
            { label: 'Overview', slug: 'sections-blocks-snippets' },
            { label: '3.1. What Is a Section?', slug: 'sections-blocks-snippets/what-is-a-section' },
            { label: '3.2. What Is a Block?', slug: 'sections-blocks-snippets/what-is-a-block' },
            { label: '3.3. Nesting Blocks Inside Blocks', slug: 'sections-blocks-snippets/nesting-blocks' },
            { label: '3.4. What Is a Snippet?', slug: 'sections-blocks-snippets/what-is-a-snippet' },
            { label: '3.5. Section Groups (Header & Footer)', slug: 'sections-blocks-snippets/section-groups' },
            { label: '3.6. Choosing the Right Piece: A Decision Guide', slug: 'sections-blocks-snippets/choosing-the-right-piece' },
            { label: '3.7. Worked Example: Building a Simple Section', slug: 'sections-blocks-snippets/worked-example' },
          ],
        },
      ],
    }),
  ],
});
