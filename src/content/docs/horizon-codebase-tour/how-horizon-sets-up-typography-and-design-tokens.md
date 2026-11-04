---
title: How Horizon Sets Up Typography & Design Tokens
description: theme-styles-variables.liquid in full — font loading, fluid type presets, and the entire token system.
---

**TL;DR:** `theme-styles-variables.liquid` in full — font loading, fluid type presets, and the entire token system.

Everything on this page is read directly from one file: `snippets/theme-styles-variables.liquid`, 687 lines, rendered once and responsible for essentially every design token Horizon's components read from. If there's one file worth understanding deeply before reusing anything from Horizon, it's this one.

## Preloading comes first, from a separate file

Before `theme-styles-variables.liquid` ever runs, `layout/theme.liquid` renders a smaller, dedicated snippet — `snippets/fonts.liquid` — that preloads all four font roles with the `preload_tag` filter, skipping any role set to a system font and marking every preload `fetchpriority: 'low'`. The full file, and the reasoning behind each of its choices, is covered in [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) — worth reading alongside this page, since preloading and the actual `@font-face` loading covered below are deliberately split across two separate files rather than combined into one.

## Loading fonts without loading the same face twice

[How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) already covered the four font-role settings (`type_body_font`, `type_subheading_font`, `type_heading_font`, `type_accent_font`) and the CSS custom properties they resolve into. What that page didn't cover is a real problem this file solves: each of those four fonts needs up to four variants loaded (regular, bold, italic, bold-italic, via `font_modify`) — but if a merchant picks the *same* font for two different roles, loading it twice would waste a download.

The file solves this by building a unique ID string for every font variant it's about to load, and tracking which ones it's already output:

```liquid
{% liquid
  assign rendered_fonts = ''
  assign primary_font = settings.type_body_font
  assign primary_font_bold = primary_font | font_modify: 'weight', 'bold'
  assign primary_font_face_id = '[primary_font_family]-[primary_font_weight]-[primary_font_style]|' | replace: '[primary_font_family]', primary_font.family | replace: '[primary_font_weight]', primary_font.weight | replace: '[primary_font_style]', primary_font.style

  unless rendered_fonts contains primary_font_face_id
    echo primary_font | font_face: font_display: 'swap'
    assign rendered_fonts = rendered_fonts | append: primary_font_face_id
  endunless
%}
```

This pattern — build an ID from a font's family/weight/style, check whether that exact ID has already been output, skip if so — repeats for all sixteen font variants (four roles times four variants each). It's a direct, practical answer to the "load each font exactly once" rule from [18.16. Typography Best Practices](/all-about-typography/typography-best-practices/), handling the specific edge case where "once" isn't obvious because the same font might be assigned to more than one role. Notice also `font_display: 'swap'` passed explicitly to `font_face` — the exact setting [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/) recommends as the sensible default.

## A real fluid type-preset algorithm, quoted in full

[18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) and [18.18. A Complete Fluid Type Preset Example](/all-about-typography/a-complete-fluid-type-preset-example/) both show `clamp()` values derived from a *desktop and a mobile* setting per level — a generic, from-scratch teaching technique, not a copy of any real theme. Horizon's real algorithm, quoted in full below from its actual `snippets/theme-styles-variables.liquid`, is different and worth seeing exactly as written: it computes every size from a *single* pixel setting per level (`settings.type_size_h1`, `settings.type_size_h2`, and so on — Horizon has no mobile-specific size setting at all), deriving the fluid minimum from neighboring sizes in the scale instead.

First, it builds a sorted, deduplicated list of every level's current size, padding two-digit numbers so a plain string sort still behaves like a numeric one across the realistic range of font sizes a merchant would actually set:

