---
title: A Complete Section Example
description: One full, realistic section file, combining everything this chapter covered into a single copy-pasteable example.
---

**TL;DR:** One full, realistic section file, combining everything this chapter covered into a single copy-pasteable example.

Every other page in this chapter looked at one concern at a time — settings, restrictions, limits, performance. This page puts all of it together into a single, complete `sections/testimonials.liquid` file: the same section already referenced from [A Complete Template Example](/all-about-theme-settings/a-complete-template-example/), now shown in full, exactly as it would exist in a real theme's `sections/` folder.

## The complete file

```liquid
{% comment %}
  sections/testimonials.liquid

  Shows a heading and a row of customer quotes. Each quote is a
  "testimonial" block, so a merchant can add, remove, and reorder
  as many as they want from the theme editor.
{% endcomment %}
{% liquid
  assign heading = section.settings.heading
  assign color_scheme = section.settings.color_scheme
  assign columns_desktop = section.settings.columns_desktop
  assign padding_top = section.settings.padding_top
  assign padding_bottom = section.settings.padding_bottom
  assign padding_top_mobile = section.settings.padding_top_mobile
  assign padding_bottom_mobile = section.settings.padding_bottom_mobile
%}

<div
  class="testimonials color-{{ color_scheme }}"
  style="
    --testimonials-columns-desktop: {{ columns_desktop }};
    --testimonials-padding-top: {{ padding_top }}px;
    --testimonials-padding-bottom: {{ padding_bottom }}px;
    --testimonials-padding-top-mobile: {{ padding_top_mobile }}px;
    --testimonials-padding-bottom-mobile: {{ padding_bottom_mobile }}px;
  "
>
  {% if heading != blank %}
    <h2 class="testimonials__heading">{{ heading }}</h2>
  {% endif %}

  {% if section.blocks.size > 0 %}
    <div class="testimonials__grid">
      {% content_for 'blocks' %}
    </div>
  {% else %}
    <p class="testimonials__empty">
      {{ 'sections.testimonials.empty' | t }}
    </p>
  {% endif %}
</div>

{% stylesheet %}
  .testimonials {
    padding-top: var(--testimonials-padding-top);
    padding-bottom: var(--testimonials-padding-bottom);
  }

  .testimonials__heading {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .testimonials__grid {
    display: grid;
    grid-template-columns: repeat(var(--testimonials-columns-desktop), 1fr);
    gap: 1.5rem;
  }

  .testimonials__empty {
    text-align: center;
    opacity: 0.6;
  }

  @media screen and (max-width: 749px) {
    .testimonials {
      padding-top: var(--testimonials-padding-top-mobile);
      padding-bottom: var(--testimonials-padding-bottom-mobile);
    }

    .testimonials__grid {
      grid-template-columns: 1fr;
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "t:sections.testimonials.name",
  "tag": "section",
  "class": "section",
  "enabled_on": {
    "templates": ["index", "page"]
  },
  "max_blocks": 12,
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:labels.heading",
      "default": "What our customers say"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:labels.color_scheme",
      "default": "scheme-3"
    },
    {
      "type": "range",
      "id": "columns_desktop",
      "label": "t:labels.columns_desktop",
      "min": 1,
      "max": 4,
      "step": 1,
      "default": 3
    },
    {
      "type": "header",
      "content": "t:general.padding"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "t:labels.padding_top",
      "min": 0,
      "max": 120,
      "step": 4,
      "unit": "px",
      "default": 40
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "t:labels.padding_bottom",
      "min": 0,
      "max": 120,
      "step": 4,
      "unit": "px",
      "default": 40
    },
    {
      "type": "range",
      "id": "padding_top_mobile",
      "label": "t:labels.padding_top_mobile",
      "min": 0,
      "max": 120,
      "step": 4,
      "unit": "px",
      "default": 20
    },
    {
      "type": "range",
      "id": "padding_bottom_mobile",
      "label": "t:labels.padding_bottom_mobile",
      "min": 0,
      "max": 120,
      "step": 4,
      "unit": "px",
      "default": 20
    }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "t:blocks.testimonial.name",
      "settings": [
        {
          "type": "textarea",
          "id": "quote",
          "label": "t:labels.quote"
        },
        {
          "type": "text",
          "id": "author",
          "label": "t:labels.author"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:sections.testimonials.name",
      "blocks": [
        {
          "type": "testimonial",
          "settings": {
            "quote": "The best purchase I've made all year.",
            "author": "Jordan R."
          }
        },
        {
          "type": "testimonial",
          "settings": {
            "quote": "Shipping was fast and the quality is excellent.",
            "author": "Morgan T."
          }
        }
      ]
    }
  ]
}
{% endschema %}
```

