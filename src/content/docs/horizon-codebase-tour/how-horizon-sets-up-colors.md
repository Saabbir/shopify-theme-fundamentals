---
title: How Horizon Sets Up Colors
description: color-palette.liquid, contrast-override.liquid, and the automatic hover/contrast system, read from source.
---

**TL;DR:** `color-palette.liquid`, `contrast-override.liquid`, and the automatic hover/contrast system, read from source.

Everything on this page is read directly from three real files in Horizon's `snippets/` folder. Worth knowing up front: Horizon doesn't use `color_scheme_group` at all — its current source has no `color_scheme_group`, `color_scheme`, `definition`, or `role` anywhere. Instead it builds a more elaborate system than the single `color_scheme_group` example in [17.2. Color Schemes](/all-about-colors/color-schemes/) out of a different set of pieces entirely: many individual `color` settings, the `color_palette` setting, and automatic contrast correction. Read this page as "a different, real production approach to the same underlying problem," not as `color_scheme_group` scaled up.

This is Horizon's own architectural choice, not Shopify deprecating `color_scheme_group`. Dawn, Shopify's other current reference theme, still ships `color_scheme_group` today, and Shopify's own changelog says color schemes "continue to work" and that themes don't need to change — `color_palette` is a recommendation for *new* themes, not a replacement requirement for existing ones. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) for that distinction in full.

If you've already read [17.2. Color Schemes](/all-about-colors/color-schemes/) or [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/), both built from Dawn's real source, here's the same underlying problem solved the other way:

| | Dawn's way (`color_scheme_group`) | Horizon's way (what this page covers) |
|---|---|---|
| What a merchant picks | One whole pre-coordinated scheme from a fixed list | Individual colors, one setting at a time |
| Who guarantees the colors work together | The theme author, by testing each shipped scheme ahead of time | Nobody has to — the theme checks and corrects live, at render time |
| Hover states | Author-defined per scheme, or left out entirely | Computed automatically from whatever base color the merchant picked |
| Contrast safety | Relies on the author having tested every shipped scheme | Enforced every time, via `color_contrast`, for any color a merchant enters |
| Where it's covered on this site | [17.2](/all-about-colors/color-schemes/), [17.9](/all-about-colors/a-complete-color-scheme-example/) | This page |

Neither approach is "more correct" — Dawn's trades flexibility for a guarantee made once, ahead of time; Horizon's trades that upfront guarantee for flexibility plus a live safety net. Worth having this table in mind as you read the rest of this page, since most of what follows is really just "how do you build that live safety net."

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