```liquid
{% liquid
  assign font_sizes = "paragraph, h1, h2, h3, h4, h5, h6" | split: ", "
  assign fluid_size_cutoff = 48
  assign absolute_font_size_min = 10

  comment
    Build an array of font sizes and sort it
  endcomment
  assign font_size_values = ''
  for font_size in font_sizes
    assign size_setting = 'type_size_[font_size]' | replace: '[font_size]', font_size
    assign size_setting_value = settings[size_setting] | times: 1

    comment
      If the font size is less than 100, pad it with a 0
      This is because we end up with an array of strings, which | sort filter can't order "correctly")
    endcomment
    if size_setting_value < 100
      assign size_setting_value = '0[size_setting_value]' | replace: '[size_setting_value]', size_setting_value
    endif

    assign font_size_values = font_size_values | append: '[size_setting_value],' | replace: '[size_setting_value]', size_setting_value
  endfor

  assign font_size_values = font_size_values | split: ',' | uniq | sort_natural
%}
```

Then, for every level, it finds that size's position in the sorted list (`find_index`) and derives its fluid minimum from whichever size sits one position below it — not an arbitrary fraction of the size itself:

```liquid
{% liquid
  comment
    For each font size S, find the next smaller size S-1, and determine the minimum for S
    The calculation depends on the size of S-1 (over or under the cutoff)
  endcomment
  for font_size in font_sizes
    assign size_setting = 'type_size_[font_size]' | replace: '[font_size]', font_size
    assign font_size_value = settings[size_setting] | times: 1
    assign font_size_string = '[font_size_value]' | replace: '[font_size_value]', font_size_value
    assign index = font_size_values | find_index: font_size_string

    if font_size_value >= fluid_size_cutoff
      comment
        Calculate the minimum size for each font size
      endcomment
      assign fluid_font_size_min = font_size_value

      if index == 0
        assign fluid_font_size_min = absolute_font_size_min
      else
        assign next_font_size_index = index | minus: 1
        assign next_font_size_value = font_size_values[next_font_size_index]
        assign next_font_size_value_number = next_font_size_value | times: 1

        comment
          If the next bigger font size under the fluid cutoff, we use keep a 4px buffer
        endcomment
        if next_font_size_value_number < fluid_size_cutoff
          assign fluid_font_size_min = next_font_size_value_number | plus: 4
          if font_size_value < fluid_font_size_min
            assign fluid_font_size_min = font_size_value
          endif
        else
          assign fluid_font_size_min = next_font_size_value | times: 1
        endif
      endif

      comment
        Calculate the fluid and maximum size for each font size
      endcomment
      assign fluid_size_min_rem = fluid_font_size_min | divided_by: 16.0
      assign fluid_size = font_size_value | times: 0.1
      assign fluid_size_max_rem = font_size_value | divided_by: 16.0

      echo '--font-size--[font_size]: clamp([fluid_size_min_rem]rem, [fluid_size]vw, [fluid_size_max_rem]rem);' | replace: '[font_size]', font_size | replace: '[fluid_size_min_rem]', fluid_size_min_rem | replace: '[fluid_size]', fluid_size | replace: '[fluid_size_max_rem]', fluid_size_max_rem
    else
      assign fluid_size_rem = font_size_value | divided_by: 16.0
      echo '--font-size--[font_size]: [fluid_size_rem]rem;' | replace: '[font_size]', font_size | replace: '[fluid_size_rem]', fluid_size_rem
    endif
  endfor
%}
```

A few things worth noticing, confirmed directly from this source rather than inferred:

