---
title: A Complete Design Tokens Example
description: One snippet merging typography, color, and spacing settings into CSS custom properties, consumed by real components.
---

**TL;DR:** One snippet merging typography, color, and spacing settings into CSS custom properties, consumed by real components.

[Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) built a token system for typography alone. This page widens that same idea to a whole small theme at once: one snippet that resolves font settings, color schemes, and a spacing scale into CSS custom properties, rendered exactly once, with two real components reading the result.

:::note[A generic, from-scratch example — not a copy of any real theme]
Everything on this page is an original, deliberately simple teaching example, built to show the *mechanism* clearly. It is not a copy of Dawn, Horizon, or any other real theme's actual files. For what this same idea looks like once it's grown to the scale of a real, shipped theme — split across several dedicated snippets instead of one — see [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) and [How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/).
:::

## The settings this snippet depends on

```json
{
  "name": "t:settings.typography",
  "settings": [
    { "type": "font_picker", "id": "type_body_font", "label": "t:labels.body_font", "default": "assistant_n4" },
    { "type": "font_picker", "id": "type_heading_font", "label": "t:labels.heading_font", "default": "playfair_display_n7" }
  ]
}
```

Both of these are entries within `settings_schema.json`'s top-level array, shown here as two separate objects for readability:

```json
{
  "name": "t:settings.colors",
  "settings": [
    {
      "type": "color_scheme_group",
      "id": "color_schemes",
      "definition": [
        { "type": "color", "id": "background", "label": "t:labels.background" },
        { "type": "color", "id": "text", "label": "t:labels.text" },
        { "type": "color", "id": "button", "label": "t:labels.button" },
        { "type": "color", "id": "button_label", "label": "t:labels.button_label" }
      ],
      "default": [
        { "id": "scheme-1", "settings": { "background": "#ffffff", "text": "#121212", "button": "#121212", "button_label": "#ffffff" } },
        { "id": "scheme-2", "settings": { "background": "#121212", "text": "#ffffff", "button": "#ffffff", "button_label": "#121212" } }
      ]
    }
  ]
}
```

Two `font_picker` settings for the typography roles, and one `color_scheme_group` for color — the exact same settings covered individually in [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) and [A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/). Spacing, below, doesn't need a merchant-facing setting at all — it's a fixed scale, not something a merchant picks.

## The complete snippet: `snippets/design-tokens.liquid`

```liquid
{% comment %}
  snippets/design-tokens.liquid

  Rendered exactly once, near the top of layout/theme.liquid's <head>.
  Resolves typography and spacing into :root custom properties, and
  color schemes into one class per scheme — the single source every
  section and block's CSS reads from afterward.
{% endcomment %}
{% style %}
  :root {
    /* Typography tokens — one role resolved per font_picker setting */
    --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
    --font-body-weight: {{ settings.type_body_font.weight }};
    --font-body-style: {{ settings.type_body_font.style }};

    --font-heading-family: {{ settings.type_heading_font.family }}, {{ settings.type_heading_font.fallback_families }};
    --font-heading-weight: {{ settings.type_heading_font.weight }};
    --font-heading-style: {{ settings.type_heading_font.style }};

    /* Spacing tokens — a fixed scale, not driven by any setting */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2.5rem;
    --space-xl: 4rem;
  }

  {{ settings.type_body_font | font_face }}
  {{ settings.type_heading_font | font_face }}

  /* Color tokens — one class per scheme, looped from the color_scheme_group setting */
  {% for scheme in settings.color_schemes %}
    .color-{{ scheme.id }} {
      --color-background: {{ scheme.settings.background }};
      --color-text: {{ scheme.settings.text }};
      --color-button: {{ scheme.settings.button }};
      --color-button-label: {{ scheme.settings.button_label }};
    }
  {% endfor %}
{% endstyle %}
```

```liquid
{% comment %} layout/theme.liquid {% endcomment %}
<head>
  {% render 'design-tokens' %}
  {{ content_for_header }}
</head>
```

Three different kinds of setting, three different resolution strategies, all ending up as the same kind of output (a CSS custom property): a `font_picker`'s font object gets read field by field; a flat spacing scale gets hardcoded directly, since nothing about it is merchant-configurable; and a `color_scheme_group` gets looped, because — unlike typography — color needs more than one simultaneous value (a merchant can have a section in a light scheme right next to one in a dark scheme on the very same page).

## Two components, consuming all three token categories at once

```liquid
{% comment %} sections/callout.liquid {% endcomment %}
<div class="callout color-{{ section.settings.color_scheme }}">
  <h2 class="callout__heading">{{ section.settings.heading }}</h2>
  <p class="callout__text">{{ section.settings.text }}</p>
</div>

{% schema %}
{
  "name": "t:sections.callout.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:labels.heading" },
    { "type": "richtext", "id": "text", "label": "t:labels.text" },
    { "type": "color_scheme", "id": "color_scheme", "label": "t:labels.color_scheme", "default": "scheme-2" }
  ]
}
{% endschema %}
```

```css
.callout {
  background: var(--color-background);
  color: var(--color-text);
  padding: var(--space-xl) var(--space-md);
}

.callout__heading {
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
  margin-bottom: var(--space-sm);
}

.callout__text {
  font-family: var(--font-body-family);
  font-weight: var(--font-body-weight);
}
```

```css
.product-card {
  border: 1px solid var(--color-text);
  padding: var(--space-sm);
}

.product-card__title {
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
  margin-bottom: var(--space-xs);
}

.product-card__price {
  font-family: var(--font-body-family);
}
```

Neither stylesheet above references a single Liquid setting directly — every value is `var(--something)`. A merchant changing the Heading font, picking a different color scheme on the callout, or (if the theme ever exposed it) adjusting the spacing scale all flow through automatically, with zero changes needed to either component's CSS.

## Why one file, here, but several in a real theme

This page deliberately keeps typography, color, and spacing in one snippet, because the point being demonstrated is the merge itself. A theme with dozens of sections usually splits this into separate, focused snippets instead — one for typography tokens, one for color scheme CSS, maybe one for spacing — purely so each stays short enough to navigate and change independently. [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) shows exactly that split, quoted directly from Horizon's real source: a dedicated `theme-styles-variables.liquid` for typography tokens, and separate files for color. The underlying mechanism — resolve settings into `:root` custom properties once, read them everywhere else — is identical either way; only the file organization changes with scale.

## Key takeaways

- Typography, color, and spacing can all resolve into the same kind of output (a CSS custom property), even though the settings behind them are different types and need different resolution strategies — field-by-field for a font object, hardcoded for a fixed scale, looped for a `color_scheme_group`.
- Every component's CSS should read a token (`var(--font-heading-family)`, `var(--color-background)`, `var(--space-md)`), never a raw Liquid setting — that's what makes a single settings change cascade everywhere automatically.
- One merged snippet is fine, and clearest, for a small theme or for learning the pattern; a larger theme typically splits the same idea across several focused snippets as it grows, without changing the underlying approach.

## Further reading

- [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)
- [A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/)
- [Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/)
- [Horizon Theme Codebase Tour](/horizon-codebase-tour/) — the same idea, at real-theme scale
