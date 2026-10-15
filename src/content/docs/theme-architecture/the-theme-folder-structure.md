---
title: The Theme Folder Structure
description: The 8 top-level folders every Shopify theme has, and what belongs in each one.
---

**TL;DR:** The 8 top-level folders every Shopify theme has, and what belongs in each one.

Every Shopify theme uses the exact same top-level folder layout. This isn't a convention you're free to deviate from — Shopify only recognizes these 8 folder names at the top level, and ignores anything else you create there.

```
.
├── assets       # CSS, JS, images, fonts — anything referenced via asset_url
├── blocks       # Reusable, nestable blocks
├── config       # settings_schema.json, settings_data.json
├── layout       # theme.liquid — the outermost wrapper
├── locales      # Translation files, one per language
├── sections     # Full-width, merchant-addable page modules + section groups
├── snippets     # Small, reusable Liquid partials
└── templates    # One file per page type, usually JSON
```

Only `layout/theme.liquid` is strictly required to have a working theme. Every other folder gets added as you build features that need it.

## What goes where

| Folder | Put here | Don't put here |
|---|---|---|
| `assets/` | Compiled CSS/JS, images, fonts | Liquid logic (assets are static files — though `.css.liquid`/`.js.liquid` extensions exist for limited cases) |
| `blocks/` | Any block meant to be reused across multiple sections | A block only ever used in one section (define it inline in that section instead — see [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/)) |
| `config/` | Global theme settings | Settings that only one specific section or block needs (those live in that section's or block's own schema) |
| `layout/` | Repeated page chrome: `<head>`, the overall page wrapper | Page-specific content |
| `locales/` | All merchant- and customer-facing text | Anything hardcoded that should be translatable |
| `sections/` | Page-level, merchant-addable modules | Tiny reusable fragments (that's a snippet) |
| `snippets/` | Small Liquid partials rendered with `{% render %}` | Anything that needs its own settings UI in the theme editor (that's a section or block) |
| `templates/` | One file per page type (home, product, collection, etc.) | Layout chrome (that's `layout/`) |

## A worked example: where does this file go?

Say you're building a feature that shows a "related products" strip at the bottom of a product page. Here's how you'd reason through where each piece of it belongs.

| Question | Answer | Conclusion |
|---|---|---|
| Does a merchant need to add, remove, or reorder it? | Yes — as a section on the product page | It's a **section**, in `sections/` |
| Does it need its own repeatable, merchant-configurable sub-items? | No — it's generated automatically from product data, not manually curated | No blocks needed |
| Is there markup reused elsewhere (say, rendering one product card)? | Yes — the same card markup also appears on collection pages | Extract that into a **snippet** in `snippets/`, rendered with explicit parameters |
| Does anything need its own JavaScript? | Not for a basic version | Nothing in `assets/` yet — add it later if the feature grows interactive behavior |

```liquid
{% comment %} sections/related-products.liquid {% endcomment %}
<div class="related-products">
  {% for product in related_products limit: 4 %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

:::caution[A mistake worth knowing about up front]
Don't create your own top-level folders, like `components/` or `styles/`, even though that's a normal pattern in general web projects. Only the 8 folders above are recognized — Shopify silently ignores anything else you create at that level, with no error to tell you it didn't do anything.
:::

## Key takeaways

- 8 top-level folders, no others recognized: `assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`.
- Only `layout/theme.liquid` is strictly required — everything else gets added as needed.
- When unsure where something goes, ask: does a merchant edit it visually? Does it render with different data each time it's used? Does it need its own settings?

## Further reading

- [Theme architecture: directory structure](https://shopify.dev/docs/storefronts/themes/architecture#directory-structure-and-component-types) (shopify.dev)
