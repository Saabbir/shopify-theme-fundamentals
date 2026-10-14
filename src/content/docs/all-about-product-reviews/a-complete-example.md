---
title: A Complete Example
description: One rating snippet, reused with different settings on a product card and a full product page, plus the schema markup that only belongs on one of the two.
---

**TL;DR:** One rating snippet, reused with different settings on a product card and a full product page, plus the schema markup that only belongs on one of the two.

A star rating shows up in two genuinely different places in a typical theme — a compact version on a product card in a grid, and a fuller version on the product page itself — and treating them as the same component with a size option, rather than two separate implementations, is what keeps both in sync as the underlying data or styling changes.

## The shared snippet

```liquid
{% comment %}
  snippets/product-rating.liquid

  Accepts:
  - product: the product to show a rating for
  - size: "compact" (card) or "standard" (product page), defaults to "standard"
{% endcomment %}
{% liquid
  assign rating = product.metafields.reviews.rating.value.rating
  assign scale_max = product.metafields.reviews.rating.value.scale_max
  assign rating_count = product.metafields.reviews.rating_count.value | default: 0
  assign size = size | default: 'standard'
%}

{% if rating and rating_count > 0 %}
  <div class="sol-product-rating sol-product-rating--{{ size }}" role="img" aria-label="Rated {{ rating }} out of {{ scale_max }} stars, from {{ rating_count }} {{ rating_count | pluralize: 'review', 'reviews' }}">
    <div class="sol-product-rating__track" aria-hidden="true">
      <div class="sol-product-rating__fill" style="--sol-product-rating-percent: {{ rating | divided_by: scale_max | times: 100.0 }}%;">
        ★★★★★
      </div>
      ☆☆☆☆☆
    </div>
    {% if size == 'standard' %}
      <span class="sol-product-rating__count">({{ rating_count }} {{ rating_count | pluralize: 'review', 'reviews' }})</span>
    {% endif %}
  </div>
{% endif %}
```

```css
.sol-product-rating {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.sol-product-rating__track {
  position: relative;
  display: inline-grid;
  color: var(--color-border);
}

.sol-product-rating--compact .sol-product-rating__track {
  font-size: 0.75rem;
}

.sol-product-rating__fill {
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: var(--sol-product-rating-percent);
  color: var(--color-accent);
  white-space: nowrap;
}

.sol-product-rating__count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
```

The `nil`/zero-review guard from [The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/), the accessible `role="img"`/`aria-label` pattern from [Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/), and a `size` parameter are all that's needed to cover both placements — the visual difference (showing the review count in text, or not) is a small CSS/markup variation, not a reason to maintain two separate components.

## Placement 1: the product card, compact

```liquid
{% comment %} snippets/product-card.liquid {% endcomment %}
<div class="sol-product-card">
  <img src="{{ card_product.featured_image | image_url: width: 400 }}" alt="{{ card_product.featured_image.alt | escape }}" loading="lazy">
  <h3 class="sol-product-card__title">{{ card_product.title }}</h3>
  {% render 'product-rating', product: card_product, size: 'compact' %}
  <p class="sol-product-card__price">{{ card_product.price | money }}</p>
</div>
```

On a card, space is tight and there are often dozens of cards on one collection page — the compact size skips the explicit review-count text (the `aria-label` still announces it to a screen reader) and uses a smaller font size, so the rating reads as a quick visual signal without competing with the title and price for attention.

## Placement 2: the product page, standard, plus schema markup

```liquid
{% comment %} sections/product.liquid {% endcomment %}
<div class="sol-product">
  <h1>{{ product.title }}</h1>
  {% render 'product-rating', product: product, size: 'standard' %}
  <p class="sol-product__price">{{ product.price | money }}</p>
</div>

{% render 'product-schema', product: product %}
```

The product page uses the same snippet with `size: 'standard'`, which shows the explicit `(128 reviews)` text alongside the stars — here, there's room, and a shopper deciding whether to buy benefits from seeing the exact count, not just a visual approximation. Critically, [`AggregateRating` Schema.org Markup for SEO](/all-about-product-reviews/aggregaterating-schema-for-seo/)'s JSON-LD snippet is rendered **only here**, on the product template — never on a collection page showing a grid of product cards, since each card isn't itself a distinct page Google could attach a product rich result to, and `AggregateRating` schema belongs to one canonical product page per product, not to every place that product's rating happens to be visually shown.

## Key takeaways

- One rating snippet, parameterized by size, correctly serves both the compact card placement and the fuller product-page placement — maintaining two separate implementations would only risk them drifting out of sync.
- A compact placement can safely omit the visible review-count text while keeping it in the accessible label; a standard placement should show it, since a shopper deciding to buy benefits from the exact number.
- `AggregateRating` JSON-LD belongs on the product template only — never duplicated onto a collection page's product cards, where there's no single canonical page for the rich result to attach to.

## Further reading

- [Review Data Fundamentals](/all-about-product-reviews/review-data-fundamentals/)
- [Rendering an Accessible Star Rating](/all-about-product-reviews/rendering-an-accessible-star-rating/)
- [`AggregateRating` Schema.org Markup for SEO](/all-about-product-reviews/aggregaterating-schema-for-seo/)
- [All About Product Cards](/all-about-product-cards/)
