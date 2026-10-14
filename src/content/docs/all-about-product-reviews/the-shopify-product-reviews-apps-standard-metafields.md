---
title: "The Shopify Product Reviews App's Standard Metafields"
description: The real, verified structure of the reviews.rating and reviews.rating_count metafields Shopify's own free Product Reviews app writes.
---

**TL;DR:** The real, verified structure of the `reviews.rating` and `reviews.rating_count` metafields Shopify's own free Product Reviews app writes.

Shopify publishes a free **Product Reviews** app, and when it's installed, it writes two standard metafields onto every reviewed product — these are the same two metafields several third-party apps also write to, specifically so themes built against Shopify's own reviews app keep working if a merchant switches review providers.

## `reviews.rating`: a `rating`-type metafield, not a plain number

```liquid
{{ product.metafields.reviews.rating.value.rating }}
{{ product.metafields.reviews.rating.value.scale_min }}
{{ product.metafields.reviews.rating.value.scale_max }}
```

This is easy to get wrong: `reviews.rating` isn't a plain float metafield — it's Shopify's dedicated `rating` metafield type, which stores three numbers together as one structured value: the rating itself, and the scale it's measured on.

```json
{
  "rating": "4.5",
  "scale_max": "5.0",
  "scale_min": "0.0"
}
```

`product.metafields.reviews.rating.value` returns this whole object — reading `.rating.value` alone gives you the object, not the number; the actual average is one level deeper, at `.rating.value.rating`. Always read `scale_max` rather than hardcoding `5`: a theme meant to work regardless of which review app is installed can't assume every app rates out of 5.

## `reviews.rating_count`: a plain integer

```liquid
{{ product.metafields.reviews.rating_count.value }}
```

Unlike `reviews.rating`, the count is an ordinary `number_integer` metafield — one value, no nested object.

## Guarding against a product with no reviews yet

```liquid
{% liquid
  assign rating_metafield = product.metafields.reviews.rating
  assign rating_count = product.metafields.reviews.rating_count.value | default: 0
%}

{% if rating_metafield and rating_count > 0 %}
  <p class="sol-product-rating">
    {{ rating_metafield.value.rating }} out of {{ rating_metafield.value.scale_max }}
    ({{ rating_count }} {{ rating_count | pluralize: 'review', 'reviews' }})
  </p>
{% endif %}
```

A brand-new product, or one with reviews collected but not yet published, simply has no `reviews.rating` metafield at all — it's `nil`, not zero. Checking the metafield's presence (not just whether the count is greater than zero) avoids rendering a "0 reviews" line on every single product that hasn't been reviewed yet, which usually looks worse than showing nothing.

:::note[These two metafields are a de facto standard, not a Shopify-enforced one]
Shopify's own Product Reviews app establishes this `reviews.rating` / `reviews.rating_count` pattern, and several popular third-party apps (including ones that predate or compete with it) deliberately write to the same namespace and keys for compatibility — but nothing forces a given app to. [Third-Party Review Apps: App Blocks vs. Metafields](/all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields/) covers how to actually confirm which metafields a specific installed app writes, rather than assuming.
:::

## Key takeaways

- `reviews.rating` is a `rating`-type metafield — a structured object with `.rating`, `.scale_min`, and `.scale_max`, not a plain number; the actual average is at `product.metafields.reviews.rating.value.rating`.
- `reviews.rating_count` is a plain integer metafield.
- Check that the `reviews.rating` metafield actually exists before rendering anything — a product with zero reviews has no metafield at all, not a metafield equal to zero.
- Read `scale_max` rather than hardcoding `5`, since not every review app necessarily rates on the same scale.

## Further reading

- [`rating` (Liquid objects, shopify.dev)](https://shopify.dev/docs/api/liquid/objects/rating)
- [Third-Party Review Apps: App Blocks vs. Metafields](/all-about-product-reviews/third-party-review-apps-app-blocks-vs-metafields/)
- [Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/)
- [Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/)
