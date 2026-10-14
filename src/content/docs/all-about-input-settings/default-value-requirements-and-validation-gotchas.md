---
title: Default-Value Requirements & Validation Gotchas
description: A default isn't technically required by Liquid itself — but a setting with no sensible default still breaks a merchant's first impression, and Theme Check has real rules that catch related mistakes.
---

**TL;DR:** A default isn't technically required by Liquid itself — but a setting with no sensible default still breaks a merchant's first impression, and Theme Check has real rules that catch related mistakes.

## `default` is optional, technically — but silently risky to skip

```json
{ "type": "text", "id": "heading", "label": "t:labels.heading" }
```

Shopify doesn't force a `default` key on a `text`, `range`, `checkbox`, or similar setting — it's genuinely optional at the schema level. The real cost of skipping it shows up downstream instead: a setting with no `default` and no value yet entered returns an empty string in Liquid, which is indistinguishable from a merchant who deliberately cleared it. A section relying on `{% if section.settings.heading %}` to decide whether to render a heading at all behaves identically whether a merchant never touched the field or explicitly emptied it — usually fine, but worth being a deliberate choice rather than an accident of omitting `default`.

## `range` needs a `default` *within* its own bounds

```json
{
  "type": "range",
  "id": "columns",
  "min": 2,
  "max": 6,
  "step": 1,
  "default": 8
}
```

A `default` outside the declared `min`/`max` (like `8` here, against a max of `6`) is a real, common schema mistake — Shopify's editor won't silently clamp it for you at save time the way it clamps a merchant's own slider interaction; it's simply an invalid schema that needs catching before it ships. Running `shopify theme check` (or the `validate_theme` tool, per this project's own convention of checking every file immediately after writing it) catches this kind of mismatch directly, via its `ValidSchema` check, which validates a section or block's entire `{% schema %}` block as real, well-formed JSON against Shopify's own expected structure.

## Every `t:` key inside a schema needs a matching locale entry

```json
{ "type": "checkbox", "id": "show_vendor", "label": "t:labels.show_vendor" }
```

If `labels.show_vendor` doesn't exist in `locales/en.default.schema.json`, a merchant sees the literal text "Translation missing" instead of a real label in the theme editor — a schema referencing a `t:` key is only half the requirement; the matching locale file entry is the other half. Theme Check's `ValidSchemaTranslations` check exists specifically to catch this mismatch — [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) covers the full locale-file mechanics this depends on.

## A `presets` entry needs real, resolvable settings — not just any values

```json
{
  "presets": [
    {
      "name": "t:sections.featured-collection.presets.default.name",
      "settings": {
        "heading": "Featured Collection",
        "columns": 3
      }
    }
  ]
}
```

Per this project's own conventions, every section needs a `presets` entry with genuinely sensible defaults, not an empty object — a merchant adding the section for the first time should see something that already looks intentional, not a blank shell. [Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/) covers the one real limit on this: a `presets.settings` value can supply a `text`, `range`, or `select` value just fine, but can't pre-select a `product`/`collection`/`image_picker` value, since those settings have no concept of a schema-level default to begin with.

## Key takeaways

- `default` is technically optional on most setting types, but skipping it usually means an empty string in Liquid, indistinguishable from a merchant who deliberately cleared the field — make that a deliberate choice, not an oversight.
- A `range` setting's `default` must fall within its own declared `min`/`max`, or the schema is simply invalid — `shopify theme check`'s `ValidSchema` rule catches this.
- Every `t:` key referenced inside a `{% schema %}` block needs a matching entry in the locale file, or a merchant sees literal "Translation missing" text — `ValidSchemaTranslations` catches this mismatch.
- A `presets` entry needs real, considered default values for everything it *can* set — which excludes resource-picker settings entirely, since those have no concept of a default at all.

## Further reading

- [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)
- [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/)
- [Theme Check (shopify.dev)](https://shopify.dev/docs/storefronts/themes/tools/theme-check)
