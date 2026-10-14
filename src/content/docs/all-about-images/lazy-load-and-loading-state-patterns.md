---
title: Lazy-Load & Loading-State Patterns
description: loading="lazy" by default, fetchpriority="high" for the one image that shouldn't wait, and a CSS-only placeholder for the gap before an image paints.
---

**TL;DR:** `loading="lazy"` by default, `fetchpriority="high"` for the one image that shouldn't wait, and a CSS-only placeholder for the gap before an image paints.

Every image in a theme competes for the same limited bandwidth and render time on page load — the right loading strategy depends on whether a given image is likely to be visible immediately, or only after the shopper scrolls.

## The default: `loading="lazy"` on nearly everything

```liquid
<img src="{{ image | image_url: width: 600 }}" alt="{{ image.alt | escape }}" loading="lazy">
```

`loading="lazy"` tells the browser to defer fetching an image until it's close to entering the viewport — the right default for most images in a theme, especially anything inside a loop (a collection grid, a list of related products), where most instances are below the fold on page load.

## The exception: the one image that should load eagerly

```liquid
<img src="{{ image | image_url: width: 1200 }}" alt="{{ image.alt | escape }}" loading="eager" fetchpriority="high">
```

A hero image, or any image that's virtually guaranteed to be the first thing visible on page load, should do the opposite — `loading="eager"` (or simply omitting `loading` entirely, since eager is the default) plus `fetchpriority="high"`, which tells the browser to prioritize this specific request above other resources competing for bandwidth at the same time. This is almost always the single image that determines a page's **Largest Contentful Paint** score, one of Google's Core Web Vitals — getting this one image loading as early and as prioritized as possible has an outsized effect on a real, measured performance metric.

:::caution[Never mark more than one or two images `fetchpriority="high"` on the same page]
`fetchpriority="high"` is a request to prioritize, not a guarantee — marking every image on the page as high priority defeats its purpose entirely, since the browser still has to pick some ordering among requests competing for the same bandwidth. Reserve it for the one, or at most two, images that are genuinely the most important for the page's initial paint.
:::

## A loading-state placeholder, without JavaScript

```liquid
<div class="sol-image-wrapper">
  <img
    class="sol-image"
    src="{{ image | image_url: width: 600 }}"
    alt="{{ image.alt | escape }}"
    loading="lazy"
    onload="this.closest('.sol-image-wrapper').classList.add('is-loaded')"
  >
</div>
```

```css
.sol-image-wrapper {
  background: var(--color-border);
  overflow: hidden;
}

.sol-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sol-image-wrapper.is-loaded .sol-image {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .sol-image {
    transition: none;
  }
}
```

The wrapper's own background color (a neutral theme token, not pure white or black) fills the reserved `aspect-ratio` box the instant the layout is calculated — before the image has downloaded at all — and the image itself fades in once its `onload` event fires. This needs no JavaScript file or Web Component; a single inline `onload` handler is a reasonable, minimal exception to this site's usual "put JavaScript in its own asset file" convention, specifically because the behavior is one line, entirely self-contained, and tightly coupled to this one element.

:::note[A real blur-up placeholder (a tiny, blurred preview image) is a bigger feature than this chapter covers]
Services like Shopify's own image CDN don't provide a built-in blurred micro-thumbnail the way some dedicated image-optimization platforms do — building true blur-up would mean generating and storing a separate tiny placeholder image per product image, which is a real feature decision with its own trade-offs, not a drop-in technique. The neutral-background approach above covers the same underlying problem (an ugly flash of empty space) with none of that added complexity, and is the right default for most theme image galleries.
:::

## Key takeaways

- `loading="lazy"` is the correct default for nearly every image, especially anything inside a loop; reserve eager loading plus `fetchpriority="high"` for the one image most likely to be a page's Largest Contentful Paint.
- Never mark more than one or two images high priority on the same page — it's a relative request, not an absolute guarantee, and marking everything defeats its purpose.
- A neutral background color on the image wrapper, combined with an opacity fade-in on `onload`, covers the loading-state gap without needing a true blur-up placeholder or any external JavaScript file.

## Further reading

- [Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/)
- [Performance Budgets for Media-Heavy Pages](/media-deep-dive/performance-budgets-for-media-heavy-pages/)
- [Aspect-Ratio Wrapper Techniques](/all-about-images/aspect-ratio-wrapper-techniques/)
