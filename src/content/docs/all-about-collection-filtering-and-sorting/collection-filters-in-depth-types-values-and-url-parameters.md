---
title: "collection.filters in Depth: Types, Values & URL Parameters"
description: Three real filter types, each shaped differently — and every filter and value already carries the exact URL a theme needs, with no manual query-string building required.
---

**TL;DR:** Three real filter types, each shaped differently — and every filter and value already carries the exact URL a theme needs, with no manual query-string building required.

`collection.filters` is Shopify's storefront filtering system — powered by the Search & Discovery app behind the scenes, but read by a theme as plain Liquid, regardless of whether a developer ever touches that app directly.

## Three filter types, verified from `collection.filters`

```liquid
{% for filter in collection.filters %}
  {{ filter.type }}
{% endfor %}
```

Every `filter` is one of exactly three types, and which properties are populated depends entirely on which one:

| `filter.type` | What it represents | Populated properties |
|---|---|---|
| `list` | A set of discrete choices (color, size, vendor) | `.values`, `.active_values`, `.inactive_values`, `.presentation`, `.operator` |
| `boolean` | A single yes/no condition (in stock, on sale) | `.true_value`, `.false_value` |
| `price_range` | A numeric min/max range | `.min_value`, `.max_value`, `.range_max` |

Reading `filter.values` on a `price_range` filter, or `filter.min_value` on a `list` filter, simply returns `nil` — the object doesn't error, it just has nothing there, since that property belongs to a different filter type entirely. Branching on `filter.type` first, before touching any of the type-specific properties, is what every example in this chapter does.

## `filter_value`: the actual choice inside a `list` or `boolean` filter

```liquid
{% for value in filter.values %}
  <a href="{% if value.active %}{{ value.url_to_remove }}{% else %}{{ value.url_to_add }}{% endif %}">
    {{ value.label }} ({{ value.count }})
  </a>
{% endfor %}
```

Every `filter_value` already carries its own ready-made URLs — `url_to_add` (the current page's URL, plus this value's filter parameter) and `url_to_remove` (the current URL, with it stripped back out) — both with pagination parameters already removed. This is the single most important thing to internalize about this whole system: a theme never constructs a filter URL from pieces by hand. It reads `value.active` to decide which of the two pre-built URLs to link to, full stop.

`value.count` is the number of results *that filter value would produce*, calculated against the unfiltered collection — this is what lets a theme show "Blue (12)" next to a filter option, so a shopper can see how many results a choice would leave before clicking it.

## Removing one whole filter at once

```liquid
<a href="{{ filter.url_to_remove }}">{{ 'collection.filters.clear' | t }}: {{ filter.label }}</a>
```

`filter.url_to_remove` (on the filter itself, not a specific value) clears every active value of that one filter in a single link — useful for a "Clear Color" affordance next to a filter group with several active values, rather than requiring a shopper to uncheck each one individually.

## The URL parameter format, if it's ever needed directly

```
?filter.v.option.color=Blue&filter.v.price.gte=20&filter.v.price.lte=80
```

`filter.param_name` (`filter.v.option.color`, for instance) and `filter_value.value` (`Blue`) are what actually get combined into the query string — but since `url_to_add`/`url_to_remove` already produce the complete URL, a theme essentially never needs to read `param_name` directly except for debugging, or the one case covered in [How Theme-Side Filtering Interacts With the Search & Discovery App](/all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery/) — reading the current filter state from `content_for_header`-independent JavaScript.

## Key takeaways

- `filter.type` (`list`/`boolean`/`price_range`) decides which other properties are actually populated — check it first, since reading a property that belongs to a different type simply returns `nil`, not an error.
- `filter_value.url_to_add`/`url_to_remove` are the complete, ready-made URLs for toggling a filter value — never build a filter URL by hand from `param_name` and `value`.
- `filter.url_to_remove` clears an entire filter's active values at once, distinct from `filter_value.url_to_remove`, which clears just one.

## Further reading

- [`filter` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/filter)
- [`filter_value` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/filter_value)
- [Support storefront filtering (shopify.dev)](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering)
- [Rendering Filters: list, price_range & boolean](/all-about-collection-filtering-and-sorting/rendering-filters-list-price-range-and-boolean/)
