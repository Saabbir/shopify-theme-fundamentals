---
title: Image CDN Transform Parameters
description: Every image_url parameter beyond width — cropping, format, and quality.
---

**TL;DR:** Every `image_url` parameter beyond `width` — cropping, format, and quality.

Every example so far has used `image_url: width: ...`. Shopify's image CDN, which `image_url` generates URLs for, accepts several other parameters worth knowing in full.

## `crop` and `aspect_ratio`: controlling composition, not just size

```liquid
{{ image | image_url: width: 800, height: 800, crop: 'center' }}
```

`crop` tells the CDN which part of the image to keep when the requested dimensions don't match the original's proportions — `center`, `top`, `bottom`, `left`, and `right` are the available anchor points. Combined with `aspect_ratio` (used in the `<picture>` example on [19.2. Art Direction with picture](/media-deep-dive/art-direction-with-picture/)), this is how a single uploaded image can be recropped to a completely different shape on demand, without the merchant uploading a second file.

## `format`: requesting a specific file format

```liquid
{{ image | image_url: width: 800, format: 'webp' }}
```

Requests the image back in a specific format rather than whatever format it was originally uploaded as. `webp` in particular is usually noticeably smaller than an equivalent JPEG or PNG at the same visual quality, which makes it worth reaching for when a browser supports it.

:::note[Shopify already does this automatically in most cases]
Shopify's CDN already serves a modern format like WebP automatically to browsers that support it, without you needing to request `format` explicitly, in most normal usage through `image_url`. Setting `format` explicitly matters most for an edge case where you need to guarantee a specific format regardless of what the CDN would otherwise choose — check [Shopify's current documentation](https://shopify.dev/docs/api/liquid/filters/image_url) for exactly when automatic format negotiation applies versus when an explicit `format` is needed.
:::

## Combining parameters

Parameters compose — a single `image_url` call can set `width`, `crop`, `aspect_ratio`, and `format` together:

```liquid
{{ image | image_url: width: 1200, aspect_ratio: '16:9', crop: 'center', format: 'webp' }}
```

## Key takeaways

- `crop` controls which part of an image is kept when its requested dimensions don't match its original proportions; `aspect_ratio` controls the shape being requested.
- `format` can request a specific file format like `webp`, though Shopify's CDN already negotiates a modern format automatically in most normal cases.
- These parameters compose in a single `image_url` call — recropping, resizing, and reformatting all happen through the same filter, on the same underlying uploaded image.

## Further reading

- [The `image_url` filter](https://shopify.dev/docs/api/liquid/filters/image_url) (shopify.dev)
