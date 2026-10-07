---
title: Cheatsheet
description: The condensed, greatest-hits version of every caution and gotcha from the whole site, on one page.
---

**TL;DR:** The condensed, greatest-hits version of every caution and gotcha from the whole site, on one page.

This is the one page on this entire site meant to be read top to bottom in one sitting, after you've already read everything else — a fast way to refresh every non-obvious detail this site covered, without re-reading twelve chapters.

## The folder structure

```
assets · blocks · config · layout · locales · sections · snippets · templates
```
Eight folders, no others recognized. Only `layout/theme.liquid` is required.

## The rendering chain

```
layout → template → sections → blocks → (nested blocks)
```

## Every gotcha from this site, in one list

- **`0` and `""` are truthy in Liquid.** Only `nil` and `false` are falsy. Compare explicitly (`== 0`, `== blank`), don't rely on implicit truthiness for numbers or strings.
- **Liquid has no parentheses for grouping `and`/`or`.** For anything beyond two conditions, break the logic into intermediate `{% assign %}` booleans instead of guessing at evaluation order.
- **A wrong or misspelled property anywhere in a chain resolves to `nil` silently — it never errors.** "Nothing is showing up" means check spelling first.
- **`product`/`collection` are only in scope where one is actually in context** — unlike `cart`/`customer`/`shop`/`settings`/`request`/`routes`, which are available everywhere.
- **`customer` is `nil` for every logged-out visitor.** Always guard with `{% if customer %}` before reading its properties.
- **`settings_data.json` only stores *global* settings values** — a section's or block's own settings live in that section's JSON template instead.
- **`visible_if` can only reference other settings in the same section/block** — not block counts, global settings, or page context. And hiding a setting doesn't clear its stored value.
- **Every schema `label`/`name` should be a `t:` key**, from a `.schema.json` locale file — not the same file storefront text uses.
- **A `font_picker` setting still needs `| font_face` output somewhere, once, or the font never actually loads** — silently, with no error.
- **Never decide mobile vs. desktop (or anything responsive) with a device check in Liquid.** It can't react to resizing, and it breaks the theme editor's live preview. Always two settings + a CSS `@media` query instead.
- **`{% stylesheet %}` and `{% javascript %}` don't evaluate Liquid at all.** Settings reach them through a `data-*` attribute or an inline CSS custom property on the markup — never directly.
- **`{% stylesheet %}` provides no automatic CSS isolation** — every section's CSS is bundled into one shared, global file. BEM plus a consistent prefix is what actually prevents collisions.
- **`name="id"` in a product form must be the variant ID, not the product ID.**
- **Cart form `updates[]` is indexed by `forloop.index` (1-based)**, matching line position — not `forloop.index0`, and not a variant ID.
- **`divided_by` does integer division when both sides are whole numbers.** Use a float on at least one side for a decimal result.
- **A snippet's scope is fully isolated** — it only sees variables explicitly passed via `{% render %}`, never anything from its caller implicitly.
- **A Web Component's markup must work before its script loads.** Enhance working HTML with JavaScript; never require JavaScript for basic content to appear.
- **`shopify:section:load` fires every time the theme editor re-renders a section** — a component that only initializes once, in `connectedCallback`, can break the moment a merchant edits that section live.
- **Never lazy-load the one image visible at page load.** `loading="lazy"` is right for almost everything else.
- **An icon-only control needs its own accessible label** (`aria-label`, or visually-hidden text) — a decorative icon next to text that already says the same thing needs `aria-hidden="true"` instead.

## Quick settings-type picks

| Need | Reach for |
|---|---|
| A bounded number (spacing, columns) | `range`, not `number` |
| A handful of exclusive options | `select` (3+ options) or `radio` (2–3) |
| Several coordinated colors picked as one unit | `color_scheme_group` + `color_scheme` |
| A fixed-structure chunk of rich text | `richtext` (or `inline_richtext` for lighter formatting) |
| An existing product/collection/menu, not freeform text | A resource-picker type (`product`, `collection`, `link_list`, ...) |

## The one naming habit that prevents the most problems

Pick **one consistent prefix** and apply it everywhere: CSS classes, CSS custom properties, custom element tag names, `data-*` attributes. It's the single cheapest habit on this entire site, and it's what prevents a theme's own code from colliding with itself, with an app's injected code, or with any other script sharing the page.

## Further reading

- Every linked term above goes back to the chapter that taught it in full — this page is a memory jog, not a replacement for any of them.
