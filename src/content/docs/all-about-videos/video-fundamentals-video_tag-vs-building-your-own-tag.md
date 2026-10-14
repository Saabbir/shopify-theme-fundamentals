---
title: "Video Fundamentals: video_tag vs. Building Your Own <video> Tag"
description: The video_tag filter covers most cases in one call — until a theme needs captions, which means building the <video> tag by hand instead.
---

**TL;DR:** The `video_tag` filter covers most cases in one call — until a theme needs captions, which means building the `<video>` tag by hand instead.

[Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/) covers when and how to autoplay; this chapter is about the UI layer on top — custom controls, poster states, inline-vs-modal placement, and accessibility — once a video is actually part of a component, not just embedded.

## `video_tag`: one filter, a complete `<video>` element

```liquid
{{ media | video_tag: controls: true, muted: false }}
```

```html
<video playsinline="playsinline" controls="controls" preload="metadata" aria-label="Potion beats" poster="https://.../thumbnail.jpg">
  <source src="https://.../video.HD-1080p.mp4" type="video/mp4">
  <img src="https://.../thumbnail.jpg">
</video>
```

`video_tag` generates the entire element as a ready-made string — `playsinline`, `preload="metadata"`, an `aria-label` pulled from the video's own `alt` text, and a `poster` derived automatically from the video's thumbnail, all without a theme needing to assemble any of it by hand. It accepts every standard HTML5 video attribute (`autoplay`, `loop`, `muted`, `controls`, `loading`) as filter parameters, and — notably — if `loading` isn't passed explicitly, Shopify automatically sets it to `lazy` for any video in a section further down the page, which is one less thing a theme needs to get right itself.

## The real limit: `video_tag` returns a closed string, with no slot for a `<track>`

```liquid
{{ media | video_tag: controls: true }}
{% comment %} There's no way to inject a <track> element inside this output — it's already a complete, closed <video> tag. {% endcomment %}
```

Captions require a `<track kind="captions" src="...">` child element inside the `<video>` tag itself — and `video_tag` gives back a complete, already-closed HTML string with no parameter for adding one. The moment captions are a requirement, a theme has to stop using `video_tag` and build the `<video>` element manually instead, using the video object's own `sources` array directly:

```liquid
{% liquid
  assign primary_source = media.sources | where: 'format', 'mp4' | first
%}
<video
  playsinline
  preload="metadata"
  poster="{{ media.preview_image | image_url: width: 800 }}"
  aria-label="{{ media.alt | escape }}"
  controls
>
  <source src="{{ primary_source.url }}" type="{{ primary_source.mime_type }}">
  <track kind="captions" src="{{ captions_url }}" srclang="en" label="English" default>
</video>
```

Every value used here — `.sources` (an array of `video_source` objects, each with its own `.url`, `.mime_type`, `.format`, `.width`, `.height`), `.preview_image`, `.alt` — is a real, verified property directly on Shopify's `video` Liquid object; nothing here needs `video_tag` at all once a theme is building the tag by hand. [Captioning & Accessibility](/all-about-videos/captioning-and-accessibility/) covers where `captions_url` actually comes from, since Shopify doesn't generate captions automatically.

## Deciding which to use

| Situation | Reach for |
|---|---|
| Standard playback, no captions needed | `video_tag` — simplest, handles poster/HLS/lazy-loading automatically |
| Captions required | Build the `<video>` tag manually from `media.sources`, with a `<track>` child |
| Custom play/pause controls (next page) | Either — the controls UI sits on top of the `<video>` element regardless of how its own tag was generated |

## Key takeaways

- `video_tag` is the right default for most video — it generates a complete, correct `<video>` element including poster, HLS fallback, and lazy-loading, in one filter call.
- `video_tag`'s output is a closed HTML string with no way to inject a `<track>` element — captions require abandoning the filter and building the `<video>` tag by hand from `media.sources`.
- `video.sources` is a real, verified array of `video_source` objects (`.url`, `.mime_type`, `.format`, `.width`, `.height`) — everything needed to construct the tag manually is already there on the object, with no extra API call required.

## Further reading

- [Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/)
- [The `video_tag` filter (shopify.dev)](https://shopify.dev/docs/api/liquid/filters/video_tag)
- [The `video` object (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/video)
- [The `video_source` object (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/video_source)
