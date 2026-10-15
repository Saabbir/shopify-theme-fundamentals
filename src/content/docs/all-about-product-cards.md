---
title: All About Product Cards
description: Everything about the UI-composition chapter tying products, colors, and reviews together into the card that repeats dozens of times on one page.
---

**TL;DR:** Everything about the UI-composition chapter tying products, colors, and reviews together into the card that repeats dozens of times on one page.

This chapter is a complete, standalone reference on product cards in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you've read (or can cross-reference) [32. All About Products](/all-about-products/), [17. All About Colors](/all-about-colors/), and [34. All About Product Reviews](/all-about-product-reviews/), since this chapter builds directly on top of all three rather than repeating them.

A product card is a deliberately narrowed, repeated view of a product — this chapter covers exactly what belongs on one, and the real edge case behind each piece that looks simple until a specific product (sold out, single-image, no reviews yet) exposes it.

## What's in this chapter

| Page | Answers |
|---|---|
| [33.1. Product Card Fundamentals](/all-about-product-cards/product-card-fundamentals/) | What a card actually needs, and what this chapter deliberately leaves to other chapters |
| [33.2. The Image & Hover/Secondary Image](/all-about-product-cards/the-image-and-hover-secondary-image/) | Why there's no "hover image" field — just a product's second image, swapped with CSS alone |
| [33.3. Badges: Sale, Sold Out & Custom Tags](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/) | Deriving sale/sold-out from real data, and a tag-based convention for merchant-controlled custom badges |
| [33.4. Price Formatting: Single, Compare-At & Ranges](/all-about-product-cards/price-formatting-single-compare-at-and-ranges/) | The exact properties for a plain price, a sale price, a range, and all three combined |
| [33.5. Color & Size Swatches](/all-about-product-cards/color-and-size-swatches/) | Shopify's real `product_option_value.swatch` object, and why size almost never has one |
| [33.6. Quick Add](/all-about-product-cards/quick-add/) | A real `<form>` first, with a `fetch`-based enhancement that falls back correctly if anything goes wrong |
| [33.7. A Complete Example](/all-about-product-cards/a-complete-example/) | One card snippet combining every piece above, including the reviews chapter's shared rating snippet |

## Further reading

- [32. All About Products](/all-about-products/)
- [17. All About Colors](/all-about-colors/)
- [34. All About Product Reviews](/all-about-product-reviews/)
- [36. All About Buttons](/all-about-buttons/)
