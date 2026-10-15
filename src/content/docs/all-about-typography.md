---
title: All About Typography
description: Everything about typography in Shopify themes, from what a font actually is to the most advanced loading and token strategies.
---

**TL;DR:** Everything about typography in Shopify themes, from what a font actually is to the most advanced loading and token strategies.

This chapter is a complete, standalone reference on typography — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## The vocabulary, before you hit it in context

A handful of terms get used precisely and repeatedly throughout this chapter. They sound similar, but they're not interchangeable — worth a quick look here first, rather than piecing the distinction together one page at a time. Full definitions live in the [Glossary](/reference/glossary/); this is the fast version.

| Term | What it actually is | Example |
|---|---|---|
| CSS custom property | The general CSS feature — a named, reusable value (`--x: value;`), read with `var(--x)`. Also informally called a **CSS variable**; this site always says "CSS custom property" | `--font-heading-family` |
| Role token | A CSS custom property that resolves one font role (Body, Heading, Subheading, Accent) into its value — `family`/`weight`/`style` only, **never a size** | `--font-heading-family` |
| Preset token | A CSS custom property that's part of a named type preset, bundling several properties — including a size — under one name | `--type-preset-h1-font-size` |
| Preset class | The CSS class a component applies in its markup to get a full preset's typography at once, instead of referencing its tokens one by one | `.h1`, `.paragraph` |

The short version: every role token and every preset token *is* a CSS custom property — "role token" and "preset token" just name which of the two jobs that particular custom property is doing. [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) builds up to this distinction from scratch if you want the full reasoning; [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) covers exactly when a component reaches for which.

## What's in this chapter

| Page | Answers |
|---|---|
| [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/) | What a font family, weight, and style actually are, and why a fallback stack matters |
| [18.2. Reading Typography from a Figma Design](/all-about-typography/reading-typography-from-a-figma-design/) | Turning a client's Figma file into font roles, settings, and tokens, before writing any code |
| [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) | `font_picker`, the font object, and the filters that actually get a font onto the page |
| [18.4. Variable Fonts](/all-about-typography/variable-fonts/) | One font file covering a whole range of weights, instead of loading a separate file per weight |
| [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) | What to do when a client's exact brand font isn't in Shopify's font library |
| [18.6. Font Substitutes & Advanced Variable Axis Control](/all-about-typography/font-substitutes-and-advanced-variable-axis-control/) | What it means when a client's font files are tuned — or even spliced together from several open-source fonts — rather than the real licensed font, and the `font-variation-settings` / `font-feature-settings` properties that kind of handoff leans on |
| [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/) | `font-display`, preloading, and avoiding layout shift while a font loads |
| [18.8. How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) | A real, current theme's typography system, read directly from its source |
| [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) | Turning a handful of font settings into a reusable, named system the whole theme draws from |
| [18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) | Building a full `clamp()`-based scale across every heading level |
| [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) | Designing a full preset system, how Horizon built its own, and using presets properly in sections, blocks, and CSS |
| [18.12. Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) | The concrete schema-to-CSS path, worked through end to end |
| [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) | A decision tree and worked examples for what typography CSS belongs in a component's own stylesheet — and what should always come from a token or preset |
| [18.14. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) | A consistent way to name every setting, CSS custom property, and preset — and how Horizon really does it |
| [18.15. Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/) | What happens when a chosen font doesn't support every character a shopper's language needs |
| [18.16. Typography Best Practices](/all-about-typography/typography-best-practices/) | A practical checklist, distilled from everything else in this chapter |
| [18.17. A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/) | One snippet merging typography, color, and spacing settings into CSS custom properties |

## Further reading

- [Fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts) (shopify.dev)
- [The `font_picker` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font-picker) (shopify.dev)
