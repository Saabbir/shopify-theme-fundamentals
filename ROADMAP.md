# Roadmap

The full long-term plan for this site, sidebar group by sidebar group. `Status: live` means the pages exist and are wired into `astro.config.mjs` today. `Status: planned` means the group is scoped but not written yet — do that work next, in order, following the same page conventions as the live groups (see "Page conventions" below).

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

## 11. JavaScript in Shopify Themes — `status: planned`

- Overview
- 11.1. The `{% javascript %}` Tag
- 11.2. Web Components for Theme Behavior
- 11.3. Theme Editor Events

## 12. Media & Assets — `status: planned`

- Overview
- 12.1. Images & Responsive Image Tags
- 12.2. Video & 3D Media
- 12.3. Icons & SVGs

## 13. Reference — `status: planned`

- Overview
- 13.1. Liquid Tag Reference
- 13.2. Liquid Filter Reference
- 13.3. Glossary
- 13.4. Cheatsheet

## Why this order

Groups 2–3 come before Liquid syntax (group 4) on purpose. Learning "a theme is made of these pieces, rendered in this order" first gives every later Liquid example somewhere to live — a `{% for %}` loop means more once you've seen the section it would loop inside. Groups 5–8 build outward from there: the data you render (objects), the settings merchants control (schema), and the two systems most requests are actually about (design tokens, forms). Group 9 (Figma to code) is placed after the reader has vocabulary for sections/blocks/snippets/settings, since that page's whole job is mapping a visual design onto those exact terms — it wouldn't land earlier. Groups 10–12 (CSS, JS, media) are deliberately last: important, but every example written so far already stood on its own without them, consistent with building for someone reading front-to-back for the first time rather than reference-hopping.

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
