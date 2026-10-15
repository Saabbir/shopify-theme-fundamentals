---
title: All About Videos
description: A UI-composition chapter on videos — custom play/pause controls, poster states, inline vs. modal placement, and captioning/accessibility.
---

**TL;DR:** A UI-composition chapter on videos — custom play/pause controls, poster states, inline vs. modal placement, and captioning/accessibility.

This chapter is a complete, standalone reference on video components in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. [19. Media Deep Dive](/media-deep-dive/)'s [19.3. Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/) covers when and how to autoplay; this chapter builds the UI layer on top once a video becomes part of an interactive component.

## What's in this chapter

| Page | Answers |
|---|---|
| [39.1. Video Fundamentals](/all-about-videos/video-fundamentals-video_tag-vs-building-your-own-tag/) | `video_tag` for the common case, and why captions require building the `<video>` tag by hand from `media.sources` instead |
| [39.2. Play/Pause UI Patterns](/all-about-videos/play-pause-ui-patterns/) | A Web Component syncing a custom button to the video's real `play`/`pause` events, never a disconnected fake state |
| [39.3. Poster-Image States](/all-about-videos/poster-image-states/) | `media.preview_image` as the default, a merchant override setting, and syncing a custom overlay to the native poster-to-playback transition |
| [39.4. Inline vs. Modal/Lightbox Video](/all-about-videos/inline-vs-modal-lightbox-video/) | When each placement is right, a native `<dialog>`-based modal, and the one rule (pause on tab hide) that applies to both |
| [39.5. Captioning & Accessibility](/all-about-videos/captioning-and-accessibility/) | Where a real caption file actually comes from (a `file_reference` metafield), and what else accessibility requires beyond captions |
| [39.6. A Complete Example](/all-about-videos/a-complete-example/) | One inline video player combining every piece above |

## Further reading

- [19. Media Deep Dive](/media-deep-dive/)
- [38. All About Images](/all-about-images/)
- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
