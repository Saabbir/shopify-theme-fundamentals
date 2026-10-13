---
title: Metafields, Tags & Categorization
description: Four different ways a product can be organized or extended, each solving a different problem and stored a different way.
---

**TL;DR:** Four different ways a product can be organized or extended, each solving a different problem and stored a different way.

A product can be organized by **type**, **tags**, **taxonomy category**, and **collection membership** — four genuinely different systems that sound similar but solve different problems. Mixing them up is a common source of a filter or navigation menu that technically works but surprises a merchant with what it actually includes.

## Type and vendor: one value each, merchant-typed

```liquid
{{ product.type }}
{{ product.vendor }}
```

Both are free-text fields, one value per product, typed directly by whoever created it — there's no controlled list enforcing consistency, so `"T-Shirt"` and `"T-shirts"` can both exist as distinct values on different products if a merchant wasn't consistent. `shop.types` and `shop.vendors` (covered in [cart, customer & shop in Full](/all-about-global-objects/cart-customer-and-shop-in-full/)) return the store's complete, deduplicated sets of whatever values actually exist.

## Tags: many per product, free text, alphabetically sorted

```liquid
{{ product.tags }}
{{ # => ["bestseller", "healing", "new-arrival"] }}
```

Unlike type and vendor, a product can have any number of tags, and `product.tags` always comes back alphabetically sorted — not in the order they were added. Tags are the backbone of the common tag-based filtering fallback covered in All About Collection Filtering & Sorting, a forthcoming chapter in this site's Part 2, and of simple product-card logic like flagging a "New" badge:

```liquid
{% if product.tags contains 'new-arrival' %}
  <span class="badge">New</span>
{% endif %}
```

## Taxonomy category: Shopify's own structured, built-in classification

```liquid
{{ product.category.name }}
{{ product.category.id }}
{{ product.category.ancestors }}
```

`product.category` is different from everything else on this page: it's Shopify's own standardized product taxonomy (the same one powering category-based reporting and some sales channels), not a merchant-authored free-text field. `product.category.ancestors` gives the full parent chain — a product categorized as "Vitamins & Supplements" might have ancestors like "Health & Beauty," useful for building a breadcrumb that reflects the category hierarchy rather than a merchant-maintained collection structure.

## Four systems, four different purposes

| System | Cardinality | Who controls the values | Typical use |
|---|---|---|---|
| `product.type` | One per product | Merchant, free text | A simple type-based nav menu |
| `product.vendor` | One per product | Merchant, free text | A brand/vendor index page |
| `product.tags` | Many per product | Merchant, free text | Filtering, badges, loose grouping |
| `product.category` | One per product | Shopify's structured taxonomy | Reporting, some sales channels, category-aware breadcrumbs |
| Collection membership | Many per product | Merchant, curated or rule-based | The actual navigable sections of a storefront |

Collection membership (`product.collections`, covered in [product, variant & collection in Full](/all-about-global-objects/product-variant-and-collection-in-full/)) is the odd one out on this page specifically because it isn't a property *of* the product at all — it's a separate relationship, built either by a merchant manually curating a collection's product list or by a collection's own automated rules (which commonly reference tags, type, or vendor to decide membership). A product's tags existing doesn't automatically put it in any particular collection; a collection's rules have to be configured to actually use those tags.

## Accessing a metafield on a product

```liquid
{{ product.metafields.custom.care_instructions.value }}
{{ product.metafields.custom.ingredients.value }}
```

A metafield attaches genuinely custom data beyond anything Shopify's built-in product fields cover — care instructions, ingredients, a size chart, a product-specific warranty length. [request, routes, localization & Metafield Access Patterns](/all-about-global-objects/request-routes-localization-and-metafields/) covers the full access pattern, type-specific `.value` formats, and the `size`/`first`/`last` key gotcha in depth; the one thing worth repeating here is that a metafield has to already be defined (in the admin or by an app) before a theme can read it — there's no way to discover what metafields a product *might* have from Liquid alone, which is why a theme's metafield-dependent features always need to be documented for whoever sets the store up.

## Key takeaways

- `product.type` and `product.vendor` are single, free-text values; `product.tags` is many free-text values, always returned alphabetically sorted.
- `product.category` is Shopify's own structured taxonomy, separate from and not controlled the same way as type/vendor/tags.
- Collection membership isn't a property of a product at all — it's a separate relationship, either curated manually or computed from rules that may or may not reference a product's tags/type/vendor.
- A metafield has to be defined ahead of time (admin or app) before Liquid can read it — there's no way to enumerate "whatever metafields this product happens to have."

## Further reading

- [Liquid objects: product](https://shopify.dev/docs/api/liquid/objects/product) (shopify.dev)
- [Liquid objects: taxonomy_category](https://shopify.dev/docs/api/liquid/objects/taxonomy_category) (shopify.dev)
- [request, routes, localization & Metafield Access Patterns](/all-about-global-objects/request-routes-localization-and-metafields/)
