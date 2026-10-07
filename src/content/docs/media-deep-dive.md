---
title: Media Deep Dive
description: Everything about media that the introductory chapter didn't have room for.
---

**TL;DR:** Everything about media that the introductory chapter didn't have room for.

:::note[This is a Part 2 deep dive]
This chapter assumes you've already read [Images & Responsive Image Tags](/media-and-assets/images-and-responsive-image-tags/) and [Video & 3D Media](/media-and-assets/video-and-3d-media/) — it doesn't repeat `srcset`/`sizes`, the layout-shift-prevention pattern, or the dedicated video/3D filters. If you haven't read Part 1 yet, start there; this chapter goes deep on one topic rather than introducing it.
:::

## What's in this chapter

| Page | Answers |
|---|---|
| [Art Direction with picture](/media-deep-dive/art-direction-with-picture/) | Serving a genuinely different crop per breakpoint, not just a different size of the same crop |
| [Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/) | When autoplay is appropriate, and loading a video without blocking the rest of the page |
| [Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/) | Every `image_url` parameter beyond `width` — cropping, format, and quality |
| [Performance Budgets for Media-Heavy Pages](/media-deep-dive/performance-budgets-for-media-heavy-pages/) | Setting and enforcing a real limit on how much a page is allowed to weigh |

## Further reading

- [Responsive images (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
