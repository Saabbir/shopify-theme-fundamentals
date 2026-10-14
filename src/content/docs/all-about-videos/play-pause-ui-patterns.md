---
title: Play/Pause UI Patterns
description: A Web Component wrapping a real <video> element, syncing a custom button's icon and label to the video's own play state — never a fake button disconnected from what's actually playing.
---

**TL;DR:** A Web Component wrapping a real `<video>` element, syncing a custom button's icon and label to the video's own play state — never a fake button disconnected from what's actually playing.

The native browser video controls (`controls` attribute) are accessible and functional out of the box, but visually don't match a theme's design system — most themes replace them with a custom play/pause button styled to match everything else, while still relying on the real `<video>` element's own playback API underneath.

## The component

```js
// assets/sol-video-player.js
class SolVideoPlayer extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('video');
    this.button = this.querySelector('[data-sol-play-pause]');

    this.button.addEventListener('click', () => this.togglePlayback());
    this.video.addEventListener('play', () => this.updateButton());
    this.video.addEventListener('pause', () => this.updateButton());

    this.updateButton();
  }

  togglePlayback() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  updateButton() {
    const isPlaying = !this.video.paused;
    this.button.setAttribute('aria-label', isPlaying ? this.dataset.pauseLabel : this.dataset.playLabel);
    this.button.classList.toggle('is-playing', isPlaying);
  }
}

customElements.define('sol-video-player', SolVideoPlayer);
```

```liquid
<sol-video-player data-play-label="{{ 'media.play_video' | t }}" data-pause-label="{{ 'media.pause_video' | t }}">
  <video playsinline preload="metadata" poster="{{ media.preview_image | image_url: width: 800 }}">
    <source src="{{ primary_source.url }}" type="{{ primary_source.mime_type }}">
  </video>
  <button type="button" data-sol-play-pause class="sol-video-player__button" aria-label="{{ 'media.play_video' | t }}">
    {% render 'icon-render', icon: 'play' %}
  </button>
</sol-video-player>
```

## Why the button listens to the video's own events, not the other way around

`updateButton()` runs in response to the `<video>` element's real `play`/`pause` events — not purely as a direct result of the button's own click. This matters because a video's play state can change for reasons that have nothing to do with this button at all: a shopper might press the spacebar while the video has focus, use a connected media remote, or the video might pause itself for an unrelated reason (buffering, an ad blocker, a browser policy). Driving the button's icon and label from the video's actual state — rather than just flipping a boolean the moment the button is clicked — keeps the custom UI from ever silently disagreeing with what's really happening.

## The real `<video>` stays in the accessibility tree

```liquid
<video playsinline preload="metadata" poster="...">
  <source src="..." type="...">
</video>
```

Nothing here hides the native `<video>` element or strips its own built-in keyboard support — a shopper can still tab to the video itself and use native media keyboard shortcuts, independent of the custom button. The custom button is an *additional* control, layered on top via its own styling, not a replacement that removes the video's native interactivity.

:::caution[Don't set `controls` and also build a custom button]
If the `<video>` keeps the `controls` attribute, the browser's native scrubber/play button renders *underneath* a custom one, producing two overlapping sets of controls. Once a custom play/pause button exists, remove `controls` from the `<video>` element entirely — the custom component is now responsible for exposing play/pause, while the video itself still handles everything else (keyboard focus, native gestures) automatically.
:::

## Key takeaways

- A custom play/pause button should always call the real `<video>` element's own `play()`/`pause()` methods, and sync its own icon/label from the video's `play`/`pause` events — never maintain its own separate "is playing" state.
- The native `<video>` element stays fully present and keyboard-accessible underneath a custom button; the button adds a styled control, it doesn't replace native interactivity.
- Remove the `controls` attribute once a custom play/pause button exists, to avoid two overlapping sets of playback controls.

## Further reading

- [Video Fundamentals](/all-about-videos/video-fundamentals-video_tag-vs-building-your-own-tag/)
- [Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
- [HTMLMediaElement (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