`color_brightness` — one of the color filters from [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — returns a numeric brightness value for a color. This loop uses it to find the two extremes of whatever palette a merchant has configured, storing them as `--palette-lightest` and `--palette-darkest`. Those two values become a fallback text color used anywhere a background is custom and nothing else has been specified — this is the same fallback `contrast-override.liquid` reaches for, covered further down this page.

## Deriving hover and focus colors automatically

Before it ever writes a CSS custom property, `color-palette.liquid` also computes a *hover* and *focus* version of several of its own colors — the primary button, the secondary button, each variant swatch — without a single merchant setting for "hover color" existing anywhere in the schema. For the primary button:

```liquid
{% liquid
  if settings.palette_primary_button_background.alpha == 0
    assign effective_primary_button_focus_outline = settings.palette_primary_button_text
  else
    assign effective_primary_button_focus_outline = settings.palette_primary_button_background
  endif

  capture effective_primary_button_hover_background
    render 'util-palette-hover-shift', color: settings.palette_primary_button_background
  endcapture

  assign primary_hover_brightness = effective_primary_button_hover_background | color_brightness
  if primary_hover_brightness > 128
    assign primary_button_hover_contrast = palette_darkest
  else
    assign primary_button_hover_contrast = palette_lightest
  endif

  if settings.palette_primary_button_background.alpha == 1
    assign effective_primary_button_hover_text = primary_button_hover_contrast
  else
    assign effective_primary_button_hover_text = settings.palette_primary_button_text
  endif
%}
```

A few things worth noticing here, because none of them are obvious from the output alone:

- **The hover background** comes from `util-palette-hover-shift` (covered next) — not a second merchant setting, a computed derivation of the one color the merchant actually picked.
- **The hover text color isn't fixed.** Once the background shifts for hover, its brightness is re-measured, and the text color is chosen fresh against the *new* background — `palette_lightest` or `palette_darkest`, whichever actually contrasts — rather than assuming the original text color still works once the background has moved.
- **A fully transparent button background is a special case.** If `palette_primary_button_background` has no alpha at all (a "ghost" button style, text and border only, no fill), there's no background color to derive a focus outline from, so the focus outline falls back to the button's text color instead.

This exact pattern — capture a hover-shifted background, re-derive hover text from its new brightness, handle the border separately (reusing the same hover-shifted background if the border already matched the background, otherwise shifting the border independently) — repeats three more times in the same file, for the secondary button, the variant swatch, and the selected-variant swatch. It's the same technique applied four times, not four different techniques, which is why it's worth understanding once in full here rather than skimming past it as boilerplate.

The payoff is a set of CSS custom properties no merchant ever configured directly:

```css
--color-primary-button-hover-background: /* derived, not picked */;
--color-primary-button-hover-text: /* re-derived against the new background */;
--color-primary-button-hover-border: /* reuses or independently shifts, depending on the base colors */;
--color-primary-button-focus-outline: /* falls back to text color for a transparent button */;
```

`color-palette.liquid` also writes a number of custom properties outside color's scope entirely — drop-shadow colors, disabled-input states, muted/subdued text opacities — using the same `settings.palette_*` and `effective_*` values computed above. Those are outside what this page covers; the color-specific pattern above is the part worth carrying into your own theme.

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

This is the most elaborate of the three, and it's a real, shipping implementation of exactly the workflow described in [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/). When a merchant sets a custom background color on some piece of content (a block, a popover, a badge), this snippet decides the right text and border colors automatically:

```liquid
{% liquid
  assign skip_contrast = skip_contrast | default: false, allow_false: true
  assign preset = preset | default: 'content'

  assign has_background = false
  if background_color != blank and background_color.alpha != 0
    assign has_background = true
  endif

  if has_background and skip_contrast == false
    assign bg_brightness = background_color | color_brightness
    if bg_brightness > 128
      assign contrast_var = 'var(--palette-darkest)'
    else
      assign contrast_var = 'var(--palette-lightest)'
    endif

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

    if border_color != blank
      assign effective_border_color = border_color
    elsif preset == 'ui'
      assign effective_border_color = effective_text_color
    else
      assign effective_border_color = contrast_var
    endif
  endif
%}
```

The core decision is the same one documented here before: if the merchant explicitly picked a text color, use it; otherwise check whether the theme's normal body text color (`settings.page_text_color`) still contrasts acceptably (`color_contrast` returning 4.5 or higher — the exact WCAG AA threshold from [17.8](/all-about-colors/a-real-contrast-testing-workflow/)) against this specific custom background, and only fall back to the computed `contrast_var` (whichever of `--palette-lightest`/`--palette-darkest` actually contrasts) if it doesn't.

What's grown since is everything around that decision:

- **A `preset` parameter** — `'content'` (the default) or `'ui'` — controls which category of tokens gets emitted. `'content'` is for text-heavy, section- and block-level surfaces; `'ui'` is a lighter set meant for chrome like a popover, drawer, or badge. The two presets also make a different choice for the border color when none is explicitly set: `'ui'` reuses whatever the effective text color ended up being (so a UI surface's border visually tracks its text), while every other preset falls back to the computed `contrast_var` instead.
- **A `skip_contrast` flag** lets a caller apply only the background color, with no contrast correction at all — an escape hatch for a case where the automatic logic isn't the right fit.
- **A text-color-only branch** (not shown above) handles a merchant setting a custom text color with *no* custom background — still worth emitting a scoped set of tokens for, just a smaller set than the full background-plus-text case.

The actual tokens this snippet writes go well beyond the single `effective_text_color` shown above — a representative slice:

```css
.color-custom-{{ section_id }},
.color-custom-{{ section_id }} .text-block {
  --color-background: /* the custom background color, verbatim */;
  --color: /* effective_text_color */;
  --color-foreground: /* same value, under the name other components read */;
  --color-foreground-muted: /* effective text color, reduced opacity */;
  --color-foreground-subdued: /* effective text color, further reduced opacity */;
  --color-border: /* effective_border_color */;
}
```

Plus, on `.color-custom-{{ section_id }}` itself (not the nested `.text-block`), a set of disabled-input and checkbox-border tokens derived the same way — form-specific chrome that only ever applies to a component that can actually hold a form input, which is why it's scoped more narrowly than the text tokens above.

:::note[This is "constrain the choices" and "check programmatically," combined]
[17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/) describes constraining choices (via `color_scheme_group`) and checking programmatically (via `color_contrast`) as two separate strategies. Horizon's real system does both at once: a merchant can still pick any custom background color they want (not constrained to a fixed scheme), but every one of those choices is checked and corrected automatically via `color_contrast`, rather than shipped as a potential broken pairing.
:::

## The reusable `.color-custom-{id}` pattern

`contrast-override.liquid` writes its output as CSS scoped to a class named from a `section_id` parameter — `.color-custom-popover`, `.color-custom-drawer`, and so on — applied to that specific component's outer element, plus a second, nested selector for `.text-block` elements inside it (prose containers like a text block, an announcement, or a collection link, which read their color from the parent's scoped tokens rather than getting their own). This is the same "settings become CSS custom properties on the outer element" convention from [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/), with one addition worth noting: the scoping class itself (`color-custom-{{ section_id }}`) is generated dynamically per call, which is what lets one shared snippet serve many different components — a popover using the lighter `'ui'` preset, a content block using the richer default `'content'` preset — without them interfering with each other.

## Key takeaways

- Dawn and Horizon solve the same problem — keeping a merchant's colors coordinated and readable — from opposite directions: Dawn guarantees it ahead of time, through schemes an author already tested; Horizon guarantees it live, at render time, through automatic hover-shifting and contrast correction on whatever individual colors a merchant picks. Neither replaces the other; `color_scheme_group` is still fully current, and this page's approach is Horizon's own architectural choice for a new theme, not a sign of deprecation.
- `color-palette.liquid` doesn't just set base colors — it computes hover and focus variants for four different UI elements (primary button, secondary button, variant swatch, selected-variant swatch) by capturing the output of `util-palette-hover-shift` and re-deriving text color against the new, shifted background each time.
- `contrast-override.liquid` has grown into a `preset`-driven system (`'content'` for text-heavy surfaces, `'ui'` for chrome like popovers and drawers) with a `skip_contrast` escape hatch and a separate branch for a text-only override — not just the single explicit-color-or-computed-fallback decision it started as.
- `color_brightness`, `color_lighten`/`color_darken`, `color_modify`, and `color_contrast` — the full color filter set from [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) — are all used together, for real, in this one system.
- Horizon defines a real `color_palette` setting (id `color_palette`, two entries: `background`/`foreground`) distinct from its many separate `palette_*`-prefixed `color` settings, which merely default from it. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).
- The `contrast-override` snippet and its dynamic `.color-custom-{id}` scoping pattern are directly reusable ideas for any theme that lets a merchant set a custom background color anywhere.

## Further reading

- [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/)
- [`color-palette.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/color-palette.liquid)
- [`contrast-override.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/contrast-override.liquid)
- [`util-palette-hover-shift.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/util-palette-hover-shift.liquid)
