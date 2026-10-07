---
title: Video Loading & Autoplay Strategy
description: When autoplay is appropriate, and loading a video without blocking the rest of the page.
---

**TL;DR:** When autoplay is appropriate, and loading a video without blocking the rest of the page.

## Autoplay has real constraints, not just etiquette ones

Autoplaying video with sound is blocked by most browsers outright, regardless of what a theme's code asks for — this isn't a style preference, it's a hard platform constraint. A video can only autoplay reliably if it's also muted:

```liquid
{{ section.settings.video | video_tag: autoplay: true, muted: true, loop: true, controls: false }}
```

If a design calls for autoplaying video with audible sound, that's not achievable with autoplay at all — the realistic options are muted autoplay with an optional sound toggle the shopper taps to opt in, or no autoplay, with a visible play control instead.

## When autoplay is actually the right call

Autoplay (muted, looping, usually without controls) tends to work well for short, ambient, background-style video — a looping lifestyle clip behind a hero heading, say, where the video is decorative rather than something the shopper needs to watch start to finish. It tends to work poorly for anything the shopper is meant to actually watch and absorb — a product demo or a founder's story autoplaying muted just means the shopper has to notice it, then manually unmute it, then probably restart it from the beginning, which is a worse experience than giving them an explicit play button from the start.

:::caution[Respect `prefers-reduced-motion` for autoplaying video too]
Per this project's own accessibility conventions, autoplaying video should pause (or never start) when `prefers-reduced-motion` is set, the same as any other animation. A looping background video is motion a shopper hasn't asked for, same as a CSS animation would be.
:::

## Not blocking the rest of the page on a video

A video file is typically much larger than an image, which makes its loading strategy matter more, not less. A few concrete practices:

- Don't autoplay a video that's below the fold at all — if a shopper may never scroll to it, there's no reason to spend their bandwidth downloading it before they do. `loading="lazy"`'s image-specific syntax doesn't apply to `<video>` directly, but the same idea applies: use a poster image for a below-the-fold video, and only trigger actual playback once it scrolls into view (an `IntersectionObserver` in a small Web Component is the usual mechanism).
- Always set a `poster` image on a `<video>` element that isn't autoplaying — without one, the browser shows a blank black box until the shopper presses play, which looks broken even though it technically isn't.
- For uploaded video (via `video_tag`), Shopify has already transcoded the file into formats appropriate for streaming — you don't need to manually compress or re-encode anything yourself before uploading.

## Key takeaways

- Autoplay only works reliably when muted — audible autoplay isn't a real option on the modern web, regardless of theme code.
- Muted, looping autoplay suits short, ambient background video; anything the shopper needs to actually watch is better served by an explicit play control.
- Respect `prefers-reduced-motion` for autoplaying video, and avoid loading or playing a below-the-fold video until it's actually about to be seen.

## Further reading

- [The `video_tag` filter](https://shopify.dev/docs/api/liquid/filters/video_tag) (shopify.dev)
- [Autoplay guide for media (MDN)](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
