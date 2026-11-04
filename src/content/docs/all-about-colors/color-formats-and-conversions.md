---
title: Color Formats & Conversions
description: Hex, RGB, HSL, and OKLCH — what a merchant's color picker actually gives you, the color object's own properties, and converting between formats.
---

**TL;DR:** Hex, RGB, HSL, and OKLCH — what a merchant's color picker actually gives you, the color object's own properties, and converting between formats.

Most of the time, as [17.1](/all-about-colors/color-fundamentals/) covers, you'll pass a merchant's color straight through without touching it. This page is for the remaining cases — deriving a hover state from a color the merchant never picked a second time for, or feeding a value into something that needs saturation and lightness as separate numbers — where you need to understand the format itself, not just pass it along.

## What a `color` setting actually returns

When a merchant picks a color in the theme editor, `settings.your_color_id` (a **theme-wide** setting — the section/block equivalent is `section.settings.your_color_id` / `block.settings.your_color_id`) prints as a plain hex string, like `#ff6600`, the moment you drop it straight into an inline style or CSS custom property. That's the one format you can always count on without converting anything, and most of the time it's all you need:

```liquid
{% comment %} layout/theme.liquid {% endcomment %}
<style>
  :root {
    --accent: {{ settings.accent_color }};
  }
</style>
```

```json
// config/settings_schema.json
{
  "name": "t:settings.colors",
  "settings": [
    { "type": "color", "id": "accent_color", "label": "t:labels.accent_color", "default": "#ff6600" }
  ]
}
```

That hex string is what *prints* — it's not technically what you're holding. `settings.accent_color` is actually a full color object, and hex is just its default, printable representation, the same way printing most Liquid objects shows some sensible stand-in for themselves. The next section shows what's actually inside that object.

## Reading a color's own properties, no filter required

A color object exposes its individual channels directly, as named properties, with no filter involved at all:

```liquid
{{ settings.accent_color.red }}
{% # => 255 %}

{{ settings.accent_color.hue }}
{% # => 24 %}

{{ settings.accent_color.rgba }}
{% # => 255 102 0 / 1.0 %}
```

The full set of properties every color object exposes:

| Property | Returns | Range / notes |
|---|---|---|
| `.red` | Number | 0–255 |
| `.green` | Number | 0–255 |
| `.blue` | Number | 0–255 |
| `.alpha` | Number | 0.0–1.0 |
| `.hue` | Number | 0–360 |
| `.saturation` | Number | 0–100 |
| `.lightness` | Number | 0–100 |
| `.chroma` | Number | 0.0–0.5 |
| `.color_space` | String | `srgb` or `oklch` — which native color space the object is working in |
| `.rgb` | String | Red, green, and blue, space-separated |
| `.rgba` | String | Red, green, blue, and alpha, space-separated, with a slash before alpha |
| `.oklch` | String | Lightness, chroma, and hue, space-separated |
| `.oklcha` | String | Same as `.oklch`, with alpha after a slash |

This is exactly what's happening in [17.1](/all-about-colors/color-fundamentals/)'s own real Horizon example, finally explained in full:

```liquid
{% # Horizon, snippets/color-palette.liquid %}
--color-primary-button-background: rgb({{ settings.palette_primary_button_background.rgba }});
```

`.rgba` there isn't a filter — it's a direct property read off the color object, returned as a ready-to-use, space-separated string that Horizon drops straight inside `rgb(...)`.

`color_space` is worth a second look. Most merchant-picked colors, anything chosen from a standard hex-based picker, come back as `srgb`. [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) is a newer CSS color space, designed so lightness and chroma behave predictably across different hues, something HSL only approximates. You won't reach for `.oklch` or `.oklcha` often in an ordinary theme, but they're there if you're already working inside an OKLCH-based design system.

## Property access vs. filters: two overlapping toolkits

[17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) covers `color_extract`, a filter that pulls one named channel (`red`, `green`, `blue`, `alpha`, `hue`, `saturation`, `lightness`) out of a color. That overlaps almost entirely with the property access shown above — `settings.accent_color | color_extract: "red"` and `settings.accent_color.red` return the same number. Reach for whichever reads clearer in context. Property access needs no filter, and additionally covers `chroma`, `color_space`, `rgb`, `rgba`, `oklch`, and `oklcha`, none of which `color_extract` reaches. Filters earn their keep for everything property access can't do at all — mixing two colors, darkening, checking contrast, or converting a whole color into a different format string, which is exactly what the rest of this page covers next.

