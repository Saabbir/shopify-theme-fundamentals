---
title: Variable Fonts
description: One font file covering a whole range of weights, instead of loading a separate file per weight.
---

**TL;DR:** One font file covering a whole range of weights, instead of loading a separate file per weight.

## The problem a variable font solves

A traditional font family ships as several separate files — one for regular weight, one for bold, maybe another for a medium weight in between. If a design uses three weights of the same family, that's three separate font files the browser has to download, even though they're all variations of the same underlying typeface.

A **variable font** packs an entire range of weights (and sometimes other properties, like width or slant) into a single font file. Instead of loading `font-regular.woff2`, `font-medium.woff2`, and `font-bold.woff2` separately, the browser loads one file and can render any weight along that file's supported range.

## What this looks like with `font_picker`

`font_modify` — the filter that derives a variant (a different weight or style) of an already-chosen font object, covered in full on [Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) — is the exact mechanism that benefits most from this. Changing a font's weight with `font_modify` doesn't need a second font file to exist at all when the underlying font is variable — the single loaded file already covers that weight:

```liquid
{% liquid
  assign heading_font = settings.heading_font
  assign heading_font_medium = heading_font | font_modify: 'weight', '500'
%}

{{ heading_font | font_face }}
```

With a non-variable font, requesting an arbitrary weight like `500` that the font family doesn't ship as its own file typically falls back to the nearest weight that does exist as a real file. With a variable font, `500` can render as an actual, distinct weight along the font's own range, with no extra file download at all.

## Why this matters for performance

Fewer font files downloaded is a direct, measurable performance win — each additional font file is its own network request, competing for bandwidth with everything else loading on the page. A design that uses several weights of the same family is exactly the case where switching to a variable font version (if the type foundry offers one) pays off the most.

:::note[Not every font has a variable version]
Whether a given typeface is available as a variable font depends entirely on what the font's creator has published — it's not something you can convert yourself. When choosing a font for a theme that's expected to use several weights of the same family, checking whether a variable version exists is worth doing before committing to the regular, single-weight files.
:::

## Key takeaways

- A variable font packs a whole range of weights (and sometimes other properties) into one file, instead of a separate file per weight.
- This directly reduces the number of font files a page has to download, which matters most for a design using several weights of the same family.
- Not every font ships a variable version — check what the type foundry actually offers before assuming one exists.

## Further reading

- [Variable fonts guide (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [The `font_modify` filter](https://shopify.dev/docs/api/liquid/filters/font_modify) (shopify.dev)
