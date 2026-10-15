---
title: Color & Size Swatches
description: Shopify's real, native swatch object — product_option_value.swatch — and why a size swatch almost never has one to read.
---

**TL;DR:** Shopify's real, native swatch object — `product_option_value.swatch` — and why a size swatch almost never has one to read.

A swatch is a small, clickable preview of one option value directly on the product card — a color dot, or a size chip — that lets a shopper pick a variant without leaving the collection grid. Shopify has a real, native `swatch` object for exactly this; it doesn't need to be built from scratch with a custom metafield.

## Where swatch data comes from

```liquid
{% for option in card_product.options_with_values %}
  {% if option.name == 'Color' %}
    {% for value in option.values %}
      {{ value.swatch.color }}
      {{ value.swatch.image }}
    {% endfor %}
  {% endif %}
{% endfor %}
```

`product.options_with_values` returns each option (`Color`, `Size`, and so on) together with its possible `values` — each `value` is a `product_option_value`, and its `.swatch` property returns a real `swatch` object *if* a merchant has configured one for that value, either a hex `color` or an uploaded `image`. If neither was ever set for that value, `.swatch` is `nil` — there's no fallback guessing from the option value's name.

:::note[A merchant sets this up in the admin, not in the theme]
A swatch's actual color or image is configured per option value in Shopify's admin (Settings → Custom data, or directly on a color-type product option), not written anywhere in theme code. The theme's only job is reading `.swatch.color`/`.swatch.image` back and rendering it — if swatches aren't showing up, the first thing to check is whether the merchant has actually set them up for that option, not the Liquid.
:::

## Rendering a color swatch

```liquid
{% liquid
  assign color_option = card_product.options_with_values | where: 'name', 'Color' | first
%}

{% if color_option %}
  <ul class="product-card__swatches" role="list">
    {% for value in color_option.values %}
      <li>
        <a
          href="{{ value.variant.url | default: value.product_url }}"
          class="swatch"
          style="{% if value.swatch.color %}--swatch-color: {{ value.swatch.color }};{% endif %}"
          aria-label="{{ value.name }}"
          {% unless value.available %}aria-disabled="true"{% endunless %}
        >
          {% if value.swatch.image %}
            <img src="{{ value.swatch.image | image_url: width: 40 }}" alt="" width="40" height="40">
          {% endif %}
        </a>
      </li>
    {% endfor %}
  </ul>
{% endif %}
```

```css
.swatch {
  display: block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--swatch-color, var(--color-border));
  background-size: cover;
}

.swatch[aria-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
}
```

`value.variant` is the variant that would result from selecting this value *together with whatever else is currently selected* — this is Shopify's own recommended way to link a swatch to the right variant, rather than a theme trying to reconstruct that lookup by hand. `value.product_url` is the fallback for a card context with nothing else "currently selected" yet, linking straight to the product page with that option pre-selected via a query parameter.

### Disabled, not hidden, for an unavailable combination

`value.available` reflects whether this option value has any purchasable combination at all, given what's already selected — a swatch for a color with zero sizes left in stock should show as disabled (`aria-disabled="true"`, dimmed), not disappear from the list entirely. Removing it outright makes the set of options look smaller and less complete than it really is, and removes a shopper's ability to see that a color *exists*, just not in a size that's currently in stock.

## Size "swatches" almost never have real swatch data

```liquid
{% liquid
  assign size_option = card_product.options_with_values | where: 'name', 'Size' | first
%}

{% if size_option %}
  <ul class="product-card__size-chips" role="list">
    {% for value in size_option.values %}
      <li>
        <a href="{{ value.variant.url | default: value.product_url }}" class="size-chip" {% unless value.available %}aria-disabled="true"{% endunless %}>
          {{ value.name }}
        </a>
      </li>
    {% endfor %}
  </ul>
{% endif %}
```

A size option value's `.swatch` is `nil` for nearly every store — there's no color or image to assign to "Medium." A size "swatch" is really just a small text chip (the option value's `name`, rendered as a button-like link), not a use of the `swatch` object at all. The same `value.variant`/`value.available` pattern from the color example still applies — only the visual presentation (text in a chip, instead of a color dot) actually changes between the two.

## Key takeaways

- `product_option_value.swatch` is Shopify's real, native object for a configured color or image swatch — `.swatch.color` and `.swatch.image`, either of which may be `nil` if a merchant hasn't set one up for that value.
- `value.variant` is the Shopify-recommended way to link a swatch to the variant it would select, accounting for whatever else is already selected; `value.product_url` is the fallback with nothing else selected.
- `value.available` should disable (not remove) a swatch for a combination with no purchasable variant — removing it entirely hides the fact that the option value exists at all.
- A size option almost never has real swatch data; a "size swatch" in practice is just styled text, not a use of the `swatch` object.

## Further reading

- [`product_option_value` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/product_option_value)
- [32.2. The Variants & Options Matrix in Depth](/all-about-products/the-variants-and-options-matrix-in-depth/)
- [Rendering option value availability (shopify.dev)](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products#option-value-availability)
