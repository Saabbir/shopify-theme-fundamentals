---
title: "Rendering Filters: list, price_range & boolean"
description: A real {% case %} dispatch over filter.type, including presentation-aware rendering (text, swatch, or image) for a list filter.
---

**TL;DR:** A real `{% case %}` dispatch over `filter.type`, including presentation-aware rendering (text, swatch, or image) for a list filter.

[`collection.filters` in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/) establishes the three filter types; this page renders each one correctly.

## The dispatcher

```liquid
{% for filter in collection.filters %}
  <fieldset class="sol-filter-group">
    <legend>{{ filter.label }}</legend>

    {% case filter.type %}
      {% when 'list' %}
        {% render 'filter-list', filter: filter %}
      {% when 'boolean' %}
        {% render 'filter-boolean', filter: filter %}
      {% when 'price_range' %}
        {% render 'filter-price-range', filter: filter %}
    {% endcase %}
  </fieldset>
{% endfor %}
```

`<fieldset>`/`<legend>` is the correct semantic wrapper for a group of related filter choices under one label — screen readers announce the group's label once, rather than needing each individual checkbox to repeat "Color" in its own accessible name.

## `list`: presentation-aware rendering

```liquid
{% comment %} snippets/filter-list.liquid {% endcomment %}
{% for value in filter.values %}
  <label class="sol-filter-option">
    <input
      type="checkbox"
      name="{{ value.param_name }}"
      value="{{ value.value }}"
      {% if value.active %}checked{% endif %}
      onchange="window.location = this.checked ? '{{ value.url_to_add }}' : '{{ value.url_to_remove }}'"
    >
    {% case filter.presentation %}
      {% when 'swatch' %}
        <span class="sol-swatch" style="--sol-swatch-color: {{ value.swatch.color }};"></span>
      {% when 'image' %}
        <img src="{{ value.image | image_url: width: 40 }}" alt="" width="40" height="40">
    {% endcase %}
    {{ value.label }} ({{ value.count }})
  </label>
{% endfor %}
```

`filter.presentation` (`text`, `swatch`, or `image`) describes how a merchant has actually configured a `list` filter to display — a Color filter is commonly set to `swatch`, reusing the exact same `swatch.color`/`swatch.image` object covered in [Color & Size Swatches](/all-about-product-cards/color-and-size-swatches/), while something like Vendor stays `text`. Checking `filter.presentation` rather than assuming every `list` filter renders the same way is what makes a filter panel correctly show color swatches for Color and plain text for Vendor, from the exact same snippet.

## `boolean`: a single checkbox, not a list

```liquid
{% comment %} snippets/filter-boolean.liquid {% endcomment %}
{% if filter.true_value %}
  <label class="sol-filter-option">
    <input
      type="checkbox"
      {% if filter.true_value.active %}checked{% endif %}
      onchange="window.location = this.checked ? '{{ filter.true_value.url_to_add }}' : '{{ filter.true_value.url_to_remove }}'"
    >
    {{ filter.label }} ({{ filter.true_value.count }})
  </label>
{% endif %}
```

A `boolean` filter has exactly one meaningful on/off state in practice (shown via `filter.true_value`) — `filter.false_value` exists in the API but is rarely rendered as its own separate control, since "not in stock" is typically just the absence of checking "in stock," not a second checkbox a shopper would toggle independently. The `{% if filter.true_value %}` guard matters because `true_value` returns `nil` entirely if no result in the unfiltered view actually has that value — there's no point offering an "In Stock" checkbox on a collection where literally everything is out of stock.

## `price_range`: two number inputs, bounded by `range_max`

```liquid
{% comment %} snippets/filter-price-range.liquid {% endcomment %}
<div class="sol-filter-price-range">
  <input type="number" min="0" max="{{ filter.range_max }}" value="{{ filter.min_value.value }}" placeholder="{{ 'collection.filters.price_min' | t }}">
  <input type="number" min="0" max="{{ filter.range_max }}" value="{{ filter.max_value.value }}" placeholder="{{ 'collection.filters.price_max' | t }}">
</div>
```

`filter.range_max` is the actual highest price across the *unfiltered* collection — using it to bound both inputs' `max` attribute prevents a shopper from typing in a price ceiling that couldn't possibly match anything. Unlike `list`/`boolean`, a price range genuinely needs a small amount of JavaScript to combine both numbers into one navigation (reading `filter_value.param_name` for each — `filter.v.price.gte`/`filter.v.price.lte` — and building one URL with both parameters set), since there's no single `url_to_add` that already represents an arbitrary, user-typed range.

## Key takeaways

- Dispatch on `filter.type` with a `{% case %}`, rendering each type with its own snippet — the three types share almost nothing structurally.
- `filter.presentation` decides how a `list` filter actually displays (`text`/`swatch`/`image`) — check it rather than assuming every list filter looks the same.
- `filter.true_value` can be `nil` if no result has that value at all — guard for it, rather than always rendering a boolean filter's checkbox unconditionally.
- A `price_range` filter is the one type that genuinely needs theme JavaScript to combine two typed numbers into a single navigation, since there's no pre-built URL for an arbitrary range.

## Further reading

- [`filter` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/filter)
- [Color & Size Swatches](/all-about-product-cards/color-and-size-swatches/)
- [collection.filters in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/)
