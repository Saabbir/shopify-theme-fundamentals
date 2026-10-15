---
title: All About Colors
description: Everything about color, from the color setting and a deep dive into color schemes, through the color_palette setting, to token systems and a real contrast-testing workflow.
---

**TL;DR:** Everything about color — the `color` setting, a full deep dive into `color_scheme_group` and `color_scheme`, the theme-wide `color_palette` setting, token systems, and a real contrast-testing workflow.

This chapter is a complete, standalone reference on color — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## What's in this chapter

| Page | Answers |
|---|---|
| [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) | The `color` setting, and why bundling colors beats standalone pickers |
| [17.2. Color Schemes](/all-about-colors/color-schemes/) | A full `color_scheme_group` and `color_scheme` deep dive — `definition`, `role`, `color_background` gradients, and consuming a scheme via a class |
| [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) | `color_palette` — a small, theme-wide set of named brand colors other settings can point back to |
| [17.4. Color Formats & Conversions](/all-about-colors/color-formats-and-conversions/) | Hex, RGB, and HSL — what a merchant's color picker actually gives you, and converting between them |
| [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) | Every Liquid color filter, with before/after examples |
| [17.6. Dark Mode](/all-about-colors/dark-mode/) | Supporting `prefers-color-scheme` alongside (or instead of) a merchant-controlled scheme setting |
| [17.7. Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/) | The three-tier color architecture larger design systems use, and why one tier isn't enough |
| [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) | Checking every color pairing a merchant can produce, not just the ones you tested by eye |
| [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) | A full `color_scheme_group` with `role` and a `color_background` gradient, the CSS-generation snippet it needs, and two sections consuming it |

## Further reading

- [Input settings: `color_scheme`, `color_scheme_group`, and `color_palette`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) (shopify.dev)
