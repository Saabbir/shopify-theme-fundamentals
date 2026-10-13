---
title: search, predictive_search & recommendations
description: The three objects that only return real data under specific rendering conditions — and silently return nothing otherwise.
---

**TL;DR:** The three objects that only return real data under specific rendering conditions — and silently return nothing otherwise.

Every object covered elsewhere in this chapter is either always populated (`cart`, `shop`) or populated whenever its matching template renders (`product` on a product page). These three are different: each one only returns real data when rendered through a *specific API*, and returns an empty, harmless placeholder everywhere else — worth understanding precisely, since the failure mode isn't an error, it's a page that silently shows nothing.

## search

`search` is populated on the dedicated search results template, after a shopper has actually submitted a query.

```liquid
{{ search.performed }}
{{ search.terms }}
{{ search.results }}
{{ search.results_count }}
{{ search.types }}
{{ search.filters }}
{{ search.sort_by }}
{{ search.default_sort_by }}
{{ search.sort_options }}
```

`search.results` mixes result types — an item can be an `article`, a `page`, or a `product` — so real theme code checks each item's `object_type` before assuming which properties are safe to read:

```liquid
{% for item in search.results %}
  {{ item.title | link_to: item.url }}
  {% if item.object_type == 'product' %}
    {{ item.featured_image | image_url: width: 100 | image_tag }}
  {% endif %}
{% endfor %}
```

Search covers a maximum of 1,000 results and up to 50 per page through [`paginate`](https://shopify.dev/docs/api/liquid/tags/paginate) — `search.filters` works exactly like `collection.filters`, covered in full in All About Collection Filtering & Sorting, a forthcoming chapter in this site's Part 2.

## predictive_search

`predictive_search` is the object behind the instant, as-you-type suggestions in a search box — and it's populated under a much narrower condition than `search`: **only** inside a section rendered via both the Predictive Search API and the [Section Rendering API](https://shopify.dev/api/section-rendering) together. Rendering a section that references `predictive_search` any other way (a normal full-page render, say) just gets an empty object back, with `performed` returning `false`.

```liquid
{{ predictive_search.performed }}
{{ predictive_search.terms }}
{{ predictive_search.types }}
{{ predictive_search.resources }}
```

```liquid
{% if predictive_search.resources.products.size > 0 %}
  {% for product in predictive_search.resources.products %}
    {{ product.title }}
  {% endfor %}
{% endif %}
```

`predictive_search.resources` groups results by type (`articles`, `collections`, `pages`, `products`) rather than mixing them into one array the way `search.results` does.

## recommendations

`recommendations` holds product recommendations generated from sales data, product descriptions, and collection relationships — and follows the identical rendering-condition pattern as `predictive_search`: populated only inside a section rendered through the [Product Recommendations API](https://shopify.dev/api/ajax/reference/product-recommendations) plus the Section Rendering API together.

```liquid
{{ recommendations.performed? }}
{{ recommendations.products }}
{{ recommendations.products_count }}
{{ recommendations.intent }}
```

```liquid
{% if recommendations.performed? %}
  {% for product in recommendations.products %}
    {{ product.title }}
  {% endfor %}
{% endif %}
```

If `performed?` is `false`, `recommendations.products` returns an empty value and `products_count` returns `0` — always gate on `performed?` first, the same instinct this chapter has been building throughout: check whether an object actually has data before assuming it does.

:::note[Why these three are built this way]
All three exist specifically so their expensive part — running an actual search query, or computing product recommendations from sales data — only happens on demand, through a dedicated endpoint, rather than on every single page load. A theme asks for predictive search results or recommendations exactly when it needs them (as a shopper types, or when a product page loads its "you might also like" section) via a small, separate request, instead of that computation running unconditionally as part of every page's main render.
:::

## Key takeaways

- `search` is populated on the search results template once a shopper has submitted a query; `search.results` mixes articles, pages, and products, so check `item.object_type` before reading type-specific properties.
- `predictive_search` and `recommendations` both only return real data inside a section rendered through their specific API *and* the Section Rendering API together — anywhere else, they're present but empty.
- Always gate on `predictive_search.performed`/`recommendations.performed?` before reading from either, the same way any global object's existence gets checked first.
- All three are deliberately built around an on-demand API rather than running unconditionally on every page load, since each one does real, non-trivial work to produce its results.

## Further reading

- [Liquid objects: search](https://shopify.dev/docs/api/liquid/objects/search) (shopify.dev)
- [Liquid objects: predictive_search](https://shopify.dev/docs/api/liquid/objects/predictive_search) (shopify.dev)
- [Liquid objects: recommendations](https://shopify.dev/docs/api/liquid/objects/recommendations) (shopify.dev)
- [The Section Rendering API](https://shopify.dev/api/section-rendering) (shopify.dev)
