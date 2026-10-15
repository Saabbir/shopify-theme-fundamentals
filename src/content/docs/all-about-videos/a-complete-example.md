---
title: A Complete Example
description: One inline video player combining a hand-built <video> tag, custom play/pause, a poster-to-playback transition, and optional captions.
---

**TL;DR:** One inline video player combining a hand-built `<video>` tag, custom play/pause, a poster-to-playback transition, and optional captions.

```liquid
{% comment %}
  snippets/video-player.liquid

  Accepts:
  - media: a video media object
  - captions_file: optional, a generic_file object from a file_reference metafield
{% endcomment %}
{% liquid
  assign primary_source = media.sources | where: 'format', 'mp4' | first
%}

<video-player class="video-player">
  <video
    playsinline
    preload="metadata"
    poster="{{ media.preview_image | image_url: width: 800 }}"
    aria-label="{{ media.alt | escape }}"
  >
    <source src="{{ primary_source.url }}" type="{{ primary_source.mime_type }}">
    {% if captions_file %}
      <track kind="captions" src="{{ captions_file.url }}" srclang="en" label="English" default>
    {% endif %}
  </video>
  <button
    type="button"
    data-play-pause
    class="video-player__button"
    aria-label="{{ 'media.play_video' | t }}"
  >
    {% render 'icon-render', icon: 'play' %}
  </button>
</video-player>
```

```js
// assets/video-player.js
class VideoPlayer extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('video');
    this.button = this.querySelector('[data-play-pause]');

    this.button.addEventListener('click', () => this.togglePlayback());
    this.video.addEventListener('play', () => this.updateState(true));
    this.video.addEventListener('pause', () => this.updateState(false));

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !this.video.paused) {
        this.video.pause();
      }
    });
  }

  togglePlayback() {
    this.video.paused ? this.video.play() : this.video.pause();
  }

  updateState(isPlaying) {
    this.classList.toggle('is-playing', isPlaying);
    this.button.setAttribute(
      'aria-label',
      isPlaying ? this.dataset.pauseLabel : this.dataset.playLabel
    );
  }
}

customElements.define('video-player', VideoPlayer);
```

```css
.video-player {
  position: relative;
  display: block;
}

.video-player video {
  width: 100%;
  display: block;
}

.video-player__button {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.9);
  transition: opacity 0.2s ease;
}

.video-player.is-playing .video-player__button {
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .video-player__button {
    transition: none;
  }
}
```

## Calling it from a product page

```liquid
{% liquid
  assign video_media = product.media | where: 'media_type', 'video' | first
  assign captions_file = product.metafields.custom.captions_vtt.value
%}

{% if video_media %}
  {% render 'video-player', media: video_media, captions_file: captions_file %}
{% endif %}
```

## How the pieces from this chapter fit together here

- **No `controls` attribute** on the `<video>` element — per [39.2. Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/), the custom button is the only playback control, so the native one is deliberately absent to avoid overlapping controls.
- **The poster disappears and the button fades out in the same instant**, both driven by the real `play` event — per [39.3. Poster-Image States](/all-about-videos/poster-image-states/), nothing here hardcodes a timer or guesses when playback has actually started.
- **`visibilitychange` pauses the video when the tab loses focus**, the page-level rule from [39.4. Inline vs. Modal/Lightbox Video](/all-about-videos/inline-vs-modal-lightbox-video/), included here even though this example is inline-only, since it's cheap insurance regardless of placement.
- **Captions render only when a caption file actually exists**, per [39.5. Captioning & Accessibility](/all-about-videos/captioning-and-accessibility/) — most calls to this snippet will have `captions_file` as `nil`, and the `{% if %}` guard keeps that the normal, unbroken case.

## Key takeaways

- A complete video component is the sum of several independently-small decisions — no native controls once a custom button exists, state driven by real video events rather than assumptions, and captions gated on a file that may or may not exist — each one easy to get right in isolation and easy to silently skip under time pressure.
- Building this as one shared snippet plus one shared Web Component means every one of those decisions is made correctly exactly once, for every video the theme ever renders.

## Further reading

- [39.1. Video Fundamentals](/all-about-videos/video-fundamentals-video_tag-vs-building-your-own-tag/)
- [39.2. Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/)
- [39.5. Captioning & Accessibility](/all-about-videos/captioning-and-accessibility/)
