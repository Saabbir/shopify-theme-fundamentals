---
title: product, variant & collection in Full
description: Every property worth knowing on the three objects nearly every storefront page touches in some way.
---

**TL;DR:** Every property worth knowing on the three objects nearly every storefront page touches in some way.

## product

A `product` object represents one product in the store, and only has real data on a product page, a product recommendation, or a search/collection result — [Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/) covers exactly where.

**Identity and content**

```liquid
{{ product.id }}
{{ product.title }}
{{ product.handle }}
{{ product.description }}
{{ product.vendor }}
{{ product.type }}
{{ product.tags }}
```

`product.description` and `product.content` are the exact same value under two names — use whichever reads more clearly in context. `product.tags` returns an alphabetically sorted array, regardless of the order tags were added in the admin.

**Pricing**

```liquid
{{ product.price }}
{{ product.price_min }}
{{ product.price_max }}
{{ product.price_varies }}
{{ product.compare_at_price }}
{{ product.compare_at_price_varies }}
```

`product.price` and `product.price_min` are the same value (the lowest variant price) — `product.price_max` matters specifically for a product whose variants span a price range, and `price_varies`/`compare_at_price_varies` tell you whether to show a single price or a "from" price without having to compare `price_min` and `price_max` yourself. Every price property is an integer in the currency's smallest subunit (cents, for USD) — always pass it through a [money filter](https://shopify.dev/docs/api/liquid/filters/money-filters) rather than outputting it raw.

**Media**

```liquid
{{ product.featured_image }}
{{ product.featured_media }}
{{ product.images }}
{{ product.media }}
```

`product.images` is the older, image-only array; `product.media` is the complete array (images, videos, 3D models) sorted by when each was added, and is the one worth reaching for by default — see [Media Fundamentals](/media-deep-dive/media-fundamentals/) for how to tell the media types apart and render each correctly.

**Variants and options**

```liquid
{{ product.variants }}
{{ product.variants_count }}
{{ product.options }}
{{ product.options_with_values }}
{{ product.options_by_name['Strength'] }}
{{ product.has_only_default_variant }}
{{ product.selected_variant }}
{{ product.selected_or_first_available_variant }}
{{ product.first_available_variant }}
```

`product.options` is just the option *names* (`["Size", "Strength"]`); `product.options_with_values` is the full objects, each with a `.name` and a `.values` array, which is what you actually loop over to build a working option picker. `product.has_only_default_variant` tells you whether a product has real options at all — a single-variant product (no size, no color, nothing to choose) still has exactly one variant under the hood, called "Default Title," and checking this property is how you know to hide the option picker entirely rather than show a picker with one meaningless choice in it.

`product.selected_variant` is `nil` until a shopper has actually picked one (via the `variant` URL parameter); `product.selected_or_first_available_variant` almost always the one you want for a product page's initial render, since it falls back sensibly instead of being `nil`.

**Availability and selling plans**

```liquid
{{ product.available }}
{{ product.gift_card? }}
{{ product.requires_selling_plan }}
{{ product.selected_selling_plan }}
{{ product.selected_or_first_available_selling_plan_allocation }}
{{ product.quantity_price_breaks_configured? }}
```

`product.available` is `true` the moment *any* variant is purchasable — check an individual `variant.available` when you need to know about one specific variant rather than the product as a whole. `product.requires_selling_plan` means every variant can only be bought through a subscription, with no one-time-purchase option at all.

**Other**

```liquid
{{ product.collections }}
{{ product.category }}
{{ product.metafields }}
{{ product.url }}
{{ product.created_at }}
{{ product.published_at }}
{{ product.template_suffix }}
```

`product.collections` only includes collections the product belongs to *and* that are themselves published to the Online Store sales channel — a collection hidden from the storefront won't show up here even if the product is genuinely in it on the backend.

## variant

A `variant` is one specific, purchasable combination of a product's options (a specific size *and* color, say) — reached through `product.variants`, `product.selected_variant`, or similar.

