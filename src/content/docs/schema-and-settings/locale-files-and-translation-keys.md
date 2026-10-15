---
title: Locale Files & Translation Keys
description: The two kinds of locale file, and why schema text should never be hardcoded.
---

**TL;DR:** The two kinds of locale file, and why schema text should never be hardcoded.

Every piece of text a shopper or merchant reads should be translatable, not hardcoded directly into a `.liquid` file or a schema. Locale files, in `locales/`, are where that translatable text actually lives — one file per language.

## Two different locale files, for two different audiences

This is the single most important distinction on this page, and it's easy to miss: there are two kinds of locale file, used in two different places, with two different lookup mechanisms.

| File | Translates | Used with |
|---|---|---|
| `locales/en.default.json` | Storefront text — anything a **shopper** reads on the actual site | The `t` filter: `{{ 'key' \| t }}` |
| `locales/en.default.schema.json` | Schema text — setting labels, section names, option labels, anything a **merchant** reads in the theme editor | The `"t:key"` prefix inside a schema's JSON |

Mixing these up is a common early mistake: a string added to the wrong file simply won't resolve — it'll either print the raw key name or (for a schema string) show literally as `t:labels.something` in the editor instead of real text.

## Storefront text: `.json` + the `t` filter

```json
{
  "cart": {
    "title": "Your cart",
    "item_count": {
      "one": "{{ count }} item",
      "other": "{{ count }} items"
    }
  }
}
```

```liquid
{{ 'cart.title' | t }}
{{ 'cart.item_count' | t: count: cart.item_count }}
```

Keys can be nested (`cart.title` reaches into the `cart` object, then `title`), and a key can branch by count for pluralization — `one` for exactly one item, `other` for everything else, resolved automatically based on the `count` argument you pass in.

## Schema text: `.schema.json` + the `t:` prefix

```json
{
  "labels": {
    "heading": "Heading",
    "background_style": "Background style"
  },
  "options": {
    "preset": "Preset",
    "custom": "Custom"
  }
}
```

```json
{
  "type": "text",
  "id": "heading",
  "label": "t:labels.heading"
}
```

Every `label`, section `name`, and option `label` inside a `{% schema %}` block should use this `t:` pattern instead of a plain hardcoded string — this is exactly the convention you've seen in every schema example since [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/).

:::caution[Why this matters beyond just "being thorough"]
A hardcoded schema string isn't a smaller problem than hardcoded storefront text — it's often a bigger one. A merchant managing their store in French or German sees your schema labels directly in their theme editor; "Heading" never becoming "Titre" or "Überschrift" is a visible, permanent gap for every non-English merchant using this theme, not a cosmetic nitpick. Shopify's own Theme Store review checks for exactly this.
:::

## The `.default` suffix marks the fallback language

Exactly one locale pair (`en.default.json` / `en.default.schema.json`, typically) carries `.default` in its filename — this is the language Shopify falls back to whenever a shopper's or merchant's language has no translation file of its own. Every other language (`fr.json` / `fr.schema.json`, `de.json` / `de.schema.json`) omits `.default`.

## Key takeaways

- Storefront text goes in `<locale>.json`, read with the `t` filter. Schema text goes in `<locale>.schema.json`, referenced with a `"t:key"` prefix. They're not interchangeable.
- Every schema `label`, section `name`, and option `label` should be a `t:` key — a hardcoded schema string is a real, visible gap for any merchant using the theme in another language.
- Exactly one locale pair carries `.default` in the filename, marking the fallback language used when no translation exists for a shopper's or merchant's language.

## Further reading

- [Locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales) (shopify.dev)
- [The `t` filter](https://shopify.dev/docs/api/liquid/filters/t) (shopify.dev)
