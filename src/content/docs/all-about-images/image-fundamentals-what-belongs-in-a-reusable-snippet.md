---
title: "Image Fundamentals: What Belongs in a Reusable Snippet"
description: One image snippet, called from dozens of places, so a loading strategy or aspect-ratio fix only ever needs making once.
---

**TL;DR:** One image snippet, called from dozens of places, so a loading strategy or aspect-ratio fix only ever needs making once.

[Media Deep Dive](/media-deep-dive/) covers the raw mechanics — `image_url`, `srcset`, `sizes`, CDN transform parameters. This chapter is about composing those mechanics into one reusable snippet used everywhere an image appears in the theme, so decisions like "how do we lazy-load" or "what's our default aspect ratio" live in exactly one file.

## Why a shared snippet, not inline `<img>` tags everywhere

```liquid
{% comment %} Repeated, slightly differently, in a dozen different section files {% endcomment %}
<img src="{{ image | image_url: width: 600 }}" srcset="..." sizes="..." loading="lazy" alt="{{ image.alt }}">
```

Every section that needs an image ends up writing some version of the same `<img>` tag — and in practice, these drift: one section forgets `loading="lazy"`, another uses a different `srcset` width list, a third omits an `alt` fallback for a missing image. A shared snippet makes these decisions once, correctly, and every caller inherits the fix automatically the moment the snippet changes.

## The parameters a reusable image snippet actually needs

```liquid
{% comment %}
  snippets/image.liquid

  Accepts:
  - image: the image object (required)
  - aspect_ratio: a number like 1 (square) or 1.5 (landscape); omit to use the image's natural ratio
  - sizes_attr: the sizes attribute value, since this varies by where the image is placed in the layout
  - widths: an array of widths for srcset; defaults to a sensible standard set
  - class: an extra class for the wrapping element
{% endcomment %}
```

Every one of these is something that genuinely varies by *where* the snippet is called — a product card's image needs a different `sizes` value than a full-width hero — while the actual loading strategy, lazy-loading attributes, and fallback handling stay identical across every call. The rest of this chapter builds out each of these pieces.

## What this chapter deliberately doesn't repeat

- **The CDN transform parameters themselves** (`width`, `height`, `crop`, `format`) are covered in full in [Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/) — this chapter assumes that mechanic and builds the reusable wrapper on top of it.
- **Art direction** (`<picture>` with different crops per breakpoint) is its own dedicated page, [Art Direction with `<picture>`](/media-deep-dive/art-direction-with-picture/) — a genuinely different technique from the single-`<img>` snippet this chapter focuses on, for the specific case where a *different crop*, not just a different size, is needed per breakpoint.
- **Performance budgets** — how many images a page can afford to load eagerly — are covered in [Performance Budgets for Media-Heavy Pages](/media-deep-dive/performance-budgets-for-media-heavy-pages/).

## Key takeaways

- A shared image snippet exists to make loading-strategy and fallback decisions exactly once, rather than letting them drift slightly different across every section that needs an image.
- `sizes` and aspect ratio genuinely vary by call site; lazy-loading and fallback handling should not — the snippet's parameters should reflect that split.
- This chapter builds a composition layer on top of the raw CDN mechanics in Media Deep Dive, not a replacement for them.

## Further reading

- [Media Deep Dive](/media-deep-dive/)
- [Image CDN Transform Parameters](/media-deep-dive/image-cdn-transform-parameters/)
- [Aspect-Ratio Wrapper Techniques](/all-about-images/aspect-ratio-wrapper-techniques/)
