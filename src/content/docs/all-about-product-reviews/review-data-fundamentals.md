---
title: "Review Data Fundamentals: Why There's No Native `reviews` Object"
description: There's no built-in reviews object in Liquid — every theme gets review data from either Shopify's own Product Reviews app or a third-party app, both via metafields or app blocks.
---

**TL;DR:** There's no built-in reviews object in Liquid — every theme gets review data from either Shopify's own Product Reviews app or a third-party app, both via metafields or app blocks.

Unlike `product`, `collection`, or `cart`, there is no `reviews` object anywhere in Liquid's global object reference. Reviews aren't a core commerce concept Shopify models directly — they're always a layer added by an app, and a theme only ever sees whatever that app chooses to expose.

## The two real sources of review data

```liquid
{% comment %} Path 1: metafields, read directly by the theme {% endcomment %}
{{ product.metafields.reviews.rating.value.rating }}

{% comment %} Path 2: an app block, rendered by the app's own code {% endcomment %}
{% content_for 'block', type: '_app', id: 'reviews-widget' %}
```

Every review app, whether it's Shopify's own or a third party, ends up using one or both of these mechanisms:

- **Metafields** the app writes onto each product — a numeric average rating, a review count — that a theme reads directly with ordinary Liquid, same as any other metafield covered in [32.6. Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/). This is the only path that gives a theme full control over markup and placement.
- **App blocks** the merchant drags into a section via the theme editor, which render the app's own markup (often an iframe, or a script-injected widget) wherever they're placed. A theme developer doesn't control what's inside an app block — only where it's allowed to go, via `{% content_for 'block', type: '_app' %}` in the section's schema.

:::note[A theme developer usually wants metafields, not an app block, for anything custom]
An app block is the fastest way for a merchant to add a working reviews widget with zero developer involvement, but it hands full control of the markup to the app. Building a custom star-rating display on a product card, or adding `AggregateRating` schema markup, requires reading the underlying metafield values directly — which only works if the review app actually publishes them as metafields (most popular ones do; see [34.3. Third-Party Review Apps: App Blocks vs. Metafields](/all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields/) for how to check).
:::

## What review data actually looks like, once you have it

Regardless of which app provides it, the data a theme cares about is almost always the same two numbers:

- An **average rating** — a float, typically on a 1–5 (or sometimes 0–5) scale.
- A **review count** — an integer, the number of reviews behind that average.

Individual review content (reviewer names, review text, dates) is usually *not* exposed to the theme at all — it lives entirely inside the app's own block or iframe, since most apps treat full review text as something only their own rendering needs to touch, both for moderation reasons and because full review lists are rarely something a theme would want to hand-roll.

## Key takeaways

- There's no native `reviews` Liquid object — every review feature in a theme comes from an app, surfaced either through metafields a theme reads directly, or through an app block the theme can place but not control the contents of.
- Metafields are the only path that lets a theme build its own custom rating display or add SEO schema markup; an app block is faster to set up but opaque to the theme.
- The data a theme typically works with is just an average rating and a review count — full review text almost always stays inside the app's own rendering.

## Further reading

- [34.2. The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/)
- [34.3. Third-Party Review Apps: App Blocks vs. Metafields](/all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields/)
- [32.6. Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/)
- [App blocks (shopify.dev)](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks)
