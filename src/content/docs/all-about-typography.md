---
title: All About Typography
description: Everything about typography that the introductory chapter didn't have room for.
---

**TL;DR:** Everything about typography that the introductory chapter didn't have room for.

:::note[This is a Part 2 deep dive]
This chapter assumes you've already read [Typography & font_picker](/design-tokens/typography-and-font-picker/) — it doesn't repeat what `font_picker` returns, how `font_face` loads a font, or the basic idea of a type scale. If you haven't read Part 1 yet, start there; this chapter goes deep on one topic rather than introducing it.
:::

## What's in this chapter

| Page | Answers |
|---|---|
| [Variable Fonts](/all-about-typography/variable-fonts/) | One font file covering a whole range of weights, instead of loading a separate file per weight |
| [Font-Loading Performance](/all-about-typography/font-loading-performance/) | `font-display`, preloading, and avoiding layout shift while a font loads |
| [Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) | Building a full `clamp()`-based scale across every heading level, not just one example size |
| [Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/) | What happens when a merchant's chosen font doesn't support every character a shopper's language needs |

## Further reading

- [The `font_picker` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font-picker) (shopify.dev)
