---
title: All About Images
description: A UI-composition chapter on images — a reusable snippet pattern, aspect-ratio wrapper techniques, lazy-load/loading-state patterns, and badge/overlay composition.
---

**TL;DR:** A UI-composition chapter on images — a reusable snippet pattern, aspect-ratio wrapper techniques, lazy-load/loading-state patterns, and badge/overlay composition.

This chapter is a complete, standalone reference on images in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. [Media Deep Dive](/media-deep-dive/) covers the underlying CDN mechanics (`image_url`, `srcset`, transform parameters, art direction, performance budgets) this chapter assumes and builds a reusable composition layer on top of, rather than repeating.

## What's in this chapter

| Page | Answers |
|---|---|
| [Image Fundamentals: What Belongs in a Reusable Snippet](/all-about-images/image-fundamentals-what-belongs-in-a-reusable-snippet/) | Why a shared snippet beats inline `<img>` tags repeated across sections |
| [Aspect-Ratio Wrapper Techniques](/all-about-images/aspect-ratio-wrapper-techniques/) | `aspect-ratio` plus `object-fit`, a merchant-facing ratio setting, and the one real reason the old padding hack still exists |
| [Lazy-Load & Loading-State Patterns](/all-about-images/lazy-load-and-loading-state-patterns/) | `loading="lazy"` by default, `fetchpriority="high"` for the one image that shouldn't wait, and a CSS-only placeholder fade-in |
| [Badge & Overlay Composition](/all-about-images/badge-and-overlay-composition/) | Why the positioning context belongs on the wrapper, never the `<img>` itself |
| [A Complete Example](/all-about-images/a-complete-example/) | One image snippet combining all of it, called the same way from a product card or anywhere else |

## Further reading

- [Media Deep Dive](/media-deep-dive/)
- [All About Product Cards](/all-about-product-cards/)
- [All About Videos](/all-about-videos/)