```liquid
{% comment %} blocks/testimonial.liquid — referenced by the section above {% endcomment %}
{% liquid
  assign quote = block.settings.quote
  assign author = block.settings.author
%}

<blockquote class="testimonial" {{ block.shopify_attributes }}>
  {% if quote != blank %}
    <p class="testimonial__quote">&ldquo;{{ quote }}&rdquo;</p>
  {% endif %}
  {% if author != blank %}
    <cite class="testimonial__author">{{ author }}</cite>
  {% endif %}
</blockquote>
```

## Every concern from this chapter, in one place

This single section demonstrates all of the following at once:

- **Settings of several different types** — `text`, `color_scheme`, `range`, and a `header` used purely for organization in the editor, per [Section Fundamentals](/all-about-sections/section-fundamentals/).
- **A restriction on where it can appear** — `enabled_on` limits it to the `index` and `page` templates, per [Restricting Where a Section Can Appear](/all-about-sections/restricting-where-a-section-can-appear/). A merchant won't see this section offered anywhere else, like a product or collection page, where testimonials wouldn't make sense.
- **A bounded limit** — `max_blocks` caps the section at 12 testimonials, per [Limits: max_blocks and Schema Size](/all-about-sections/limits-max-blocks-and-schema-size/), so a merchant can't accidentally paste in 200 blocks and tank the page's render time.
- **A color scheme, not standalone color pickers** — `color_scheme` lets a merchant pick one pre-coordinated, contrast-checked scheme instead of choosing a background and text color independently, per [Color Fundamentals](/all-about-colors/color-fundamentals/). The `color-{{ color_scheme }}` class on the outer `<div>` matches whatever class a theme-wide snippet generates per scheme — see [A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) for that snippet written out in full.
- **Full desktop/mobile spacing**, wired to CSS custom properties and overridden in a `@media` query rather than decided in Liquid, per [Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/).
- **A settings-to-variables block at the top**, read once into local variables instead of repeating `section.settings.x` throughout the file.
- **A sensible empty state** — when a merchant removes every block, the section shows a translated message instead of an empty, broken-looking gap.
- **A `presets` entry that isn't empty** — two real testimonial blocks with real content, so the section looks finished the moment a merchant adds it, per [Section Fundamentals](/all-about-sections/section-fundamentals/).
- **A block rendered with `{{ block.shopify_attributes }}`**, which is what lets the theme editor highlight and select that specific block instance when a merchant clicks it in the preview.
- **Translated schema strings throughout** (`t:sections.testimonials.name`, `t:labels.heading`, and so on) rather than hardcoded English, per [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) — see [A Complete Locale File Example](/all-about-theme-settings/a-complete-locale-file-example/) for the matching locale entries this schema depends on.

## How this connects to the rest of the site

This exact section — same name, same `color_scheme` default, same two testimonials — is also the one used in [A Complete Template Example](/all-about-theme-settings/a-complete-template-example/), shown there as it would actually appear once placed on a page, with real settings values stored in a JSON template. Reading the two pages together shows the full round trip: the section file defines what's configurable, and the template records what a merchant actually configured.

## Key takeaways

- A real section file combines settings, restrictions, limits, a color scheme, full spacing, blocks, a sensible empty state, and translated strings — not just the one feature each earlier page in this chapter focused on individually.
- `presets` should ship real, representative content, not an empty shell — a merchant adding this section should immediately see what it's supposed to look like.
- A block file stays separate from its section, rendered through `{% content_for 'blocks' %}`, and needs `{{ block.shopify_attributes }}` for the theme editor to be able to select it.

## Further reading

- [A Complete Template Example](/all-about-theme-settings/a-complete-template-example/)
- [A Complete Block Example](/all-about-blocks/a-complete-block-example/)
- [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) (shopify.dev)
