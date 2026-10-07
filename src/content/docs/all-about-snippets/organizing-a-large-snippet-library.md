---
title: Organizing a Large Snippet Library
description: Keeping snippets/ navigable once a theme has grown to dozens of them.
---

**TL;DR:** Keeping `snippets/` navigable once a theme has grown to dozens of them.

Shopify themes keep all snippets in one flat `snippets/` folder — there's no support for subfolders. A theme with a handful of snippets doesn't need a strategy for this at all; a theme with sixty doesn't have a choice.

## A naming convention stands in for folders

Since the folder itself can't be nested, a consistent file-naming prefix is the closest substitute, and it's what most larger themes settle on:

```
snippets/
  product-card.liquid
  product-price.liquid
  product-badge.liquid
  cart-item.liquid
  cart-summary.liquid
  icon-cart.liquid
  icon-search.liquid
  icon-close.liquid
```

Grouping by a shared prefix (`product-`, `cart-`, `icon-`) means related snippets sort next to each other alphabetically in a file browser or editor sidebar, even without real folders — `product-card.liquid` and `product-price.liquid` end up adjacent, instead of scattered between unrelated files.

## Separate "components" from "helpers"

As a snippet library grows, it tends to split into two genuinely different kinds of snippet, worth naming so the difference is visible at a glance:

- **Markup snippets** render actual HTML — `product-card.liquid`, `cart-item.liquid`. These are what most snippets are, and what [Snippet Fundamentals](/all-about-snippets/snippet-fundamentals/) covers.
- **Logic-only snippets** compute or format a value and render no markup at all — something like a snippet that takes a price and a compare-at price and outputs just the right discount-percentage text. A prefix like `format-` or a dedicated `helpers/`-style naming group (still inside the same flat `snippets/` folder) makes these easy to spot as "not a visual component" at a glance.

## A snippet index, for themes that outgrow memory

Past a certain size, nobody reliably remembers what every snippet does just from its filename. Some larger theme codebases keep a single reference document (a markdown file in the repo, not shipped as part of the theme itself) listing every snippet, its parameters, and a one-line description — essentially a hand-maintained index on top of each snippet's own `{% doc %}` header. This is worth doing once a snippet library gets large enough that a new contributor can't reasonably read through `snippets/` top to bottom to find what already exists.

:::tip[Reuse before you create, at scale]
The "Reuse before you create" instinct matters more, not less, as a snippet library grows — it's easy to accidentally write a near-duplicate of an existing snippet simply because nobody could find it. A snippet index (or even just consistent naming) is what makes "check if this already exists" actually practical once there are dozens of them.
:::

## Key takeaways

- `snippets/` is a flat folder with no real subfolder support — a consistent naming prefix is the practical substitute for organization.
- As a library grows, separating markup snippets from logic-only, no-markup snippets by naming convention makes their purpose clear at a glance.
- A hand-maintained snippet index becomes worth the effort once a library is too large to hold in memory, and is what keeps "reuse before you create" actually practical at scale.

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture#snippets) (shopify.dev)
