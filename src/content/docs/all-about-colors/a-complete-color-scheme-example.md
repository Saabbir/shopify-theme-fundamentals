---
title: A Complete Color Scheme Example
description: A full worked example of Horizon's approach — individual colors, an automatic hover state, and a contrast-checked text color — plus Dawn's color_scheme_group version of the same completeness goal.
---

**TL;DR:** A full worked example of Horizon's approach — individual colors, an automatic hover state, and a contrast-checked text color — plus Dawn's `color_scheme_group` version of the same completeness goal, for comparison.

[17.2. Color Schemes](/all-about-colors/color-schemes/) introduced both of this chapter's real approaches to keeping a merchant's colors coordinated. This page shows each one assembled into a complete, working piece: the full schema, the snippet every theme needs to turn settings into real CSS, and sections consuming the result.

## Horizon's approach, complete: individual colors, computed live

### The schema: `config/settings_schema.json`

```json
{
  "name": "t:settings.colors",
  "settings": [
    {
      "type": "color_palette",
      "id": "color_palette",
      "default": {
        "background": "#ffffff",
        "foreground": "#121212"
      }
    }
  ]
}
```

A small, theme-wide `color_palette` ([17.3](/all-about-colors/color-palette-setting/)) supplies the two raw colors everything else falls back to. Nothing scheme-related is declared at the theme level at all — the actual color choices live on each section.

### The section: `sections/testimonials.liquid`

```liquid
<div
  class="testimonials"
  style="
    --testimonials-background: {{ section.settings.background_color }};
    --testimonials-text: {{ section.settings.text_color | default: settings.color_palette.foreground }};
    --testimonials-button: {{ section.settings.button_color }};
    --testimonials-button-label: {{ section.settings.button_label_color }};
  "
>
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "t:sections.testimonials.name",
  "settings": [
    { "type": "color", "id": "background_color", "label": "t:labels.background", "default": "#ffffff" },
    { "type": "color", "id": "text_color", "label": "t:labels.text" },
    { "type": "color", "id": "button_color", "label": "t:labels.button", "default": "#121212" },
    { "type": "color", "id": "button_label_color", "label": "t:labels.button_label", "default": "#ffffff" }
  ]
}
{% endschema %}
```

`text_color` is deliberately left without a `default` — blank means "use the theme's normal text color," which is what makes the automatic contrast check below meaningful: most merchants never touch it, so the theme has to get the fallback right on its own.

### The missing piece: deriving a hover color and a safe text color

A `color_scheme_group` setting only ever gives you *data*; Horizon's approach is the same — nothing computes a hover state or checks contrast automatically. A theme has to do that itself, once, in a reusable snippet:

```liquid
{% comment %} snippets/coordinated-colors.liquid {% endcomment %}
{% doc %}
  Given a background and button color a merchant picked independently, derives
  a hover variant for the button and a text color that's guaranteed to pass
  WCAG AA against the background — falling back to the theme's own palette
  only when the normal text color wouldn't actually be readable.

  @param {string} background_color
  @param {string} button_color
{% enddoc %}

{% liquid
  assign button_brightness = button_color | color_brightness
  if button_brightness <= 128
    assign button_hover_color = button_color | color_lighten: 10
  else
    assign button_hover_color = button_color | color_darken: 10
  endif

  assign default_text_contrast = background_color | color_contrast: settings.color_palette.foreground
  if default_text_contrast >= 4.5
    assign effective_text_color = settings.color_palette.foreground
  else
    assign background_brightness = background_color | color_brightness
    if background_brightness > 128
      assign effective_text_color = settings.color_palette.foreground
    else
      assign effective_text_color = settings.color_palette.background
    endif
  endif
%}
```

Rendered for `testimonials`'s settings above (a white background, a dark button), this resolves `effective_text_color` to the palette's own dark `foreground` — the default passes contrast against a white background, so nothing needs correcting. A merchant who changes `background_color` to something dark triggers the fallback branch instead, flipping to the palette's light `background` color automatically, with no code change and no broken pairing shipped.

### A second section, reusing the exact same snippet

```liquid
{% comment %} sections/hero-banner.liquid (abridged) {% endcomment %}
{% render 'coordinated-colors', background_color: section.settings.background_color, button_color: section.settings.button_color %}

<div class="hero-banner" style="--hero-banner-background: {{ section.settings.background_color }}; --hero-banner-text: {{ effective_text_color }};">
  <h1>{{ section.settings.heading }}</h1>
</div>

{% schema %}
{
  "name": "t:sections.hero_banner.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:labels.heading" },
    { "type": "color", "id": "background_color", "label": "t:labels.background", "default": "#121212" },
    { "type": "color", "id": "button_color", "label": "t:labels.button", "default": "#ffffff" }
  ]
}
{% endschema %}
```

