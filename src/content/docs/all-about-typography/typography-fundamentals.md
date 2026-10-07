---
title: Typography Fundamentals
description: What a font family, weight, and style actually are, and why a fallback stack matters.
---

**TL;DR:** What a font family, weight, and style actually are, and why a fallback stack matters.

Before touching anything Shopify-specific, it's worth being precise about what a "font" actually is, because the vocabulary (family, weight, style, fallback) shows up constantly in every page that follows.

## A font family is a collection, not one single thing

"Helvetica" isn't one file — it's a **family** name for a whole collection of related files: Helvetica Regular, Helvetica Bold, Helvetica Italic, Helvetica Light, and so on. When CSS says `font-family: Helvetica`, the browser still needs to know which member of that family to actually use for a given piece of text, which is where weight and style come in.

## Weight: how thick the letters are

```css
font-weight: 400; /* normal */
font-weight: 700; /* bold */
```

Font weight is expressed as a number from 100 (thinnest) to 900 (thickest), with 400 as the conventional "normal" weight and 700 as the conventional "bold." Not every font ships every weight — a typeface might only provide 400 and 700, or might provide a fuller range like 100, 300, 400, 500, 700, and 900. Asking for a weight a font doesn't have causes the browser to substitute the closest one it does have, silently.

## Style: upright or slanted

```css
font-style: normal;
font-style: italic;
```

Style is simpler: normal (upright) or italic (slanted). Some fonts ship a true italic as its own distinct set of letterforms, hand-drawn to look right slanted; others don't, and the browser fakes it by mathematically slanting the normal letterforms instead — which usually looks noticeably worse than a real italic. This isn't something you can control from Liquid or CSS; it depends entirely on what the font file itself provides.

## Why a single font is never enough: fallback stacks

```css
font-family: "Brand Display Font", Georgia, serif;
```

A `font-family` value is a comma-separated list, not a single name, and that's deliberate. The browser tries each one in order: if "Brand Display Font" is still downloading, has failed to load, or doesn't exist at all for some reason, it falls through to Georgia, and if that's also unavailable, falls through again to the browser's own generic `serif` font — which every browser is guaranteed to have. This is called a **fallback stack**, and every `font-family` declaration on a real website should have one, never just the one font you actually want.

## Web fonts vs. system fonts

A **web font** is a font file the browser has to download before it can render text in that font — this is what a merchant picking a custom brand font from `font_picker` results in. A **system font** is a font already installed on the shopper's own device, which costs nothing to download because the browser already has it. `system-ui`, `sans-serif`, `serif`, and `monospace` are *generic* system font keywords — not an actual specific font, but an instruction to the browser to use whatever real font it considers the system default for that category, which varies by operating system.

:::tip[System fonts are the fastest typography choice there is]
A theme using only system fonts has zero font files to download — text renders the instant the page's CSS is parsed, with no loading delay and no risk of a visible font swap. This is a real, meaningful performance advantage, worth considering seriously for a theme that doesn't have a specific brand typeface it needs to use.
:::

## Key takeaways

- A font family is a collection of related files, not one file — weight and style together determine which specific file within that family actually gets used.
- Not every font ships every weight; requesting one it doesn't have causes a silent substitution to the nearest available weight.
- Always write a `font-family` value as a fallback stack (specific font, then a reasonable alternative, then a generic system category) — never a single font name alone.
- System fonts cost nothing to download and are the fastest typography option available; web fonts look exactly as designed but require a network request first.

## Further reading

- [`font-family` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
- [Fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts) (shopify.dev)
