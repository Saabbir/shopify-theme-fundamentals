---
title: How Horizon Sets Up Colors
description: color-palette.liquid, contrast-override.liquid, and the automatic hover/contrast system, read from source.
---

**TL;DR:** `color-palette.liquid`, `contrast-override.liquid`, and the automatic hover/contrast system, read from source.

Everything on this page is read directly from three real files in Horizon's `snippets/` folder. Together they show a noticeably more elaborate color system than the single `color_scheme_group` example in [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) — this is what that same idea looks like scaled up to a real, production theme.

## The base layer: `color-palette.liquid`

This snippet runs once and writes the theme's foundational color custom properties to `:root`. Rather than one simple two-role palette, Horizon defines granular settings for specific UI roles — separate background/border/text settings for primary buttons, secondary buttons, form inputs, variant swatches, and selected variant swatches:

```liquid
--color-primary-button-text: rgb({{ settings.palette_primary_button_text.rgba }});
--color-primary-button-background: rgb({{ settings.palette_primary_button_background.rgba }});
--color-primary-button-border: rgb({{ settings.palette_primary_button_border.rgba }});

--color-input-background: rgb({{ settings.palette_input_background.rgba }});
--color-input-text: rgb({{ settings.palette_input_text.rgba }});
--color-input-border: rgb({{ settings.palette_input_border.rgba }});

--color-variant-background: rgb({{ settings.palette_variant_background.rgba }});
--color-variant-border: rgb({{ settings.palette_variant_border.rgba }});
--color-variant-text: rgb({{ settings.palette_variant_text.rgba }});
```

This is the same "name the role, not the appearance" instinct from [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/), taken further: instead of one generic "accent" role, Horizon has a distinct role for every UI surface that genuinely needs independent control.

## Finding the lightest and darkest color automatically

Before writing any button colors, the snippet computes the lightest and darkest color in the merchant's overall palette, by looping over `settings.color_palette` and comparing each color's brightness:

```liquid
{% liquid
  assign palette_lightest = '#ffffff'
  assign palette_lightest_brightness = -1
  assign palette_darkest = '#000000'
  assign palette_darkest_brightness = 256

  for palette_color in settings.color_palette
    if palette_color != blank and palette_color.alpha == 1
      assign b = palette_color | color_brightness
      if b > palette_lightest_brightness
        assign palette_lightest = palette_color
        assign palette_lightest_brightness = b
      endif
      if b < palette_darkest_brightness
        assign palette_darkest = palette_color
        assign palette_darkest_brightness = b
      endif
    endif
  endfor
%}
```

`color_brightness` — one of the color filters from [17.3. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — returns a numeric brightness value for a color. This loop uses it to find the two extremes of whatever palette a merchant has configured, storing them as `--palette-lightest` and `--palette-darkest`. Those two values become the fallback text color used anywhere a background is custom and nothing else has been specified — covered next.

## Automatic hover colors: `util-palette-hover-shift.liquid`

A separate, small utility snippet computes a hover-state color from any given color, entirely automatically — no merchant setting for "hover color" exists at all:

```liquid
{%- liquid
  assign alpha = color.alpha | default: 1
  if alpha < 0.4
    assign new_alpha = alpha | plus: 0.15
    echo color | color_modify: 'alpha', new_alpha
  else
    assign source_brightness = color | color_brightness
    if source_brightness <= 40
      echo color | color_lighten: 15
    elsif source_brightness <= 128
      echo color | color_lighten: 5
    elsif source_brightness <= 190
      echo color | color_darken: 10
    else
      echo color | color_darken: 5
    endif
  endif
-%}
```

The logic: a very transparent color gets *more* opaque on hover (since lightening or darkening a barely-visible color wouldn't read as a visible change); an opaque color gets lightened or darkened depending on how dark or light it already is, using `color_lighten`/`color_darken` from the same filter set covered in [17.3. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/). A merchant picks one button color; this snippet derives its hover state with no second setting required.

## Automatic contrast: `contrast-override.liquid`

This is the most elaborate of the three, and it's a real, shipping implementation of exactly the workflow described in [17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/). When a merchant sets a custom background color on some piece of content (a block, a popover, a badge), this snippet decides the right text color automatically:

```liquid
if text_color != blank
  assign effective_text_color = text_color
else
  assign page_text_contrast = background_color | color_contrast: settings.page_text_color
  if page_text_contrast >= 4.5
    assign effective_text_color = settings.page_text_color
  else
    assign effective_text_color = contrast_var
  endif
endif
```

In words: if the merchant explicitly picked a text color, use it. Otherwise, check whether the theme's normal body text color (`settings.page_text_color`) still contrasts acceptably (`color_contrast` returning 4.5 or higher — the exact WCAG AA threshold from [17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/)) against this specific custom background. If it does, keep using it, so text stays visually consistent with the rest of the page. If it doesn't, fall back to whichever of `--palette-lightest`/`--palette-darkest` actually contrasts against that background, computed earlier in `color-palette.liquid`.

:::note[This is "constrain the choices" and "check programmatically," combined]
[17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) describes constraining choices (via `color_scheme_group`) and checking programmatically (via `color_contrast`) as two separate strategies. Horizon's real system does both at once: a merchant can still pick any custom background color they want (not constrained to a fixed scheme), but every one of those choices is checked and corrected automatically via `color_contrast`, rather than shipped as a potential broken pairing.
:::

## The reusable `.color-custom-{id}` pattern

`contrast-override.liquid` writes its output as CSS scoped to a class named from a `section_id` parameter — `.color-custom-popover`, `.color-custom-drawer`, and so on — applied to that specific component's outer element. This is the same "settings become CSS custom properties on the outer element" convention from [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/), with one addition worth noting: the scoping class itself (`color-custom-{{ section_id }}`) is generated dynamically per call, which is what lets one shared snippet serve many different components (a popover, a drawer, a sale badge) without them interfering with each other.

## Key takeaways

- Horizon's color system is a scaled-up version of the same ideas taught elsewhere on this site: named roles instead of generic ones, settings resolved into CSS custom properties once, and automatic contrast checking instead of trusting a merchant's raw color choice.
- `color_brightness`, `color_lighten`/`color_darken`, `color_modify`, and `color_contrast` — the full color filter set from [17.3. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — are all used together, for real, in this one system.
- The `contrast-override` snippet and its dynamic `.color-custom-{id}` scoping pattern are directly reusable ideas for any theme that lets a merchant set a custom background color anywhere.

## Further reading

- [`color-palette.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/color-palette.liquid)
- [`contrast-override.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/contrast-override.liquid)
- [`util-palette-hover-shift.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/util-palette-hover-shift.liquid)
