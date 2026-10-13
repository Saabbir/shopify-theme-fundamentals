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
  assign heading_font = settings.type_heading_font
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

## How to tell whether a font picked with `font_picker` is variable

This is a reasonable thing to want to know, and there's no single property on the `font` object that answers it directly — Shopify's documented `font` object properties are `family`, `fallback_families`, `weight`, `style`, `baseline_ratio`, `system?`, and `variants`; none of them is a `variable` boolean. The underlying question — "is this one file covering a range, or several separate files?" — is a detail of how Shopify's font library serves that specific family, not something exposed directly in Liquid. A few practical ways to actually find out:

### Check the font's listing on Google Fonts

Most of the non-system fonts in Shopify's font library are sourced from Google Fonts, and Google Fonts' own site explicitly labels which families are published as variable (showing the supported weight — and sometimes width — range as a slider in its UI). Searching for the font family name on [fonts.google.com](https://fonts.google.com) is the fastest way to check, before writing any code.

### Probe it with `font_modify` and watch for `nil`

```liquid
{% liquid
  assign test_weight_500 = settings.type_body_font | font_modify: 'weight', '500'
  assign test_weight_600 = settings.type_body_font | font_modify: 'weight', '600'
%}

{{ test_weight_500 }}
{{ test_weight_600 }}
```

`font_modify` returns `nil` if the specific variant it was asked for doesn't exist for that font family. A font that only ships as regular (400) and bold (700) static files returns `nil` for every weight in between; a font covering the full 100–900 range as one variable file returns a real font object for every weight requested. Trying a handful of in-between weights this way is a quick, practical signal — not a definitive test, but a useful one you can run directly in Liquid without downloading anything.

:::caution[Always handle a `nil` result from `font_modify`]
Because a requested variant might not exist, `font_modify` can silently return `nil` — using that result directly (`{{ nil_font | font_face }}`) renders nothing and fails quietly. Guard it with the `default` filter, falling back to a weight you know exists:

```liquid
{% liquid
  assign bold_heading_font = settings.type_heading_font | font_modify: 'weight', 'bold' | default: settings.type_heading_font
%}
```
:::

### Inspect the actual served file

For certainty, use the `font_url` filter to get the real file URL Shopify is serving, download it, and open it in a font inspection tool (such as [Wakamai Fondue](https://wakamaifondue.com/) or [Fontdrop.info](https://fontdrop.info/)) — a true variable font's file contains an `fvar` table; a static font's file doesn't. This is the only fully conclusive method, worth reaching for when it genuinely matters (deciding whether to invest in a larger set of `font_modify`-derived weights for a design) rather than for routine use.

### Why it mostly doesn't matter day to day

`font_modify` and `font_face` behave identically from Liquid's perspective regardless of which kind of file is actually being served — Shopify handles the difference for you. Knowing whether a font is variable mainly matters for performance awareness (one file instead of several, covered above) and for understanding *why* a wide range of `font_modify`-derived weights might "just work" for one font and come back `nil` for another.

## What about a font loaded outside font_picker?

Everything above assumes a `font_picker`-sourced font — a real `font` object exists to call `font_modify` on. [Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) covers the other case: a brand font the client licensed directly, self-hosted as a theme asset or Shopify File, with no `font_picker` setting and no `font` object anywhere. Two of the three detection methods above need adjusting for that case, and one doesn't change at all:

- **The "check it on Google Fonts" step generalizes, but might not apply.** A licensed brand font often isn't on Google Fonts at all — check wherever it was actually licensed from instead. A type foundry's own product or license page almost always states outright whether a release is "Variable" (sometimes sold as a separate product from the individual static weight cuts), so this is usually the fastest way to find out before touching any code.
- **Probing with `font_modify` doesn't apply at all.** There's no `font` object for a self-hosted font to call it on — this method is specific to `font_picker`, not a general technique. Don't reach for it here; it has nothing to probe.
- **Inspecting the actual file still works, unchanged.** The `fvar`-table check (via [Wakamai Fondue](https://wakamaifondue.com/) or [Fontdrop.info](https://fontdrop.info/)) looks at the font file itself, not at how it was loaded — it's actually the more useful method here, since it gives a definitive answer even when a foundry's marketing language is ambiguous about what "variable" means for that specific release.

### If the custom font turns out to be variable, the loading pattern changes

[Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/)'s main example writes one `@font-face` rule per static weight/style file (a `canela-regular.woff2` and a separate `canela-bold.woff2`). A variable font replaces that with a single file and a `font-weight` **range**, letting the browser render any weight inside that range from the one file:

```liquid
{% style %}
  @font-face {
    font-family: 'Canela';
    src: url({{ 'canela-variable.woff2' | asset_url }}) format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
{% endstyle %}
```

```css
h1 {
  font-family: 'Canela', Georgia, serif;
  font-weight: 650; /* any value in the declared range renders correctly from the one file */
}
```

One `@font-face` rule, one file, and `font-weight: 650` (a value that would need its own dedicated static file otherwise) renders correctly straight from it. This is the same underlying benefit [The problem a variable font solves](#the-problem-a-variable-font-solves) describes for `font_picker`-sourced fonts — fewer files, fewer requests — it's just written by hand here instead of generated by `font_face`.

## Key takeaways

- A variable font packs a whole range of weights (and sometimes other properties) into one file, instead of a separate file per weight.
- This directly reduces the number of font files a page has to download, which matters most for a design using several weights of the same family.
- Not every font ships a variable version — check what the type foundry actually offers before assuming one exists.
- The `font` object has no direct "is this variable" property — check the font on Google Fonts, probe it with `font_modify` and watch for `nil` results, or inspect the actual served file for certainty.
- For a self-hosted custom font, `font_modify` doesn't apply at all (there's no `font` object) — check the foundry's own license page instead, and the file-inspection method still works unchanged. A variable custom font gets one `@font-face` rule with a `font-weight` range, instead of one rule per static weight file.

## Further reading

- [Variable fonts guide (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [The `font_modify` filter](https://shopify.dev/docs/api/liquid/filters/font_modify) (shopify.dev)
- [Liquid objects: `font`](https://shopify.dev/docs/api/liquid/objects/font) (shopify.dev)
