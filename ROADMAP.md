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

Part 1 (groups 1–13 above) is a front-to-back path for someone who's never built a theme before — it stays exactly as it is, and nothing in Part 2 renumbers or disrupts it. Part 2 is a second, separate shelf of comprehensive, reference-depth chapters for after Part 1: each one goes much deeper on a single topic than Part 1 had room for, written for someone who already has the fundamentals and wants to go deep on one specific thing. Unlike Part 1, these don't need to be read in order relative to each other — each stands on its own, though every one still assumes all of Part 1.

Where a Part 2 topic already has an intro-level page in Part 1 (sections, blocks, snippets, colors, typography, media), that Part 1 page is left alone — it's still the right on-ramp for a first-time reader, and it's cross-linked from dozens of other pages. The Part 2 chapter is an additional, standalone deep dive, not a replacement.

## 14. All About Sections — `status: live`

Everything [Sections, Blocks & Snippets](/sections-blocks-snippets/) didn't have room for: `enabled_on`/`disabled_on` (restricting a section to specific templates or groups), `max_blocks`, practical schema-size limits, section-level performance considerations, and a wider set of real-world section patterns.

## 15. All About Blocks — `status: live`

Static blocks (`"static": true` — a block always present, not removable by a merchant), deeper nested-block patterns, `@app`/`@theme` targeting rules in full, block count limits, and advanced preset patterns.

## 16. All About Snippets — `status: live`

Recursive snippets, organizing a large snippet library as a theme grows, and the performance characteristics of `render` at scale.

## 17. All About Colors — `status: live`

Beyond [Color Settings & Color Schemes](/design-tokens/color-settings-and-color-schemes/): color formats and conversions, every color filter in depth with before/after examples, dark mode (`prefers-color-scheme`), building a full primitive → semantic → component token system, and a real contrast-testing workflow.

## 18. All About Typography — `status: live`

Beyond [Typography & font_picker](/design-tokens/typography-and-font-picker/): variable fonts, font-loading performance (`font-display`, preloading), fluid type scales in depth, and font fallback strategy for multi-language stores.

## 19. Media Deep Dive — `status: planned`

Beyond [Media & Assets](/media-and-assets/): art direction with `<picture>` (different crops per breakpoint, not just different sizes of the same crop), video loading/autoplay strategy, image CDN transform parameters beyond `width`, and performance budgets for media-heavy pages.

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

---

## Why this order

Groups 2–3 come before Liquid syntax (group 4) on purpose. Learning "a theme is made of these pieces, rendered in this order" first gives every later Liquid example somewhere to live — a `{% for %}` loop means more once you've seen the section it would loop inside. Groups 5–8 build outward from there: the data you render (objects), the settings merchants control (schema), and the two systems most requests are actually about (design tokens, forms). Group 9 (Figma to code) is placed after the reader has vocabulary for sections/blocks/snippets/settings, since that page's whole job is mapping a visual design onto those exact terms — it wouldn't land earlier. Groups 10–12 (CSS, JS, media) are deliberately last: important, but every example written so far already stood on its own without them, consistent with building for someone reading front-to-back for the first time rather than reference-hopping.

Part 2's groups (14+) don't follow this same "each depends on the last" logic — they're independent deep dives, not a continued front-to-back path, so their relative order only reflects how closely each one follows from Part 1 (architecture deep dives first, then the two AJAX APIs and filtering, then the three cross-cutting concerns, ending on the capstone that bridges to the Handbook).

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
- Every Part 2 group's Overview page opens with a `:::note[This is a Part 2 deep dive]` aside naming the specific Part 1 page it assumes the reader has already read, so a reader who lands on a Part 2 chapter directly knows where to go first if they haven't read Part 1 yet.
