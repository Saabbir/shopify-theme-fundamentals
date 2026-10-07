---
title: Responsive & Logical Properties
description: The breakpoint convention used throughout this site, and writing CSS that still works in a right-to-left language.
---

**TL;DR:** The breakpoint convention used throughout this site, and writing CSS that still works in a right-to-left language.

## The breakpoint you've already seen repeatedly

Every `@media` example since [Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) has used the same breakpoint:

```css
@media screen and (max-width: 749px) {
  /* mobile styles */
}
```

`749px` (equivalently, "mobile starts below 750px") is a common convention, not a rule enforced by Shopify — it roughly separates typical phone/small-tablet widths from larger tablet and desktop widths. Some themes use a slightly different number. What actually matters is picking one breakpoint and using it consistently everywhere in a theme, rather than having several sections each decide their own slightly different cutoff.

## Logical properties: writing CSS that doesn't assume left-to-right

Most CSS tutorials teach physical properties — `margin-left`, `padding-top`, `text-align: left`. These describe a direction tied to how English-language, left-to-right pages happen to be laid out. **Logical properties** describe the same spacing in terms of the flow of text instead of a fixed physical direction — and they're what keeps a layout correct if that flow ever changes.

| Physical property | Logical equivalent |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block-start` / `padding-block-end` (or the shorthand `padding-block`) |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `text-align: left` | `text-align: start` |

```css
.hero-banner {
  padding-block: var(--padding-top) var(--padding-bottom);
  margin-inline-start: 1rem;
  text-align: start;
}
```

## Why this matters even if a theme never ships in Arabic or Hebrew

A theme is translatable the moment `locales/` exists at all, covered back in [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) — and a merchant can add a right-to-left language (Arabic, Hebrew) to their store without you doing anything special for it, unless your CSS was written with physical properties that silently assume left-to-right. `margin-left` stays stuck on the visual left even when an entire page correctly flips to flow right-to-left — producing lopsided spacing that only shows up once someone actually tests in that language, often long after the CSS was written and forgotten.

:::tip[A simple habit, not a rewrite]
Reaching for the logical property is almost always a direct, one-for-one swap — `padding-block` instead of `padding-top`/`padding-bottom`, `margin-inline-start` instead of `margin-left`. Making it the default habit from the first line of CSS you write costs nothing extra; retrofitting an entire theme's stylesheet after the fact, section by section, is real, avoidable work.
:::

## Key takeaways

- `749px` is this site's consistent breakpoint convention, not a Shopify requirement — pick one value and apply it everywhere in a given theme.
- Logical properties (`margin-inline-start`, `padding-block`, `text-align: start`) describe spacing relative to text flow rather than a fixed physical direction.
- Using logical properties by default costs nothing extra and keeps a theme correct the moment a merchant adds a right-to-left language — physical properties fail silently until someone specifically tests that language.

## Further reading

- [CSS logical properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
