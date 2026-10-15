---
title: A Complete Color Scheme Example
description: A full color_scheme_group, the snippet that turns it into real CSS, and sections consuming the result.
---

**TL;DR:** A full `color_scheme_group`, the snippet that turns it into real CSS, and sections consuming the result.

[17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) introduced `color_scheme_group` and `color_scheme` as the pattern for letting a merchant pick a whole pre-coordinated look instead of independent color pickers. This page shows the complete picture: a realistic three-scheme `color_scheme_group`, the snippet every theme needs to turn that schema into actual CSS (Shopify doesn't generate this for you), and two sections consuming the result.

## The schema: `config/settings_schema.json`

```json
{
  "name": "t:settings.colors",
  "settings": [
    {
      "type": "color_scheme_group",
      "id": "color_schemes",
      "definition": [
        { "type": "color", "id": "background", "label": "t:labels.background", "default": "#ffffff" },
        { "type": "color", "id": "text", "label": "t:labels.text", "default": "#121212" },
        { "type": "color", "id": "button", "label": "t:labels.button", "default": "#121212" },
        { "type": "color", "id": "button_label", "label": "t:labels.button_label", "default": "#ffffff" },
        { "type": "color", "id": "border", "label": "t:labels.border", "default": "#e5e5e5" }
      ],
      "default": [
        {
          "id": "scheme-1",
          "settings": {
            "background": "#ffffff",
            "text": "#121212",
            "button": "#121212",
            "button_label": "#ffffff",
            "border": "#e5e5e5"
          }
        },
        {
          "id": "scheme-2",
          "settings": {
            "background": "#121212",
            "text": "#ffffff",
            "button": "#ffffff",
            "button_label": "#121212",
            "border": "#333333"
          }
        },
        {
          "id": "scheme-3",
          "settings": {
            "background": "#f4ede4",
            "text": "#2c2416",
            "button": "#8a5a3b",
            "button_label": "#ffffff",
            "border": "#ddd0bd"
          }
        }
      ]
    }
  ]
}
```

Three schemes here, each filling in every role `definition` requires: `scheme-1` is a plain light scheme, `scheme-2` is a dark/inverse scheme, and `scheme-3` is a warm, brand-accent scheme. This is the same `color_schemes` setting that already appears populated with real merchant-chosen values in [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) — that page shows what Shopify saves once a merchant has used this setting; this page shows the setting's own definition, and what makes it actually render as color.

## The missing piece: turning schemes into CSS

A `color_scheme_group` setting only ever gives you *data* — a merchant's chosen colors, available in Liquid as `settings.color_schemes`. Nothing renders yet. A theme has to loop over that data itself, once, and output real CSS:

```liquid
{% comment %} snippets/color-scheme-css-variables.liquid — rendered once, in layout/theme.liquid's <head> {% endcomment %}
{% style %}
  {% for scheme in settings.color_schemes %}
    .color-{{ scheme.id }} {
      --color-background: {{ scheme.settings.background }};
      --color-text: {{ scheme.settings.text }};
      --color-button: {{ scheme.settings.button }};
      --color-button-label: {{ scheme.settings.button_label }};
      --color-border: {{ scheme.settings.border }};
    }
  {% endfor %}
{% endstyle %}
```

```liquid
{% comment %} layout/theme.liquid — rendered once, near the top of <head> {% endcomment %}
<head>
  {% render 'color-scheme-css-variables' %}
  {{ content_for_header }}
</head>
```

This is the loop directly documented by [Shopify's `color_scheme_group` Liquid object reference](https://shopify.dev/docs/api/liquid/objects/color_scheme_group) — `scheme.id` becomes the class name, and each of `scheme.settings.*` becomes one CSS custom property. Rendered once for the three schemes above, it outputs:

```css
.color-scheme-1 {
  --color-background: #ffffff;
  --color-text: #121212;
  --color-button: #121212;
  --color-button-label: #ffffff;
  --color-border: #e5e5e5;
}
.color-scheme-2 {
  --color-background: #121212;
  --color-text: #ffffff;
  --color-button: #ffffff;
  --color-button-label: #121212;
  --color-border: #333333;
}
.color-scheme-3 {
  --color-background: #f4ede4;
  --color-text: #2c2416;
  --color-button: #8a5a3b;
  --color-button-label: #ffffff;
  --color-border: #ddd0bd;
}
```

:::note[Real scheme IDs vs. this example's names]
A merchant-created scheme's real `id` is usually a generated value, not a clean name like `scheme-1` — this example keeps `scheme-1`/`scheme-2`/`scheme-3` throughout purely for readability, matching the same IDs already used in [28.5. A Complete Template Example](/all-about-theme-settings/a-complete-template-example/) and [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/).
:::

## Consuming it: a section with a `color_scheme` setting

```liquid
{% comment %} sections/testimonials.liquid (abridged — full version in All About Sections) {% endcomment %}
<div class="testimonials color-{{ section.settings.color_scheme }}">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "t:sections.testimonials.name",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:labels.color_scheme",
      "default": "scheme-3"
    }
  ]
}
{% endschema %}
```

```css
.testimonials {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.testimonials .button {
  background: var(--color-button);
  color: var(--color-button-label);
}
```

The section's CSS never hardcodes a color — it only ever reads `var(--color-background)` and similar. Whichever class `color-{{ section.settings.color_scheme }}` resolves to at render time is what supplies those variables' actual values, so the exact same stylesheet produces three entirely different-looking results depending only on which scheme a merchant picked.

## A second section, picking a different scheme by default

```liquid
{% comment %} sections/hero-banner.liquid (abridged) {% endcomment %}
<div class="hero-banner color-{{ section.settings.color_scheme }}">
  <h1>{{ section.settings.heading }}</h1>
</div>

{% schema %}
{
  "name": "t:sections.hero_banner.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:labels.heading" },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:labels.color_scheme",
      "default": "scheme-2"
    }
  ]
}
{% endschema %}
```

Two completely different sections, both reusing the exact same three schemes and the exact same `.color-*` classes — this is the entire payoff of defining schemes once, globally, instead of giving every section its own independent color pickers.

## Every concern from this chapter, in one place

- **A full `definition` array** covering every color role a scheme must fill, per [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/).
- **Multiple real schemes in `default`** — a light, a dark/inverse, and a warm brand-accent scheme, each filling in every role.
- **The CSS-generation loop**, which [17.3. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) and [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) both assume exists somewhere in a theme, but don't show written out — this page is that missing piece.
- **Two independent sections consuming the same scheme set**, proving the reuse actually works the way [17.5. Building a Token System](/all-about-colors/building-a-token-system/) describes semantic tokens working: components read a variable, never a hardcoded value.
- **A contrast-checked-by-construction set of defaults** — each scheme here pairs a background/text combination meant to already pass WCAG AA, per [17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) — worth verifying with `color_contrast` the same way that page describes, for any scheme you ship as a real default.

## Key takeaways

- `color_scheme_group` only supplies data; a theme must still render its own loop over `settings.color_schemes` to generate the actual `.color-*` CSS classes — Shopify does not do this automatically.
- That loop belongs in one snippet, rendered once near the top of `layout/theme.liquid`, not repeated per section.
- Once that snippet exists, any number of sections can consume the same schemes just by adding a `color_scheme` setting and a matching `color-{{ ... }}` class — the CSS itself never needs to hardcode a color.

## Further reading

- [14.6. A Complete Section Example](/all-about-sections/a-complete-section-example/)
- [Liquid objects: color_scheme_group](https://shopify.dev/docs/api/liquid/objects/color_scheme_group) (shopify.dev)
- [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) — this same idea, scaled up to a real, production theme
