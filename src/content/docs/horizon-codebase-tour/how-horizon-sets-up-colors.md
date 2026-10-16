---
title: How Horizon Sets Up Colors
description: color-palette.liquid, contrast-override.liquid, and the automatic hover/contrast system, read from source.
---

**TL;DR:** `color-palette.liquid`, `contrast-override.liquid`, and the automatic hover/contrast system, read from source.

Everything on this page is read directly from three real files in Horizon's `snippets/` folder. Worth knowing up front: Horizon doesn't use `color_scheme_group` at all — its current source has no `color_scheme_group`, `color_scheme`, `definition`, or `role` anywhere. Instead it builds a more elaborate system than the single `color_scheme_group` example in [17.2. Color Schemes](/all-about-colors/color-schemes/) out of a different set of pieces entirely: many individual `color` settings, the `color_palette` setting, and automatic contrast correction. Read this page as "a different, real production approach to the same underlying problem," not as `color_scheme_group` scaled up.

This is Horizon's own architectural choice, not Shopify deprecating `color_scheme_group`. Dawn, Shopify's other current reference theme, still ships `color_scheme_group` today, and Shopify's own changelog says color schemes "continue to work" and that themes don't need to change — `color_palette` is a recommendation for *new* themes, not a replacement requirement for existing ones. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) for that distinction in full.

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

This is the same "name the role, not the appearance" instinct from [17.2. Color Schemes](/all-about-colors/color-schemes/), taken further: instead of one generic "accent" role, Horizon has a distinct role for every UI surface that genuinely needs independent control.

## Finding the lightest and darkest color automatically

Before writing any button colors, the snippet computes the lightest and darkest color in the merchant's overall palette, by looping over `settings.color_palette` — Horizon's real, officially-typed [17.3. `color_palette` setting](/all-about-colors/color-palette-setting/), with the id `color_palette` and exactly two entries, `background` and `foreground` — and comparing each color's brightness:

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

`color_brightness` — one of the color filters from [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — returns a numeric brightness value for a color. This loop uses it to find the two extremes of whatever palette a merchant has configured, storing them as `--palette-lightest` and `--palette-darkest`. Those two values become the fallback text color used anywhere a background is custom and nothing else has been specified — covered next.

:::note[Two different things, both called "palette"]
The `palette_primary_button_text`-style settings above and `settings.color_palette` here are not the same mechanism, despite sharing the word "palette." `palette_primary_button_text` is an ordinary, standalone `color` setting — its own default is just the Liquid string `"{{ settings.color_palette.foreground }}"`. `settings.color_palette` is the real `color_palette`-type setting itself, holding only the two raw colors (`background`, `foreground`) that feed those other settings' defaults. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) for the full distinction.
:::

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

The logic: a very transparent color gets *more* opaque on hover (since lightening or darkening a barely-visible color wouldn't read as a visible change); an opaque color gets lightened or darkened depending on how dark or light it already is, using `color_lighten`/`color_darken` from the same filter set covered in [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/). A merchant picks one button color; this snippet derives its hover state with no second setting required.

## Automatic contrast: `contrast-override.liquid`

This is the most elaborate of the three, and it's a real, shipping implementation of exactly the workflow described in [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/). When a merchant sets a custom background color on some piece of content (a block, a popover, a badge), this snippet decides the right text color automatically:

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

In words: if the merchant explicitly picked a text color, use it. Otherwise, check whether the theme's normal body text color (`settings.page_text_color`) still contrasts acceptably (`color_contrast` returning 4.5 or higher — the exact WCAG AA threshold from [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/)) against this specific custom background. If it does, keep using it, so text stays visually consistent with the rest of the page. If it doesn't, fall back to whichever of `--palette-lightest`/`--palette-darkest` actually contrasts against that background, computed earlier in `color-palette.liquid`.

:::note[This is "constrain the choices" and "check programmatically," combined]
[17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) describes constraining choices (via `color_scheme_group`) and checking programmatically (via `color_contrast`) as two separate strategies. Horizon's real system does both at once: a merchant can still pick any custom background color they want (not constrained to a fixed scheme), but every one of those choices is checked and corrected automatically via `color_contrast`, rather than shipped as a potential broken pairing.
:::

## The reusable `.color-custom-{id}` pattern

`contrast-override.liquid` writes its output as CSS scoped to a class named from a `section_id` parameter — `.color-custom-popover`, `.color-custom-drawer`, and so on — applied to that specific component's outer element. This is the same "settings become CSS custom properties on the outer element" convention from [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/), with one addition worth noting: the scoping class itself (`color-custom-{{ section_id }}`) is generated dynamically per call, which is what lets one shared snippet serve many different components (a popover, a drawer, a sale badge) without them interfering with each other.

## Key takeaways

- Horizon's color system applies the same ideas taught elsewhere on this site — named roles instead of generic ones, settings resolved into CSS custom properties once, automatic contrast checking instead of trusting a merchant's raw color choice — but through its own mechanism, not `color_scheme_group`. That's Horizon's own architectural choice for a new theme, not a sign `color_scheme_group` is being phased out; Dawn still ships it today.
- `color_brightness`, `color_lighten`/`color_darken`, `color_modify`, and `color_contrast` — the full color filter set from [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — are all used together, for real, in this one system.
- Horizon defines a real `color_palette` setting (id `color_palette`, two entries: `background`/`foreground`) distinct from its many separate `palette_*`-prefixed `color` settings, which merely default from it. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).
- The `contrast-override` snippet and its dynamic `.color-custom-{id}` scoping pattern are directly reusable ideas for any theme that lets a merchant set a custom background color anywhere.

## Further reading

- [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/)
- [`color-palette.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/color-palette.liquid)
- [`contrast-override.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/contrast-override.liquid)
- [`util-palette-hover-shift.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/util-palette-hover-shift.liquid)
