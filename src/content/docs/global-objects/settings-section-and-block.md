---
title: "settings, section & block"
description: A quick reference for three objects already covered in depth in earlier chapters.
---

**TL;DR:** A quick reference for three objects already covered in depth in earlier chapters.

You've already used all three of these extensively — this page exists as a quick lookup, not a re-teaching. For the full explanation of how sections, blocks, and schema work, see [3. Sections, Blocks & Snippets](/sections-blocks-snippets/).

## `settings`

`settings` reads the theme's **global** settings — the ones defined in `config/settings_schema.json`, set once for the whole theme rather than per-section.

```liquid
{{ settings.heading_font }}
{{ settings.social_instagram_link }}
```

Every property under `settings` corresponds to an `id` in that global schema file. Unlike `section.settings`, this object is available on every page, since global settings apply theme-wide.

## `section`

`section` gives you the current section's own settings and metadata — the object behind everything in [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/).

```liquid
{{ section.settings.heading }}
{{ section.id }}
{{ section.blocks }}
{{ section.index }}
```

| Property | Is |
|---|---|
| `section.settings.*` | Whatever this specific section instance has configured, keyed by each setting's `id` |
| `section.id` | A unique ID for this instance of the section on the page |
| `section.blocks` | The array of blocks a merchant has added to this section, in order |
| `section.index` | This section's position (1-based) among all sections on the current page |

## `block`

`block` is the equivalent object one level down, available inside a block's own file — the object behind everything in [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/).

```liquid
{{ block.settings.quote }}
{{ block.type }}
{{ block.id }}
{{ block.shopify_attributes }}
```

| Property | Is |
|---|---|
| `block.settings.*` | This specific block instance's configured values |
| `block.type` | The block's type string, as defined in its schema |
| `block.shopify_attributes` | The hidden attributes the theme editor needs for click-to-select — see [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/) |

## Further reading

- [The `settings` object](https://shopify.dev/docs/api/liquid/objects/settings) (shopify.dev)
- [The `section` object](https://shopify.dev/docs/api/liquid/objects/section) (shopify.dev)
- [The `block` object](https://shopify.dev/docs/api/liquid/objects/block) (shopify.dev)
