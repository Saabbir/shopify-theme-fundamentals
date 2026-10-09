---
title: All About Typography
description: Everything about typography in Shopify themes, from what a font actually is to the most advanced loading and token strategies.
---

**TL;DR:** Everything about typography in Shopify themes, from what a font actually is to the most advanced loading and token strategies.

This chapter is a complete, standalone reference on typography — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## What's in this chapter

| Page | Answers |
|---|---|
| [Typography Fundamentals](/all-about-typography/typography-fundamentals/) | What a font family, weight, and style actually are, and why a fallback stack matters |
| [Reading Typography from a Figma Design](/all-about-typography/reading-typography-from-a-figma-design/) | Turning a client's Figma file into font roles, settings, and tokens, before writing any code |
| [Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) | `font_picker`, the font object, and the filters that actually get a font onto the page |
| [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) | A real, current theme's typography system, read directly from its source |
| [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) | Turning a handful of font settings into a reusable, named system the whole theme draws from |
| [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) | The concrete schema-to-CSS path, worked through end to end |
| [Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) | A consistent way to name every setting, CSS variable, and preset — and how Horizon really does it |
| [Typography Best Practices](/all-about-typography/typography-best-practices/) | A practical checklist, distilled from everything else in this chapter |
| [Variable Fonts](/all-about-typography/variable-fonts/) | One font file covering a whole range of weights, instead of loading a separate file per weight |
| [Font-Loading Performance](/all-about-typography/font-loading-performance/) | `font-display`, preloading, and avoiding layout shift while a font loads |
| [Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) | Building a full `clamp()`-based scale across every heading level |
| [Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/) | What happens when a chosen font doesn't support every character a shopper's language needs |
| [A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/) | One snippet merging typography, color, and spacing settings into CSS custom properties |

## Further reading

- [Fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts) (shopify.dev)
- [The `font_picker` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font-picker) (shopify.dev)
