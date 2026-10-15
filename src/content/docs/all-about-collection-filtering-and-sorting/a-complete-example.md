---
title: A Complete Example
description: One collection template combining filters, presentation-aware rendering, and a sort dropdown that doesn't discard active filters.
---

**TL;DR:** One collection template combining filters, presentation-aware rendering, and a sort dropdown that doesn't discard active filters.

```liquid
{% comment %} sections/main-collection.liquid {% endcomment %}
{% liquid
  assign sort_by = collection.sort_by | default: collection.default_sort_by
%}

<div class="sol-collection">
  <aside class="sol-collection__filters">
    {% for filter in collection.filters %}
      <fieldset class="sol-filter-group">
        <legend>{{ filter.label }}</legend>

        {% case filter.type %}
          {% when 'list' %}
            {% for value in filter.values %}
              <label class="sol-filter-option">
                <input
                  type="checkbox"
                  {% if value.active %}checked{% endif %}
                  onchange="window.location = this.checked ? '{{ value.url_to_add }}' : '{{ value.url_to_remove }}'"
                >
                {% if filter.presentation == 'swatch' %}
                  <span class="sol-swatch" style="--sol-swatch-color: {{ value.swatch.color }};"></span>
                {% endif %}
                {{ value.label }} ({{ value.count }})
              </label>
            {% endfor %}
          {% when 'boolean' %}
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
          {% when 'price_range' %}
            <div class="sol-filter-price-range" data-sol-price-filter data-param-min="{{ filter.min_value.param_name }}" data-param-max="{{ filter.max_value.param_name }}">
              <input type="number" min="0" max="{{ filter.range_max }}" value="{{ filter.min_value.value }}">
              <input type="number" min="0" max="{{ filter.range_max }}" value="{{ filter.max_value.value }}">
            </div>
        {% endcase %}
      </fieldset>
    {% endfor %}
  </aside>

  <div class="sol-collection__main">
    <select
      class="sol-collection__sort"
      aria-label="{{ 'collection.sort.label' | t }}"
      onchange="window.location = new URL(window.location).searchParams.set('sort_by', this.value) || window.location"
    >
      {% for option in collection.sort_options %}
        <option value="{{ option.value }}" {% if option.value == sort_by %}selected{% endif %}>
          {{ option.name }}
        </option>
      {% endfor %}
    </select>

    <div class="sol-product-grid">
      {% for card_product in collection.products %}
        {% render 'product-card', card_product: card_product %}
      {% endfor %}
    </div>
  </div>
</div>
```

## The sort dropdown's `onchange`, explained

```js
window.location = new URL(window.location).searchParams.set('sort_by', this.value) || window.location
```

This replaces [Sorting](/all-about-collection-filtering-and-sorting/sorting-collection-sort_options-and-sort_by/)'s simpler bare-string version specifically to address the gap flagged there: `new URL(window.location)` parses the *entire current URL*, including every active filter parameter, `searchParams.set('sort_by', ...)` changes only the one parameter being updated, and `.toString()` (implied by the assignment) rebuilds the full URL with every other parameter intact. `.set()` returns `undefined`, which is why `|| window.location` exists — it's a compact way to fall through to re-reading the (now-mutated) `URL` object's string form, rather than needing a separate variable and an extra line.

:::note[This inline expression is right at the edge of what belongs inline]
Per this site's own JavaScript convention, anything beyond a single, simple line belongs in its own asset file as a proper Web Component, not an inline `onchange`. This expression is kept inline here to stay consistent with the other inline handlers in this chapter, but a theme should strongly consider promoting it to a real `sol-collection-sort.js` component the moment it needs any additional logic (debouncing, a loading state, an AJAX section update) — which, in practice, is almost immediately.
:::

## Key takeaways

- A real collection template dispatches on `filter.type` exactly once, in one loop, rendering each type's own inline markup rather than needing separate top-level loops per type.
- The sort dropdown preserves active filters by mutating the full current URL's `sort_by` parameter specifically, not by constructing a bare `?sort_by=...` string from scratch.
- Even a correct one-line inline handler is a signal to promote to a real component the moment it needs to do anything more — this chapter's examples deliberately stay minimal, not as a final recommendation for production code.

## Further reading

- [35.1. collection.filters in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/)
- [35.2. Rendering Filters: list, price_range & boolean](/all-about-collection-filtering-and-sorting/rendering-filters-list-price-range-and-boolean/)
- [35.3. Sorting: collection.sort_options & sort_by](/all-about-collection-filtering-and-sorting/sorting-collection-sort_options-and-sort_by/)