```liquid
{{ variant.id }}
{{ variant.title }}
{{ variant.price }}
{{ variant.compare_at_price }}
{{ variant.available }}
{{ variant.sku }}
{{ variant.inventory_quantity }}
{{ variant.inventory_policy }}
{{ variant.inventory_management }}
{{ variant.options }}
{{ variant.options_with_values }}
{{ variant.selected_selling_plan_allocation }}
{{ variant.requires_selling_plan }}
{{ variant.featured_image }}
{{ variant.weight }}
{{ variant.taxable }}
```

`variant.title` is every option value joined together with `/` (`"Large / Blue"`) — for a single-option product, it's just that one value. `variant.options_with_values` is the modern, preferred way to match a variant against a specific option combination directly: an array of `{ name, value }` pairs, one per product option, always present even for a single-default-variant product (check `product.has_only_default_variant` first if you need to know whether to skip rendering an option picker at all). The older `variant.option1`/`option2`/`option3` properties still exist but are deprecated in favor of `variant.options` (the plain array of values) and `options_with_values` — prefer the newer pair in new code. `variant.available` is the one to check for a specific variant's purchasability — it's `true` when `inventory_quantity` is greater than zero, `inventory_policy` is `continue` (oversell allowed), or `inventory_management` is `nil` (inventory isn't tracked for this variant at all).

:::tip[A variant's own image, if it has one]
`variant.featured_image` is `nil` unless that specific variant has its own image assigned (a "Blue" variant with its own blue product photo, say) — falling back to `product.featured_image` when it's `nil` is the usual pattern for a gallery that should update when a shopper picks a different color.
:::

## collection

A `collection` groups products together, either by a merchant's manual picks or by rules (an automated collection).

```liquid
{{ collection.title }}
{{ collection.handle }}
{{ collection.description }}
{{ collection.products }}
{{ collection.products_count }}
{{ collection.all_products_count }}
{{ collection.image }}
{{ collection.url }}
{{ collection.current_type }}
{{ collection.sort_by }}
{{ collection.default_sort_by }}
{{ collection.filters }}
{{ collection.all_tags }}
{{ collection.all_types }}
{{ collection.all_vendors }}
```

`collection.products` returns the current page's worth of products (use the [`paginate` tag](https://shopify.dev/docs/api/liquid/tags/paginate) to control how many); `collection.products_count` is the count *after* any active filters are applied, while `collection.all_products_count` is the collection's true total, unfiltered — the difference matters for a "showing X of Y results" message. `collection.filters` is the full faceted-filtering data structure, covered in depth in All About Collection Filtering & Sorting, a forthcoming chapter in this site's Part 2.

:::note[The "all products" collection]
Every store has an automatically generated collection containing literally every product, reachable at `routes.all_products_collection_url` (normally `/collections/all`) — worth knowing about any time a theme needs "every product" rather than a specific curated set, since it means a theme never needs to build that list manually.
:::

## Key takeaways

- `product.price`/`price_min` are identical; reach for `price_max` and `price_varies` specifically for a product whose variants span a range.
- `product.options` is just names; `product.options_with_values` is what you actually loop over to build a working picker.
- `product.has_only_default_variant` is how you detect a product with no real options, so a meaningless one-choice picker never renders.
- `variant.available` (not `product.available`) is the correct check for one specific variant's purchasability.
- `collection.products_count` reflects active filters; `collection.all_products_count` doesn't — pick the one that matches what you're actually telling the shopper.

## Further reading

- [Liquid objects: product](https://shopify.dev/docs/api/liquid/objects/product) (shopify.dev)
- [Liquid objects: variant](https://shopify.dev/docs/api/liquid/objects/variant) (shopify.dev)
- [Liquid objects: collection](https://shopify.dev/docs/api/liquid/objects/collection) (shopify.dev)
- [All About Products](/all-about-products/) — every property introduced here, covered in much greater depth
