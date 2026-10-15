---
title: Global Object Fundamentals
description: What a global object actually is, where its data comes from, and the one habit that prevents most real-world bugs involving it.
---

**TL;DR:** What a global object actually is, where its data comes from, and the one habit that prevents most real-world bugs involving it.

## What makes an object "global"

Most things a section or snippet works with — a setting, a block, a variable you `assign` yourself — only exist because something nearby created them. A **global object** is different: Shopify makes it available automatically, by name, from any Liquid file that's eligible to use it, with no `{% assign %}` or parameter passing required. `product`, `cart`, `shop`, `customer`, `settings`, `routes` — all of these are just *there*, the instant a template starts rendering, populated with real data from the store.

```liquid
{{ product.title }}
{{ cart.item_count }}
{{ shop.name }}
```

None of these three lines needed anything to set `product`, `cart`, or `shop` up first. That's the entire point of a global object: it's Shopify's way of handing a theme the data it almost certainly needs, without the theme having to ask for it explicitly every time.

## Every global object is read-only

A global object reflects the real state of the store at the moment the page renders — it's not a plain variable a theme can reassign. `{% assign product.title = "New Title" %}` doesn't fail loudly; it's simply not how any of these objects work, because they're backed by live store data, not local template state. A theme reads from a global object and renders markup based on what it finds; changing what a global object actually contains means changing something in the Shopify admin (editing the product, adding an item to the cart), not editing Liquid.

## Not every global object exists everywhere

This is the single most common source of confusion with global objects, and it's the reason this chapter has an entire page dedicated to it ([31.7. Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/)). `product` only has real data on a product page — reference it from a collection page template and it's `nil`. `customer` is `nil` for anyone not logged in, on every template, always. `cart` is the one major exception: it exists on every single page, including pages that have nothing to do with shopping, specifically so a cart icon or mini-cart count can render in the header no matter where a shopper currently is.

:::caution[The most common global-object bug: assuming availability]
Writing `{{ product.title }}` inside a snippet that's also rendered from the header or footer (which run on every page template) silently outputs nothing on any page that isn't a product page — no error, no warning, just an empty string where a title was expected. The fix is never to assume an object is populated; it's to check first, covered next.
:::

## The habit that prevents most of these bugs: check before you use

```liquid
{% if product %}
  {{ product.title }}
{% endif %}
```

Because every global object is `nil` (falsy) wherever it isn't populated, wrapping a reference in `{% if %}` is enough to make a snippet safe to render from anywhere, instead of safe only on the one template its author had in mind. This single habit — check whether an object exists before reading a property off it — is worth forming early, because it's the difference between a snippet that's genuinely reusable across a theme and one that quietly breaks the moment someone renders it from an unexpected place.

The same caution applies one level deeper, to a property that might itself be `nil` even when its parent object exists:

```liquid
{% if product.selected_variant %}
  {{ product.selected_variant.title }}
{% endif %}
```

`product` can exist while `product.selected_variant` is still `nil` (nothing is selected by default on a product with multiple variants) — checking only the outer object isn't always enough.

## Objects, properties, and the dot

Every global object is a collection of named properties, read with a dot: `product.title`, `cart.item_count`, `shop.currency`. A property can itself be another object (`product.featured_image` is an `image` object, not a plain string), a plain value (`product.title` is a string), or an array of objects (`product.variants` is an array of `variant` objects, each with its own properties) — this chapter's remaining pages go through the major objects' real properties in full, rather than this page trying to enumerate all of them at once.

## Key takeaways

- A global object is handed to a template automatically, by name, with real store data — no setup required, and nothing a theme can reassign.
- Not every global object is populated on every template; `product` only has data on product pages, `customer` only when someone's logged in, `cart` is the one object guaranteed to exist everywhere.
- Checking `{% if object %}` before reading from a global object is what makes a snippet safe to reuse anywhere in a theme, rather than safe only on the template it was first written for.
- A `nil` property on an object that does exist (`product.selected_variant` with nothing selected) is just as real a case to guard against as the object itself being missing.

## Further reading

- [Liquid objects overview](https://shopify.dev/docs/api/liquid/objects) (shopify.dev)
- [31.7. Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/)
- [4.2. Variables, Types & Truthiness](/liquid-basics/variables-types-and-truthiness/)
