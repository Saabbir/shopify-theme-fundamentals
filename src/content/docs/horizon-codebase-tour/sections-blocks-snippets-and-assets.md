---
title: Sections, Blocks, Snippets & Assets at a Glance
description: What kind of content lives in each remaining folder, and how to explore it yourself.
---

**TL;DR:** What kind of content lives in each remaining folder, and how to explore it yourself.

The color and typography pages in this chapter went deep on specific, fully-verified files. This page is different in kind: it's an honest overview of what the remaining folders generally contain, built from Horizon's confirmed real version history and documented architecture, rather than a line-by-line reading of every file in them.

:::note[Why this page isn't a complete file list]
Horizon's `sections/`, `blocks/`, `snippets/`, and `assets/` folders together hold well over a hundred files, and that number changes with every release — version 4.1.3's own [release notes](https://github.com/Shopify/horizon/blob/main/release-notes.md) mention changes to Header, Filters, Quick-add, Spacer, Search, and Product page components, none of which existed in earlier versions in the same form. A static list here would be stale within a few releases. What follows is the general shape of each folder, plus specifically-confirmed real examples — for the exact, current file list, browse the folders directly at [github.com/Shopify/horizon](https://github.com/Shopify/horizon).
:::

## `sections/`

Every page-level module a merchant can add from the theme editor. Confirmed real examples from Horizon's source and documentation include `main-product.liquid` and `hero-banner.liquid`. Expect this folder to cover, at minimum, one section per standard page type (a main product section, a main collection section, a main cart section, and so on — see [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/) for why every JSON template needs at least one) plus a large library of general-purpose content sections (banners, galleries, multi-column layouts, testimonials, and similar), reflecting the "rich components out of the box" design goal the Horizon README describes.

## `blocks/`

Standalone block files, referenced from section schemas via `"@theme"` (see [15.1. Block Fundamentals](/all-about-blocks/block-fundamentals/)). Confirmed real examples include a card block and a button block. Given Horizon's heavy use of nested blocks (see [15.3. Advanced Nested Block Patterns](/all-about-blocks/advanced-nested-block-patterns/) for the general mechanism), expect a meaningful number of these to be generic, composable layout pieces — a group/container block, a text block, an image block — used and reused across many different sections, rather than one bespoke block type per section.

## `snippets/`

The deepest-covered folder in this chapter: beyond the color and typography files covered on their own pages, expect a large library of smaller, focused snippets — icon snippets (one per icon, or one parameterized icon snippet reading an identifier), a product card snippet, loading-state snippets, and metadata/SEO snippets (a `meta-tags.liquid`-style snippet is standard across nearly every modern Shopify theme, Horizon included). [16.3. Organizing a Large Snippet Library](/all-about-snippets/organizing-a-large-snippet-library/)'s naming-prefix guidance is directly visible here in practice — Horizon's own `util-` prefix convention (see [27.5. Naming & Code Conventions in Horizon](/horizon-codebase-tour/naming-and-code-conventions/)) is exactly that pattern, applied at scale.

## `assets/`

CSS and JavaScript, plus any other static files (icons as SVGs, if not inlined directly in snippets). Horizon is confirmed to include dedicated JavaScript for scroll-triggered animations and media interactions, separate from its base styling — reflecting the "animation layers" the theme is known for beyond a more minimal theme's JavaScript footprint. Expect most interactive behavior here to follow the Web Component pattern from [18.8. Wiring Typography into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/)'s JavaScript counterpart — one custom element per interactive piece, registered with `customElements.define`, each in its own file.

## `locales/`

Translation files — an `en.default.json` (storefront text) and an `en.default.schema.json` (schema/settings labels) at minimum, per the two-tier system from [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/), plus additional language files for every language Horizon ships pre-translated.

## `templates/`

One JSON file per page type — `index.json`, `product.json`, `collection.json`, `cart.json`, and the rest of the standard set from [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/), each referencing sections from `sections/` by type.

## How to actually explore these yourself

Since this page is deliberately not a complete inventory, the practical next step is browsing the real thing:

1. Visit [github.com/Shopify/horizon](https://github.com/Shopify/horizon) and open whichever folder you're curious about.
2. Start with a section or block whose *name* tells you roughly what it does — `main-product.liquid`, say — rather than trying to read the whole folder top to bottom.
3. Every file you open will make more sense now than it would have before this chapter: the `{% schema %}` block follows [14.1. Section Fundamentals](/all-about-sections/section-fundamentals/), the CSS reads from tokens covered in the previous two pages, and any interactive element is very likely a Web Component following the pattern from [11. JavaScript in Shopify Themes](/javascript-in-shopify-themes/).

## Key takeaways

- `sections/`, `blocks/`, `snippets/`, `assets/`, `locales/`, and `templates/` each hold what their names suggest, following the same architecture taught throughout this entire site — Horizon's scale is the main thing that's different, not its structure.
- Specific file names mentioned here are confirmed real examples, not an exhaustive list — Horizon's exact file count and names shift release to release.
- The fastest way to get real, current, complete coverage is to browse the live repository directly — everything taught elsewhere on this site, and in this chapter, prepares you to read what you find there.

## Further reading

- [Horizon theme source (GitHub)](https://github.com/Shopify/horizon)
- [2. Theme Architecture & Files](/theme-architecture/)
