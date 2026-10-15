---
title: Product Fundamentals
description: What a product actually is underneath its options and variants, before anything more advanced makes sense.
---

**TL;DR:** What a product actually is underneath its options and variants, before anything more advanced makes sense.

## A product is a container; a variant is what's actually for sale

A `product` is never, by itself, the thing a shopper buys. Every product has at least one **variant** — even a product with no real choices ("just add a T-shirt to my cart") still has exactly one variant behind the scenes, Shopify's own auto-generated "Default Title." A product with real choices (Size, Color) has one variant per *combination* of those choices: a T-shirt with 3 sizes and 4 colors has up to 12 variants, each with its own price, inventory, SKU, and barcode.

```liquid
{{ product.title }}
{{ product.variants_count }}
{{ product.has_only_default_variant }}
```

`product.has_only_default_variant` is the reliable way to tell these two cases apart in Liquid — `true` for the single-default-variant case, `false` the moment a product has one or more real options. This single check is what decides whether a product page needs to render an option picker at all, covered in full on [32.2. The Variants & Options Matrix in Depth](/all-about-products/the-variants-and-options-matrix-in-depth/).

## Identity: handle, id, title

```liquid
{{ product.id }}
{{ product.title }}
{{ product.handle }}
```

`product.handle` is the URL-safe slug (`"health-potion"`) used to build the product's URL and as a stable key for comparisons — unlike `product.id`, a handle is human-readable and set (or auto-generated from the title) by whoever created the product. `product.url` already includes the handle correctly formatted; there's rarely a reason to build a product URL by hand from the handle alone.

## Content: description, vendor, type, tags

```liquid
{{ product.description }}
{{ product.vendor }}
{{ product.type }}
{{ product.tags }}
```

`product.description` (identical to `product.content`, under two names) is rich HTML, not plain text — rendering it directly is correct; running it through `strip_html` first is only needed for something like a meta description or a plain-text excerpt. `product.vendor` and `product.type` are both free-text fields set per product, commonly used to build a vendor index or a type-based navigation menu (`shop.vendors` and `shop.types` return the store's complete sets, covered in [31.3. cart, customer & shop in Full](/all-about-global-objects/cart-customer-and-shop-in-full/)). [32.6. Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/) covers tags, `product.category`, and how all of this differs from collection membership, in full.

## A product only exists where it's eligible to

`product` is `nil` everywhere except a product page, a product recommendation, or a search/collection result — [31.7. Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/) covers this in full for every global object, `product` included. The practical habit that follows: any snippet referencing `product` that isn't exclusively rendered from `templates/product.json` needs an `{% if product %}` guard, the same instinct [31.1. Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/) establishes for every global object.

## Key takeaways

- Every product has at least one variant, even one with no real options — Shopify auto-generates a "Default Title" variant for it.
- `product.has_only_default_variant` is the reliable check for whether a product needs an option picker rendered at all.
- `product.description`/`product.content` are rich HTML; strip it first only when plain text is actually needed.
- `product` is `nil` outside a product page, a recommendation, or a search/collection result — guard any snippet that might render elsewhere.

## Further reading

- [Liquid objects: product](https://shopify.dev/docs/api/liquid/objects/product) (shopify.dev)
- [31.2. product, variant & collection in Full](/all-about-global-objects/product-variant-and-collection-in-full/) — this site's quick-reference property list for all three objects at once
- [32.2. The Variants & Options Matrix in Depth](/all-about-products/the-variants-and-options-matrix-in-depth/)
