---
title: Nesting Blocks Inside Blocks
description: How blocks can now contain other blocks, several levels deep — the biggest recent change to theme architecture.
---

**TL;DR:** How blocks can now contain other blocks, several levels deep — the biggest recent change to theme architecture.

For a long time, the rendering chain stopped at one level of blocks: a section could contain blocks, but a block could never contain another block. That's no longer true. **Blocks can now hold other blocks**, nested as many levels deep as the design calls for. If you've read any older Shopify tutorials or blog posts, this is the single most likely thing to be out of date.

## What this actually looks like

Picture a "group" block — a plain container with no visual content of its own, used purely to hold other blocks in a specific layout (say, a row versus a column). That group block's schema can allow other blocks inside it, the same way a section allows blocks:

```liquid
{% comment %} blocks/group.liquid {% endcomment %}
{% liquid
  assign layout_direction = block.settings.direction | default: 'column'
%}

<div class="group group--{{ layout_direction }}" {{ block.shopify_attributes }}>
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Group",
  "settings": [
    {
      "type": "select",
      "id": "direction",
      "label": "Direction",
      "options": [
        { "value": "row", "label": "Row" },
        { "value": "column", "label": "Column" }
      ],
      "default": "column"
    }
  ],
  "blocks": [
    { "type": "@theme" }
  ]
}
{% endschema %}
```

`{% content_for 'blocks' %}` and `"blocks": [{ "type": "@theme" }]` are doing the same job here that they did inside a section — they just now appear inside a block's own file instead. A merchant can drop a text block, an image block, or even another group block inside this one, and that nested group can hold more blocks of its own.

## Why this changes how you plan a design

Before nesting existed, the only available layout was: section, then a flat list of blocks inside it. Now, a block itself can be a layout container. That means when you're deciding how to structure something (this matters a lot once you get to the planned "Figma to code" section later), you have a real choice between:

- A flat structure: one section with several sibling blocks.
- A nested structure: a "group" block containing other blocks, which might itself sit inside another group.

Nesting gives a merchant much finer control over layout directly from the theme editor (arranging blocks into rows and columns, say) without a developer having to build a bespoke section for every layout variation.

## Key takeaways

- Blocks can contain other blocks, nested to any depth — this is a genuinely new capability, not something themes have always supported.
- The mechanism is identical whether it's a section or a block doing the nesting: `{% content_for 'blocks' %}` in the markup, `"blocks"` in the schema.
- This unlocks merchant-controlled layout flexibility (rows, columns, grouping) without a developer building a new section for every variation.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
