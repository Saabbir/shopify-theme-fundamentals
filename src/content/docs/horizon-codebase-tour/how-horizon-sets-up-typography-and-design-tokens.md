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

## A real fluid type-preset algorithm

[18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) showed hand-picked `clamp()` values for a handful of headings. Horizon instead *computes* a `clamp()` value for every size, from a single pixel number per size (`settings.type_size_h1`, `settings.type_size_h2`, and so on), using a consistent formula:

```liquid
{% liquid
  assign fluid_size_cutoff = 48
  assign absolute_font_size_min = 10
  # ...
  for font_size in font_sizes
    assign font_size_value = settings[size_setting] | times: 1
    if font_size_value >= fluid_size_cutoff
      # compute a minimum based on the next-smaller size in the scale
      # ...
      echo '--font-size--[font_size]: clamp([fluid_size_min_rem]rem, [fluid_size]vw, [fluid_size_max_rem]rem);'
    else
      echo '--font-size--[font_size]: [fluid_size_rem]rem;'
    endif
  endfor
%}
```

Two things worth noticing: sizes below a cutoff (48px) get a plain fixed `rem` value, not a `clamp()` — the same "reserve fluid scaling for sizes that need it" guidance from [18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/), applied as an actual rule rather than a judgment call per size. And each size's fluid minimum is derived from the *next smaller size* in the scale, not an arbitrary fraction — keeping the whole scale internally consistent as a merchant adjusts individual sizes from the theme editor, rather than each size scaling independently and potentially overlapping or inverting relative to its neighbors.

## Type presets: bundling size with family, weight, case, and spacing

Beyond raw sizes, the file builds a complete preset per text role (`paragraph`, `h1` through `h6`), each one bundling several decisions under one set of variables:

```liquid
{% liquid
  for preset_name in type_presets
    echo '--font-[preset_name]--weight: var([preset_weight]);'
    echo '--font-[preset_name]--letter-spacing: var(--letter-spacing--[preset_letter_spacing]);'
    echo '--font-[preset_name]--size: var([preset_size]);'
    echo '--font-[preset_name]--family: var([preset_font]);'
    echo '--font-[preset_name]--style: var([preset_style]);'
    echo '--font-[preset_name]--case: [preset_case];'
    echo '--font-[preset_name]--line-height: var(--line-height--[preset_line_height]);'
  endfor
%}
```

This is precisely the type-preset idea from [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), built for real: `--font-h2--family`, `--font-h2--size`, `--font-h2--weight`, `--font-h2--case`, `--font-h2--line-height` all exist as one named bundle a component reads from, rather than a component assembling those five decisions itself every time it needs "H2 styling." Notice each preset's font-family doesn't hardcode a font — it points at `var(--font-heading--family)` (one of the four role tokens from the typography chapter), so changing the Heading font setting still cascades through every preset built on top of it.

## The rest of the file: a full design-token system, not just type

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
- Its fluid type scale is computed, not hand-picked: a cutoff separates fixed from fluid sizes, and each size's fluid minimum derives from its neighbor in the scale, keeping the whole thing internally consistent.
- Type presets bundle family, size, weight, case, letter-spacing, and line-height under one name per text role, built from the same font-role tokens rather than hardcoding fonts again.
- Beyond typography, the same single file defines Horizon's entire token system — layout, z-index, spacing, opacity, borders, animation, and dozens of component-specific variables — a real, production example of the primitive/semantic/component tiering taught elsewhere on this site.

## Further reading

- [27.4. Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) — exactly how many settings, variants, tokens, and presets this adds up to
- [`theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
- [`fonts.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/fonts.liquid)
- [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)
