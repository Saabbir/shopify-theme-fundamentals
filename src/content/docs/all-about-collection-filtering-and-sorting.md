---
title: All About Collection Filtering & Sorting
description: collection.filters in depth, sorting, a manual tag-based fallback, and exactly where the theme's responsibility ends and the Search & Discovery app's begins.
---

**TL;DR:** `collection.filters` in depth, sorting, a manual tag-based fallback, and exactly where the theme's responsibility ends and the Search & Discovery app's begins.

This chapter is a complete, standalone reference on collection filtering and sorting in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. Part 1's original roadmap reserved a stub for this topic that was never actually written — this chapter is that coverage's first real version, verified directly against shopify.dev's `filter`, `filter_value`, `collection`, and `sort_option` objects.

## What's in this chapter

| Page | Answers |
|---|---|
| [collection.filters in Depth](/all-about-collection-filtering-and-sorting/collection-filters-in-depth-types-values-and-url-parameters/) | The three real filter types, and why a theme never builds a filter URL by hand |
| [Rendering Filters: list, price_range & boolean](/all-about-collection-filtering-and-sorting/rendering-filters-list-price-range-and-boolean/) | A real dispatcher per type, including presentation-aware rendering for `list` filters |
| [Sorting: collection.sort_options & sort_by](/all-about-collection-filtering-and-sorting/sorting-collection-sort_options-and-sort_by/) | The one correct `| default:` idiom combining a shopper's choice and the merchant's configured default |
| [A Manual Tag-Based Fallback](/all-about-collection-filtering-and-sorting/a-manual-tag-based-fallback/) | Shopify's older, app-independent `link_to_add_tag` system, and when it's still the right tool |
| [How Theme-Side Filtering Interacts With the Search & Discovery App](/all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery/) | What the app owns vs. what the theme owns, and why a missing filter is usually an admin question |
| [A Complete Example](/all-about-collection-filtering-and-sorting/a-complete-example/) | One collection template combining filters, sorting, and a product grid |

## Further reading

- [`filter` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/filter)
- [`collection` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/collection)
- [Support storefront filtering (shopify.dev)](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering)
