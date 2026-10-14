# Roadmap

The full long-term plan for this site, sidebar group by sidebar group. `Status: live` means the pages exist and are wired into `astro.config.mjs` today. `Status: planned` means the group is scoped but not written yet — do that work next, in order, following the same page conventions as the live groups (see "Page conventions" below).

**All 13 originally planned groups are now live.** This roadmap's job isn't done, though — it's the place future groups get scoped before they're built. If a new topic comes up (a merchant-facing feature this site doesn't cover yet, a platform change worth teaching, a gap a reader points out), add it here as its own numbered group, `status: planned`, in the right position for the "Why this order" reasoning below — then build it the same way every group above it was built.

Audience throughout: someone who has never touched a Shopify theme before, but already knows HTML, CSS, and JavaScript. Every example is generic — no theme-specific naming (no `sol-` prefixes, no references to a specific project's repo). That's what separates this site from the Shopify Theme Handbook, which assumes the reader already knows Shopify/Liquid and documents one specific theme's real codebase.

## 1. Start Here — `status: live`

- Overview
- 1.1. How to Use This Site
- 1.2. What You Need Before You Start

## 2. Theme Architecture & Files — `status: live`

- Overview
- 2.1. What Is a Shopify Theme?
- 2.2. The Theme Folder Structure
- 2.3. How a Page Gets Rendered
- 2.4. theme.liquid Explained
- 2.5. Templates: JSON vs. Liquid

## 3. Sections, Blocks & Snippets — `status: live`

- Overview
- 3.1. What Is a Section?
- 3.2. What Is a Block?
- 3.3. Nesting Blocks Inside Blocks
- 3.4. What Is a Snippet?
- 3.5. Section Groups (Header & Footer)
- 3.6. Choosing the Right Piece: A Decision Guide
- 3.7. Worked Example: Building a Simple Section

## 4. Liquid Language Basics — `status: live`

- Overview
- 4.1. Syntax: Tags, Output & Comments
- 4.2. Variables, Types & Truthiness
- 4.3. Operators & Conditionals
- 4.4. Loops
- 4.5. Whitespace Control
- 4.6. Filters: An Overview
- 4.7. Common Filters by Category (string, array, math, money, HTML/URL)
- 4.8. Debugging Liquid

## 5. Shopify's Global Objects — `status: live`

- Overview
- 5.1. product, variant & collection
- 5.2. cart, customer & shop
- 5.3. settings, section & block
- 5.4. Other Useful Objects (request, routes, images, metafields)

## 6. Schema & Settings — `status: live`

- Overview
- 6.1. Section & Block Settings: Every Type
- 6.2. Presets & Defaults
- 6.3. settings_schema.json & settings_data.json
- 6.4. Conditional Settings (visible_if)
- 6.5. Locale Files & Translation Keys

## 7. Design Tokens: Color, Type & Spacing — `status: live`

- Overview
- 7.1. Color Settings & Color Schemes
- 7.2. Typography & font_picker
- 7.3. Spacing & Layout Tokens
- 7.4. Turning Settings into CSS Variables

## 8. Forms — `status: live`

- Overview
- 8.1. The Product Form
- 8.2. The Cart Form
- 8.3. Customer Forms (login, register, account)
- 8.4. Contact & Newsletter Forms

## 9. From Figma to Code: The Mental Model — `status: live`

- Overview
- 9.1. Reading a Design Like a Developer
- 9.2. Content vs. Structure
- 9.3. Section, Block, Snippet, or Fixed Markup? (the decision in context)
- 9.4. Planning Responsive Behavior
- 9.5. Worked Example: One Figma Frame, Start to Finish

## 10. CSS in Shopify Themes — `status: live`

- Overview
- 10.1. `{% stylesheet %}` and `{% style %}`
- 10.2. Naming & Scoping
- 10.3. Responsive & Logical Properties

## 11. JavaScript in Shopify Themes — `status: live`

- Overview
- 11.1. The `{% javascript %}` Tag
- 11.2. Web Components for Theme Behavior
- 11.3. Theme Editor Events

## 12. Media & Assets — `status: live`

- Overview
- 12.1. Images & Responsive Image Tags
- 12.2. Video & 3D Media
- 12.3. Icons & SVGs

## 13. Reference — `status: live`

- Overview
- 13.1. Liquid Tag Reference
- 13.2. Liquid Filter Reference
- 13.3. Glossary
- 13.4. Cheatsheet

---

# Part 2: Deep Dives

Part 1 (groups 1–13 above) is a front-to-back path for someone who's never built a theme before — it stays exactly as it is, and nothing in Part 2 renumbers or disrupts it. Part 2 is a second, separate shelf of **comprehensive, standalone references** — one per topic (sections, blocks, snippets, colors, typography, media, and so on). Each Part 2 chapter covers its topic completely on its own, starting from what the thing *is* and building all the way up to its most advanced corners, so a reader can land directly on "All About Typography" with zero prior context and come away knowing everything the site teaches about typography, without ever needing to have read Part 1 first.

This means a Part 2 chapter's early pages deliberately cover some of the same ground as the matching Part 1 page — that overlap is intentional, not a mistake to dedupe away. Part 1 teaches a topic once, briefly, in the order a first-time reader needs it, woven into the front-to-back path. Part 2 teaches the same topic again, on its own, in full — as deep and as complete as the topic actually goes, independent of what order Part 1 happened to introduce things in. A Part 2 chapter never says "as covered in Part 1" or assumes a reader has read anything else on the site; it only assumes the general web-development background stated in the site's own audience note (HTML/CSS/JS, no prior Shopify/Liquid experience). Cross-links to Part 1 or to other Part 2 chapters are for a reader who wants more, never a prerequisite for understanding the page they're on.

## 14. All About Sections — `status: live`

Everything about sections, start to finish, in one place: what a section is and how it's structured, schema and rendering from the ground up, `enabled_on`/`disabled_on`, `max_blocks`, practical schema-size limits, section-level performance considerations, a wider set of real-world section patterns, and a complete, copy-pasteable section file combining every one of those concerns at once.

## 15. All About Blocks — `status: live`

Everything about blocks, start to finish: what a block is, inline vs. standalone blocks, nesting, static blocks (`"static": true`), `@app`/`@theme` targeting rules in full, block count limits, advanced preset patterns, and a complete worked example combining nesting, a static block, and a nested preset in one place.

## 16. All About Snippets — `status: live`

Everything about snippets, start to finish: what a snippet is, `{% render %}` and scope isolation, recursive snippets, organizing a large snippet library as a theme grows, the performance characteristics of `render` at scale, and a complete snippet with documented optional parameters and defensive checks, called from two different real call sites.

## 17. All About Colors — `status: live`

Everything about color, start to finish: `color` and `color_scheme_group` settings from the ground up, color formats and conversions, every color filter in depth with before/after examples, dark mode (`prefers-color-scheme`), building a full primitive → semantic → component token system, a real contrast-testing workflow, and a complete color-scheme example including the CSS-generation snippet every theme actually needs (and that Shopify doesn't generate for you).

## 18. All About Typography — `status: live`

Everything about typography, start to finish: what fonts/weights/styles are, reading a client's Figma handoff and turning it into font roles and settings before writing any code, the `font_picker` setting and loading a font correctly, how Shopify's own Horizon theme structures its typography tokens, building a type-preset system, wiring font settings into sections and blocks, a standalone naming-conventions page for settings/CSS variables/presets, best practices, variable fonts, font-loading performance (`font-display`, preloading), fluid type scales in depth, font fallback strategy for multi-language stores, and a complete design-tokens example merging typography, color, and spacing settings into one CSS custom-properties snippet.

## 19. Media Deep Dive — `status: live`

Everything about media, start to finish: images, video, and 3D media from the ground up, art direction with `<picture>` (different crops per breakpoint, not just different sizes of the same crop), video loading/autoplay strategy, image CDN transform parameters beyond `width`, and performance budgets for media-heavy pages.

## 20. The Section Rendering API — `status: planned`

Re-rendering one section's HTML via `?sections=section-id`, without a full page reload — what it's for (cart drawers, filtering without navigation), and a worked example.

## 21. The Cart AJAX API — `status: planned`

`/cart/add.js`, `/cart/change.js`, `/cart/update.js`, `/cart/clear.js` — the full cart JSON shape each returns, and building a cart drawer with no page reload. A direct follow-up to [The Cart Form](/forms/the-cart-form/), which covered the non-JS version.

## 22. Collection Filtering & Sorting — `status: planned`

`collection.filters`, `sort_by`, tag-based filtering as a manual fallback, and how this interacts with the Search & Discovery app.

## 23. Accessibility Deep Dive — `status: planned`

A comprehensive chapter instead of the scattered callouts across Icons & SVGs, Forms, and Web Components: WCAG basics, keyboard navigation patterns, screen-reader testing workflow, focus management, and ARIA patterns for common interactive components (modals, accordions, carousels).

## 24. Performance Deep Dive — `status: planned`

Core Web Vitals, consolidated image/font/CSS/JS loading strategy, Lighthouse, and setting real performance budgets.

## 25. Naming Conventions & Theme Architecture at Scale — `status: planned`

Consolidates the "pick one consistent prefix" advice scattered across the CSS, JavaScript, and data-attribute chapters into one authoritative naming system, plus file/folder organization for a theme that's grown large.

## 26. Best Practices & Theme Store Readiness — `status: planned`

A practical, checklist-style capstone — and the natural bridge to the [Shopify Theme Handbook](https://saabbir.github.io/shopify-theme-handbook/), which covers real Theme Store submission requirements in full for a reader who's finished this entire site.

## 27. Horizon Theme Codebase Tour — `status: live`

A different kind of chapter from the rest of Part 2: not a general mechanism taught in the abstract, but a tour of one real, currently-shipping theme — Shopify's own Horizon — read directly from its public source. Covers Horizon's folder structure and the explicit Theme Store eligibility caveat in its README, a from-source walkthrough of how it sets up colors (`color-palette.liquid`, `contrast-override.liquid`) and typography/design tokens (`theme-styles-variables.liquid`), the naming conventions that repeat throughout its real code, an honest (non-exhaustive, explicitly sourced) overview of its sections/blocks/snippets/assets, and a practical step-by-step guide to using it as a starting skeleton for a new custom theme. Built ahead of groups 20–26 at explicit user request, since it directly answers "what does Shopify's own reference theme already give me to reuse."

## 28. All About Theme Settings — `status: live`

Another chapter built ahead of groups 20–26, at explicit user request: a dedicated, deep treatment of the distinction between global theme settings and per-instance section/block settings ("theme content"), exactly where each one's data is actually stored (`settings_schema.json` vs. `settings_data.json` vs. the JSON template itself), and complete, realistic, copy-pasteable example files for every piece — a full `settings_schema.json`, its matching `settings_data.json`, a full JSON template showing where section/block settings really live, and a full locale file pair. Goes well beyond [settings_schema.json & settings_data.json](/schema-and-settings/settings-schema-and-settings-data/)'s intro-level single-page treatment in Part 1.

## 29. All About CSS — `status: live`

A third chapter built ahead of groups 20–26, at explicit user request, alongside group 30: everything about CSS mechanics in a Shopify theme, start to finish — where CSS lives (`{% stylesheet %}` vs. `{% style %}` vs. an asset stylesheet, in full, including the one-tag-per-file rule), a dedicated page on modern CSS units (rem vs. em vs. px, viewport units including dvh/svh/lvh, ch, lh, and when `clamp()` earns its complexity over a fixed value), BEM naming and the real `ValidScopedCSSClass` Theme Check rule that catches a cross-file dependency, CSS custom properties in depth (`var()` fallbacks, inheritance, `@property`) with explicit cross-links out to the Colors and Typography chapters' own token-system coverage rather than repeating it, container queries alongside viewport media queries, cascade layers for taming specificity against app-injected CSS, Shopify's real, documented CSS subsetting behavior (what's actually left to optimize once it's accounted for), RTL and print considerations, a complete section stylesheet combining all of it at once, and a dedicated old-pattern-vs-new-feature catalog (`:has()`, native nesting, `:is()`/`:where()`, `aspect-ratio`, `gap`, `subgrid`, `color-mix()`/relative color syntax, `@starting-style`, scroll-driven animations, `@scope`, `text-wrap: balance`/`pretty`) with real, verified browser support for each. Goes well beyond [CSS in Shopify Themes](/css-in-shopify-themes/)'s three-page intro-level treatment in Part 1.

## 30. All About JavaScript — `status: live`

The fourth chapter built ahead of groups 20–26, at explicit user request: everything about theme JavaScript mechanics, start to finish — where JS lives (`{% javascript %}` in full, including its real per-file-type bundling into `scripts.js`/`block-scripts.js`/`snippet-scripts.js`), the full Web Component lifecycle (not just `connectedCallback`) and encapsulation without Shadow DOM, a dedicated page on Shadow DOM/`<slot>`/`::part()`/declarative Shadow DOM for the real cases where that trade-off is worth making after all, getting data from Liquid into JavaScript safely (data attributes up through JSON islands), every real theme editor event from Shopify's own reference table, custom-event-based communication between unrelated components, lazy-loading genuinely expensive component work, and a complete quantity-selector component combining all of it at once. Deliberately stops short of the Cart and Section Rendering AJAX APIs, reserved for groups 20–21. Goes well beyond [JavaScript in Shopify Themes](/javascript-in-shopify-themes/)'s three-page intro-level treatment in Part 1.

## 31. All About Global Objects — `status: live`

A deep-dive companion to [Shopify's Global Objects](/global-objects/)'s intro-level Part 1 treatment: every documented property of `product`/`variant`/`collection` and `cart`/`customer`/`shop` in full (not just the handful introduced in Part 1), the `settings`/`section`/`block` objects in depth including `section.blocks` iteration and `block.shopify_attributes`, `request`/`routes`/`localization` and real metafield/metaobject access patterns, the lesser-known `search`/`predictive_search`/`recommendations` objects, a practical reference table of which objects actually exist on which template (a common source of silent `nil` bugs), and a complete worked example combining several objects with full nil-guards. All source information verified directly against shopify.dev's current Liquid object reference while writing this chapter.

## 32. All About Products — `status: live`

Everything about the `product` object specifically, start to finish: the variants/options matrix and `options_with_values`, the media gallery (`product.media`, not just `product.featured_image`), selling plans and subscriptions, metafields on a product, availability and `compare_at_price` nuances, tags vs. collection filters, and quantity rules. All source information was verified directly against shopify.dev (the `product`, `variant`, `product_option`, `media`, `selling_plan*`, `quantity_rule`, and `taxonomy_category` objects) rather than from memory.

## 33. All About Product Cards — `status: live`

A UI-composition chapter tying several other chapters together: what a card actually needs versus a full product page, the real convention for a hover/secondary image (the product's own second image, swapped with CSS and `:focus-within` alone — there's no dedicated field), badges derived from real data (`product.available`, `compare_at_price_min > price_min`) plus a `badge:`-tag convention for merchant-controlled custom badges, price formatting for the plain/sale/range/combined cases, Shopify's real native `product_option_value.swatch` object for color swatches (verified directly against shopify.dev, including why a size option almost never has swatch data), a quick-add button built as a real `<form>` first with a `fetch`-based enhancement that falls back correctly, and a complete example combining all of it plus the reviews chapter's shared rating snippet. Built from group 32 (All About Products), [All About Colors](/all-about-colors/), and group 34 (All About Product Reviews) rather than repeating their content.

## 34. All About Product Reviews — `status: live`

How reviews actually surface in a theme, since Liquid has no native reviews object: why review data always comes from an app (metafields a theme reads directly, vs. an app block it can only place), the Shopify Product Reviews app's real, verified `reviews.rating` (a `rating`-type metafield, not a plain number — `.value.rating`/`.value.scale_min`/`.value.scale_max`) and `reviews.rating_count` metafields, how to confirm what a specific third-party app actually exposes rather than assuming it matches, a CSS-only accessible star rating (`role="img"`/`aria-label` plus a percentage-width clip for partial stars, no JavaScript or SVG masking), `AggregateRating` JSON-LD for SEO with the self-serving-reviews guard that must gate it, and a complete example reusing one rating snippet as both a compact card placement and a full product-page placement with schema on the page only. Built from scratch with real metafield structure verified directly against shopify.dev's `rating` Liquid object reference.

## 35. All About Collection Filtering & Sorting — `status: live`

Supersedes the original group 22 stub below, which was never actually written, with a full Part 2-style chapter: `collection.filters` in depth (the three real types -- `list`/`boolean`/`price_range` -- and why a theme never builds a filter URL by hand, since `filter_value.url_to_add`/`url_to_remove` are always pre-built), presentation-aware rendering for `list` filters (`text`/`swatch`/`image`), the one correct `collection.sort_by | default: collection.default_sort_by` idiom for sorting, Shopify's older, app-independent tag-based fallback (`collection.all_tags`, `link_to_add_tag`/`link_to_remove_tag`, the `/collection/tag+tag` URL convention) for stores without Search & Discovery, and an explicit page on where the app's responsibility ends and the theme's begins. All object properties verified directly against shopify.dev's `filter`, `filter_value`, `collection`, and `sort_option` references rather than from memory.

## 36. All About Buttons — `status: live`

A UI-component chapter: button variants (primary/secondary/text/icon-only), every interactive state (hover/focus/active/disabled/loading) including accessible loading-state patterns, settings-driven styling that reuses this site's existing design-token chapters rather than inventing a new one, and icon+text composition. Built ahead of groups 33–35 at the user's explicit request; several pages quote Horizon's real `blocks/button.liquid`, `snippets/button-custom-styles.liquid`, `snippets/resolve-custom-hover.liquid`, and `snippets/size-style.liquid`, fetched fresh rather than from memory.

## 37. All About Icons — `status: live`

A UI-component chapter, distinct from [Icons & SVGs](/media-and-assets/icons-and-svgs/)'s intro-level treatment: the real trade-off between inline SVG and a sprite system (repeated markup vs. setup cost, not extra network requests), a reusable icon-dispatcher snippet pattern quoted directly from Shopify's real Horizon theme source (`snippets/icon.liquid`, including its own comment anticipating a future native icon static block), sizing and coloring icons through one `--sol-icon-size` custom property and `currentColor`/`stroke="currentColor"`, and accessibility in depth (`aria-hidden`+`focusable="false"` for decorative icons, labeling the containing control vs. a real `<title>`+`role="img"` for a standalone icon, and why icon fonts are a structural accessibility hazard rather than just outdated).

## 38. All About Images (Components) — `status: live`

A UI-component chapter, distinct from [Media Deep Dive](/media-deep-dive/)'s platform-mechanics angle (art direction, CDN params, performance budgets): why a shared image snippet beats inline `<img>` tags repeated across sections, `aspect-ratio` plus `object-fit` for a forced ratio (with a merchant-facing ratio setting as a named `select`, and the one real remaining reason for the old padding-hack wrapper), `loading="lazy"` by default versus `fetchpriority="high"` for the single most important image on a page, a CSS-only loading-state placeholder with no blur-up complexity, badge/overlay positioning anchored on the wrapper rather than the `<img>` itself, and a complete example tying all of it into one snippet including a `:has()`-based fix for the priority-image fade-in edge case.

## 39. All About Videos (Components) — `status: live`

A UI-component chapter, distinct from [Media Deep Dive](/media-deep-dive/)'s video-loading-and-autoplay-strategy angle: `video_tag` for the common case versus why captions require abandoning it and building the `<video>` tag by hand from `media.sources` (verified directly against shopify.dev's `video`/`video_source` objects), a custom play/pause Web Component that syncs its button to the video's own real `play`/`pause` events rather than maintaining separate state, poster-image sourcing (`media.preview_image`, with a merchant override setting) and syncing a custom overlay to the native poster-to-playback transition, inline versus a native-`<dialog>`-based modal/lightbox with the shared pause-on-tab-hide rule, and captioning sourced from a real `file_reference` metafield's `generic_file.url` (since Shopify never generates captions automatically) plus the rest of what video accessibility requires beyond captions alone.

## 40. All About Input Settings — `status: planned`

A deep-dive companion to [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)'s intro-level enumeration: for every `settings_schema` input type, the exact value type it returns in Liquid (a `select` returns its `value`, not its `label`; `product`/`collection`/`image_picker`/`video` return full resource objects, not IDs), real default-value requirements, Theme Store validation gotchas, and what happens when a referenced resource (a linked product, a picked image) is later deleted.

---

## Why this order

Groups 2–3 come before Liquid syntax (group 4) on purpose. Learning "a theme is made of these pieces, rendered in this order" first gives every later Liquid example somewhere to live — a `{% for %}` loop means more once you've seen the section it would loop inside. Groups 5–8 build outward from there: the data you render (objects), the settings merchants control (schema), and the two systems most requests are actually about (design tokens, forms). Group 9 (Figma to code) is placed after the reader has vocabulary for sections/blocks/snippets/settings, since that page's whole job is mapping a visual design onto those exact terms — it wouldn't land earlier. Groups 10–12 (CSS, JS, media) are deliberately last: important, but every example written so far already stood on its own without them, consistent with building for someone reading front-to-back for the first time rather than reference-hopping.

Part 2's groups (14+) don't follow this same "each depends on the last" logic — they're independent deep dives, not a continued front-to-back path, so their relative order only reflects how closely each one follows from Part 1 (architecture deep dives first, then the two AJAX APIs and filtering, then the three cross-cutting concerns, ending on the capstone that bridges to the Handbook). Groups 31–40 were scoped together at explicit user request and are being built in dependency order within that batch: the data-layer chapters first (Global Objects, then Products specifically, since the product-composition chapters need it), then the product-composition chapters that build on them (Product Cards, Product Reviews, Collection Filtering), then the standalone UI-component chapters (Buttons, Icons, Images, Videos), ending on the self-contained reference chapter (Input Settings) that doesn't depend on any of the others.

## Page conventions (match these exactly in every new page)

Every content page follows the same shape used throughout the Shopify Theme Handbook, so the two sites feel like one family:

- Frontmatter: `title` + `description`.
- A `**TL;DR:**` line right after the frontmatter, restating the description in one sentence.
- Starlight asides — `:::note[Title]`, `:::tip[Title]`, `:::caution[Title]` — for anything that needs visual separation from the main flow.
- A `## Do / Don't` two-column table **only** where it adds something the prose hasn't already said — a specific, common mistake worth contrasting against the right approach. Most pages won't have one. If the "Don't" column would just restate a sentence already written above it, leave the table out (a `:::caution` or `:::tip` aside, or a plain sentence, usually says it better anyway).
- A `## Key takeaways` bullet list on longer/denser pages.
- A `## Further reading` list at the end, linking to shopify.dev and/or other pages on this site.
- Every top-level sidebar group has its own `Overview` page (e.g. `theme-architecture.md`) that explains what the group covers and links to each sub-page, exactly like `getting-started.md` does in the handbook.
- Generic examples only. No `sol-` prefixes, no references to any specific theme's repo or files. If an example needs a name, invent a plain one (`hero-banner`, `product-card`) rather than borrowing a real project's naming convention.
- A Part 2 chapter is self-contained: no "assumes you've read Part 1" note, and no "as covered in [Part 1 page]" phrasing anywhere in its pages. Its first one or two sub-pages cover the topic's fundamentals from zero (what the thing is, the simplest working example), exactly as if Part 1 didn't exist, before building up through the same intermediate and advanced material the chapter always planned to cover. Overlap with Part 1 is expected and fine — a cross-link to a Part 1 page is offered as further reading, never as a prerequisite.
