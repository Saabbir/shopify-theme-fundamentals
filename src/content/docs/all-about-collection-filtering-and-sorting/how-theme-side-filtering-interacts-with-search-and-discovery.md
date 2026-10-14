---
title: How Theme-Side Filtering Interacts With the Search & Discovery App
description: The app decides which filters exist and what options they have; the theme only decides how to render whatever collection.filters actually returns.
---

**TL;DR:** The app decides which filters exist and what options they have; the theme only decides how to render whatever `collection.filters` actually returns.

Every page in this chapter so far has been about rendering `collection.filters` — this page is about the boundary between what a theme controls and what the Search & Discovery app controls, since confusing the two is a common source of "why isn't my filter showing up" questions.

## What the app owns

A merchant configures *which* filters appear on a given collection, and in what order, entirely inside the Search & Discovery app's own admin interface — which product properties become filters (an option like Color, a specific metafield, price), and for a `list` filter, whether it presents as `text`, `swatch`, or `image`. None of this is theme code. A theme has no setting, schema field, or Liquid logic that adds a new filter to the list `collection.filters` returns — it only ever renders whatever the app has configured for that collection.

```liquid
{% for filter in collection.filters %}
  {# Whatever shows up here was decided in the Search & Discovery app's
     admin UI, not by anything written in this loop. #}
{% endfor %}
```

This is why a missing expected filter is almost never a Liquid bug — it means the app either hasn't been configured to expose that filter on this collection, or (for a metafield-based filter) the underlying metafield itself isn't set up for filtering. Debugging that is an admin-configuration question, not a theme-code one.

## What the theme owns

Everything covered earlier in this chapter — the actual markup, the swatch-vs-text-vs-image presentation choice *within* a `list` filter's rendering, the layout of a filter panel, whether it's a sidebar or a drawer, whether changing a filter triggers a full page reload or an AJAX update — is entirely the theme's responsibility. The app provides the data; the theme decides how it looks and feels.

## Combining filter changes with an already-active sort order

```liquid
{% comment %}
  A filter_value's url_to_add/url_to_remove already preserves every OTHER
  active filter and the current sort_by, automatically — Shopify computes
  these URLs with the full current query string in mind, not just the one
  parameter being toggled.
{% endcomment %}
<a href="{{ value.url_to_add }}">{{ value.label }}</a>
```

This is worth stating plainly because it resolves a reasonable worry: clicking a filter value's link does *not* reset whatever sort order or other active filters a shopper has already applied — `url_to_add`/`url_to_remove` are computed against the full current URL, not just the one filter being toggled. The one place this doesn't hold automatically is the plain `<select onchange>` sort dropdown from the previous page, which — because it was built from scratch with a bare `?sort_by=...` string — needs its own logic to preserve any active filter parameters, rather than getting that behavior for free the way a filter link does.

## Faster filtering without a full page reload: a forward look

Clicking any filter or sort link in every example in this chapter triggers a real, full page navigation — which works correctly and accessibly everywhere, but reloads the entire page for what's conceptually just a change to one product grid. A smoother, AJAX-driven version of the same interaction is possible using Shopify's **Section Rendering API** (requesting just the updated section's HTML via a `?sections=` parameter, swapping it into the page without a full reload) — covered in its own dedicated future chapter. Every pattern in this chapter works correctly as a foundation either way; the Section Rendering API is a performance and polish layer on top, not a different filtering mechanism underneath.

## Key takeaways

- Which filters exist, their order, and a `list` filter's presentation style are all configured in the Search & Discovery app's admin — a theme has no mechanism to add or invent a filter that app hasn't exposed.
- A missing expected filter is an admin-configuration question first, not a Liquid bug to debug.
- `filter_value.url_to_add`/`url_to_remove` already preserve every other active filter and sort order automatically; only a from-scratch control like a bare sort dropdown needs to handle that preservation itself.
- Full-page-reload filtering is a correct, accessible foundation on its own — an AJAX layer via the Section Rendering API is a later enhancement, not a prerequisite.

## Further reading

- [collection.filters in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/)
- [Support storefront filtering (shopify.dev)](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering)
- [Search & Discovery app (Shopify App Store)](https://apps.shopify.com/search-and-discovery)
