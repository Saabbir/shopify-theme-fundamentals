---
title: Advanced Nested Block Patterns
description: Real layout patterns built from nested blocks, and where nesting stops being a good idea.
---

**TL;DR:** Real layout patterns built from nested blocks, and where nesting stops being a good idea.

[15.1. Block Fundamentals](/all-about-blocks/block-fundamentals/) introduced block nesting with a single "group" block example. This page works through a few real patterns built on top of that mechanism, and where nesting starts costing more than it's worth.

## Pattern: rows and columns from one recursive block

The single biggest payoff of nesting is that one "group" block, used recursively, can build arbitrarily complex layouts without a developer writing a new section for each arrangement:

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
  "blocks": [{ "type": "@theme" }]
}
{% endschema %}
```

A merchant can nest a "row" group inside a "column" group, and another "row" group inside that, building a layout like a two-column section where one column itself splits into a stacked image-over-text arrangement — entirely from the theme editor, with no developer involvement, because the same group block type is doing all of it recursively.

## Pattern: a card that's really a group with constraints

Not every container block should accept literally any other block. A "card" block (image, heading, text, button, all inside a bordered box) is really a specialized group — but one that makes sense with a narrower set of children than a general-purpose layout group:

```json
{
  "name": "Card",
  "blocks": [
    { "type": "@theme", "name": "text" },
    { "type": "@theme", "name": "image" },
    { "type": "@theme", "name": "button" }
  ]
}
```

This is the same targeting idea covered in full on [15.4. @app and @theme Targeting in Full](/all-about-blocks/app-and-theme-targeting-in-full/) — a container block doesn't have to accept every block type just because it's a container.

## Where nesting stops being a good idea

Nesting is powerful precisely because it's flexible, and that flexibility has a real cost once it's overused:

- **Deep nesting is hard for a merchant to navigate.** A group, inside a group, inside a group, inside a group gets genuinely difficult to understand and edit in the theme editor's block list, even though nothing technically stops you from building it.
- **Deep nesting is hard for a developer to debug.** When something looks wrong visually, tracing which of several nested group blocks is responsible for a given CSS rule or spacing value takes real effort, proportional to how deep the nesting goes.
- **Not every layout need calls for a generic group.** If a design always needs the exact same "image left, text right" arrangement, a purpose-built block (or even just fixed markup in the section) is often clearer and more maintainable than achieving the same visual result through two or three levels of a generic group block.

:::tip[A sensible rule of thumb]
If you find yourself nesting a generic group block more than two or three levels deep to achieve one specific, recurring layout, that's usually a sign to build a dedicated block for that layout instead — trading some merchant flexibility for something far easier to understand, debug, and maintain.
:::

## Key takeaways

- A single recursive "group" block type can build a wide range of layouts without new sections, by nesting the same block type inside itself.
- A container block doesn't have to accept every block type — narrowing which types it accepts (see the targeting chapter) keeps a specialized container like a "card" focused.
- Nesting has real limits: past two or three levels deep, both merchant usability and developer debuggability suffer. A purpose-built block is often the better trade at that point.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
