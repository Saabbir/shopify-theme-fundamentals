---
title: What Is a Section?
description: The page-level module a merchant can add, remove, and reorder from the theme editor.
---

**TL;DR:** The page-level module a merchant can add, remove, and reorder from the theme editor.

A **section** is a self-contained, page-level piece of content — a hero banner, a product grid, a newsletter signup, a footer. Sections are what a merchant actually sees and manipulates in Shopify's theme editor: they can add a section to a page, remove one, drag to reorder them, and change its settings, all without touching code. This is what the `sections` list in a [JSON template](/theme-architecture/templates-json-vs-liquid/) refers to.

## Anatomy of a section file

A section lives in `sections/` as a single `.liquid` file, with three parts: the markup, optional styling, and a schema describing its settings.

```liquid
{% comment %} sections/hero-banner.liquid {% endcomment %}
{% liquid
  assign heading = section.settings.heading
  assign button_label = section.settings.button_label
  assign button_url = section.settings.button_url
%}

<div class="hero-banner">
  <h1>{{ heading }}</h1>
  {% if button_label != blank and button_url != blank %}
    <a href="{{ button_url }}">{{ button_label }}</a>
  {% endif %}
</div>

{% stylesheet %}
  .hero-banner {
    text-align: center;
    padding-block: 4rem;
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Hero banner",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome"
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Button label"
    },
    {
      "type": "url",
      "id": "button_url",
      "label": "Button link"
    }
  ],
  "presets": [
    {
      "name": "Hero banner"
    }
  ]
}
{% endschema %}
```

Three things are doing the work here:

| Part | What it does |
|---|---|
| The markup | Ordinary Liquid and HTML, reading `section.settings.*` for anything a merchant should be able to change. |
| `{% stylesheet %}` | CSS scoped to this section's markup. Covered in detail in a later, planned CSS section. |
| `{% schema %}` | A JSON block describing every setting this section exposes, and the `presets` a merchant sees when adding it for the first time. |

The `schema` block is what makes a section editable in the theme editor at all. Without it, a section still renders, but a merchant has nothing to configure — every setting a merchant can touch in the editor comes directly from an entry in this list.

## Why `presets` matters

The `presets` array defines what a merchant sees the moment they add this section for the first time — which default settings it starts with. A section with an empty or missing preset can add it to a page and see a confusing blank result. Always give a section at least one sensible preset with real default values, so it looks correct the instant it's added.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Give every section a `presets` entry with real, sensible defaults, so it looks right the moment it's added. | **Leaving `presets` empty**, forcing a merchant to configure every single setting themselves before a newly-added section looks like anything. |
| Keep a section's responsibility at the page level — "one distinct module of a page," not "the whole page." | **Building an entire page's content as one giant section** instead of breaking it into multiple sections a merchant can independently reorder or remove. |

## Key takeaways

- A section is a page-level module, defined by one `.liquid` file with markup, optional styling, and a `schema` block.
- The `schema` block's `settings` array is what makes a section configurable in the theme editor.
- `presets` controls what a merchant sees the moment they add the section — always give it real defaults.

## Further reading

- [Theme architecture: sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) (shopify.dev)
- [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) (shopify.dev)