- **The `vw` term is just the raw pixel size times `0.1`** (`font_size_value | times: 0.1`) — not a two-point line fitted between a mobile and a desktop setting. There's no mobile-specific size setting anywhere in this algorithm; the whole fluid range comes from one size setting per level plus its neighbor in the scale.
- **The maximum is always the setting's own raw value**, converted straight to `rem` (`font_size_value | divided_by: 16.0`) — a size never fluidly exceeds what the merchant actually set.
- **The minimum comes from the next-smaller size in the sorted scale**, not the current size itself — keeping every level's floor anchored to its neighbor, so adjusting one size in the theme editor can shift where nearby sizes bottom out too, rather than each level scaling in total isolation. The smallest size in the whole scale (`index == 0`) has no smaller neighbor to borrow from, so it floors at a fixed `absolute_font_size_min` of 10px instead.
- **Sizes below `fluid_size_cutoff` (48px) skip `clamp()` entirely** and just print a fixed `rem` value — the same "reserve fluid scaling for what needs it" rule [18.10](/all-about-typography/fluid-type-scales-in-depth/) teaches, applied here as a literal threshold rather than a per-size judgment call.
- **The one special case:** if a size's next-smaller neighbor is itself still under the 48px cutoff, the minimum is that neighbor's size plus a 4px buffer (capped so the minimum never exceeds the size itself) — the source comment calls this out directly as deliberate, not an edge case nobody noticed.

## Type presets: bundling size with family, weight, case, and spacing

Beyond raw sizes, the same file builds a complete preset per text role (`paragraph`, `h1` through `h6`), reading each role's font from a dynamically-built setting ID — this is the loop that answers "which font role does this heading level actually use," looked up with `settings[preset_font_id]` rather than a hardcoded setting name per level, quoted here exactly as written:

```liquid
{% liquid
  assign type_presets = "paragraph, h1, h2, h3, h4, h5, h6" | split: ", "

  for preset_name in type_presets
    assign preset_size = '--font-size--[preset_name]' | replace: '[preset_name]', preset_name
    assign preset_line_height = 'type_line_height_[preset_name]' | replace: '[preset_name]', preset_name

    if preset_name == 'paragraph'
      assign preset_font = '--font-body--family'
      assign preset_style = '--font-body--style'
      assign preset_weight = '400'
      assign preset_case = '--font-body--case'

      echo '--font-[preset_name]--weight: [preset_weight];' | replace: '[preset_name]', preset_name | replace: '[preset_weight]', preset_weight
    else
      assign preset_font_id = 'type_font_[preset_name]' | replace: '[preset_name]', preset_name
      assign preset_font = '--font-[preset_font]--family' | replace: '[preset_font]', settings[preset_font_id]
      assign preset_style = '--font-[preset_font]--style' | replace: '[preset_font]', settings[preset_font_id]
      assign preset_weight = '--font-[preset_font]--weight' | replace: '[preset_font]', settings[preset_font_id]
      assign preset_case = 'type_case_[preset_name]' | replace: '[preset_name]', preset_name
      assign preset_letter_spacing = 'type_letter_spacing_[preset_name]' | replace: '[preset_name]', preset_name

      echo '--font-[preset_name]--weight: var([preset_weight]);' | replace: '[preset_name]', preset_name | replace: '[preset_weight]', preset_weight
      echo '--font-[preset_name]--letter-spacing: var(--letter-spacing--[preset_letter_spacing]);' | replace: '[preset_name]', preset_name | replace: '[preset_letter_spacing]', settings[preset_letter_spacing]
    endif

    echo '--font-[preset_name]--size: var([preset_size]);' | replace: '[preset_name]', preset_name | replace: '[preset_size]', preset_size
    echo '--font-[preset_name]--family: var([preset_font]);' | replace: '[preset_name]', preset_name | replace: '[preset_font]', preset_font
    echo '--font-[preset_name]--style: var([preset_style]);' | replace: '[preset_name]', preset_name | replace: '[preset_style]', preset_style
    echo '--font-[preset_name]--case: [preset_case];' | replace: '[preset_name]', preset_name | replace: '[preset_case]', settings[preset_case]
    echo '--font-[preset_name]--line-height: var(--line-height--[preset_line_height]);' | replace: '[preset_name]', preset_name | replace: '[preset_line_height]', settings[preset_line_height]
  endfor
%}
```

