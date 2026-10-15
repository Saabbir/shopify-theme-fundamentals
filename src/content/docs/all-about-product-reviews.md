---
title: All About Product Reviews
description: How reviews actually surface in a theme, since Liquid has no native reviews object — metafields, app blocks, accessible star ratings, and AggregateRating schema.
---

**TL;DR:** How reviews actually surface in a theme, since Liquid has no native reviews object — metafields, app blocks, accessible star ratings, and `AggregateRating` schema.

This chapter is a complete, standalone reference on product reviews in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and Liquid basics, same as the rest of this site, but nothing about any specific review app beyond that.

There's no `reviews` object anywhere in Liquid — every review feature comes from an installed app, surfaced either through metafields a theme reads directly or through an app block the theme can place but not control. This chapter covers both paths, plus the accessibility and SEO work that sits on top once review data is actually in hand.

## What's in this chapter

| Page | Answers |
|---|---|
| [34.1. Review Data Fundamentals](/all-about-product-reviews/review-data-fundamentals/) | Why there's no native `reviews` object, and the two real sources — metafields vs. app blocks |
| [34.2. The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/) | The real, verified structure of `reviews.rating` (a `rating`-type metafield) and `reviews.rating_count` |
| [34.3. Third-Party Review Apps: App Blocks vs. Metafields](/all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields/) | How to confirm what a specific installed app actually exposes, rather than assuming it matches Shopify's own |
| [34.4. Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/) | `role="img"`/`aria-label`, and a CSS-only partial-star fill with no JavaScript |
| [`AggregateRating` Schema.org Markup for SEO](/all-about-product-reviews/aggregaterating-schema-for-seo/) | JSON-LD for rich results, and the self-serving-reviews rule that must gate it |
| [34.6. A Complete Example](/all-about-product-reviews/a-complete-example/) | One rating snippet reused as a compact card placement and a full product-page placement, with schema on the page only |

## Further reading

- [`rating` (Liquid objects, shopify.dev)](https://shopify.dev/docs/api/liquid/objects/rating)
- [32.6. Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/)
- [33. All About Product Cards](/all-about-product-cards/)
