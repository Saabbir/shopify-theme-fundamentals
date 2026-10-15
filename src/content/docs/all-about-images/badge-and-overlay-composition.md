---
title: Badge & Overlay Composition on Top of an Image
description: A positioning context on the wrapper, not the image itself, is what lets a badge, gradient, or caption layer cleanly on top.
---

**TL;DR:** A positioning context on the wrapper, not the image itself, is what lets a badge, gradient, or caption layer cleanly on top.

[33.3. Badges: Sale, Sold Out & Custom Tags](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/) covers *what* a badge says and when it should appear; this page covers the general layering mechanism any overlay on top of an image needs, whether it's a badge, a gradient for text legibility, or a caption.

## The wrapper owns the positioning context, not the `<img>`

```liquid
<div class="image-wrapper">
  <img class="image" src="{{ image | image_url: width: 600 }}" alt="{{ image.alt | escape }}" loading="lazy">
  <span class="image-wrapper__badge">{{ 'products.badges.new' | t }}</span>
</div>
```

```css
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper__badge {
  position: absolute;
  inset-block-start: var(--space-sm);
  inset-inline-start: var(--space-sm);
}
```

`position: relative` goes on the *wrapper*, never the `<img>` itself — an absolutely positioned overlay is positioned relative to the nearest positioned ancestor, which needs to be a stable container, not the image, since the image's own box can change shape as `aspect-ratio`/`object-fit` do their work. `overflow: hidden` on the same wrapper is what clips anything (an overlay that overflows at an unusual aspect ratio, for instance) to the image's visible bounds. Logical properties (`inset-block-start`, `inset-inline-start`) are used here for the same reason they're used throughout this site — a badge in the "start" corner stays in the correct corner once a storefront ships a right-to-left language, where visual "left" and "start" are no longer the same direction.

## A gradient overlay, for text legibility on top of a photo

```css
.image-wrapper--with-caption::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgb(0 0 0 / 0.6) 100%);
  pointer-events: none;
}

.image-wrapper__caption {
  position: absolute;
  inset-block-end: var(--space-md);
  inset-inline: var(--space-md);
  color: white;
}
```

A `::after` pseudo-element, rather than a second real element in the markup, is the right tool for a purely decorative gradient — it needs no accessible content of its own, and keeping it out of the actual DOM means there's nothing for assistive technology to even consider. `pointer-events: none` ensures the gradient layer never intercepts a click meant for whatever's visually underneath or on top of it (the image itself, or a caption link).

## Stacking more than one overlay without them colliding

```css
.image-wrapper__badge { inset-block-start: var(--space-sm); inset-inline-start: var(--space-sm); }
.image-wrapper__quick-add { inset-block-end: var(--space-sm); inset-inline: var(--space-sm); }
```

Once a wrapper has more than one overlay (a badge in a corner, a quick-add button along the bottom edge, as in [33. All About Product Cards](/all-about-product-cards/)'s complete example), each one needs its own distinct corner or edge — `inset-block-start`/`inset-inline-start` for one, `inset-block-end` for another — rather than letting two absolutely positioned elements default to the same position and overlap unintentionally.

## Key takeaways

- `position: relative` belongs on the image's wrapper, never the `<img>` itself, since the image's own box can change shape independently of where an overlay needs to anchor.
- A purely decorative gradient overlay is a good use for a `::after` pseudo-element — it needs no real DOM presence, and `pointer-events: none` keeps it from intercepting clicks.
- Logical properties (`inset-block-start`, `inset-inline-start`) keep a badge in the correct corner once a storefront ships a right-to-left language — physical properties would visually flip to the wrong side.

## Further reading

- [33.3. Badges: Sale, Sold Out & Custom Tags](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/)
- [29.5. Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/)
- [38.2. Aspect-Ratio Wrapper Techniques](/all-about-images/aspect-ratio-wrapper-techniques/)
