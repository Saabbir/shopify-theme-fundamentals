---
title: Media Fundamentals
description: Responsive images, the dedicated video/3D filters, and the complete img pattern, all from the ground up.
---

**TL;DR:** Responsive images, the dedicated video/3D filters, and the complete `<img>` pattern, all from the ground up.

## The complete responsive image pattern

A real, production `<img>` needs several attributes working together — not because any one of them is complicated, but because skipping any one of them causes a real, specific problem:

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

## `srcset` and `sizes`: not downloading more than necessary

`srcset` lists several versions of the same image at different widths. `sizes` tells the browser how wide the image will actually be displayed at different viewport widths (here: half the viewport on screens 750px and wider, the full viewport below that). Given both, the browser — not your code — picks whichever listed width is the best fit for the device it's actually running on, accounting for both viewport size and screen pixel density. A phone on a narrow connection never downloads the 1200px version meant for a wide desktop monitor.

## `width` and `height`: preventing layout shift

```liquid
width="{{ image.width }}"
height="{{ image.height }}"
```

These two attributes don't control the image's final *displayed* size — that's normally CSS's job. What they do is tell the browser the image's aspect ratio immediately, before the image file has actually downloaded, so it can reserve the correct amount of space in the layout right away. Without them, the surrounding content visibly jumps the moment the image finishes loading and the browser only then discovers how tall it actually is.

## `loading="lazy"` — except for the one image that shouldn't be

`loading="lazy"` tells the browser not to bother downloading an image until it's about to scroll into view — the right default for most images on a typical page.

:::caution[Never lazy-load the first, most important image on a page]
A hero image, or anything else visible the instant the page loads, should **not** use `loading="lazy"`. Lazy-loading tells the browser to deliberately delay that download — for an image already on screen, that only makes it appear later than it needs to, for no benefit. Omit `loading` entirely (or set `loading="eager"`) for anything above the fold, and reserve `loading="lazy"` specifically for images further down the page that a shopper may never even scroll to.
:::

## Video and 3D media: dedicated filters, not hand-built tags

Shopify provides dedicated filters for each media type beyond a plain image, each one generating the correct, complete markup for that specific kind of media.

A `video`-type setting returns a video object, rendered with a filter that builds a complete, working `<video>` element:

```liquid
{{ section.settings.video | video_tag: controls: true }}
```

This generates the right `<source>` elements for the formats Shopify has transcoded the upload into, so the browser can pick whichever one it supports — you never need to know or list those formats yourself.

A `video_url`-type setting returns a reference to an external video (YouTube, Vimeo), rendered with its own matching filter:

```liquid
{{ section.settings.external_video | external_video_tag }}
```

A product's 3D model files are found and rendered through their own mechanism too:

```liquid
{% assign model = product.media | where: 'media_type', 'model' | first %}
{% if model %}
  {{ model | model_viewer_tag }}
{% endif %}
```

`model_viewer_tag` generates a `<model-viewer>` element — a native Web Component Shopify provides — letting a shopper rotate and (on a supporting device) view the model in AR.

:::note[Check exact filter options against current docs]
Each of these filters accepts its own set of options (autoplay, loop, specific player controls, and similar) beyond what's shown here. The pattern — a dedicated filter per media type, rather than hand-building the tag — is the main thing worth internalizing; check [Shopify's filter reference](https://shopify.dev/docs/api/liquid/filters) for the full, current set of options each one accepts.
:::

## Key takeaways

- `srcset`/`sizes` let the browser choose the right image size for its own viewport and pixel density — never make that choice yourself in Liquid.
- `width`/`height` attributes prevent layout shift by reserving space before the image downloads.
- `loading="lazy"` is right for most images, but actively harmful for the one image visible the moment the page loads.
- Each media type beyond a plain image has its own dedicated rendering filter (`video_tag`, `external_video_tag`, `model_viewer_tag`) — avoid hand-assembling a `<video>` or `<model-viewer>` tag yourself.

## Further reading

- [Responsive images (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [The `image_url` filter](https://shopify.dev/docs/api/liquid/filters/image_url) (shopify.dev)
- [The `video_tag` filter](https://shopify.dev/docs/api/liquid/filters/video_tag) (shopify.dev)
