---
title: The Image & Hover/Secondary Image
description: There's no dedicated "hover image" field — the real convention is the product's second media item, swapped in with CSS alone.
---

**TL;DR:** There's no dedicated "hover image" field — the real convention is the product's second media item, swapped in with CSS alone.

A common product-card pattern shows the primary image normally, then swaps to a second image on hover — often an alternate angle, or the product in use. It's easy to assume this needs its own setting or metafield; it doesn't.

## Where the second image actually comes from

```liquid
{% liquid
  assign primary_image = card_product.featured_image
  assign secondary_image = card_product.images[1]
%}
```

Shopify has no concept of a dedicated "hover image" — `secondary_image` here is simply the *second* image in the product's own media list (`images[1]`, since `images[0]` is the featured/first image). This is the real, common convention: whatever a merchant uploads second for a product becomes its card hover image, with no separate upload step or setting required.

:::note[A product with only one image has no secondary image — guard for it]
`card_product.images[1]` is `nil` for any product with fewer than two images, which is common for a brand-new or simply-photographed product. Every example on this page checks for this before rendering the swap markup; skipping the check doesn't break anything visually (an empty `<img>` just doesn't render), but it's still worth guarding explicitly rather than relying on that accident.
:::

## The swap, with CSS alone — no JavaScript needed

```liquid
<a href="{{ card_product.url }}" class="sol-product-card__media">
  <img
    class="sol-product-card__image sol-product-card__image--primary"
    src="{{ primary_image | image_url: width: 600 }}"
    alt="{{ primary_image.alt | escape }}"
    loading="lazy"
    width="600"
    height="{{ 600 | divided_by: primary_image.aspect_ratio }}"
  >
  {% if secondary_image %}
    <img
      class="sol-product-card__image sol-product-card__image--secondary"
      src="{{ secondary_image | image_url: width: 600 }}"
      alt=""
      loading="lazy"
      width="600"
      height="{{ 600 | divided_by: secondary_image.aspect_ratio }}"
    >
  {% endif %}
</a>
```

```css
.sol-product-card__media {
  position: relative;
  display: block;
}

.sol-product-card__image--secondary {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sol-product-card__media:hover .sol-product-card__image--secondary,
.sol-product-card__media:focus-within .sol-product-card__image--secondary {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .sol-product-card__image--secondary {
    transition: none;
  }
}
```

Both images render in the markup from the start — the second one sits absolutely positioned on top of the first, at `opacity: 0`, and `:hover`/`:focus-within` fade it in. `:focus-within` matters here specifically because a keyboard user tabbing to the card link should see the same secondary image a mouse user hovering sees — an effect built only on `:hover` would be invisible to keyboard navigation entirely.

### The secondary image's `alt` is deliberately empty

The primary image carries the real, descriptive `alt` text; the secondary image is marked `alt=""` on purpose. A screen reader encountering both images on the same card link would otherwise announce the product twice — once per image — for what is, to a screen reader user, a single link to a single product.

## Performance: both images load, even though only one is initially visible

```liquid
<img
  ...
  loading="lazy"
  ...
>
```

`loading="lazy"` on both images is what keeps this pattern affordable on a page with dozens of cards — the browser only actually fetches images close to entering the viewport, regardless of which one is visually on top at that moment. Without it, every card on a long collection grid would eagerly download two full images each, most of which the shopper may never scroll to.

## Key takeaways

- There's no "hover image" field — the real convention is simply the product's second image (`card_product.images[1]`), which is `nil` and needs guarding for any product with fewer than two images.
- `:focus-within` alongside `:hover` is what makes the swap visible to keyboard users too, not just mouse users.
- The secondary image's `alt` should be empty, since the primary image's `alt` already describes the product once for the whole card link.
- `loading="lazy"` on both images keeps a grid of dozens of cards from eagerly downloading twice as many images as actually get seen.

## Further reading

- [The Media Gallery](/all-about-products/the-media-gallery/)
- [Media Deep Dive](/media-deep-dive/)
- [`image_url` (shopify.dev)](https://shopify.dev/docs/api/liquid/filters/image_url)
