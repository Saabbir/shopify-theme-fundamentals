---
title: Rendering an Accessible Star Rating
description: Partial-star fills with CSS, and why the visual stars can never be the only thing a screen reader hears.
---

**TL;DR:** Partial-star fills with CSS, and why the visual stars can never be the only thing a screen reader hears.

A star rating is a genuinely easy component to get visually right and accessibly wrong at the same time — five filled/half-filled/empty icons communicate the number clearly to a sighted user, but convey nothing on their own to a screen reader, which has no visual concept of "how full" an icon looks.

## The accessible foundation: a real text equivalent, always

```liquid
{% liquid
  assign rating = product.metafields.reviews.rating.value.rating
  assign scale_max = product.metafields.reviews.rating.value.scale_max
  assign rating_count = product.metafields.reviews.rating_count.value | default: 0
%}

<div class="sol-star-rating" role="img" aria-label="Rated {{ rating }} out of {{ scale_max }} stars, from {{ rating_count }} {{ rating_count | pluralize: 'review', 'reviews' }}">
  {% comment %} visual stars go here, aria-hidden — see below {% endcomment %}
</div>
```

`role="img"` plus `aria-label` is the key decision: it tells assistive technology to treat the whole star cluster as a single image with one text description, rather than reading each individual star icon as its own, meaningless element. The actual star graphics inside become purely decorative at that point, which is what lets the visual half-star-fill trick below exist at all without confusing anyone using a screen reader.

## The visual stars, marked decorative

```liquid
<div class="sol-star-rating" role="img" aria-label="Rated {{ rating }} out of {{ scale_max }} stars">
  <div class="sol-star-rating__track" aria-hidden="true">
    <div class="sol-star-rating__fill" style="--sol-star-rating-percent: {{ rating | divided_by: scale_max | times: 100.0 }}%;">
      ★★★★★
    </div>
    ☆☆☆☆☆
  </div>
</div>
```

```css
.sol-star-rating__track {
  position: relative;
  display: inline-grid;
  color: var(--color-border);
}

.sol-star-rating__fill {
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: var(--sol-star-rating-percent);
  color: var(--color-accent);
  white-space: nowrap;
}
```

Five empty stars sit as the base layer; a second, absolutely positioned copy of five *filled* stars sits on top, clipped to a percentage width via `overflow: hidden`. At `72%`, the fill layer's fifth star is sliced through partway — the browser doesn't understand "three and a half stars" as a concept, but clipping an element to a percentage width produces the same visual result with ordinary CSS, no SVG masking or JavaScript needed. `aria-hidden="true"` on the whole visual track makes sure none of this — the repeated star glyphs, the clipping div — is ever exposed to a screen reader; it's purely decorative, since the real description already lives in the outer `aria-label`.

:::note[Real SVG icons work the same way — this example uses glyph characters only to keep the markup short]
A production component would almost certainly use inline SVG stars rather than the `★`/`☆` text glyphs shown here, for crisper rendering and real control over the icon's shape — the clipping and labeling technique is identical either way. [All About Icons](/all-about-icons/) covers the reusable icon-snippet pattern this would plug into.
:::

## What to never do instead

- **Never rely on color alone** to distinguish filled from empty stars — someone with a color vision deficiency needs the same shape-based distinction (filled vs. outline, or a percentage fill) sighted color contrast alone doesn't guarantee.
- **Never read five individual star elements as five separate, unlabeled list items** — that reads to a screen reader as five meaningless icons in a row, with no way to know the rating is "4 out of 5" without counting filled icons visually, which a screen reader user can't do.
- **Never omit the review count from the same accessible label** — "4.5 out of 5" alone doesn't convey whether that's based on 2 reviews or 2,000, which materially changes how much weight a shopper should give it.

## Key takeaways

- `role="img"` with a single `aria-label` describing the full rating (value, scale, and review count) is what makes a star rating accessible — the visual stars themselves should be `aria-hidden="true"`.
- A partial-star fill is just a percentage-width `overflow: hidden` clip of an absolutely positioned filled layer, sitting on top of an empty one — no JavaScript or SVG masking required.
- The accessible label and the visual rendering are two separate concerns that happen to describe the same data; building one without the other is the most common mistake with this component.

## Further reading

- [The Shopify Product Reviews App's Standard Metafields](/all-about-product-reviews/the-shopify-product-reviews-apps-standard-metafields/)
- [`AggregateRating` Schema.org Markup for SEO](/all-about-product-reviews/aggregaterating-schema-for-seo/)
- [ARIA: img role (MDN)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role)
