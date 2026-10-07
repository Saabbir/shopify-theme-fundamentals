---
title: Images & Responsive Image Tags
description: "srcset/sizes, preventing layout shift, and the difference between lazy and eager loading."
---

**TL;DR:** `srcset`/`sizes`, preventing layout shift, and the difference between lazy and eager loading.

Every image example so far has used `image_url` to request one single size. A real, production `<img>` needs a few more attributes working together — not because any one of them is complicated, but because skipping any one of them causes a real, specific problem.

## The complete pattern

```liquid
<img
  src="{{ image | image_url: width: 600 }}"
  srcset="
    {{ image | image_url: width: 400 }} 400w,
    {{ image | image_url: width: 600 }} 600w,
    {{ image | image_url: width: 900 }} 900w,
    {{ image | image_url: width: 1200 }} 1200w
  "
  sizes="(min-width: 750px) 50vw, 100vw"
  width="{{ image.width }}"
  height="{{ image.height }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
>
```

Each attribute here is solving a different problem — leaving one out doesn't just make the tag shorter, it reintroduces whichever specific issue that attribute exists to prevent.

## `srcset` and `sizes`: not downloading more than necessary

`srcset` lists several versions of the same image at different widths. `sizes` tells the browser how wide the image will actually be displayed at different viewport widths (here: half the viewport on screens 750px and wider, the full viewport below that). Given both, the browser — not your code — picks whichever listed width is the best fit for the device it's actually running on, accounting for both viewport size and screen pixel density. A phone on a narrow connection never downloads the 1200px version meant for a wide desktop monitor.

## `width` and `height`: prevent layout shift

```liquid
width="{{ image.width }}"
height="{{ image.height }}"
```

These two attributes don't control the image's final *displayed* size — that's normally CSS's job. What they do is tell the browser the image's aspect ratio immediately, before the image file has actually downloaded, so it can reserve the correct amount of space in the layout right away. Without them, the surrounding content visibly jumps the moment the image finishes loading and the browser only then discovers how tall it actually is — a real, measurable harm to a page's perceived stability, not just a cosmetic nitpick.

## `loading="lazy"` — except for the one image that shouldn't be

`loading="lazy"` tells the browser not to bother downloading an image until it's about to scroll into view — the right default for most images on a typical page.

:::caution[Never lazy-load the first, most important image on a page]
A hero image, or anything else visible the instant the page loads, should **not** use `loading="lazy"`. Lazy-loading tells the browser to deliberately delay that download — for an image already on screen, that only makes it appear later than it needs to, for no benefit. Omit `loading` entirely (or set `loading="eager"`) for anything above the fold, and reserve `loading="lazy"` specifically for images further down the page that a shopper may never even scroll to.
:::

## Key takeaways

- `srcset`/`sizes` let the browser choose the right image size for its own viewport and pixel density — never make that choice yourself in Liquid.
- `width`/`height` attributes prevent layout shift by reserving space before the image downloads; they don't override the displayed size, which CSS still controls.
- `loading="lazy"` is right for most images, but actively harmful for the one image visible the moment the page loads — that one should load eagerly instead.

## Further reading

- [Responsive images (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [The `image_url` filter](https://shopify.dev/docs/api/liquid/filters/image_url) (shopify.dev)