`hero-banner` ships a dark default background, where `testimonials` ships a light one — the same snippet computes the right text color for each, because it's checking the actual background in play each time, not assuming one fixed answer works everywhere.

:::note[A teaching version, not Horizon's actual file]
This snippet is written to be readable end to end in one sitting — Horizon's real implementation (covered in [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/)) handles more roles, border colors, transparent backgrounds, and a `preset` system for different surface types, all built from this same core idea.
:::

## Dawn's version of the same completeness goal: a full `color_scheme_group` example

The alternative approach from [17.2](/all-about-colors/color-schemes/) — pre-tested, merchant-picked schemes rather than live correction — has its own complete shape, worth seeing in full for the same reason: a `color_scheme_group` with `role` and a `color_background` gradient field, the snippet every Dawn-style theme needs to turn that schema into actual CSS, and sections consuming the result.

### The schema: `config/settings_schema.json`

```json
{
  "name": "t:settings.colors",
  "settings": [
    {
      "type": "color_scheme_group",
      "id": "color_schemes",
      "definition": [
        { "type": "color", "id": "background", "label": "t:labels.background", "default": "#ffffff" },
        { "type": "color_background", "id": "background_gradient", "label": "t:labels.background_gradient", "info": "t:labels.background_gradient_info" },
        { "type": "color", "id": "text", "label": "t:labels.text", "default": "#121212" },
        { "type": "color", "id": "button", "label": "t:labels.button", "default": "#121212" },
        { "type": "color", "id": "button_label", "label": "t:labels.button_label", "default": "#ffffff" },
        { "type": "color", "id": "secondary_button_label", "label": "t:labels.secondary_button_label", "default": "#121212" },
        { "type": "color", "id": "border", "label": "t:labels.border", "default": "#e5e5e5" }
      ],
      "role": {
        "text": "text",
        "background": { "solid": "background", "gradient": "background_gradient" },
        "links": "secondary_button_label",
        "icons": "text",
        "primary_button": "button",
        "on_primary_button": "button_label",
        "primary_button_border": "button",
        "secondary_button": "background",
        "on_secondary_button": "secondary_button_label",
        "secondary_button_border": "secondary_button_label"
      }
    }
  ]
}
```

That's the entire setting — `type`, `id`, `definition`, `role`. As [17.2. Color Schemes](/all-about-colors/color-schemes/) explains, there's no `default` array of schemes living inside it. The four actual schemes a merchant sees (a light one, a dark/inverse one, a warm brand-accent one, and a bold gradient one) live in `config/settings_data.json` instead, keyed by scheme ID:

```json
{
  "current": {
    "color_schemes": {
      "scheme-1": {
        "settings": {
          "background": "#ffffff",
          "text": "#121212",
          "button": "#121212",
          "button_label": "#ffffff",
          "secondary_button_label": "#121212",
          "border": "#e5e5e5"
        }
      },
      "scheme-2": {
        "settings": {
          "background": "#121212",
          "text": "#ffffff",
          "button": "#ffffff",
          "button_label": "#121212",
          "secondary_button_label": "#ffffff",
          "border": "#333333"
        }
      },
      "scheme-3": {
        "settings": {
          "background": "#f4ede4",
          "text": "#2c2416",
          "button": "#8a5a3b",
          "button_label": "#ffffff",
          "secondary_button_label": "#8a5a3b",
          "border": "#ddd0bd"
        }
      },
      "scheme-4": {
        "settings": {
          "background_gradient": "linear-gradient(180deg, #2c6e5c, #121212 100%)",
          "text": "#ffffff",
          "button": "#ffffff",
          "button_label": "#121212",
          "secondary_button_label": "#ffffff",
          "border": "#333333"
        }
      }
    }
  }
}
```

Each scheme fills in every role `definition` requires, except `scheme-4` — the bold, gradient-background scheme — which sets `background_gradient` instead of `background` and leaves `background` unset. `role` doesn't change any of this at runtime; it only tells the theme editor's own scheme picker which `definition` IDs correspond to which standardized concept (background, text, primary button, and so on), so it can draw an accurate preview swatch for each scheme without guessing. The full mapping and every role key are covered in [17.2. Color Schemes](/all-about-colors/color-schemes/) — this page assumes that explanation and jumps straight to using it.

This split — structure in `settings_schema.json`, real values in `settings_data.json` — is the same split shown in full in [28.3. A Complete settings_schema.json Example](/all-about-theme-settings/a-complete-settings-schema-example/) and [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) — those pages show `scheme-1` through `scheme-3` on a simpler four-role scheme; `scheme-4` and the gradient role are new on this page, to demonstrate `color_background`.

### The missing piece: turning schemes into CSS

A `color_scheme_group` setting only ever gives you *data* — a merchant's chosen colors, available in Liquid as `settings.color_schemes`. Nothing renders yet. A theme has to loop over that data itself, once, and output real CSS:

```liquid
{% comment %} snippets/color-scheme-css-variables.liquid — rendered once, in layout/theme.liquid's <head> {% endcomment %}
{% style %}
  {% for scheme in settings.color_schemes %}
    .color-{{ scheme.id }} {
      {% # background_gradient is only set on schemes that actually chose a gradient (scheme-4 here) — fall back to the plain background color on every other scheme. %}
      --color-background: {{ scheme.settings.background_gradient | default: scheme.settings.background }};
      --color-text: {{ scheme.settings.text }};
      --color-button: {{ scheme.settings.button }};
      --color-button-label: {{ scheme.settings.button_label }};
      --color-secondary-button-label: {{ scheme.settings.secondary_button_label }};
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

This is the loop directly documented by [Shopify's `color_scheme_group` Liquid object reference](https://shopify.dev/docs/api/liquid/objects/color_scheme_group) — `scheme.id` becomes the class name, and each of `scheme.settings.*` becomes one CSS custom property. `scheme.settings.background_gradient` is `nil` for any scheme that didn't set a gradient, which is exactly why `default` falls back to the plain `background` color instead — without that fallback, `--color-background` would come out blank for `scheme-1` through `scheme-3`. Rendered once for the four schemes above, it outputs:

```css
.color-scheme-1 {
  --color-background: #ffffff;
  --color-text: #121212;
  --color-button: #121212;
  --color-button-label: #ffffff;
  --color-secondary-button-label: #121212;
  --color-border: #e5e5e5;
}
.color-scheme-2 {
  --color-background: #121212;
  --color-text: #ffffff;
  --color-button: #ffffff;
  --color-button-label: #121212;
  --color-secondary-button-label: #ffffff;
  --color-border: #333333;
}
.color-scheme-3 {
  --color-background: #f4ede4;
  --color-text: #2c2416;
  --color-button: #8a5a3b;
  --color-button-label: #ffffff;
  --color-secondary-button-label: #8a5a3b;
  --color-border: #ddd0bd;
}
.color-scheme-4 {
  --color-background: linear-gradient(180deg, #2c6e5c, #121212 100%);
  --color-text: #ffffff;
  --color-button: #ffffff;
  --color-button-label: #121212;
  --color-secondary-button-label: #ffffff;
  --color-border: #333333;
}
```

Notice `--color-background` on `.color-scheme-4` holds a full `linear-gradient(...)` string, not a hex color. That's the whole reason the consuming CSS below reads `background: var(--color-background)` rather than `background-color: var(--color-background)` — `background-color` only ever accepts a solid color and would simply drop the gradient, leaving `scheme-4` rendering as transparent. `background` accepts either shape, so the same declaration works unmodified across all four schemes.

:::note[Real scheme IDs vs. this example's names]
A merchant-created scheme's real `id` is usually a generated value, not a clean name like `scheme-1` — this example keeps `scheme-1` through `scheme-4` throughout purely for readability, matching the same IDs already used in [28.5. A Complete Template Example](/all-about-theme-settings/a-complete-template-example/).
:::

### Consuming it: a section with a `color_scheme` setting

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

The section's CSS never hardcodes a color — it only ever reads `var(--color-background)` and similar. Whichever class `color-{{ section.settings.color_scheme }}` resolves to at render time is what supplies those variables' actual values, so the exact same stylesheet produces four entirely different-looking results (including the gradient scheme) depending only on which scheme a merchant picked.

### A second section, picking a different scheme by default

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

Two completely different sections, both reusing the exact same four schemes and the exact same `.color-*` classes — this is the entire payoff of defining schemes once, globally, instead of giving every section its own independent color pickers.

## Every concern from this chapter, in one place

- **Horizon's approach, complete**: individual `color` settings, a theme-wide `color_palette` for the fallback, a reusable snippet deriving a hover color (`color_brightness`, `color_lighten`/`color_darken`) and a contrast-checked text color (`color_contrast`), reused unmodified across two sections with very different default backgrounds.
- **Dawn's approach, complete**: a full `definition` array using all three allowed entry types, a complete `role` mapping, four real schemes in `settings_data.json` (including a gradient scheme), the CSS-generation loop every `color_scheme_group` theme needs, and two independent sections consuming the same schemes.
- **Both approaches proving the same underlying principle** — covered generically in [17.7. Building a Token System](/all-about-colors/building-a-token-system/) — that components should read a variable, never a hardcoded value, whether that variable's value was pre-tested (Dawn) or computed live (Horizon).
- **A contrast-checked-by-construction result either way** — Horizon's by checking live with `color_contrast`; Dawn's by each scheme pairing a background/text combination meant to already pass WCAG AA, worth verifying with `color_contrast` the same way [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) describes, for any scheme you ship as a real default.

## Built-in reference

**Setting types used on this page**

| Type | Used for |
|---|---|
| `color` | Individual color roles (Horizon's approach); `definition` entries, solid color only (Dawn's approach) |
| `color_palette` | Theme-wide fallback colors (Horizon's approach) |
| `color_scheme_group` | The main setting bundling roles into schemes (Dawn's approach) |
| `color_scheme` | A section's scheme picker (Dawn's approach) |
| `color_background` | `definition` entry for the gradient role (Dawn's approach) |

**Filters used on this page** (Horizon's approach)

| Filter | Purpose |
|---|---|
| `color_brightness` | Decides whether a color needs to lighten or darken for its hover state |
| `color_lighten` / `color_darken` | Derive the hover variant |
| `color_contrast` | Checks the default text color against the actual background in play |

**Liquid tags used on this page**

| Tag | Purpose |
|---|---|
| `{% comment %}...{% endcomment %}` | Inline and file-path notes in the examples |
| `{% style %}...{% endstyle %}` | Outputs a `<style>` block built from Liquid |
| `{% for %}...{% endfor %}` | Loops over `settings.color_schemes` (Dawn's approach) |
| `{% render %}` | Includes a snippet in another file |
| `{% schema %}...{% endschema %}` | Declares a section's settings |
| `{% content_for 'blocks' %}` | Renders a section's blocks |

**Liquid objects and global variables**

| Property / variable | Returns | Notes |
|---|---|---|
| `settings.color_palette.<key>` | Color object | Horizon's approach — the theme-wide fallback colors |
| `settings.color_schemes` | Iterable | Dawn's approach — every scheme currently defined for the theme |
| `scheme.id` | String | Dawn's approach — becomes the CSS class name |
| `scheme.settings` | Object | Dawn's approach — each `definition` value, keyed by the ID you chose |
| `section.settings.color_scheme` | String | Dawn's approach — the scheme ID a merchant picked |
| `content_for_header` | String | Shopify's required head-injection output — must be rendered once in `<head>`, regardless of colors |

**Filter used on this page** (Dawn's approach)

| Filter | Purpose |
|---|---|
| `default` | Falls back to `scheme.settings.background` when `background_gradient` is `nil` |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| Individual color setting `id` (Horizon's approach) | snake_case, name the role, not the appearance | `button_background`, `button_text` |
| CSS custom property (Horizon's approach) | `--{component}-{role}` | `--testimonials-background` |
| CSS class that applies a scheme (Dawn's approach) | `color-{{ scheme.id }}` | `.color-scheme-1` |
| CSS custom property per role (Dawn's approach) | `--color-{role}` | `--color-background`, `--color-button-label` |
| Snippet file for the CSS-generation loop (Dawn's approach) | Descriptive, hyphenated | `color-scheme-css-variables.liquid` |

## Key takeaways

- Horizon's approach reaches completeness with a small `color_palette`, individual `color` settings, and one reusable snippet that derives a hover color and a contrast-checked text color live — reused unmodified across sections with very different defaults.
- Dawn's approach reaches completeness with a full `color_scheme_group` (`definition` plus `role`), real schemes written into `settings_data.json`, and one CSS-generation loop every theme using this pattern needs to write itself — Shopify doesn't generate it automatically.
- Both approaches converge on the same underlying discipline: a component's CSS reads a variable, never a hardcoded value, whether that variable's value was pre-tested ahead of time or computed automatically at render time.
- Neither approach is "the old one" in a deprecated sense — `color_scheme_group` is still fully supported — but Horizon, Shopify's current reference theme, builds new themes the first way, which is why this page (and this chapter) leads with it.

## Further reading

- [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) — Horizon's real, current source, read line by line
- [14.6. A Complete Section Example](/all-about-sections/a-complete-section-example/)
- [Input settings: `color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme_group) (shopify.dev)
- [Liquid objects: color_scheme_group](https://shopify.dev/docs/api/liquid/objects/color_scheme_group) (shopify.dev)
- [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/)
- [Dawn's real `color_scheme_group` (GitHub)](https://github.com/Shopify/dawn/blob/main/config/settings_schema.json) — the production theme this page's Dawn section is modeled on
