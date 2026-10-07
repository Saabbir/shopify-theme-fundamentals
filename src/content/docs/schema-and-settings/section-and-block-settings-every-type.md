---
title: "Section & Block Settings: Every Type"
description: The full catalog of setting types available in a section or block's schema, grouped by what they're for.
---

**TL;DR:** The full catalog of setting types available in a section or block's schema, grouped by what they're for.

Every setting, regardless of type, follows the same basic shape: an `id` (how you read it in Liquid), a `type`, and a `label` (what a merchant sees). This page groups every commonly used type by purpose, rather than listing them alphabetically.

## Text and rich content

```json
{ "type": "text", "id": "heading", "label": "t:labels.heading" },
{ "type": "textarea", "id": "note", "label": "t:labels.note" },
{ "type": "richtext", "id": "body", "label": "t:labels.body" },
{ "type": "inline_richtext", "id": "caption", "label": "t:labels.caption" },
{ "type": "liquid", "id": "custom_code", "label": "t:labels.custom_code" }
```

| Type | Merchant sees | Returns in Liquid |
|---|---|---|
| `text` | A single-line input | A plain string |
| `textarea` | A multi-line input | A plain string |
| `richtext` | A formatting toolbar (bold, links, lists) | HTML — output it directly, don't `escape` it |
| `inline_richtext` | A lighter toolbar (bold/italic/links only, no block-level formatting) | HTML, same as `richtext` but more restrictive |
| `liquid` | A raw code input | A string containing Liquid, which still needs to be rendered — see the note below |

:::note[A `liquid`-type setting needs to be rendered, not just printed]
Printing a `liquid` setting with plain `{{ }}` output shows the raw Liquid code as text, not its rendered result. Run it through the `render` filter instead: `{{ block.settings.custom_code | render }}`. This setting type exists specifically so a merchant (or a developer helping them) can drop in a small, custom snippet of Liquid without a new theme file — useful for one-off cases, but it's unescaped, so only expose it where you trust whoever can edit it.
:::

## Numbers and toggles

```json
{ "type": "number", "id": "max_items", "label": "t:labels.max_items" },
{ "type": "range", "id": "columns", "label": "t:labels.columns", "min": 1, "max": 6, "step": 1, "default": 3 },
{ "type": "checkbox", "id": "show_vendor", "label": "t:labels.show_vendor", "default": false }
```

Prefer `range` over `number` whenever the value has a sensible minimum and maximum — a plain `number` input lets a merchant type anything, including values that would break your layout. You've already seen this preference in the [spacing settings pattern](/sections-blocks-snippets/worked-example/) from the worked example, and it's the right default for most numeric settings, not just spacing.

## Choice settings

```json
{
  "type": "select",
  "id": "layout",
  "label": "t:labels.layout",
  "options": [
    { "value": "grid", "label": "t:options.grid" },
    { "value": "list", "label": "t:options.list" }
  ],
  "default": "grid"
},
{
  "type": "radio",
  "id": "alignment",
  "label": "t:labels.alignment",
  "options": [
    { "value": "left", "label": "t:options.left" },
    { "value": "center", "label": "t:options.center" }
  ],
  "default": "left"
}
```

`select` and `radio` behave almost identically in Liquid — both return the chosen `value` as a string. The difference is purely how a merchant interacts with them: `select` is a dropdown (better once you have more than 3–4 options), `radio` shows every option at once (better for 2–3 options where seeing them all side by side helps).

## Color

```json
{ "type": "color", "id": "accent_color", "label": "t:labels.accent_color", "default": "#121212" },
{ "type": "color_background", "id": "section_background", "label": "t:labels.section_background" },
{ "type": "color_scheme", "id": "color_scheme", "label": "t:labels.color_scheme" }
```

`color` returns a single color value. `color_background` is similar but allows a gradient, not just a flat color. `color_scheme` lets a merchant pick one of the theme's predefined color schemes (bundles of several coordinated colors) rather than a single value — a deeper look at how those schemes are defined is a natural fit for a later, planned chapter on design tokens.

## Media

```json
{ "type": "image_picker", "id": "image", "label": "t:labels.image" },
{ "type": "video", "id": "video", "label": "t:labels.video" },
{ "type": "video_url", "id": "external_video", "label": "t:labels.external_video", "accept": ["youtube", "vimeo"] }
```

`image_picker` returns an image object, exactly like `product.featured_image` from [Other Useful Objects](/global-objects/other-useful-objects/) — same properties, same `image_url` filter to build a URL from it. `video` is for a file uploaded directly to Shopify; `video_url` is for linking an external YouTube or Vimeo video instead.

## Resource pickers

```json
{ "type": "product", "id": "featured_product", "label": "t:labels.featured_product" },
{ "type": "collection", "id": "featured_collection", "label": "t:labels.featured_collection" },
{ "type": "product_list", "id": "featured_products", "label": "t:labels.featured_products", "limit": 6 },
{ "type": "collection_list", "id": "featured_collections", "label": "t:labels.featured_collections" },
{ "type": "blog", "id": "blog", "label": "t:labels.blog" },
{ "type": "page", "id": "page", "label": "t:labels.page" },
{ "type": "link_list", "id": "menu", "label": "t:labels.menu" }
```

These let a merchant pick an existing resource (one specific product, an entire collection, a navigation menu) rather than typing anything — each one returns the actual object (a `product`, a `collection`, and so on), ready to use exactly like the objects covered in the previous chapter.

## Key takeaways

- Every setting needs `id`, `type`, and `label` at minimum — `id` is how you read it in Liquid, `label` is what a merchant sees.
- `range` is almost always better than `number` for anything with a sensible min/max — it prevents a merchant from entering a value that breaks the layout.
- Resource-picker types (`product`, `collection`, `product_list`, and similar) return the real object, usable with everything from [Shopify's Global Objects](/global-objects/).

## Further reading

- [Full list of input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) (shopify.dev)
