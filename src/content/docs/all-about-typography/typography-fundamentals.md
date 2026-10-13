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

A font chosen through `font_picker` carries this distinction as a real, checkable property — `font.system?` returns `true` if the merchant picked a system font, `false` otherwise:

```liquid
{% if settings.type_heading_font.system? %}
  {% comment %} No font_face needed — the browser already has this font. {% endcomment %}
{% else %}
  {{ settings.type_heading_font | font_face }}
{% endif %}
```

This is more than a curiosity — [Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) covers why every web font needs a matching `font_face` output somewhere, but a system font doesn't need one at all (there's no file to load). Checking `.system?` before deciding whether to output `font_face` avoids generating a pointless `@font-face` rule for a font the browser already has.

## Line-height: why the value usually has no unit

```css
line-height: 1.5;    /* preferred: unitless */
line-height: 1.5em;  /* avoid */
line-height: 150%;   /* avoid */
```

A **unitless** `line-height` (just `1.5`, not `1.5em` or `150%`) is a multiplier of that element's own `font-size` — and critically, it's recalculated fresh for every descendant based on *that descendant's own* font size, rather than being fixed once and inherited as a flat pixel value. A `line-height: 1.5em` set on a parent, by contrast, inherits as a computed pixel value — so a smaller or larger child element inherits a line-height proportioned for the *parent's* font size, not its own, which usually produces text that's too cramped or too loose. Unitless `line-height` is the conventional default for exactly this reason: it stays proportionally correct no matter where in the document it ends up applying.

## Letter-spacing and text-transform: smaller, often-forgotten levers

Family, weight, style, and size get most of the attention, but two more properties round out a complete typographic treatment, especially for a type preset (per [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)):

```css
.eyebrow {
  letter-spacing: 0.08em; /* also typically unitless-relative, via em */
  text-transform: uppercase;
}
```

`letter-spacing` is conventionally expressed in `em` (relative to that element's own font size, same reasoning as unitless `line-height`) rather than a fixed `px` value, for the same reason: it stays proportionally correct as font size changes. A small positive `letter-spacing` paired with `text-transform: uppercase` is a common combination for a small, label-like treatment (an "eyebrow" above a heading, a badge, a category label) — worth including as named properties in a preset's token set alongside family, weight, size, and line-height, rather than left as one-off inline styles wherever that treatment is needed.

## Key takeaways

- A font family is a collection of related files, not one file — weight and style together determine which specific file within that family actually gets used.
- Not every font ships every weight; requesting one it doesn't have causes a silent substitution to the nearest available weight.
- Always write a `font-family` value as a fallback stack (specific font, then a reasonable alternative, then a generic system category) — never a single font name alone.
- System fonts cost nothing to download and are the fastest typography option available; web fonts look exactly as designed but require a network request first. `font.system?` checks this directly in Liquid — skip `font_face` entirely when it's `true`.
- Write `line-height` unitless, not with `em` or `%` — a unitless value recalculates correctly for every descendant's own font size, instead of inheriting a value proportioned for the parent's.
- `letter-spacing` and `text-transform` round out a full typographic treatment alongside family, weight, size, and line-height — worth naming as real properties in a preset's token set, not left as one-off inline styles.

## Further reading

- [Reading Typography from a Figma Design](/all-about-typography/reading-typography-from-a-figma-design/) — applying weight, style, line-height, and letter-spacing to a real client handoff
- [`font-family` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
- [Fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts) (shopify.dev)
- [Liquid objects: `font`](https://shopify.dev/docs/api/liquid/objects/font) (shopify.dev)
