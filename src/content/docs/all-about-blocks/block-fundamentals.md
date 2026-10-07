---
title: Block Fundamentals
description: What a block is, the two ways to define one, and the difference between theme blocks and app blocks.
---

**TL;DR:** What a block is, the two ways to define one, and the difference between theme blocks and app blocks.

## What a block actually is

A **block** is a smaller, configurable, repeatable piece that lives inside a section (or, as covered below, inside another block). Where a section is a whole page-level module — a "testimonials" section, say — a block is one repeatable item inside it: one single testimonial. A merchant can add, remove, and reorder blocks within a section from the theme editor, exactly like they do with sections at the page level, just one layer deeper.

## Two ways to define a block

A block can be defined **inline**, directly inside the section file that uses it, or as a **standalone file** in `blocks/`, reusable across multiple sections.

### Inline blocks

```liquid
{% comment %} sections/testimonials.liquid {% endcomment %}
<div class="testimonials">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Testimonials",
  "blocks": [
    {
      "type": "testimonial",
      "name": "Testimonial",
      "settings": [
        { "type": "text", "id": "quote", "label": "Quote" },
        { "type": "text", "id": "author", "label": "Author" }
      ]
    }
  ],
  "presets": [{ "name": "Testimonials" }]
}
{% endschema %}
```

Here, `testimonial` is defined entirely inside the section's own `schema.blocks` array. It only exists within this section — nothing else in the theme can use it.

### Standalone blocks (in `blocks/`)

```liquid
{% comment %} blocks/testimonial.liquid {% endcomment %}
{% liquid
  assign quote = block.settings.quote
  assign author = block.settings.author
%}

<blockquote {{ block.shopify_attributes }}>
  <p>{{ quote }}</p>
  <cite>{{ author }}</cite>
</blockquote>

{% schema %}
{
  "name": "Testimonial",
  "settings": [
    { "type": "text", "id": "quote", "label": "Quote" },
    { "type": "text", "id": "author", "label": "Author" }
  ]
}
{% endschema %}
```

A standalone block in `blocks/` can be referenced from any section's schema with `"@theme"` (covered below), making it reusable wherever it's needed, instead of being redefined inline every time it's needed somewhere new.

:::tip[`block.shopify_attributes`]
Always include `{{ block.shopify_attributes }}` on a block's outermost element. It outputs the hidden data attributes the theme editor needs to highlight and select that specific block when a merchant clicks it — without it, clicking a block in the editor won't reliably select the right element.
:::

## Theme blocks vs. app blocks

A section's schema can allow two different kinds of blocks:

| Block source | What it is | How a section allows it |
|---|---|---|
| **Theme block** | A block defined by the theme itself, in `blocks/` or inline | `"type": "@theme"` in the section's `blocks` array |
| **App block** | A block provided by an installed Shopify app (a reviews widget, a countdown timer) | `"type": "@app"` in the section's `blocks` array |

```json
{
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
```

Allowing `@app` blocks matters more than it might seem: it's what lets a merchant drop an app's widget directly into your section through the theme editor, instead of the app being stuck in its own separate, less flexible placement. Many themes explicitly design their main content sections to accept both.

## Blocks can contain other blocks

For a long time, the rendering chain stopped at one level: a section could contain blocks, but a block could never contain another block. That's no longer true — **blocks can hold other blocks**, nested as many levels deep as a design calls for. A "group" block — a plain container with no visual content of its own, used purely to hold other blocks in a specific layout — is the clearest example:

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

`{% content_for 'blocks' %}` and `"blocks": [{ "type": "@theme" }]` do exactly the same job here that they do inside a section — they just now appear inside a block's own file instead. A merchant can drop a text block, an image block, or even another group block inside this one, and that nested group can hold more blocks of its own, to whatever depth the design needs.

## Key takeaways

- A block is a configurable, repeatable piece one layer below the page-level section (or, for a nested block, one layer below its parent block).
- Blocks can be defined inline (one section only) or as standalone files in `blocks/` (reusable anywhere via `"@theme"`).
- `"@app"` lets installed apps contribute their own blocks into a section through the theme editor.
- Blocks can contain other blocks, nested to any depth — the mechanism is identical to a section containing blocks, just one level deeper.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
- [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) (shopify.dev)
