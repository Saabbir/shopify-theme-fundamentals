---
title: Settings-Driven Styling in Depth
description: Two real layers — theme-wide base styles, and a per-block override — and the CSS custom properties that connect them.
---

**TL;DR:** Two real layers — theme-wide base styles, and a per-block override — and the CSS custom properties that connect them.

[36.2. Button Variants](/all-about-buttons/button-variants/) introduced Primary, Secondary, Text, and Custom as a merchant-facing choice. This page goes one level deeper: how a choice like "Custom" actually becomes real CSS, read directly from Horizon's source.

## Layer one: theme-wide settings become theme-wide tokens

```liquid
--style-border-radius-buttons-primary: {{ settings.button_border_radius_primary }}px;
--style-border-radius-buttons-secondary: {{ settings.button_border_radius_secondary }}px;
--style-border-width-primary: {{ settings.primary_button_border_width }}px;
--button-font-family-primary: var(--font-{{ settings.type_font_button_primary }}--family);
--button-text-case-primary: {{ settings.button_text_case_primary }};
```

This is the same "resolve settings into tokens once, consume everywhere" pattern [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) already covers for fonts, applied to buttons: every Primary-styled button anywhere in the theme reads `var(--style-border-radius-buttons-primary)` rather than any component re-reading `settings.button_border_radius_primary` directly. Change the setting once, and every primary button updates — the entire point of resolving into a token rather than reading the setting repeatedly.

:::note[`--button-font-family-primary` points at a role token, not a literal font]
`var(--font-{{ settings.type_font_button_primary }}--family)` is a nested reference: `type_font_button_primary` holds a string like `"body"` or `"accent"`, and that string is spliced directly into another custom property's name — resolving to `--font-body--family` or `--font-accent--family`, one of the role tokens [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) covers in full. A button's font setting doesn't pick a font directly; it picks *which existing role* the button should follow.
:::

## Layer two: a per-block override, scoped to one block

Selecting "Custom" on one specific button block shouldn't change every other button in the theme — it needs to be scoped to that one block instance. Horizon does this with a CSS custom property block, keyed by the block's own ID:

```liquid
{% if block_settings.style_class == 'button-custom' %}
  {%- assign effective_background_color = block_settings.custom_button_background
    | default: settings.palette_primary_button_background
  -%}
  {%- assign effective_text_color = block_settings.custom_button_text
    | default: settings.palette_primary_button_text
  -%}

  {% style %}
    .button-custom--{{ block_id }} {
      --button-background-color: rgb({{ effective_background_color.rgba }});
      --button-color: rgb({{ effective_text_color.rgba }});
    }
  {% endstyle %}
{% endif %}
```

```css
.button {
  background: var(--button-background-color, var(--style-button-background-primary));
  color: var(--button-color, var(--style-button-text-primary));
}
```

Two things worth noticing here, each a real, reusable pattern on its own:

- **`.button-custom--{{ block_id }}`** — the class name itself includes the block's ID, so this override only ever matches the one block instance it was generated for, no matter how many other Custom-styled buttons exist elsewhere on the same page.
- **`| default: settings.palette_primary_button_background`** — if a merchant switches a block to Custom but hasn't actually picked a custom color yet, the override falls back to the theme's own primary color rather than rendering transparent or black. A merchant sees a sensible button immediately, not a broken one, the moment they pick "Custom" from the dropdown.

The CSS itself reads `var(--button-background-color, var(--style-button-background-primary))` — a custom property with its own fallback. When the block-scoped override exists (Custom was picked), it wins; when it doesn't (Primary or Secondary was picked, so no `.button-custom--{{ block_id }}` rule was ever generated), the CSS silently falls through to the theme-wide primary token instead. No conditional logic is needed in the CSS itself — the fallback chain handles both cases.

## A real focus-outline decision, made from the color itself

```liquid
{%- if effective_background_color.alpha == 0 -%}
  {%- assign effective_focus_outline_color = effective_text_color -%}
{%- else -%}
  {%- assign effective_focus_outline_color = effective_background_color -%}
{%- endif -%}
```

```css
.button-custom--{{ block_id }}:focus-visible {
  outline-color: var(--button-focus-outline-color);
}
```

A focus outline drawn in a fully transparent background color would be invisible — so Horizon checks `effective_background_color.alpha == 0` first, and uses the *text* color for the outline instead whenever the background itself can't be seen. This is the same "don't hardcode a color that a merchant's own choice could make invisible" instinct [36.3. Interactive States](/all-about-buttons/interactive-states/) already covers for hover text — applied here to a different property (the focus outline) and a different trigger (fully transparent, rather than too dark or too light).

## Key takeaways

- Theme-wide button settings resolve into theme-wide tokens exactly once (the same pattern as font tokens) — every button of a given variant reads the same tokens, so a single settings change cascades everywhere automatically.
- A per-block "Custom" override is scoped with a class name that includes the block's own ID, so it only ever affects that one block instance.
- `| default: settings.palette_primary_button_background` means switching to Custom never produces a broken-looking button before a merchant has actually chosen a custom color.
- CSS custom properties with their own fallback (`var(--button-background-color, var(--style-button-background-primary))`) let the override "win" only when it actually exists — no conditional CSS needed for the common case where it doesn't.
- A focus outline color is computed from whether the background is fully transparent, not hardcoded — the same instinct behind computing readable hover text automatically.

## Further reading

- [`snippets/button-custom-styles.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/button-custom-styles.liquid)
- [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)
- [36.2. Button Variants](/all-about-buttons/button-variants/)
- [36.3. Interactive States](/all-about-buttons/interactive-states/)
