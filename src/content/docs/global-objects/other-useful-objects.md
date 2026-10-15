---
title: Other Useful Objects
description: "request, routes, image, and a first look at metafields."
---

**TL;DR:** `request`, `routes`, `image`, and a first look at metafields.

## `request`

`request` describes the current page request itself — useful for logic that depends on where you are, rather than what you're looking at.

```liquid
{{ request.page_type }}
{{ request.path }}
{{ request.locale.iso_code }}
```

You've already seen `request.locale.iso_code` used in [2.4. theme.liquid Explained](/theme-architecture/theme-liquid-explained/), setting the page's `<html lang="">` attribute. `request.page_type` is handy for logic that should only apply on a specific kind of page:

```liquid
{% if request.page_type == 'product' %}
  <!-- product-page-only markup -->
{% endif %}
```

## `routes`

`routes` gives you the URL for Shopify's built-in pages — cart, account, search — without ever hardcoding a path yourself.

```liquid
{{ routes.root_url }}
{{ routes.cart_url }}
{{ routes.account_url }}
{{ routes.account_login_url }}
{{ routes.account_logout_url }}
{{ routes.search_url }}
```

:::tip[Always use routes instead of writing these paths by hand]
Writing `href="/cart"` directly happens to work on most stores, but `routes.cart_url` is correct regardless of locale prefixes, custom domains, or anything else that could change what that path actually resolves to. Prefer the object over a hardcoded guess every time one of these pages is involved.
:::

## `image`

Any image-type property (`product.featured_image`, `collection.image`, an `image` picker setting) returns an image object with its own properties, separate from the filters that generate a URL for it.

```liquid
{{ product.featured_image.alt }}
{{ product.featured_image.width }}
{{ product.featured_image.height }}
```

Combine this with `image_url` (covered in [4.7. Common Filters by Category](/liquid-basics/common-filters-by-category/)) to build the actual `<img>` tag — the image object's own properties (`alt`, `width`, `height`) are for the attributes around that URL, not the URL itself.

```liquid
<img
  src="{{ product.featured_image | image_url: width: 600 }}"
  alt="{{ product.featured_image.alt | escape }}"
  width="{{ product.featured_image.width }}"
  height="{{ product.featured_image.height }}"
>
```

## A first look at metafields

A **metafield** is a piece of custom structured data attached to an object — a product, a collection, a page — that doesn't fit into Shopify's standard fields. A merchant or app might add a "Material" field to every product, for example, which isn't something `product.title` or `product.vendor` was ever meant to hold.

```liquid
{{ product.metafields.custom.material }}
```

Metafields are read the same way as any other nested object property — `product.metafields.<namespace>.<key>`. If that specific metafield hasn't been set on a given product, the expression resolves to `nil`, silently, the same as any other missing property (see [4.8. Debugging Liquid](/liquid-basics/debugging-liquid/)) — so always check it's present before relying on it being there for every product.

```liquid
{% if product.metafields.custom.material %}
  <p>Material: {{ product.metafields.custom.material.value }}</p>
{% endif %}
```

This is enough to recognize and read a metafield when you encounter one. Defining new metafields, working with their different value types, and metaobjects (metafields that reference a whole separate, structured record) are a deeper topic than this introductory chapter covers.

## Key takeaways

- `request` tells you about the current page itself (type, path, locale); `routes` gives you correct URLs for Shopify's built-in pages instead of hardcoded guesses.
- An image object's properties (`alt`, `width`, `height`) are separate from the URL-generating filters like `image_url` — you typically need both together to build a proper `<img>` tag.
- A metafield is read like any nested property (`product.metafields.custom.key`) and resolves to `nil`, silently, if it isn't set — always check before relying on it.

## Further reading

- [The `request` object](https://shopify.dev/docs/api/liquid/objects/request) (shopify.dev)
- [The `routes` object](https://shopify.dev/docs/api/liquid/objects/routes) (shopify.dev)
- [Metafields](https://shopify.dev/docs/apps/build/custom-data/metafields) (shopify.dev)
