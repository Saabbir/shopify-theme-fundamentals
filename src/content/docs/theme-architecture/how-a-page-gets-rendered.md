---
title: How a Page Gets Rendered
description: The exact chain Shopify follows, from a shopper's URL to the finished HTML page.
---

**TL;DR:** The exact chain Shopify follows, from a shopper's URL to the finished HTML page.

Every page a shopper loads goes through the same four-layer chain, in the same order, every time. Internalizing this chain is the single highest-leverage thing you can learn before writing theme code — almost every "why isn't my change showing up" problem comes down to not knowing which layer your code actually lives in.

## The rendering chain

```
layout (theme.liquid)
  └─ template (e.g. product.json)
       └─ sections (e.g. a "main-product" section)
            └─ blocks (e.g. a "text" block)
                 └─ blocks (a block can hold other blocks, nested)
```

Think of it as nested boxes. A **layout** wraps everything and never changes between pages. A **template** picks which content goes inside that layout for one specific page type. **Sections** are the content modules a template arranges. **Blocks** are the smaller, configurable pieces inside a section — and blocks can themselves contain other blocks.

## Walking through a real request

Say a shopper visits a product page. Here's what Shopify does, step by step:

1. Shopify looks at the URL and determines the page type — in this case, a product page.
2. It loads that page type's **template** (covered in [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/)) — for a product page, usually `templates/product.json`.
3. The template lists which **sections** should appear, and in what order — say, a main product section, then a "you may also like" section.
4. Each section renders its own markup, and renders any **blocks** a merchant has added to it, in the order the merchant arranged them.
5. All of that gets inserted into the **layout** (`layout/theme.liquid`), which wraps it with the page's `<head>`, header, footer, and any markup that's identical on every page.
6. Shopify sends the finished HTML to the shopper's browser.

Every single page request — home, product, collection, cart, search — follows this exact same four-step shape. Only the specific template, sections, and blocks involved change.

:::tip[Using this chain to debug]
If a change you made isn't showing up, ask which layer it should live in. Edited a block's settings but nothing changed? Check whether that block is actually added to the section on this specific page — a block only renders if a merchant has placed it there. Edited `theme.liquid` but a page-specific thing didn't change? That's expected: `theme.liquid` is shared across every page, so page-specific content never belongs there.
:::

## Key takeaways

- The chain is always: layout → template → sections → blocks (→ nested blocks).
- A layout is shared across every page. A template picks sections for one page type. Sections arrange blocks. Blocks are the smallest configurable piece.
- Most "it's not showing up" confusion is really "I edited the wrong layer."

## Further reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
