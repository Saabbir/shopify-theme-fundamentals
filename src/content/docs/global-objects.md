---
title: "Shopify's Global Objects"
description: The structured data objects Shopify automatically makes available in Liquid, and which ones exist on which pages.
---

**TL;DR:** The structured data objects Shopify automatically makes available in Liquid, and which ones exist on which pages.

An "object" in Liquid is just a named collection of properties you read with a dot — `product.title`, `cart.item_count`. You've already used several without a full explanation: `product` and `collection` in [3. Sections, Blocks & Snippets](/sections-blocks-snippets/), `section` and `block` throughout that same chapter, `settings` mentioned in passing. This chapter is the reference for what these objects actually contain, and — just as importantly — when each one is actually available.

## What's in this section

| Page | Answers |
|---|---|
| [5.1. product, variant & collection](/global-objects/product-variant-and-collection/) | The core commerce objects, and the properties you'll use constantly |
| [5.2. cart, customer & shop](/global-objects/cart-customer-and-shop/) | The three objects available on every single page, no matter what |
| [5.3. settings, section & block](/global-objects/settings-section-and-block/) | A quick reference, tying back to how these were already used in earlier chapters |
| [5.4. Other Useful Objects](/global-objects/other-useful-objects/) | `request`, `routes`, `image`, and a first look at metafields |

## The distinction that matters more than any single object's properties

Not every object is available on every page. Some objects only exist in a specific context — `product` only makes sense where there's an actual product to describe. Others are available absolutely everywhere, on every single page type, with no setup required.

| Object | Available |
|---|---|
| `cart`, `customer`, `shop`, `settings`, `request`, `routes` | **Everywhere** — every template, every section, every snippet |
| `product`, `collection` | **Only where there's a specific one in context** — a product page, inside a `{% for product in collection.products %}` loop, or explicitly passed into a snippet |

:::caution[A mistake this causes constantly]
Referencing `product` on a template that isn't a product page — like trying to read `product.title` directly on a collection page, outside any loop — doesn't error. Following the rule from [4.8. Debugging Liquid](/liquid-basics/debugging-liquid/), it silently resolves to `nil` and whatever you tried to print just doesn't show up. If something reads like it should work but renders blank, check whether the object you're using is actually in scope on that specific page, not just whether you spelled it correctly.
:::

## Further reading

- [Liquid objects](https://shopify.dev/docs/api/liquid/objects) (shopify.dev)
