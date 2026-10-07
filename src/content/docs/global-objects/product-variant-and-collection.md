---
title: "product, variant & collection"
description: The core commerce objects, and the properties you'll use constantly.
---

**TL;DR:** The core commerce objects, and the properties you'll use constantly.

## `product`

`product` represents a single product. It's available on a product page's template and sections automatically, and as the loop variable whenever you iterate over a list of products (`{% for product in collection.products %}`).

```liquid
{{ product.title }}
{{ product.description }}
{{ product.price | money }}
{{ product.featured_image | image_url: width: 600 }}
{{ product.handle }}
{{ product.url }}
{{ product.available }}
{{ product.vendor }}
{{ product.type }}
{{ product.tags }}
```

| Property | Is |
|---|---|
| `product.title`, `product.description` | The product's name and body copy (description can contain HTML) |
| `product.price` | A representative price for the product — typically its lowest-priced available variant |
| `product.available` | `true` if at least one variant is in stock and purchasable |
| `product.handle` | The URL-safe slug (`my-product-name`), used to build links |
| `product.url` | The product's actual storefront URL — prefer this over building a URL from `handle` yourself |
| `product.images`, `product.featured_image` | All images, and the one shown by default |
| `product.tags` | An array of every tag on the product — commonly checked with `contains` |
| `product.vendor`, `product.type` | The merchant-assigned brand/manufacturer and product category |

:::note[A product almost always has more than one variant, even with just one option]
Even a product with no visible options (no size, no color) still has exactly one variant behind the scenes. `product.price` above is a convenience that already accounts for this — but anything involving stock, a specific price, or a specific SKU should go through the variant itself, covered next.
:::

## `variant`

A **variant** is one specific, purchasable combination of a product's options — a specific size and color, for example. `product.variants` is the full list; `product.selected_or_first_available_variant` gives you one sensible default to work with (whatever a shopper has selected via the URL, or the first available one).

```liquid
{% assign variant = product.selected_or_first_available_variant %}

{{ variant.title }}
{{ variant.price | money }}
{{ variant.compare_at_price | money }}
{{ variant.available }}
{{ variant.id }}
{{ variant.option1 }}
```

| Property | Is |
|---|---|
| `variant.price` | This specific variant's actual price |
| `variant.compare_at_price` | The "was" price, if one is set — `nil` otherwise. Always check it's present before showing a strikethrough price. |
| `variant.available` | `true` if this specific variant is in stock |
| `variant.title` | Usually the option values joined together, like `"Large / Blue"` |
| `variant.option1`, `option2`, `option3` | The raw value of each option position (up to three) |
| `variant.id` | The variant's unique ID — what a product form actually submits to add it to the cart |

## `collection`

`collection` represents a group of products — what a shopper sees on a collection/category page.

```liquid
{{ collection.title }}
{{ collection.description }}
{{ collection.products }}
{{ collection.products_count }}
{{ collection.image }}
{{ collection.url }}
```

```liquid
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
```

`collection.products` is the array you loop over to actually list what's in it — this is the same pattern used throughout [Sections, Blocks & Snippets](/sections-blocks-snippets/worked-example/).

## Key takeaways

- `product.price` is a representative price; use `variant.price` when you need the price of one specific, exact combination of options.
- Always check that `variant.compare_at_price` is actually present before building a "was/now" price display — it's `nil` on a variant with no compare-at price set.
- `collection.products` is the array to loop over to list a collection's contents; `product` only exists where a specific one is in scope.

## Further reading

- [The `product` object](https://shopify.dev/docs/api/liquid/objects/product) (shopify.dev)
- [The `variant` object](https://shopify.dev/docs/api/liquid/objects/variant) (shopify.dev)
- [The `collection` object](https://shopify.dev/docs/api/liquid/objects/collection) (shopify.dev)
