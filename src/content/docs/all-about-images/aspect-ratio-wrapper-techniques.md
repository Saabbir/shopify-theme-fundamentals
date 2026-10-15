---
title: Aspect-Ratio Wrapper Techniques
description: The modern aspect-ratio property, why a forced ratio still needs object-fit, and the one real reason to fall back to the old padding-hack wrapper.
---

**TL;DR:** The modern `aspect-ratio` property, why a forced ratio still needs `object-fit`, and the one real reason to fall back to the old padding-hack wrapper.

A product image's natural dimensions rarely match exactly across a merchant's whole catalog — forcing every image in a grid to the same aspect ratio, regardless of its real dimensions, is what keeps a collection grid visually even.

## The direct approach: `aspect-ratio` plus `object-fit`

```liquid
<img
  class="sol-image"
  src="{{ image | image_url: width: 600 }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
  width="600"
  height="{{ 600 | divided_by: aspect_ratio }}"
>
```

```css
.sol-image {
  aspect-ratio: var(--sol-image-aspect-ratio, 1 / 1);
  object-fit: cover;
  width: 100%;
  display: block;
}
```

`aspect-ratio` alone reserves the right box shape; `object-fit: cover` is what actually makes the image fill that box without distorting — without it, a forced `aspect-ratio` on an `<img>` just squashes or stretches the image to fit, since the browser has no instruction otherwise on how to handle an image whose natural ratio doesn't match the box. [29.10. Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/) covers `aspect-ratio` more generally — this is one of its most common uses in a theme specifically.

## Why `width`/`height` attributes still matter, even with `aspect-ratio` set

The `width`/`height` HTML attributes above aren't redundant with the CSS `aspect-ratio` — they're what the browser uses to reserve layout space *before* any CSS has even been parsed, which is what actually prevents a layout shift as the page loads. Omitting them and relying on `aspect-ratio` alone in CSS still works visually once CSS has loaded, but reintroduces a brief shift during the gap before it does.

## When the ratio needs to come from a setting, not a hardcoded value

```liquid
{% liquid
  assign aspect_ratio = block.settings.image_aspect_ratio | default: 1
%}
<div class="sol-image-wrapper" style="--sol-image-aspect-ratio: {{ aspect_ratio }};">
  <img class="sol-image" src="{{ image | image_url: width: 600 }}" alt="{{ image.alt | escape }}" loading="lazy">
</div>
```

```json
{
  "type": "select",
  "id": "image_aspect_ratio",
  "label": "t:labels.image_aspect_ratio",
  "options": [
    { "value": "1", "label": "t:options.square" },
    { "value": "0.8", "label": "t:options.portrait" },
    { "value": "1.78", "label": "t:options.landscape" }
  ],
  "default": "1"
}
```

A merchant-facing ratio setting should offer a small, named set of options (`Square`, `Portrait`, `Landscape`) rather than a free-form number input — the actual numeric values (`1`, `0.8`, `1.78`) are an implementation detail a merchant shouldn't need to know or type, consistent with [18.13. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/)'s broader point about naming settings by what they mean, not their raw value.

## The one real reason to still use the old padding-hack wrapper

```css
/* Only for a context the modern approach doesn't reach */
.sol-image-wrapper--legacy {
  position: relative;
  padding-top: 56.25%;
}

.sol-image-wrapper--legacy img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

`aspect-ratio` has been Baseline Widely Available since 2021 (confirmed in [29.10. Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/)) — there's no realistic browser-support reason left to reach for the padding-hack version in a new theme. The only genuine remaining reason is working inside an email template or a very old third-party embed's CSS reset that specifically can't be touched; for everything an actual theme controls, `aspect-ratio` is simply the correct, modern choice.

## Key takeaways

- `aspect-ratio` reserves the box shape; `object-fit: cover` is what actually fills it without distortion — both are needed together.
- `width`/`height` HTML attributes still matter alongside CSS `aspect-ratio`, since they're what the browser uses to reserve space before CSS has loaded at all.
- A merchant-facing ratio setting should be a named `select` (`Square`/`Portrait`/`Landscape`), not a raw number input.
- The old padding-hack wrapper has no real remaining use case inside a modern theme — `aspect-ratio` is simply the correct default now.

## Further reading

- [29.10. Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/)
- [19.4. Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/)
- [38.3. Lazy-Load & Loading-State Patterns](/all-about-images/lazy-load-and-loading-state-patterns/)
