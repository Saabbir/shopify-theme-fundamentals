---
title: "Art Direction with picture"
description: Serving a genuinely different crop per breakpoint, not just a different size of the same crop.
---

**TL;DR:** Serving a genuinely different crop per breakpoint, not just a different size of the same crop.

## What `srcset` doesn't solve

[19.1. Media Fundamentals](/media-deep-dive/media-fundamentals/)'s `srcset` pattern serves different *sizes* of the same image — the browser picks whichever width fits best, but every option is the same crop, just scaled. That's the right tool when a smaller version of the exact same image genuinely looks fine at a smaller size.

It's the wrong tool when a design actually wants a different *composition* at different viewport widths — a wide, landscape-oriented crop for desktop, and a tighter, portrait-oriented crop of the same photo for mobile, where simply shrinking the desktop crop would leave the subject too small to read.

## `<picture>`: choosing between genuinely different sources

```liquid
<picture>
  <source
    media="(min-width: 750px)"
    srcset="{{ image | image_url: width: 1600, crop: 'center', aspect_ratio: '16:9' }}"
  >
  <source
    media="(max-width: 749px)"
    srcset="{{ image | image_url: width: 800, crop: 'center', aspect_ratio: '4:5' }}"
  >
  <img
    src="{{ image | image_url: width: 800, crop: 'center', aspect_ratio: '4:5' }}"
    alt="{{ image.alt | escape }}"
    width="{{ image.width }}"
    height="{{ image.height }}"
  >
</picture>
```

Each `<source>` names its own `media` condition and its own `srcset` — the browser evaluates them in order and uses the first one whose condition matches, falling back to the plain `<img>` if nothing matches (which also serves as the fallback for browsers that don't support `<picture>` at all, though that's essentially none in practice today).

## This is still "one Liquid image," rendered twice

Notice both `<source>` entries and the fallback `<img>` all reference the same `image` object — `<picture>` doesn't require two separate image uploads for two separate crops. `aspect_ratio` and `crop` (covered in full on [19.4. Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/)) do the actual recropping, so one merchant-uploaded image can serve genuinely different compositions at different breakpoints without the merchant uploading anything twice.

## When this is actually worth the extra markup

`<picture>` is more markup than a plain `srcset`, and most images don't need it — reserve it for the specific case where a design calls for a real compositional change between breakpoints, most commonly a wide hero image on desktop that needs a taller, narrower crop on mobile to keep its subject legible. For anything where the same crop just needs to scale, plain `srcset`/`sizes` is simpler and sufficient.

## Key takeaways

- `<picture>` solves a different problem than `srcset`/`sizes`: a genuinely different crop per breakpoint, not just a different size of the same crop.
- Each `<source>`'s `media` condition is checked in order; the browser uses the first match, falling back to the plain `<img>`.
- One merchant-uploaded image can serve multiple crops via `aspect_ratio`/`crop` — reserve `<picture>` for designs that actually need a compositional change, not every image by default.

## Further reading

- [The `<picture>` element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
- [The `image_url` filter](https://shopify.dev/docs/api/liquid/filters/image_url) (shopify.dev)
