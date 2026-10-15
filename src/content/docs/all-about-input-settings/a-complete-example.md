---
title: A Complete Example
description: One section's schema and Liquid, deliberately exercising every gotcha from this chapter at once — correct return-type handling, a real empty state, and a valid, bounded default.
---

**TL;DR:** One section's schema and Liquid, deliberately exercising every gotcha from this chapter at once — correct return-type handling, a real empty state, and a valid, bounded default.

```json
{% comment %} sections/featured-product.liquid — {% schema %} block {% endcomment %}
{
  "name": "t:sections.featured-product.name",
  "settings": [
    {
      "type": "product",
      "id": "featured_product",
      "label": "t:labels.featured_product"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "t:labels.layout",
      "options": [
        { "value": "image_first", "label": "t:options.image_first" },
        { "value": "text_first", "label": "t:options.text_first" }
      ],
      "default": "image_first"
    },
    {
      "type": "range",
      "id": "image_width",
      "label": "t:labels.image_width",
      "min": 30,
      "max": 70,
      "step": 5,
      "unit": "%",
      "default": 50
    },
    {
      "type": "checkbox",
      "id": "show_price",
      "label": "t:labels.show_price",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "t:sections.featured-product.presets.default.name",
      "settings": {
        "layout": "image_first",
        "image_width": 50,
        "show_price": true
      }
    }
  ]
}
```

```liquid
{% liquid
  assign featured_product = section.settings.featured_product
  assign layout = section.settings.layout
  assign image_width = section.settings.image_width
  assign show_price = section.settings.show_price
%}

{% if featured_product %}
  <div class="sol-featured-product sol-featured-product--{{ layout }}" style="--sol-featured-product-image-width: {{ image_width }}%;">
    <img src="{{ featured_product.featured_image | image_url: width: 800 }}" alt="{{ featured_product.featured_image.alt | escape }}" loading="lazy">
    <div class="sol-featured-product__content">
      <h2>{{ featured_product.title }}</h2>
      {% if show_price %}
        <p>{{ featured_product.price | money }}</p>
      {% endif %}
    </div>
  </div>
{% else %}
  <p class="sol-empty-state">{{ 'sections.featured-product.empty_state' | t }}</p>
{% endif %}
```

## Every gotcha from this chapter, present and correctly handled

- **`layout` is compared by `value`, never `label`** (`sol-featured-product--image_first`, matching the schema's own `value` strings) — the mistake covered in [40.1. Exact Return Types, Verified](/all-about-input-settings/exact-return-types-verified/).
- **`image_width`'s `default` of `50` sits within its declared `min: 30`/`max: 70`** — the invalid-schema mistake covered in [40.3. Default-Value Requirements & Validation Gotchas](/all-about-input-settings/default-value-requirements-and-validation-gotchas/).
- **`featured_product` has no `default` key at all**, since `product`-type settings don't support one — per [40.2. Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/) — and the `{% if featured_product %}` guard around the entire section body is what correctly handles both "never selected" and "selected, then later deleted," per [40.4. What Happens When a Referenced Resource Is Deleted](/all-about-input-settings/what-happens-when-a-referenced-resource-is-deleted/).
- **`show_price` is checked directly as a boolean**, with no string comparison.
- **The `presets` entry supplies real values for everything it can** (`layout`, `image_width`, `show_price`) and correctly leaves `featured_product` out entirely, since there's no merchant-specific product to pre-select.

## Key takeaways

- A single, well-built section schema naturally touches most of this chapter's gotchas at once — exact return types, a bounded default, a resource picker with no default and a real empty state, and a presets entry that fills in everything it actually can.
- The empty state isn't a nice-to-have added at the end — it's load-bearing the moment a schema includes any resource-picker setting, since that's the section's actual starting state for every merchant who adds it.

## Further reading

- [40.1. Exact Return Types, Verified](/all-about-input-settings/exact-return-types-verified/)
- [40.2. Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/)
- [40.3. Default-Value Requirements & Validation Gotchas](/all-about-input-settings/default-value-requirements-and-validation-gotchas/)
