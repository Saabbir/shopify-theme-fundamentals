---
title: Section Fundamentals
description: What a section is, how it's structured, and how to build the simplest one that actually works.
---

**TL;DR:** What a section is, how it's structured, and how to build the simplest one that actually works.

## What a section actually is

A **section** is a self-contained, reusable building block of a Shopify theme — a whole page-level module like a hero banner, a product grid, or a footer. It's a single Liquid file that bundles together its own markup, its own merchant-facing settings, and (when needed) its own CSS and JavaScript. A merchant adds, removes, reorders, and configures sections directly from the theme editor, with no code changes required.

## Where a section lives

Every section is a `.liquid` file inside a theme's `sections/` folder:

```
sections/
  hero-banner.liquid
  featured-collection.liquid
  footer.liquid
```

The filename becomes the section's type, used to reference it elsewhere in the theme (most commonly from a JSON template or a section group, covered below).

## The two halves of a section file

A section file has two parts: the Liquid markup it renders, and a `{% schema %}` block defining what a merchant can configure.

```liquid
{% comment %} sections/hero-banner.liquid {% endcomment %}
{% liquid
  assign heading = section.settings.heading
  assign button_label = section.settings.button_label
%}

<section class="hero-banner">
  <h1>{{ heading }}</h1>
  {% if button_label != blank %}
    <a href="{{ section.settings.button_url }}" class="hero-banner__button">{{ button_label }}</a>
  {% endif %}
</section>

{% schema %}
{
  "name": "Hero banner",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Welcome" },
    { "type": "text", "id": "button_label", "label": "Button label" },
    { "type": "url", "id": "button_url", "label": "Button link" }
  ],
  "presets": [
    { "name": "Hero banner" }
  ]
}
{% endschema %}
```

The Liquid above the `{% schema %}` tag is ordinary HTML and Liquid — it renders exactly what you'd expect. The `{% schema %}` block is JSON, not Liquid, and it's what makes the section configurable: each entry in `settings` becomes a control in the theme editor, and `section.settings.<id>` is how the rendered markup reads back whatever value a merchant chose.

## `presets` isn't optional

A section needs at least one entry under `presets` to be addable from the theme editor at all — without it, a merchant has no way to add this section to a page, even though the file itself is perfectly valid Liquid. `presets` also supplies the section's starting settings and blocks the moment it's added, so it should reflect a sensible, ready-to-look-good starting point, not be left empty.

## How a section actually gets used on a page

A section file existing in `sections/` doesn't, by itself, put it on any page. It has to be referenced from somewhere — most commonly a JSON template:

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "settings": {
        "heading": "Summer Collection"
      }
    }
  },
  "order": ["hero"]
}
```

`"type": "hero-banner"` points back at `sections/hero-banner.liquid` by filename. A template's `order` array controls which sections appear and in what sequence; a merchant can reorder this from the theme editor without you touching the JSON directly. (A section can also be placed inside a section group, like a theme's header or footer, which works the same way but outside the page-specific templates.)

## Letting a section hold repeatable content: blocks

Most real sections need to repeat some unit of content a variable number of times — testimonials, FAQ items, feature callouts. That repeatable piece is a **block**, declared in the section's schema and rendered with `{% content_for 'blocks' %}`:

```liquid
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
        { "type": "text", "id": "quote", "label": "Quote" }
      ]
    }
  ],
  "presets": [{ "name": "Testimonials" }]
}
{% endschema %}
```

A merchant can then add, remove, and reorder as many testimonial blocks as they want, each with its own quote — without a developer touching the section's code for each new testimonial.

## Key takeaways

- A section is one `.liquid` file in `sections/`, combining markup with a `{% schema %}` block that defines merchant-facing settings.
- `presets` is required for a section to be addable from the theme editor at all, and supplies its starting settings/blocks.
- A section does nothing on its own until referenced by `"type"` from a JSON template or a section group.
- Blocks, declared in a section's schema and rendered with `{% content_for 'blocks' %}`, let a merchant repeat a unit of content a variable number of times.

## Further reading

- [Sections](https://shopify.dev/docs/storefronts/themes/architecture#sections) (shopify.dev)
- [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) (shopify.dev)
