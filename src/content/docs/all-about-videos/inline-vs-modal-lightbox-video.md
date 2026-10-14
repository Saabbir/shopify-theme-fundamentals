---
title: Inline vs. Modal/Lightbox Video
description: Inline playback never steals focus; a modal has to manage it deliberately — and both need the video to actually stop when it's no longer visible.
---

**TL;DR:** Inline playback never steals focus; a modal has to manage it deliberately — and both need the video to actually stop when it's no longer visible.

A product demo video can play directly in the page's normal layout, or open in an overlaying modal/lightbox triggered by a thumbnail click — the right choice depends on how much the rest of the page should visually recede while the video plays.

## Inline: simplest, and the right default for most placement

```liquid
<sol-video-player>
  <video playsinline preload="metadata" poster="{{ media.preview_image | image_url: width: 800 }}">
    <source src="{{ primary_source.url }}" type="{{ primary_source.mime_type }}">
  </video>
  <button type="button" data-sol-play-pause class="sol-video-player__button" aria-label="{{ 'media.play_video' | t }}">
    {% render 'icon-render', icon: 'play' %}
  </button>
</sol-video-player>
```

An inline video plays in its normal position in the page flow — nothing about the surrounding layout changes, no focus management is required beyond what [Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/) already covers, and a shopper can keep scrolling and reading the rest of the page while it plays. This is the right default whenever the video is one part of a richer page, rather than something that deserves the shopper's full, undivided attention.

## Modal/lightbox: for a video that deserves full attention

```liquid
<button type="button" data-sol-open-video-modal="{{ media.id }}" class="sol-video-thumbnail">
  <img src="{{ media.preview_image | image_url: width: 600 }}" alt="">
  {% render 'icon-render', icon: 'play', label: 'media.play_video' | t %}
</button>

<dialog class="sol-video-modal" id="video-modal-{{ media.id }}">
  <button type="button" class="sol-video-modal__close" aria-label="{{ 'media.close' | t }}">
    {% render 'icon-render', icon: 'close' %}
  </button>
  <video playsinline controls>
    <source src="{{ primary_source.url }}" type="{{ primary_source.mime_type }}">
  </video>
</dialog>
```

```js
class SolVideoModalTrigger extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('[data-sol-open-video-modal]');
    this.button.addEventListener('click', () => this.openModal());
  }

  openModal() {
    const mediaId = this.button.dataset.solOpenVideoModal;
    const dialog = document.getElementById(`video-modal-${mediaId}`);
    dialog.showModal();
    dialog.querySelector('video').play();

    dialog.addEventListener('close', () => {
      dialog.querySelector('video').pause();
    }, { once: true });
  }
}

customElements.define('sol-video-modal-trigger', SolVideoModalTrigger);
```

The native `<dialog>` element, opened with `showModal()`, is the right foundation here rather than a hand-built overlay — it automatically traps focus inside the dialog, is dismissible with <kbd>Escape</kbd>, and correctly removes the rest of the page from the accessibility tree while open, all without a theme needing to reimplement any of that behavior.

:::caution[Always pause the video when the modal closes]
A shopper closing the modal (via the close button, <kbd>Escape</kbd>, or clicking the backdrop) should never leave the video silently still playing, invisible, in the background. The `close` event listener above exists specifically for this — `<dialog>`'s native close methods all fire the same `close` event, so one listener correctly covers every way a shopper might dismiss it, rather than needing a separate pause call wired to each dismissal method individually.
:::

## The one rule that applies regardless of which is chosen

```js
// In a parent component managing multiple videos on one page
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    this.querySelectorAll('video').forEach((video) => video.pause());
  }
});
```

Whether inline or modal, a playing video should pause when the browser tab itself loses visibility (a shopper switches tabs, or the browser is minimized) — otherwise it keeps consuming bandwidth and battery for a video nobody is actually watching. This is a page-level concern, not specific to either placement choice, which is why it's handled once via `visibilitychange` rather than duplicated inside each video component.

## Key takeaways

- Inline playback is the right default for most product-page or section video — no focus management beyond the play/pause button itself, and the shopper can keep interacting with the rest of the page.
- A modal/lightbox is worth the added complexity specifically when a video deserves the shopper's full attention — build it on the native `<dialog>` element and `showModal()`, which handles focus trapping and `Escape`-to-dismiss automatically.
- Always pause a video when its modal closes, and pause any playing video when the browser tab itself loses visibility — both are easy to forget, and both leave a video silently consuming resources if skipped.

## Further reading

- [Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/)
- [The `dialog` element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [Page Visibility API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
