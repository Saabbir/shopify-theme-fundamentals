// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';

const base = '/shopify-theme-fundamentals';

/** Prefix root-relative hrefs and image srcs with Astro `base` (Starlight does not do this for
 * plain Markdown links, and a root-relative `![]()` image path isn't run through Vite's asset
 * pipeline either, so both need the same manual fix-up). */
function rehypeBaseLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const attr = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : null;
      if (!attr) return;
      const value = node.properties?.[attr];
      if (typeof value !== 'string') return;
      if (!value.startsWith('/') || value.startsWith('//')) return;
      if (value === base || value.startsWith(`${base}/`)) return;
      node.properties[attr] = `${base}${value}`;
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
    // Root-relative internal links (/start-here/) and image srcs (/images/foo.svg)
    // are rewritten to include `base`, otherwise GitHub Pages would resolve them
    // at saabbir.github.io/ instead of saabbir.github.io/shopify-theme-fundamentals/.
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
        // Scrolls the left sidebar so the active page's link is visible on
        // load, since Starlight only restores a scroll position when one was
        // already saved earlier in the tab session. See public/scripts/sidebar-scroll.js.
        {
          tag: 'script',
          attrs: { src: `${base}/scripts/sidebar-scroll.js`, defer: true },
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
        {
          label: '4. Liquid Language Basics',
          items: [
            { label: 'Overview', slug: 'liquid-basics' },
            { label: '4.1. Syntax: Tags, Output & Comments', slug: 'liquid-basics/syntax-tags-output-and-comments' },
            { label: '4.2. Variables, Types & Truthiness', slug: 'liquid-basics/variables-types-and-truthiness' },
            { label: '4.3. Operators & Conditionals', slug: 'liquid-basics/operators-and-conditionals' },
            { label: '4.4. Loops', slug: 'liquid-basics/loops' },
            { label: '4.5. Whitespace Control', slug: 'liquid-basics/whitespace-control' },
            { label: '4.6. Filters: An Overview', slug: 'liquid-basics/filters-an-overview' },
            { label: '4.7. Common Filters by Category', slug: 'liquid-basics/common-filters-by-category' },
            { label: '4.8. Debugging Liquid', slug: 'liquid-basics/debugging-liquid' },
          ],
        },
        {
          label: "5. Shopify's Global Objects",
          items: [
            { label: 'Overview', slug: 'global-objects' },
            { label: '5.1. product, variant & collection', slug: 'global-objects/product-variant-and-collection' },
            { label: '5.2. cart, customer & shop', slug: 'global-objects/cart-customer-and-shop' },
            { label: '5.3. settings, section & block', slug: 'global-objects/settings-section-and-block' },
            { label: '5.4. Other Useful Objects', slug: 'global-objects/other-useful-objects' },
          ],
        },
        {
          label: '6. Schema & Settings',
          items: [
            { label: 'Overview', slug: 'schema-and-settings' },
            { label: '6.1. Section & Block Settings: Every Type', slug: 'schema-and-settings/section-and-block-settings-every-type' },
            { label: '6.2. Presets & Defaults', slug: 'schema-and-settings/presets-and-defaults' },
            { label: '6.3. settings_schema.json & settings_data.json', slug: 'schema-and-settings/settings-schema-and-settings-data' },
            { label: '6.4. Conditional Settings', slug: 'schema-and-settings/conditional-settings' },
            { label: '6.5. Locale Files & Translation Keys', slug: 'schema-and-settings/locale-files-and-translation-keys' },
          ],
        },
        {
          label: '7. Design Tokens: Color, Type & Spacing',
          items: [
            { label: 'Overview', slug: 'design-tokens' },
            { label: '7.1. Color Settings & Color Schemes', slug: 'design-tokens/color-settings-and-color-schemes' },
            { label: '7.2. Typography & font_picker', slug: 'design-tokens/typography-and-font-picker' },
            { label: '7.3. Spacing & Layout Tokens', slug: 'design-tokens/spacing-and-layout-tokens' },
            { label: '7.4. Turning Settings into CSS Custom Properties', slug: 'design-tokens/turning-settings-into-css-variables' },
          ],
        },
        {
          label: '8. Forms',
          items: [
            { label: 'Overview', slug: 'forms' },
            { label: '8.1. The Product Form', slug: 'forms/the-product-form' },
            { label: '8.2. The Cart Form', slug: 'forms/the-cart-form' },
            { label: '8.3. Customer Forms', slug: 'forms/customer-forms' },
            { label: '8.4. Contact & Newsletter Forms', slug: 'forms/contact-and-newsletter-forms' },
          ],
        },
        {
          label: '9. From Figma to Code: The Mental Model',
          items: [
            { label: 'Overview', slug: 'figma-to-code' },
            { label: '9.1. Reading a Design Like a Developer', slug: 'figma-to-code/reading-a-design-like-a-developer' },
            { label: '9.2. Content vs. Structure', slug: 'figma-to-code/content-vs-structure' },
            { label: '9.3. Section, Block, Snippet, or Fixed Markup?', slug: 'figma-to-code/section-block-snippet-or-fixed-markup' },
            { label: '9.4. Planning Responsive Behavior', slug: 'figma-to-code/planning-responsive-behavior' },
            { label: '9.5. Worked Example: One Figma Frame, Start to Finish', slug: 'figma-to-code/worked-example' },
          ],
        },
        {
          label: '10. CSS in Shopify Themes',
          items: [
            { label: 'Overview', slug: 'css-in-shopify-themes' },
            { label: '10.1. {% stylesheet %} and {% style %}', slug: 'css-in-shopify-themes/stylesheet-and-style-tags' },
            { label: '10.2. Naming & Scoping', slug: 'css-in-shopify-themes/naming-and-scoping' },
            { label: '10.3. Responsive & Logical Properties', slug: 'css-in-shopify-themes/responsive-and-logical-properties' },
          ],
        },
        {
          label: '11. JavaScript in Shopify Themes',
          items: [
            { label: 'Overview', slug: 'javascript-in-shopify-themes' },
            { label: '11.1. The {% javascript %} Tag', slug: 'javascript-in-shopify-themes/the-javascript-tag' },
            { label: '11.2. Web Components for Theme Behavior', slug: 'javascript-in-shopify-themes/web-components-for-theme-behavior' },
            { label: '11.3. Theme Editor Events', slug: 'javascript-in-shopify-themes/theme-editor-events' },
          ],
        },
        {
          label: '12. Media & Assets',
          items: [
            { label: 'Overview', slug: 'media-and-assets' },
            { label: '12.1. Images & Responsive Image Tags', slug: 'media-and-assets/images-and-responsive-image-tags' },
            { label: '12.2. Video & 3D Media', slug: 'media-and-assets/video-and-3d-media' },
            { label: '12.3. Icons & SVGs', slug: 'media-and-assets/icons-and-svgs' },
          ],
        },
        {
          label: '13. Reference',
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: '13.1. Liquid Tag Reference', slug: 'reference/liquid-tag-reference' },
            { label: '13.2. Liquid Filter Reference', slug: 'reference/liquid-filter-reference' },
            { label: '13.3. Glossary', slug: 'reference/glossary' },
            { label: '13.4. Cheatsheet', slug: 'reference/cheatsheet' },
          ],
        },
        {
          label: '14. All About Sections',
          items: [
            { label: 'Overview', slug: 'all-about-sections' },
            { label: '14.1. Section Fundamentals', slug: 'all-about-sections/section-fundamentals' },
            { label: '14.2. Restricting Where a Section Can Appear', slug: 'all-about-sections/restricting-where-a-section-can-appear' },
            { label: '14.3. Limits: max_blocks and Schema Size', slug: 'all-about-sections/limits-max-blocks-and-schema-size' },
            { label: '14.4. Section Performance Considerations', slug: 'all-about-sections/section-performance-considerations' },
            { label: '14.5. Real-World Section Patterns', slug: 'all-about-sections/real-world-section-patterns' },
            { label: '14.6. A Complete Section Example', slug: 'all-about-sections/a-complete-section-example' },
          ],
        },
        {
          label: '15. All About Blocks',
          items: [
            { label: 'Overview', slug: 'all-about-blocks' },
            { label: '15.1. Block Fundamentals', slug: 'all-about-blocks/block-fundamentals' },
            { label: '15.2. Static Blocks', slug: 'all-about-blocks/static-blocks' },
            { label: '15.3. Advanced Nested Block Patterns', slug: 'all-about-blocks/advanced-nested-block-patterns' },
            { label: '15.4. @app and @theme Targeting in Full', slug: 'all-about-blocks/app-and-theme-targeting-in-full' },
            { label: '15.5. Block Limits', slug: 'all-about-blocks/block-limits' },
            { label: '15.6. Advanced Preset Patterns', slug: 'all-about-blocks/advanced-preset-patterns' },
            { label: '15.7. A Complete Block Example', slug: 'all-about-blocks/a-complete-block-example' },
          ],
        },
        {
          label: '16. All About Snippets',
          items: [
            { label: 'Overview', slug: 'all-about-snippets' },
            { label: '16.1. Snippet Fundamentals', slug: 'all-about-snippets/snippet-fundamentals' },
            { label: '16.2. Recursive Snippets', slug: 'all-about-snippets/recursive-snippets' },
            { label: '16.3. Organizing a Large Snippet Library', slug: 'all-about-snippets/organizing-a-large-snippet-library' },
            { label: '16.4. Render Performance at Scale', slug: 'all-about-snippets/render-performance-at-scale' },
            { label: '16.5. A Complete Snippet Example', slug: 'all-about-snippets/a-complete-snippet-example' },
          ],
        },
        {
          label: '17. All About Colors',
          items: [
            { label: 'Overview', slug: 'all-about-colors' },
            { label: '17.1. Color Fundamentals', slug: 'all-about-colors/color-fundamentals' },
            { label: '17.2. Color Formats & Conversions', slug: 'all-about-colors/color-formats-and-conversions' },
            { label: '17.3. Every Color Filter in Depth', slug: 'all-about-colors/every-color-filter-in-depth' },
            { label: '17.4. Dark Mode', slug: 'all-about-colors/dark-mode' },
            { label: '17.5. Building a Token System', slug: 'all-about-colors/building-a-token-system' },
            { label: '17.6. A Real Contrast-Testing Workflow', slug: 'all-about-colors/a-real-contrast-testing-workflow' },
            { label: '17.7. A Complete Color Scheme Example', slug: 'all-about-colors/a-complete-color-scheme-example' },
          ],
        },
        {
          label: '18. All About Typography',
          items: [
            { label: 'Overview', slug: 'all-about-typography' },
            { label: '18.1. Typography Fundamentals', slug: 'all-about-typography/typography-fundamentals' },
            { label: '18.2. Reading Typography from a Figma Design', slug: 'all-about-typography/reading-typography-from-a-figma-design' },
            { label: '18.3. Font Settings & Loading a Font Correctly', slug: 'all-about-typography/font-settings-and-loading-a-font-correctly' },
            { label: '18.4. Variable Fonts', slug: 'all-about-typography/variable-fonts' },
            { label: '18.5. Loading a Custom or Licensed Font', slug: 'all-about-typography/loading-a-custom-or-licensed-font' },
            { label: '18.6. Font Substitutes & Advanced Variable Axis Control', slug: 'all-about-typography/font-substitutes-and-advanced-variable-axis-control' },
            { label: '18.7. Font-Loading Performance', slug: 'all-about-typography/font-loading-performance' },
            { label: '18.8. How Horizon Loads Typography', slug: 'all-about-typography/how-horizon-loads-typography' },
            { label: '18.9. Design Tokens & Type Presets', slug: 'all-about-typography/design-tokens-and-type-presets' },
            { label: '18.10. Fluid Type Scales in Depth', slug: 'all-about-typography/fluid-type-scales-in-depth' },
            { label: '18.11. Type Presets & Building a Complete Type System', slug: 'all-about-typography/type-presets-and-building-a-complete-type-system' },
            { label: '18.12. Wiring Typography into Sections & Blocks', slug: 'all-about-typography/wiring-typography-into-sections-and-blocks' },
            { label: '18.13. Typography in Components: A Day-to-Day Cheat Sheet', slug: 'all-about-typography/typography-in-components-a-day-to-day-cheat-sheet' },
            { label: '18.14. Naming Conventions for Font Settings & Type Tokens', slug: 'all-about-typography/naming-conventions-for-settings-and-tokens' },
            { label: '18.15. Font Fallback for Multi-Language Stores', slug: 'all-about-typography/font-fallback-for-multi-language-stores' },
            { label: '18.16. Typography Best Practices', slug: 'all-about-typography/typography-best-practices' },
            { label: '18.17. A Complete Design Tokens Example', slug: 'all-about-typography/a-complete-design-tokens-example' },
          ],
        },
        {
          label: '19. Media Deep Dive',
          items: [
            { label: 'Overview', slug: 'media-deep-dive' },
            { label: '19.1. Media Fundamentals', slug: 'media-deep-dive/media-fundamentals' },
            { label: '19.2. Art Direction with picture', slug: 'media-deep-dive/art-direction-with-picture' },
            { label: '19.3. Video Loading & Autoplay Strategy', slug: 'media-deep-dive/video-loading-and-autoplay-strategy' },
            { label: '19.4. Image CDN Transform Parameters', slug: 'media-deep-dive/image-cdn-transform-parameters' },
            { label: '19.5. Performance Budgets for Media-Heavy Pages', slug: 'media-deep-dive/performance-budgets-for-media-heavy-pages' },
          ],
        },
        {
          label: '27. Horizon Theme Codebase Tour',
          items: [
            { label: 'Overview', slug: 'horizon-codebase-tour' },
            { label: '27.1. Folder Structure & Theme Store Caveat', slug: 'horizon-codebase-tour/folder-structure-and-theme-store-caveat' },
            { label: '27.2. How Horizon Sets Up Colors', slug: 'horizon-codebase-tour/how-horizon-sets-up-colors' },
            { label: '27.3. How Horizon Sets Up Typography & Design Tokens', slug: 'horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens' },
            { label: "27.4. Horizon's Typography System by the Numbers", slug: 'horizon-codebase-tour/horizons-typography-system-by-the-numbers' },
            { label: '27.5. Naming & Code Conventions in Horizon', slug: 'horizon-codebase-tour/naming-and-code-conventions' },
            { label: '27.6. Sections, Blocks, Snippets & Assets at a Glance', slug: 'horizon-codebase-tour/sections-blocks-snippets-and-assets' },
            { label: '27.7. Using Horizon as a Skeleton for a New Theme', slug: 'horizon-codebase-tour/using-horizon-as-a-skeleton' },
          ],
        },
        {
          label: '28. All About Theme Settings',
          items: [
            { label: 'Overview', slug: 'all-about-theme-settings' },
            { label: '28.1. Theme Settings Fundamentals', slug: 'all-about-theme-settings/theme-settings-fundamentals' },
            { label: '28.2. Where Global Settings Data Actually Lives', slug: 'all-about-theme-settings/where-global-settings-data-lives' },
            { label: '28.3. A Complete settings_schema.json Example', slug: 'all-about-theme-settings/a-complete-settings-schema-example' },
            { label: '28.4. A Complete settings_data.json Example', slug: 'all-about-theme-settings/a-complete-settings-data-example' },
            { label: '28.5. A Complete Template Example', slug: 'all-about-theme-settings/a-complete-template-example' },
            { label: '28.6. A Complete Locale File Example', slug: 'all-about-theme-settings/a-complete-locale-file-example' },
          ],
        },
        {
          label: '29. All About CSS',
          items: [
            { label: 'Overview', slug: 'all-about-css' },
            { label: '29.1. CSS Fundamentals in a Shopify Theme', slug: 'all-about-css/css-fundamentals' },
            { label: '29.2. Modern CSS Units: rem, em, px & Viewport Units', slug: 'all-about-css/modern-css-units' },
            { label: '29.3. Naming & Scoping at Scale', slug: 'all-about-css/naming-and-scoping-at-scale' },
            { label: '29.4. CSS Custom Properties & Design Tokens in Depth', slug: 'all-about-css/css-custom-properties-and-design-tokens-in-depth' },
            { label: '29.5. Responsive CSS, Container Queries & Logical Properties', slug: 'all-about-css/responsive-css-container-queries-and-logical-properties' },
            { label: '29.6. Cascade Layers & Managing Specificity', slug: 'all-about-css/cascade-layers-and-managing-specificity' },
            { label: '29.7. Critical CSS & Loading Performance', slug: 'all-about-css/critical-css-and-loading-performance' },
            { label: '29.8. RTL, Print & Other Rendering Contexts', slug: 'all-about-css/rtl-print-and-other-rendering-contexts' },
            { label: '29.9. A Complete CSS Example', slug: 'all-about-css/a-complete-css-example' },
            { label: '29.10. Old Patterns vs. New CSS Features', slug: 'all-about-css/old-patterns-vs-new-css-features' },
          ],
        },
        {
          label: '30. All About JavaScript',
          items: [
            { label: 'Overview', slug: 'all-about-javascript' },
            { label: '30.1. JavaScript Fundamentals in a Shopify Theme', slug: 'all-about-javascript/javascript-fundamentals' },
            { label: '30.2. Web Components for Theme Behavior in Depth', slug: 'all-about-javascript/web-components-for-theme-behavior-in-depth' },
            { label: "30.3. Shadow DOM, Slots & ::part(): When You'd Actually Reach for Them", slug: 'all-about-javascript/shadow-dom-slots-and-part' },
            { label: '30.4. Talking to Liquid: Data Attributes & JSON Islands', slug: 'all-about-javascript/talking-to-liquid-data-attributes-and-json-islands' },
            { label: '30.5. Theme Editor Events in Depth', slug: 'all-about-javascript/theme-editor-events-in-depth' },
            { label: '30.6. Custom Events & Cross-Component Communication', slug: 'all-about-javascript/custom-events-and-cross-component-communication' },
            { label: '30.7. Performance & Loading Strategy for Theme JS', slug: 'all-about-javascript/performance-and-loading-strategy-for-theme-js' },
            { label: '30.8. A Complete Web Component Example', slug: 'all-about-javascript/a-complete-web-component-example' },
          ],
        },
        {
          label: '31. All About Global Objects',
          items: [
            { label: 'Overview', slug: 'all-about-global-objects' },
            { label: '31.1. Global Object Fundamentals', slug: 'all-about-global-objects/global-object-fundamentals' },
            { label: '31.2. product, variant & collection in Full', slug: 'all-about-global-objects/product-variant-and-collection-in-full' },
            { label: '31.3. cart, customer & shop in Full', slug: 'all-about-global-objects/cart-customer-and-shop-in-full' },
            { label: '31.4. settings, section & block in Full', slug: 'all-about-global-objects/settings-section-and-block-in-full' },
            { label: '31.5. request, routes, localization & Metafield Access Patterns', slug: 'all-about-global-objects/request-routes-localization-and-metafields' },
            { label: '31.6. search, predictive_search & recommendations', slug: 'all-about-global-objects/search-predictive-search-and-recommendations' },
            { label: '31.7. Which Objects Exist on Which Template', slug: 'all-about-global-objects/which-objects-exist-on-which-template' },
            { label: '31.8. A Complete Example', slug: 'all-about-global-objects/a-complete-example' },
          ],
        },
        {
          label: '32. All About Products',
          items: [
            { label: 'Overview', slug: 'all-about-products' },
            { label: '32.1. Product Fundamentals', slug: 'all-about-products/product-fundamentals' },
            { label: '32.2. The Variants & Options Matrix in Depth', slug: 'all-about-products/the-variants-and-options-matrix-in-depth' },
            { label: '32.3. The Media Gallery', slug: 'all-about-products/the-media-gallery' },
            { label: '32.4. Availability, Pricing & Compare-At in Depth', slug: 'all-about-products/availability-pricing-and-compare-at-in-depth' },
            { label: '32.5. Selling Plans, Subscriptions & Quantity Rules', slug: 'all-about-products/selling-plans-subscriptions-and-quantity-rules' },
            { label: '32.6. Metafields, Tags & Categorization', slug: 'all-about-products/metafields-tags-and-categorization' },
            { label: '32.7. A Complete Example', slug: 'all-about-products/a-complete-example' },
          ],
        },
        {
          label: '33. All About Product Cards',
          items: [
            { label: 'Overview', slug: 'all-about-product-cards' },
            { label: '33.1. Product Card Fundamentals', slug: 'all-about-product-cards/product-card-fundamentals' },
            { label: '33.2. The Image & Hover/Secondary Image', slug: 'all-about-product-cards/the-image-and-hover-secondary-image' },
            { label: '33.3. Badges: Sale, Sold Out & Custom Tags', slug: 'all-about-product-cards/badges-sale-sold-out-and-custom-tags' },
            { label: '33.4. Price Formatting: Single, Compare-At & Ranges', slug: 'all-about-product-cards/price-formatting-single-compare-at-and-ranges' },
            { label: '33.5. Color & Size Swatches', slug: 'all-about-product-cards/color-and-size-swatches' },
            { label: '33.6. Quick Add', slug: 'all-about-product-cards/quick-add' },
            { label: '33.7. A Complete Example', slug: 'all-about-product-cards/a-complete-example' },
          ],
        },
        {
          label: '34. All About Product Reviews',
          items: [
            { label: 'Overview', slug: 'all-about-product-reviews' },
            { label: '34.1. Review Data Fundamentals', slug: 'all-about-product-reviews/review-data-fundamentals' },
            { label: "34.2. The Shopify Product Reviews App's Standard Metafields", slug: 'all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields' },
            { label: '34.3. Third-Party Review Apps: App Blocks vs. Metafields', slug: 'all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields' },
            { label: '34.4. Rendering an Accessible Star Rating', slug: 'all-about-product-reviews/rendering-an-accessible-star-rating' },
            { label: '34.5. AggregateRating Schema.org Markup for SEO', slug: 'all-about-product-reviews/aggregaterating-schema-for-seo' },
            { label: '34.6. A Complete Example', slug: 'all-about-product-reviews/a-complete-example' },
          ],
        },
        {
          label: '36. All About Buttons',
          items: [
            { label: 'Overview', slug: 'all-about-buttons' },
            { label: '36.1. Button Fundamentals', slug: 'all-about-buttons/button-fundamentals' },
            { label: '36.2. Button Variants', slug: 'all-about-buttons/button-variants' },
            { label: '36.3. Interactive States', slug: 'all-about-buttons/interactive-states' },
            { label: '36.4. Accessible Loading & Busy States', slug: 'all-about-buttons/accessible-loading-and-busy-states' },
            { label: '36.5. Sizing & Icon+Text Composition', slug: 'all-about-buttons/sizing-and-icon-text-composition' },
            { label: '36.6. Settings-Driven Styling in Depth', slug: 'all-about-buttons/settings-driven-styling-in-depth' },
            { label: '36.7. A Complete Example', slug: 'all-about-buttons/a-complete-example' },
          ],
        },
        {
          label: '37. All About Icons',
          items: [
            { label: 'Overview', slug: 'all-about-icons' },
            { label: '37.1. Icon Fundamentals: Inline SVG vs. a Sprite System', slug: 'all-about-icons/icon-fundamentals-inline-svg-vs-a-sprite-system' },
            { label: '37.2. A Reusable Icon Snippet Pattern', slug: 'all-about-icons/a-reusable-icon-snippet-pattern' },
            { label: '37.3. Sizing & Coloring Icons with CSS Custom Properties', slug: 'all-about-icons/sizing-and-coloring-icons-with-css-custom-properties' },
            { label: '37.4. Icon Accessibility: Decorative vs. Meaningful', slug: 'all-about-icons/icon-accessibility-decorative-vs-meaningful' },
            { label: '37.5. A Complete Example', slug: 'all-about-icons/a-complete-example' },
          ],
        },
        {
          label: '38. All About Images',
          items: [
            { label: 'Overview', slug: 'all-about-images' },
            { label: '38.1. Image Fundamentals: What Belongs in a Reusable Snippet', slug: 'all-about-images/image-fundamentals-what-belongs-in-a-reusable-snippet' },
            { label: '38.2. Aspect-Ratio Wrapper Techniques', slug: 'all-about-images/aspect-ratio-wrapper-techniques' },
            { label: '38.3. Lazy-Load & Loading-State Patterns', slug: 'all-about-images/lazy-load-and-loading-state-patterns' },
            { label: '38.4. Badge & Overlay Composition', slug: 'all-about-images/badge-and-overlay-composition' },
            { label: '38.5. A Complete Example', slug: 'all-about-images/a-complete-example' },
          ],
        },
        {
          label: '39. All About Videos',
          items: [
            { label: 'Overview', slug: 'all-about-videos' },
            { label: '39.1. Video Fundamentals', slug: 'all-about-videos/video-fundamentals-video_tag-vs-building-your-own-tag' },
            { label: '39.2. Play/Pause UI Patterns', slug: 'all-about-videos/play-pause-ui-patterns' },
            { label: '39.3. Poster-Image States', slug: 'all-about-videos/poster-image-states' },
            { label: '39.4. Inline vs. Modal/Lightbox Video', slug: 'all-about-videos/inline-vs-modal-lightbox-video' },
            { label: '39.5. Captioning & Accessibility', slug: 'all-about-videos/captioning-and-accessibility' },
            { label: '39.6. A Complete Example', slug: 'all-about-videos/a-complete-example' },
          ],
        },
        {
          label: '35. All About Collection Filtering & Sorting',
          items: [
            { label: 'Overview', slug: 'all-about-collection-filtering-and-sorting' },
            { label: '35.1. collection.filters in Depth', slug: 'all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters' },
            { label: '35.2. Rendering Filters: list, price_range & boolean', slug: 'all-about-collection-filtering-and-sorting/rendering-filters-list-price-range-and-boolean' },
            { label: '35.3. Sorting: collection.sort_options & sort_by', slug: 'all-about-collection-filtering-and-sorting/sorting-collection-sort_options-and-sort_by' },
            { label: '35.4. A Manual Tag-Based Fallback', slug: 'all-about-collection-filtering-and-sorting/a-manual-tag-based-fallback' },
            { label: '35.5. How Theme-Side Filtering Interacts With Search & Discovery', slug: 'all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery' },
            { label: '35.6. A Complete Example', slug: 'all-about-collection-filtering-and-sorting/a-complete-example' },
          ],
        },
        {
          label: '40. All About Input Settings',
          items: [
            { label: 'Overview', slug: 'all-about-input-settings' },
            { label: '40.1. Exact Return Types, Verified', slug: 'all-about-input-settings/exact-return-types-verified' },
            { label: '40.2. Resource Pickers: Full Objects, Not IDs', slug: 'all-about-input-settings/resource-pickers-full-objects-not-ids' },
            { label: '40.3. Default-Value Requirements & Validation Gotchas', slug: 'all-about-input-settings/default-value-requirements-and-validation-gotchas' },
            { label: '40.4. What Happens When a Referenced Resource Is Deleted', slug: 'all-about-input-settings/what-happens-when-a-referenced-resource-is-deleted' },
            { label: '40.5. A Complete Example', slug: 'all-about-input-settings/a-complete-example' },
          ],
        },
      ],
    }),
  ],
});
