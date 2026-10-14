---
title: "Resource Pickers: Full Objects, Not IDs"
description: product, collection, image_picker, and video all return the real, usable object — and none of them support a schema-level default at all.
---

**TL;DR:** `product`, `collection`, `image_picker`, and `video` all return the real, usable object — and none of them support a schema-level `default` at all.

## The return value is the real object, ready to use

```liquid
{{ section.settings.featured_product.title }}
{{ section.settings.featured_product.featured_image | image_url: width: 600 }}
{{ section.settings.featured_collection.products.size }}
{{ section.settings.image.alt }}
```

A `product`-type setting doesn't return a product ID that then needs a second lookup — `section.settings.featured_product` already *is* a full `product` object, with every property covered in [All About Products](/all-about-products/) available immediately. The same is true for `collection`, `image_picker` (a real `image` object, same shape as `product.featured_image`), `blog`, `page`, and every other resource-picker type. There's no `{% assign product = all_products[section.settings.featured_product_handle] %}` lookup step required or expected — if a theme is doing that, it's almost certainly working around a misunderstanding of what the setting already returns.

## No schema-level `default` for any resource picker

```json
{
  "type": "product",
  "id": "featured_product",
  "label": "t:labels.featured_product"
}
```

```json
{
  "type": "product",
  "id": "featured_product",
  "label": "t:labels.featured_product",
  "default": "some-handle"
}
```

The first is correct; the second simply doesn't work — `product`, `collection`, `product_list`, `collection_list`, `blog`, `page`, `link_list`, `image_picker`, `video`, and `video_url` have no `default` key at all. A merchant has to actively choose a value through the picker UI; there's no way for a developer to pre-select one in the schema itself, which is the real reason a section's `presets` entry (covered next) matters more for these settings than for almost any other type.

## Presets can't fill this gap either, for a store-specific resource

```json
{
  "presets": [
    {
      "name": "t:sections.featured-product.presets.default.name",
      "settings": {
        "columns": 3
      }
    }
  ]
}
```

A section's `presets` entry supplies real, sensible defaults the moment a merchant adds the section — covered as a hard requirement throughout this site's project conventions. But a `presets` setting can only pre-fill a value Shopify can resolve generically; it has no way to reference "this specific merchant's product," since that product doesn't exist until the merchant's own store does. This is the one real, unavoidable gap: a section using a `product`/`collection`/`image_picker` setting will always render in an empty, unselected state the first time it's added, and that's expected, not a bug to engineer around.

## The practical consequence: always build for the unselected state

```liquid
{% if section.settings.featured_product %}
  {% render 'product-card', card_product: section.settings.featured_product %}
{% else %}
  <p class="sol-empty-state">{{ 'sections.featured_product.empty_state' | t }}</p>
{% endif %}
```

Since a resource picker genuinely cannot have a default, every section or block using one needs a real, considered empty state — not just a blank gap in the layout — for the period between a merchant adding the section and actually picking something. [QA checklist](https://shopify.dev) conventions elsewhere on this site already call for testing an empty block state; a resource-picker setting is the single most common reason that state exists at all.

## Key takeaways

- Every resource-picker type (`product`, `collection`, `image_picker`, `video`, and the rest) returns the real, full object directly — never an ID requiring a second lookup.
- None of them support a schema-level `default` — a merchant always has to pick a value explicitly through the editor.
- `presets` can't substitute for a missing default here either, since it has no way to reference a specific merchant's own data.
- Always build a real, intentional empty state for the unselected case — it's the expected starting state for every section using one of these settings, not an edge case to dismiss.

## Further reading

- [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)
- [All About Products](/all-about-products/)
- [What Happens When a Referenced Resource Is Deleted](/all-about-input-settings/what-happens-when-a-referenced-resource-is-deleted/)
