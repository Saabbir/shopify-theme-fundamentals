---
title: A Complete Block Example
description: One full, realistic set of block files, combining nesting, static blocks, and presets into a single worked example.
---

**TL;DR:** One full, realistic set of block files, combining nesting, static blocks, and presets into a single worked example.

Every other page in this chapter looked at one block feature in isolation. This page puts them together: a complete `sections/feature-row.liquid`, a standalone `blocks/feature-card.liquid` that can itself hold nested children, and a small `blocks/section-heading.liquid` used as a **static** block — all wired together exactly as they'd exist in a real theme.

## What this example builds

A "feature row" section: a fixed heading at the top that a merchant can edit but never remove or delete, followed by a merchant-addable row of feature cards, where each card can optionally hold its own small list of nested bullet points.

## The section: `sections/feature-row.liquid`

```liquid
{% comment %}
  sections/feature-row.liquid

  A fixed heading (a static block, always present) followed by a
  merchant-addable row of feature-card blocks.
{% endcomment %}
<div class="feature-row">
  {% content_for 'block', type: 'section-heading', id: 'feature-row-heading' %}

  <div class="feature-row__cards">
    {% content_for 'blocks' %}
  </div>
</div>

{% schema %}
{
  "name": "t:sections.feature_row.name",
  "max_blocks": 6,
  "blocks": [
    {
      "type": "section-heading",
      "name": "t:blocks.section_heading.name",
      "static": true,
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "t:labels.heading",
          "default": "Why shop with us"
        }
      ]
    },
    { "type": "@theme" }
  ],
  "presets": [
    {
      "name": "t:sections.feature_row.name",
      "blocks": [
        {
          "type": "feature-card",
          "settings": { "title": "Free shipping", "text": "On every order over $50." }
        },
        {
          "type": "feature-card",
          "settings": { "title": "Easy returns", "text": "30 days, no questions asked." },
          "blocks": [
            { "type": "bullet", "settings": { "text": "Free return shipping" } },
            { "type": "bullet", "settings": { "text": "Refund within 5 business days" } }
          ]
        },
        {
          "type": "feature-card",
          "settings": { "title": "24/7 support", "text": "Real humans, every day of the week." }
        }
      ]
    }
  ]
}
{% endschema %}
```

Notice `"blocks"` mixes exactly one static entry (`section-heading`) with `{ "type": "@theme" }`. The static block is declared once, by its specific type; `@theme` separately opens the door to any other theme block — in this case, `feature-card` — being added freely by a merchant. These two are independent: a section can have zero, one, or several static blocks, entirely separate from whatever it also allows through `@theme` or `@app`.

## The static block: `blocks/section-heading.liquid`

```liquid
{% comment %} blocks/section-heading.liquid — rendered only as a static block {% endcomment %}
{% liquid
  assign heading = block.settings.heading
%}

<h2 class="feature-row__heading" {{ block.shopify_attributes }}>{{ heading }}</h2>

{% schema %}
{
  "name": "t:blocks.section_heading.name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:labels.heading"
    }
  ]
}
{% endschema %}
```

This file looks like any other block — the `"static": true` key lives in the section's schema (above), not here. The same block type could, in principle, also be used as an ordinary addable block in a different section that doesn't mark it static; nothing about this file itself makes it static.

## The nesting standalone block: `blocks/feature-card.liquid`

```liquid
{% comment %} blocks/feature-card.liquid {% endcomment %}
{% liquid
  assign title = block.settings.title
  assign text = block.settings.text
%}

<div class="feature-card" {{ block.shopify_attributes }}>
  <h3 class="feature-card__title">{{ title }}</h3>
  {% if text != blank %}
    <p class="feature-card__text">{{ text }}</p>
  {% endif %}

  {% if block.blocks.size > 0 %}
    <ul class="feature-card__bullets">
      {% content_for 'blocks' %}
    </ul>
  {% endif %}
</div>

{% schema %}
{
  "name": "t:blocks.feature_card.name",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "t:labels.title"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "t:labels.text"
    }
  ],
  "blocks": [
    { "type": "@theme" }
  ]
}
{% endschema %}
```

`feature-card`'s own schema declares `"blocks": [{ "type": "@theme" }]` — exactly the mechanism from [Block Fundamentals](/all-about-blocks/block-fundamentals/) that lets a block hold other blocks, just applied here instead of at the section level. `{% content_for 'blocks' %}` inside this file is what renders whatever children a merchant has nested inside this specific card.

## The nested child: `blocks/bullet.liquid`

```liquid
{% comment %} blocks/bullet.liquid — meant to be nested inside feature-card, but not restricted to only that parent {% endcomment %}
{% liquid
  assign text = block.settings.text
%}

<li class="bullet" {{ block.shopify_attributes }}>{{ text }}</li>

{% schema %}
{
  "name": "t:blocks.bullet.name",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "t:labels.text"
    }
  ]
}
{% endschema %}
```

## Every concern from this chapter, in one place

- **A standalone block reusable via `@theme`** — `feature-card` and `bullet` both live in `blocks/` as their own files, per [Block Fundamentals](/all-about-blocks/block-fundamentals/), rather than being defined inline inside the section.
- **A static block** — `section-heading` is declared with `"static": true` in the section's schema and rendered at a fixed position with `{% content_for 'block', type:, id: %}`, per [Static Blocks](/all-about-blocks/static-blocks/). A merchant can edit its heading text but can't remove it or move it below the cards.
- **Nested blocks, two levels deep** — a `feature-card` can hold `bullet` blocks, demonstrating the same recursive mechanism from [Advanced Nested Block Patterns](/all-about-blocks/advanced-nested-block-patterns/): `block.blocks.size`, `{% content_for 'blocks' %}`, and `"blocks": [{ "type": "@theme" }]`, all used inside a block's own file instead of a section's.
- **`@theme` targeting** — the section allows any theme block via `@theme` rather than hardcoding `feature-card` by name, per [@app and @theme Targeting in Full](/all-about-blocks/app-and-theme-targeting-in-full/); the same section could be extended later to also accept `@app` blocks without changing this structure.
- **A bounded limit** — `max_blocks: 6` caps the row at six cards, per [Block Limits](/all-about-blocks/block-limits/).
- **A nested preset** — the section's `presets` entry pre-builds one card with nested bullets already filled in, per [Advanced Preset Patterns](/all-about-blocks/advanced-preset-patterns/), so a merchant sees the nesting in action immediately instead of an empty card.
- **`block.shopify_attributes` on every block's outermost element** — `section-heading`, `feature-card`, and `bullet` all include it, so the theme editor can select any of them individually, at any nesting depth.
- **Translated schema strings throughout**, matching the pattern from [A Complete Locale File Example](/all-about-theme-settings/a-complete-locale-file-example/).

## Key takeaways

- A static block and `@theme`-targeted ordinary blocks can coexist in the same section's `blocks` array — they're independent, unrelated settings.
- A block gains the ability to hold children the exact same way a section does: its own `"blocks": [{ "type": "@theme" }]` entry plus `{% content_for 'blocks' %}` in its own file.
- A preset's `blocks` array can pre-configure nested structure too, not just a flat list — worth doing whenever an empty instance wouldn't hint at what the block is capable of.

## Further reading

- [A Complete Section Example](/all-about-sections/a-complete-section-example/)
- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
