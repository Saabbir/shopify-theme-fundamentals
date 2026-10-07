---
title: Font Settings & Loading a Font Correctly
description: font_picker, the font object, and the filters that actually get a font onto the page.
---

**TL;DR:** `font_picker`, the font object, and the filters that actually get a font onto the page.

## Letting a merchant choose a font: `font_picker`

```json
{
  "type": "font_picker",
  "id": "heading_font",
  "label": "t:labels.heading_font",
  "default": "assistant_n4"
}
```

A `font_picker` setting gives a merchant a searchable list of fonts in the theme editor, pulled from Shopify's own font library (a curated set of system fonts and licensed Google Fonts, free to use on any Shopify store). Unlike a `text` or `color` setting, `font_picker` doesn't return a simple string — it returns a whole **font object**, with its own set of properties: `family`, `fallback_families`, `style`, `weight`, and more.

```liquid
{{ settings.heading_font.family }}
{% # => "Assistant" %}

{{ settings.heading_font.weight }}
{% # => 400 %}

{{ settings.heading_font.style }}
{% # => "normal" %}
```

## Having the font object isn't the same as loading the font

This is the single most important thing to understand about theme typography, and the thing most commonly gotten wrong: `settings.heading_font.family` is just a string. Writing `font-family: {{ settings.heading_font.family }}` into your CSS tells the browser what name to look for, but doesn't make the actual font file available — if the browser doesn't already have a font by that name, it silently falls back to its default, with no error anywhere.

## Actually loading the font: `font_face`

The `font_face` filter generates the complete, correct `@font-face` CSS rule for a given font object — the thing that actually tells the browser where to download the font file from:

```liquid
{% style %}
  {{ settings.heading_font | font_face }}
{% endstyle %}
```

This needs to run exactly once per font, somewhere global — typically in `theme.liquid`, so it loads on every page regardless of which section ends up using that font. Repeating it inside every section that happens to reference the font doesn't break anything, but it's wasted output; once is enough.

:::caution[The most common typography bug: using a font without loading it]
Writing `font-family: {{ settings.heading_font.family }};` somewhere in your CSS, without ever outputting `{{ settings.heading_font | font_face }}` anywhere on the page, doesn't produce an error. The browser just quietly falls back to its generic default font. If a chosen font isn't showing up and nothing in the console explains why, this is the first thing to check — search the rendered page for whether `font_face`'s `@font-face` rule actually made it out anywhere.
:::

## Using the font once it's loaded

```liquid
<h1 style="font-family: {{ settings.heading_font.family }}, {{ settings.heading_font.fallback_families }};">
  {{ page_title }}
</h1>
```

Always include `fallback_families` alongside `family`, never `family` alone — per [Typography Fundamentals](/all-about-typography/typography-fundamentals/), a font-family value should always be a fallback stack. `fallback_families` is a ready-made, comma-separated list of reasonable substitutes Shopify provides for each font in its library, used automatically while the chosen font is still loading, or if it fails to load at all.

## Getting the raw font URL: `font_url`

```liquid
{% style %}
  @font-face {
    font-family: 'CustomHeadingFont';
    src: url({{ settings.heading_font | font_url }}) format('woff2');
    font-display: swap;
  }
{% endstyle %}
```

`font_face` builds the whole `@font-face` rule for you, with sensible defaults. `font_url` instead gives you just the font file's CDN URL, for when you need to write a custom `@font-face` rule yourself — most commonly because you want to control `font-display` or another property `font_face`'s defaults don't expose. (Font-loading performance, including `font-display`, has its own full page — see [Font-Loading Performance](/all-about-typography/font-loading-performance/).)

## A bolder or italic variant: `font_modify`

```liquid
{% liquid
  assign bold_heading_font = settings.heading_font | font_modify: 'weight', 'bold'
%}
{{ bold_heading_font | font_face }}
```

A merchant typically only picks one font per setting — but a design often needs more than one weight or style of that same family (a bold variant for emphasis, an italic variant for a pull quote). `font_modify` returns a new font object with one property changed, which you then load with `font_face` exactly like any other font object. This avoids asking a merchant to pick a second, separate font setting just to get a bold version of the font they already chose.

## Key takeaways

- `font_picker` returns a font object (`family`, `fallback_families`, `weight`, `style`, and more), not a plain string.
- Referencing `.family` in CSS is not the same as loading the font — `font_face` (or a custom `@font-face` built from `font_url`) has to run once, globally, or the font never actually downloads, and this fails completely silently.
- Always pair `.family` with `.fallback_families` when writing a `font-family` CSS value.
- `font_modify` derives a variant (bold, italic) of an already-chosen font, without a second merchant-facing setting.

## Further reading

- [The `font_picker` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font-picker) (shopify.dev)
- [The `font_face` filter](https://shopify.dev/docs/api/liquid/filters/font_face) (shopify.dev)
- [The `font_url` filter](https://shopify.dev/docs/api/liquid/filters/font_url) (shopify.dev)
- [The `font_modify` filter](https://shopify.dev/docs/api/liquid/filters/font_modify) (shopify.dev)
