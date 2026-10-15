---
title: Advanced Preset Patterns
description: Presets that ship with nested blocks already configured, not just flat lists.
---

**TL;DR:** Presets that ship with nested blocks already configured, not just flat lists.

[6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/) covered the basics: a `presets` entry gives a section sensible starting settings and blocks the moment a merchant adds it. This page covers a pattern that chapter didn't have room for — presets that pre-configure a nested block structure, not just a flat list of blocks.

## A flat preset, as a reminder

```json
{
  "presets": [
    {
      "name": "Testimonials",
      "blocks": [
        { "type": "testimonial" },
        { "type": "testimonial" },
        { "type": "testimonial" }
      ]
    }
  ]
}
```

This is what most presets look like — a flat list of block instances, each with its own type and optionally its own default settings.

## A preset with nested blocks

Once a section or block supports nesting (see [15.1. Block Fundamentals](/all-about-blocks/block-fundamentals/)), a preset's `blocks` array can itself contain blocks that have their own nested `blocks` array, so the layout a merchant sees on first adding the section already reflects the intended nested structure, instead of a flat pile of blocks they'd have to manually group themselves:

```json
{
  "presets": [
    {
      "name": "Featured collection",
      "blocks": [
        {
          "type": "group",
          "settings": { "direction": "row" },
          "blocks": [
            { "type": "image" },
            {
              "type": "group",
              "settings": { "direction": "column" },
              "blocks": [
                { "type": "text" },
                { "type": "button" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

This preset gives a merchant a group block laid out as a row, containing an image on one side and a nested column (text over a button) on the other — exactly the kind of layout that would otherwise take several manual steps in the theme editor to assemble from scratch.

## Why this matters more as nesting goes deeper

The deeper a theme leans on nested, recursive blocks (per [15.3. Advanced Nested Block Patterns](/all-about-blocks/advanced-nested-block-patterns/)), the more a merchant benefits from starting somewhere sensible rather than an empty container they have to populate themselves. A recursive group block is powerful specifically because it's unopinionated — but that same lack of opinion means an empty one, added fresh, gives a merchant no hint about the layout it's capable of. A good preset is often the only place that intended structure is actually communicated.

## Key takeaways

- A preset's `blocks` array can nest, mirroring exactly how the section or block itself supports nested children.
- A nested preset gives a merchant a sensible, pre-built starting layout instead of an empty or flat container they'd have to assemble themselves.
- This matters most for generic, recursive container blocks (like a layout "group"), where an empty instance otherwise gives no hint of what it's capable of.

## Further reading

- [6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/)
- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