## Why you'd ever need a color format other than hex

Hex is compact but opaque — `#ff6600` tells you nothing about how to make it 20% darker or how saturated it is without doing math on the individual red/green/blue components. HSL (hue, saturation, lightness) is far easier to reason about for exactly that kind of adjustment, because lightness and saturation are already separated out as their own numbers instead of being tangled together across three channels:

```liquid
{{ "#ff6600" | color_to_hsl }}
{% # => hsl(24, 100%, 50%) — the 50% lightness is a single number you can
   # read and reason about directly; hex has no equivalent single value %}
```

## Converting between formats with filters

Liquid provides filters for moving between formats:

```liquid
{{ "#ff6600" | color_to_rgb }}
{% # => rgb(255, 102, 0) %}

{{ "#ff6600" | color_to_hsl }}
{% # => hsl(24, 100%, 50%) %}

{{ "hsl(24, 100%, 50%)" | color_to_hex }}
{% # => #ff6600 %}
```

## A practical use: deriving a hover state from a base color

A common real need is deriving a slightly darker or lighter variant of a merchant-picked color for a hover or active state, without asking the merchant to pick a second color themselves:

```liquid
{% liquid
  assign button_color = settings.button_color
  assign button_hover_color = button_color | color_darken: 10
%}
<button style="--button-color: {{ button_color }}; --button-hover-color: {{ button_hover_color }};"></button>
```

```json
// config/settings_schema.json — theme-wide, same as the example above;
// the identical derivation works unchanged on a section or block setting
{
  "type": "color",
  "id": "button_color",
  "label": "t:labels.button_color",
  "default": "#2c6e5c"
}
```

`color_darken` (covered in full on [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/)) works directly on whatever format you give it and returns a value in the same family — you don't need to manually convert to HSL first just to darken something.

## Built-in reference

**Filters used on this page**

| Filter | Converts | Notes |
|---|---|---|
| `color_to_rgb` | Any color format → `rgb(...)` string | |
| `color_to_hsl` | Any color format → `hsl(...)` string | |
| `color_to_hex` | Any color format → `#hex` string | |
| `color_darken` | Any color format → same format, darker | Takes a percentage argument; full reference on [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) |

**Liquid object properties**

| Property | Returns | Notes |
|---|---|---|
| `settings.<id>` | A color object, prints as hex | Theme-wide `color` setting |
| `section.settings.<id>` / `block.settings.<id>` | Same | Section or block `color` setting |
| `.red` / `.green` / `.blue` | Number, 0–255 | |
| `.alpha` | Number, 0.0–1.0 | |
| `.hue` | Number, 0–360 | |
| `.saturation` / `.lightness` | Number, 0–100 | |
| `.chroma` | Number, 0.0–0.5 | |
| `.color_space` | String, `srgb` or `oklch` | Which native color space the object is working in |
| `.rgb` / `.rgba` | Space-separated string | `.rgba` includes a slash before alpha |
| `.oklch` / `.oklcha` | Space-separated string | `.oklcha` includes a slash before alpha |

## Key takeaways

- A `color` setting prints as hex by default — that's usually all you need.
- `settings.<id>` is actually a full color object, not a plain string. Its properties (`.red`, `.hue`, `.rgba`, `.oklch`, and the rest) are readable directly, with no filter required.
- `color_extract` and direct property access overlap for the channels they share, but property access additionally reaches `chroma`, `color_space`, `rgb`, `rgba`, `oklch`, and `oklcha`.
- HSL is easier to reason about for programmatic adjustments (darker, lighter, more saturated) because its components are already separated, rather than blended across RGB channels. OKLCH takes that further, keeping lightness and chroma predictable across different hues — exposed through `.color_space`, `.oklch`, and `.oklcha` for a theme already working in that space.
- `color_to_rgb`, `color_to_hsl`, and `color_to_hex` convert between formats; most other color filters (like `color_darken`) work directly on whatever format you pass them, with no manual conversion needed first.

## Further reading

- [Color filters](https://shopify.dev/docs/api/liquid/filters#color) (shopify.dev)
- [Liquid objects: `color`](https://shopify.dev/docs/api/liquid/objects/color) (shopify.dev)
- [OKLCH color space (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
