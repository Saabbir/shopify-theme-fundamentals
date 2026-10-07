---
title: What Is a Block?
description: The configurable piece inside a section, and the difference between theme blocks and app blocks.
---

**TL;DR:** The configurable piece inside a section, and the difference between theme blocks and app blocks.

A **block** is a smaller, configurable piece that lives inside a section. Where a section is a whole page-level module (a "testimonials" section, say), a block is one repeatable item inside it (one single testimonial). A merchant can add, remove, and reorder blocks within a section from the theme editor, exactly like they do with sections at the page level — just one layer deeper.

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

Here, `testimonial` is defined entirely inside the section's own `schema.blocks` array. It only exists within this section — nothing else can use it.

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

A standalone block in `blocks/` can be referenced from any section's schema with `"@theme"` (covered below), making it reusable wherever it's needed, rather than redefined inline every time.

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

## Key takeaways

- A block is a configurable, repeatable piece inside a section — one layer below the page-level section itself.
- Blocks can be defined inline (one section only) or as standalone files in `blocks/` (reusable across sections, referenced via `"@theme"`).
- `"@app"` lets installed apps contribute their own blocks into your section through the theme editor.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
- [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) (shopify.dev)
