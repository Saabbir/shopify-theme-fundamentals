---
title: Color Formats & Conversions
description: Hex, RGB, and HSL — what a merchant's color picker actually gives you, and converting between them.
---

**TL;DR:** Hex, RGB, and HSL — what a merchant's color picker actually gives you, and converting between them.

Most of the time, as [17.1](/all-about-colors/color-fundamentals/) covers, you'll pass a merchant's color straight through without touching it. This page is for the remaining cases — deriving a hover state from a color the merchant never picked a second time for, or feeding a value into something that needs saturation and lightness as separate numbers — where you need to understand the format itself, not just pass it along.

## What a `color` setting actually returns

When a merchant picks a color in the theme editor, `settings.your_color_id` (a **theme-wide** setting — the section/block equivalent is `section.settings.your_color_id` / `block.settings.your_color_id`) returns a plain string in hex format, like `#ff6600`. That's the one format you can always count on without converting anything — most of the time, printing it straight into an inline style or CSS custom property is all you need:

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

## Why you'd ever need a different format

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

| Property | Returns |
|---|---|
| `settings.<id>` | Hex color string, for a theme-wide `color` setting |
| `section.settings.<id>` / `block.settings.<id>` | Same, for a section or block `color` setting |

## Key takeaways

- A `color` setting always returns hex by default — that's usually all you need.
- HSL is easier to reason about for programmatic adjustments (darker, lighter, more saturated) because its components are already separated, rather than blended across RGB channels.
- `color_to_rgb`, `color_to_hsl`, and `color_to_hex` convert between formats; most other color filters (like `color_darken`) work directly on whatever format you pass them, with no manual conversion needed first.

## Further reading

- [Color filters](https://shopify.dev/docs/api/liquid/filters#color) (shopify.dev)
