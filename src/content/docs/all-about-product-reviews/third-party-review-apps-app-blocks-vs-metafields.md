---
title: "Third-Party Review Apps: App Blocks vs. Metafields"
description: How to find out what a specific installed review app actually exposes to the theme, instead of assuming it matches Shopify's own.
---

**TL;DR:** How to find out what a specific installed review app actually exposes to the theme, instead of assuming it matches Shopify's own.

[34.2. The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/) covers `reviews.rating`/`reviews.rating_count`, and several popular third-party apps (Judge.me, Loox, and others) deliberately mirror that same namespace for compatibility — but "several" isn't "all," and a theme shouldn't assume it without checking.

## Checking what a specific app actually writes

The only reliable way to know what a given review app exposes is to check directly, for the specific store the theme is built for:

- **Admin → Settings → Custom data → Products** lists every metafield definition currently registered on products, including ones an app created — if a `reviews` namespace with `rating`/`rating_count` keys shows up here, the app follows the standard pattern.
- **The app's own documentation** usually states explicitly whether it writes Shopify's standard review metafields, often under a heading like "theme integration" or "metafields," since app developers know this is the main thing a theme developer needs to know.
- **Shopify's own built-in metafield inspector**, when viewing a reviewed product in the admin, shows every metafield value actually present on that product — the fastest way to confirm real data exists, not just a registered-but-empty definition.

:::caution[A metafield *definition* existing doesn't mean every product has a *value*]
An app can register the `reviews.rating` definition store-wide the moment it's installed, before a single review has been collected. Checking that the definition exists confirms the app uses the standard pattern; it doesn't confirm any given product actually has review data yet — that's what the `nil` guard from the previous page is for.
:::

## When an app only offers an app block, with no metafields at all

Some apps — particularly ones built around a fully managed, iframe-rendered widget — don't expose metafields to the theme at all. In that case, a theme's only real option is the app block itself:

```liquid
{% comment %} sections/product.liquid {% endcomment %}
{% content_for 'block', type: '_app', id: 'reviews' %}
```

```json
{
  "blocks": [
    { "type": "@app" }
  ]
}
```

A section that allows `{ "type": "@app" }` in its blocks list lets a merchant add any installed app's block through the theme editor, including a reviews widget — the theme defines *where* it's allowed to render, the app defines everything about *what* renders there. This is a legitimate, often-correct choice: it's less work, it stays current automatically as the app updates its own widget, and it's the only option when metafields genuinely aren't available — the trade-off is giving up control over the widget's markup, styling, and whether it participates in anything the theme itself defines, like a custom star-rating component or `AggregateRating` schema.

## A practical decision

| Situation | Reach for |
|---|---|
| The app writes `reviews.rating`/`reviews.rating_count` (or an equivalent, confirmed metafield) | Read the metafield directly — full control over markup, styling, and schema |
| The app only offers a managed widget, no metafields | An app block — less control, but the only option |
| Unsure which an installed app does | Check Admin → Settings → Custom data → Products, or the app's own docs, before assuming either way |

## Key takeaways

- Not every review app writes Shopify's standard `reviews.rating`/`reviews.rating_count` metafields — check the specific installed app via Admin → Settings → Custom data → Products or its own documentation, rather than assuming.
- A metafield *definition* existing store-wide doesn't guarantee a *value* exists on any specific product yet.
- When an app genuinely offers no metafields, an app block (`{ "type": "@app" }` in a section's schema) is the only path — a legitimate choice, just one that trades away markup control.

## Further reading

- [34.2. The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/)
- [App blocks (shopify.dev)](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks)
- [Metafield definitions (Shopify Help Center)](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions)
