---
title: "AggregateRating Schema.org Markup for SEO"
description: JSON-LD that lets a product's star rating actually show up in Google search results, and the one rule that keeps it from being a penalty instead of a benefit.
---

**TL;DR:** JSON-LD that lets a product's star rating actually show up in Google search results, and the one rule that keeps it from being a penalty instead of a benefit.

A star rating rendered only in a page's visible HTML doesn't automatically show up as a rich result in Google search — that requires a separate, structured description of the same data, written as [schema.org](https://schema.org) JSON-LD and placed in the page's `<head>`.

## The markup

```liquid
{% comment %} snippets/product-schema.liquid — rendered once on the product template {% endcomment %}
{% liquid
  assign rating = product.metafields.reviews.rating.value.rating
  assign rating_count = product.metafields.reviews.rating_count.value | default: 0
%}

<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": {{ product.title | json }},
    "image": {{ product.featured_image | image_url: width: 1200 | prepend: "https:" | json }},
    "offers": {
      "@type": "Offer",
      "priceCurrency": {{ cart.currency.iso_code | json }},
      "price": {{ product.price | money_without_currency | json }},
      "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}"
    }
    {% if rating and rating_count > 0 %}
      ,"aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": {{ rating | json }},
        "reviewCount": {{ rating_count | json }}
      }
    {% endif %}
  }
</script>
```

Every value is written through the `json` filter rather than interpolated as a raw string — this isn't a style preference, it's what correctly escapes a product title containing a quotation mark or backslash into valid JSON, which plain Liquid string interpolation doesn't do on its own.

## The rule that matters more than the markup itself: only when ratings are genuinely visible

:::caution[Google's structured data guidelines require the rating to actually be visible on the page]
Adding `aggregateRating` to a product's schema when that product page shows no visible star rating or review count anywhere is a direct violation of [Google's review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) — specifically the "self-serving" review restriction, which can result in the rich result being suppressed for the entire site, not just the one offending page. The `{% if rating and rating_count > 0 %}` guard above exists for exactly this reason: never emit `aggregateRating` for a product that isn't actually displaying a rating to the shopper.
:::

This is the single most common mistake with this pattern — copying the JSON-LD snippet onto every product template unconditionally, including products with zero reviews, where the visible rating never renders at all. The guard has to gate the schema the same way it gates the visible star component in [Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/) — both or neither.

## Verifying it actually works

Google's [Rich Results Test](https://search.google.com/test/rich-results) parses a live product URL and reports exactly which structured data it found and whether it's eligible for a rich result — the only reliable way to confirm the JSON-LD is both valid and actually detected, rather than trusting that the markup "looks right."

## Key takeaways

- `aggregateRating` inside a `Product` JSON-LD block is what lets a star rating appear directly in Google search results, separate from however the rating renders visually on the page.
- Always write JSON-LD values through the `json` filter, not raw string interpolation, so special characters in a product title or description don't produce invalid JSON.
- Never emit `aggregateRating` for a product whose rating isn't actually visible on that page — Google's guidelines treat this as a self-serving-reviews violation, with a potential site-wide penalty, not just a wasted few lines of markup.
- Verify with Google's Rich Results Test against a live URL rather than assuming the JSON-LD is correct just because it parses.

## Further reading

- [AggregateRating (schema.org)](https://schema.org/AggregateRating)
- [Review snippet structured data guidelines (Google)](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Rich Results Test (Google)](https://search.google.com/test/rich-results)
- [Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/)
