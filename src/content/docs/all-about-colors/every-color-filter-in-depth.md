---
title: Every Color Filter in Depth
description: Every Liquid color filter, with before/after examples.
---

**TL;DR:** Every Liquid color filter, with before/after examples.

:::note[Check filter names and parameters against Shopify's current docs]
Liquid's color filters are the kind of detail Shopify adds to over time. Treat the filters below as the core, long-standing set — and check [Shopify's filter reference](https://shopify.dev/docs/api/liquid/filters#color) for anything newer before assuming this list is exhaustive.
:::

## Lightening and darkening

```liquid
{{ "#ff6600" | color_darken: 20 }}
{% # => a noticeably darker orange %}

{{ "#ff6600" | color_lighten: 20 }}
{% # => a noticeably lighter orange %}
```

The number is a percentage — how far to move toward black (`color_darken`) or white (`color_lighten`).

## Saturating and desaturating

```liquid
{{ "#ff6600" | color_saturate: 20 }}
{% # => a more vivid, intense orange %}

{{ "#ff6600" | color_desaturate: 20 }}
{% # => a duller, more muted orange %}
```

Useful for deriving a muted secondary tone from a bold brand color, without the merchant picking a second color themselves.

## Mixing two colors together

```liquid
{{ "#ff6600" | color_mix: "#0000ff", 50 }}
{% # => a blend roughly halfway between orange and blue %}
```

The third argument controls the blend ratio — 50 is an even split; a lower number weights the result closer to the first color.

## Extracting one channel

```liquid
{{ "#ff6600" | color_extract: "red" }}
{% # => 255 %}

{{ "#ff6600" | color_extract: "hue" }}
{% # => 24 %}
```

Pulls out a single numeric component (`red`, `green`, `blue`, `alpha`, `hue`, `saturation`, `lightness`) from a color, rather than the whole color itself — useful when you need to make a decision based on one channel, like checking how light or dark a color already is.

## Adjusting a specific channel

```liquid
{{ "#ff6600" | color_modify: "alpha", 0.5 }}
{% # => rgba(255, 102, 0, 0.5) %}
```

Changes one named channel while leaving the others alone — this is how you'd add transparency to an otherwise-opaque merchant-picked color, since a standard `color` setting has no built-in way to pick alpha/transparency itself.

## Checking contrast between two colors

```liquid
{{ "#ffffff" | color_contrast: "#121212" }}
{% # => a contrast ratio, e.g. 18.1 %}
```

Returns the WCAG contrast ratio between two colors — not a filter that changes a color, but the single most important one for accessibility. Covered in full on [17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/).

## Converting formats

Covered in full on [17.2. Color Formats & Conversions](/all-about-colors/color-formats-and-conversions/): `color_to_rgb`, `color_to_hsl`, `color_to_hex`.

## Key takeaways

- `color_darken`/`color_lighten` and `color_saturate`/`color_desaturate` derive a related tone from one merchant-picked color, without a second setting.
- `color_mix` blends two colors; `color_extract` pulls out one channel; `color_modify` changes one channel while leaving the rest alone (useful for adding alpha/transparency).
- `color_contrast` is the one to reach for before shipping any new color pairing — see the dedicated contrast-workflow page for how to use it systematically, not just spot-check it.

## Further reading

- [Color filters](https://shopify.dev/docs/api/liquid/filters#color) (shopify.dev)
