---
title: A Manual Tag-Based Fallback for Stores Without Search & Discovery
description: Shopify's older, app-independent tag filtering system — real link_to_add_tag/link_to_remove_tag filters, and a URL convention that still works today.
---

**TL;DR:** Shopify's older, app-independent tag filtering system — real `link_to_add_tag`/`link_to_remove_tag` filters, and a URL convention that still works today.

Everything in this chapter so far — `collection.filters` — is powered by the Search & Discovery app. A much older mechanism, built into Shopify core rather than any app, still works today: filtering a collection by product tag directly through the URL.

## The URL convention

```
/collections/frontpage/new
/collections/frontpage/new+sale
```

Appending `/{tag-handle}` to a collection's URL filters it down to only products carrying that tag — this works with zero theme code at all, simply by linking to that URL. Multiple tags, joined with `+`, combine with an **AND**: `new+sale` shows only products tagged with both, not either.

## Reading which tags exist, and which are currently active

```liquid
{% for tag in collection.all_tags %}
  <a href="{{ tag | link_to_tag: tag }}" class="{% if current_tags contains tag %}is-active{% endif %}">
    {{ tag }}
  </a>
{% endfor %}
```

`collection.all_tags` lists every tag present on any product in the *unfiltered* collection — the full set of possible filter options, the same role `filter.values` plays for a Search & Discovery filter. `current_tags` holds whatever tags are active in the current URL, letting a theme highlight which ones are already applied.

## Toggling a tag without losing other active tags

```liquid
{% for tag in collection.all_tags %}
  {% if current_tags contains tag %}
    <a href="{{ tag | link_to_remove_tag: tag }}" class="is-active">{{ tag }}</a>
  {% else %}
    <a href="{{ tag | link_to_add_tag: tag }}">{{ tag }}</a>
  {% endif %}
{% endfor %}
```

`link_to_add_tag` and `link_to_remove_tag` are the real, dedicated filters for this — each one builds the correct `+`-joined URL automatically, adding or removing just the one tag while preserving every other currently active tag. This is the direct equivalent of `filter_value.url_to_add`/`url_to_remove` from the Search & Discovery system — a theme never manually concatenates tag strings into a URL path by hand, same underlying principle as the modern filter system, just a different, older mechanism.

## When this is the right (or only) tool

- **A store with no Search & Discovery app installed at all** — a genuinely rare case today, since the app ships free and pre-installed on new stores, but still possible on an older store that's never enabled it, or one that's deliberately uninstalled it.
- **A simple, tag-only filter need** — a "Shop by Collection Tag" navigation pattern that was never meant to support color swatches, price ranges, or boolean filters, where the full `collection.filters` system would be more machinery than the actual requirement calls for.

:::caution[Don't build both systems side by side without a clear reason]
Mixing `collection.filters` and manual tag-based URLs on the same collection page risks two different, overlapping filtering mechanisms disagreeing about what's currently active, since they use entirely separate URL parameter schemes. [How Theme-Side Filtering Interacts With the Search & Discovery App](/all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery/) covers the real, current recommendation — reach for this chapter's `collection.filters` system as the default, and treat the tag-based approach as a fallback for the specific case where that app genuinely isn't available, not a parallel system layered on top of it.
:::

## Key takeaways

- `collection.all_tags`/`current_tags` plus `link_to_add_tag`/`link_to_remove_tag` is Shopify's original, app-independent tag filtering mechanism — still fully functional, built into core Liquid rather than any app.
- The `/collections/{handle}/{tag}+{tag}` URL convention combines multiple tags with AND, with no query-string parameters involved at all.
- This remains the right tool specifically when Search & Discovery genuinely isn't installed, or when a filter need is simple enough that the full `collection.filters` system is more than what's actually required — not a system to run in parallel with it.

## Further reading

- [Filter collections by tag (shopify.dev)](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/tag-filtering)
- [`link_to_add_tag` (shopify.dev)](https://shopify.dev/docs/api/liquid/filters/link_to_add_tag)
- [35.1. collection.filters in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/)
