---
title: Poster-Image States
description: Shopify's auto-generated thumbnail works as a poster — but a merchant-chosen cover image needs its own override, and the poster has to disappear exactly once playback begins.
---

**TL;DR:** Shopify's auto-generated thumbnail works as a poster — but a merchant-chosen cover image needs its own override, and the poster has to disappear exactly once playback begins.

A poster image is what a shopper sees before pressing play — [19.3. Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/) already establishes that a non-autoplaying video always needs one, since a blank black box looks broken. This page covers where it actually comes from, and the one state transition worth getting right.

## The default: Shopify's auto-generated thumbnail

```liquid
<video poster="{{ media.preview_image | image_url: width: 800 }}" ...>
```

`media.preview_image` is a real `image` object Shopify generates automatically for every uploaded video — no merchant action required, and it's already the right fallback for a video with no explicit cover image chosen.

## Letting a merchant override it

```liquid
{% liquid
  assign poster_image = block.settings.custom_poster | default: media.preview_image
%}
<video poster="{{ poster_image | image_url: width: 800 }}" ...>
```

```json
{
  "type": "image_picker",
  "id": "custom_poster",
  "label": "t:labels.custom_poster_image"
}
```

A merchant uploading a product video rarely gets to choose which exact frame Shopify auto-extracts as the thumbnail — an optional `image_picker` setting, falling back to `media.preview_image` when empty, gives a merchant a real way to pick a more flattering cover image (a clean product shot, rather than whatever frame happened to be first) without being forced to.

## The poster has to disappear the instant playback starts, not before

```css
.sol-video-player {
  position: relative;
}
```

```js
this.video.addEventListener('play', () => {
  this.classList.add('is-playing');
});
```

```css
.sol-video-player__button {
  position: absolute;
  inset: 0;
  margin: auto;
}

.sol-video-player.is-playing .sol-video-player__button {
  opacity: 0;
  pointer-events: none;
}
```

The browser already handles the poster-to-video-frame swap automatically — a `<video>` element's `poster` attribute simply stops rendering the instant the video actually begins playing, with no theme code required for that part. What *does* need theme code is fading out the custom play button overlaying it (from [39.2. Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/)) in sync with that same moment — without the `is-playing` class toggle above, a large play button would otherwise sit visually on top of the now-playing video indefinitely, rather than disappearing once it's no longer needed.

## Key takeaways

- `media.preview_image` is a real, automatically generated thumbnail — the correct default poster with zero merchant setup.
- An optional `image_picker` setting, falling back to `media.preview_image`, lets a merchant choose a better cover frame without requiring one.
- The browser handles the poster-image-to-video-frame swap on its own; a theme's own job is only syncing any custom overlay UI (like a large play button) to disappear at that same moment, via the video's `play` event.

## Further reading

- [19.3. Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/)
- [39.2. Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/)
- [The `video` object (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/video)
