---
title: Presets & Defaults
description: The difference between a setting's default and a schema's presets, and how the two interact.
---

**TL;DR:** The difference between a setting's `default` and a schema's `presets`, and how the two interact.

These two words sound similar and solve related problems, which is exactly why they're easy to mix up. They operate at different levels: `default` belongs to one single setting; `presets` belongs to the whole section or block.

## `default`: a fallback for one setting

Every individual setting can have a `default` — the value it starts at if nothing else overrides it.

```json
{
  "type": "text",
  "id": "heading",
  "label": "t:labels.heading",
  "default": "Welcome"
}
```

If a merchant never touches this setting, `section.settings.heading` is `"Welcome"`. Not every setting needs one — a `product` picker, for instance, has no sensible default since there's no "correct" product to start with — but giving a text or number setting a default means a section never looks broken or empty the moment it's added, before a merchant configures anything.

## `presets`: a starting configuration for the whole section

`presets` lives outside `settings`, as its own top-level array in the schema. Each entry defines what a merchant sees in the "Add section" list, and what settings (and blocks) that section starts with the moment it's added.

```json
{
  "name": "Hero banner",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:labels.heading", "default": "Welcome" }
  ],
  "blocks": [
    { "type": "button", "name": "Button", "settings": [] }
  ],
  "presets": [
    {
      "name": "Hero banner",
      "settings": {
        "heading": "Summer Sale"
      },
      "blocks": [
        { "type": "button" }
      ]
    }
  ]
}
```

This preset overrides `heading`'s own `default` ("Welcome") with `"Summer Sale"` specifically for this preset, and pre-populates the section with one button block already added — so a merchant adding this section sees it fully formed, not empty.

## Why a section can have more than one preset

A schema's `presets` array can have more than one entry, and each becomes its own separate choice in the "Add section" list — useful when the same section file can meaningfully start in a few different common configurations.

```json
"presets": [
  { "name": "Hero banner — centered", "settings": { "alignment": "center" } },
  { "name": "Hero banner — left aligned", "settings": { "alignment": "left" } }
]
```

Both presets use the exact same section file and the exact same schema — they just hand a merchant two different, sensibly pre-configured starting points instead of one.

## How they interact, in order

When a merchant adds a section from a specific preset, Shopify resolves each setting's value in this order: the preset's own value for that setting, if the preset specifies one; otherwise, that setting's own `default`; otherwise, the setting has no value at all (which is fine for picker types, but worth avoiding for text/number settings a template directly relies on).

## Key takeaways

- `default` is per-setting, a fallback value for when nothing else sets it. `presets` is per-section/block, a named starting configuration that can override several defaults and pre-add blocks at once.
- A schema can define multiple presets — each becomes a separate option in the theme editor's "Add section" picker.
- Always give at least one preset a real `name`, and real values for anything the section would otherwise render strangely without — this was the same rule from [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/), just explained in more depth here.

## Further reading

- [Presets](https://shopify.dev/docs/storefronts/themes/architecture/settings/presets) (shopify.dev)
