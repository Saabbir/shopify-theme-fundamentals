---
title: Typography & font_picker
description: Loading a merchant-chosen font correctly, and the idea of a type scale.
---

**TL;DR:** Loading a merchant-chosen font correctly, and the idea of a type scale.

## The `font_picker` setting

```json
{
  "type": "font_picker",
  "id": "heading_font",
  "label": "t:labels.heading_font",
  "default": "assistant_n4"
}
```

Unlike a `text` or `color` setting, `font_picker` doesn't return a simple string — it returns a whole **font object**, with its own properties: family name, style, weight, and fallback fonts to use while (or if) the chosen font fails to load.

## Actually loading the font: `font_face`

Having the font object isn't enough on its own — the font's actual file still needs to be loaded by the browser. The `font_face` filter generates the CSS `@font-face` rule that does that.

```liquid
{% style %}
  {{ settings.heading_font | font_face }}
{% endstyle %}
```

This needs to run exactly once, somewhere global — typically in `theme.liquid` — not repeated inside every section that happens to use that font.

:::caution[A common mistake: using the font without loading it]
Writing `font-family: {{ settings.heading_font.family }}` in your CSS, without ever outputting `{{ settings.heading_font | font_face }}` anywhere, doesn't error — the browser just falls back to its generic default font, silently. If a chosen font isn't showing up, check whether `font_face` has actually been output somewhere on the page before assuming anything else is wrong.
:::

## Using the font once it's loaded

```liquid
<h1 style="font-family: {{ settings.heading_font.family }}, {{ settings.heading_font.fallback_families }};">
  {{ page_title }}
</h1>
```

Always include `fallback_families` alongside `family` — it's a comma-separated list of reasonable substitute fonts (generic ones like `sans-serif`, or similar real fonts), used if the chosen font is still loading or fails outright. This is the same job a browser's own system-font fallback does, just configured specifically for the font a merchant picked.

## A bolder or italic variant: `font_modify`

```liquid
{% assign bold_heading_font = settings.heading_font | font_modify: 'weight', 'bold' %}
{{ bold_heading_font | font_face }}
```

`font_modify` returns a new font object with one property changed (a different weight, or italic) — useful when you need a specific variant of the same font family without asking a merchant to pick a second, separate font setting for it.

## Beyond a single font setting: a type scale

A single font choice doesn't by itself make a theme's typography feel consistent — that comes from using a deliberate, limited set of font sizes throughout, rather than a different arbitrary size in every section. A **type scale** is just that: a small, fixed list of sizes (for a heading, a subheading, body text, a caption) that every section pulls from, instead of each one choosing its own.

```css
:root {
  --font-size-h1: clamp(2rem, 4vw, 3.5rem);
  --font-size-h2: clamp(1.5rem, 3vw, 2.5rem);
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
}
```

`clamp(min, preferred, max)` is worth knowing here specifically: it gives you one line that behaves responsively — never smaller than `min`, never larger than `max`, scaling smoothly with the viewport in between — instead of writing separate font sizes inside multiple media queries for every heading level.

## Key takeaways

- `font_picker` returns a font object, not a string — `family`, `fallback_families`, and other properties, not just a name.
- `font_face` must be output once, somewhere global, or the chosen font never actually loads — this fails silently, the same as the typo behavior from [Debugging Liquid](/liquid-basics/debugging-liquid/).
- A small, fixed type scale (reused everywhere) produces more consistent results than letting every section pick its own font sizes independently.

## Further reading

- [The `font_picker` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font-picker) (shopify.dev)
- [The `font_face` filter](https://shopify.dev/docs/api/liquid/filters/font_face) (shopify.dev)
- [The `font_modify` filter](https://shopify.dev/docs/api/liquid/filters/font_modify) (shopify.dev)