This is precisely the type-preset idea from [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), built for real: `--font-h2--family`, `--font-h2--size`, `--font-h2--weight`, `--font-h2--case`, `--font-h2--line-height` all exist as one named bundle a component reads from, rather than a component assembling those five decisions itself every time it needs "H2 styling." `paragraph` is handled as a special case up front — it always uses the Body role and a fixed weight of `400`, with no per-level font-role setting at all, which is why it's branched out from the `else` block that handles every heading level. For `h1` through `h6`, `preset_font_id` is built as a string (`type_font_h2`, say) and looked up with `settings[preset_font_id]` — the same dynamic square-bracket lookup [18.18](/all-about-typography/a-complete-fluid-type-preset-example/) covers in its own loop-based preset example, confirmed here as the real pattern Horizon itself uses, not a technique invented for this site. Notice `preset_font` doesn't resolve to a literal font name — it resolves to the *name of a CSS custom property* (`--font-heading--family`, say), which is why the final `echo` wraps it in `var(...)`: the preset points at whichever role token the merchant's per-level choice resolved to, so changing that level's font-role setting still cascades through automatically.

## The rest of `theme-styles-variables.liquid`: a full design-token system, not just type

Past typography, the same file defines CSS custom properties for nearly every other design decision a Horizon component might need — confirmed directly in the source, organized by comment headers in the file itself:

| Category | Examples |
|---|---|
| Layout widths | `--sidebar-width`, `--normal-page-width`, `--narrow-content-width` |
| Responsive section heights | `--section-height-small/medium/large`, each redefined inside `@media` blocks for wider viewports |
| Z-index layering | `--layer-base`, `--layer-sticky`, `--layer-overlay`, `--layer-menu-drawer` — a full, named stacking order instead of arbitrary z-index numbers scattered through component CSS |
| Spacing | Three parallel scales — `--margin-*`, `--padding-*`, `--gap-*` — each from `3xs` to `6xl` |
| Opacity | A named scale from `--opacity-5` to `--opacity-90`, plus semantic ones like `--opacity-muted-text` |
| Borders | Radii and widths, several driven directly by merchant settings (`--style-border-radius-buttons-primary: {{ settings.button_border_radius_primary }}px;`) |
| Animation | Named easing curves, plus several custom spring-physics `linear()` easings with explicit duration constants |
| Component-specific tokens | Dedicated variables for inputs, checkboxes, buttons, drawers, modals, variant swatches, and the cart |

:::note[This is a primitive/semantic token system, confirmed in production]
[Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/) describes a three-tier token architecture as a pattern worth adopting. This file is that pattern, shipping in a real theme: broad primitives (`--padding-lg`), semantic groupings (`--font-heading--family`), and component-specific tokens (`--cart-secondary-font-family`) all coexist, with the component-specific ones built from the semantic ones, not redefined from scratch.
:::

## Key takeaways

- Horizon avoids loading the same font file twice by building a unique ID per font variant and tracking which ones have already been output — worth copying directly if a theme loads multiple font roles that a merchant might set to the same font.
- Its fluid type scale is computed from a *single* size setting per level, not a desktop/mobile pair — a cutoff (48px) separates fixed from fluid sizes, the `vw` term is just that size times `0.1`, the maximum is always the raw setting value, and the minimum borrows from whichever size sits one position below it in a sorted, deduplicated scale (or a fixed 10px floor, for the smallest size with no neighbor to borrow from).
- Type presets bundle family, size, weight, case, letter-spacing, and line-height under one name per text role, built from the same font-role tokens rather than hardcoding fonts again — `paragraph` is a special case with a fixed weight and the Body role; every heading level's font role is looked up dynamically with `settings[preset_font_id]`.
- Beyond typography, the same single file defines Horizon's entire token system — layout, z-index, spacing, opacity, borders, animation, and dozens of component-specific variables — a real, production example of the primitive/semantic/component tiering taught elsewhere on this site.

## Further reading

- [27.4. Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) — exactly how many settings, variants, tokens, and presets this adds up to
- [`theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
- [`fonts.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/fonts.liquid)
- [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)
