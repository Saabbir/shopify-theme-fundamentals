---
title: The Color Palette Setting
description: The color_palette setting type — a small, theme-wide set of named brand colors other settings can point back to — and how it relates to color_scheme_group.
---

**TL;DR:** `color_palette` — a small, theme-wide set of named brand colors other settings can point back to — and how it's different from (and complementary to) `color_scheme_group`.

[17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) and [17.2. Color Schemes](/all-about-colors/color-schemes/) covered `color`, `color_scheme_group`, and `color_scheme` — every one of them about letting a merchant *pick* colors. This page covers a different, theme-wide setting: `color_palette`, which gives a theme a small set of named "raw" brand colors other settings can reference, rather than every color setting in the theme hand-typing its own hex default.

## What problem `color_palette` actually solves

Picture a theme with forty independent `color` settings scattered across buttons, badges, inputs, borders, and schemes. Most of those colors should ultimately trace back to just two or three real brand colors — a background and a foreground, say. Without `color_palette`, every one of those forty settings hardcodes its own `"default"` hex value. Change the brand's base background color later, and you're hunting down and editing forty separate defaults by hand, hoping you don't miss one.

`color_palette` gives a theme one small, named source of truth for those raw brand colors, so every other setting's default can point back at it instead of repeating the hex value.

## The setting itself

`color_palette` is declared exactly once per theme, in `config/settings_schema.json`. Unlike `color_scheme_group`, it only supports two attributes — `id` and `default` — nothing else. No `label`, no `info`, no `visible_if`:

```json
{
  "type": "color_palette",
  "id": "color_palette",
  "default": {
    "background": "#ffffff",
    "foreground": "#121212"
  }
}
```

`default` is a flat object of named colors — not an array like `color_scheme_group`'s `default`. A few concrete rules govern it:

- Between **2 and 20** entries are required — fewer than 2 or more than 20 fails theme check.
- Each key must start with a letter, and can only contain letters, digits, and underscores after that (`background`, `accent_2`, not `2nd-color` or `background-color`).
- Each value must be a valid hex color, **without alpha** — an 8-digit hex (`#ffffffcc`) is rejected. `color_palette` colors are always fully opaque.

This is a real, current Shopify theme setting — Horizon itself (Shopify's own reference theme, version 4.1.4 at the time of writing) defines exactly this setting, with the id `color_palette` and exactly two entries:

```json
{
  "type": "color_palette",
  "id": "color_palette",
  "default": {
    "background": "#ffffff",
    "foreground": "#000000"
  }
}
```

## Reading it in Liquid: `settings.<id>.<key>`

Because the setting's own `id` is `color_palette`, its values are read as `settings.color_palette.<key>` — each one a full Liquid `color` object, the same type a `color` setting itself returns:

```liquid
{{ settings.color_palette.background }}
{{ settings.color_palette.foreground }}
```

If you chose a different `id` for the setting (say `brand_colors`), you'd read it as `settings.brand_colors.<key>` instead — the id you pick is what everything else keys off, same as any other setting.

## Using a palette color as another setting's default

The most common real use isn't reading `color_palette` directly in a template — it's referencing one of its colors as the **dynamic default** of a separate, standalone `color` or `color_background` setting elsewhere in `settings_schema.json`. You do this with a Liquid output tag, written as a plain string inside `"default"`:

```json
{
  "type": "color",
  "id": "page_background_color",
  "label": "t:labels.background",
  "default": "{{ settings.color_palette.background }}"
}
```

Shopify evaluates that `{{ settings.color_palette.background }}` string at the point the setting needs a default — so `page_background_color` starts out matching the palette's `background` color, without the theme author typing `#ffffff` a second time. If the merchant later edits the base palette color, any setting that hasn't been individually overridden by the merchant picks up the new value automatically; a setting the merchant *has* explicitly changed keeps their choice, same as any other setting default.

The same pattern works for `color_background` settings, including inside a gradient string — the Liquid tag is just interpolated into the larger CSS value:

```json
{
  "type": "color_background",
  "id": "hero_background",
  "label": "t:labels.background",
  "default": "linear-gradient(180deg, {{ settings.color_palette.background }}, {{ settings.color_palette.foreground }} 100%)"
}
```

This is, concretely, exactly the gap in [17.8. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/)'s own example — that page checks `settings.color_palette.foreground` against `settings.color_palette.background` with `color_contrast`, which only makes sense once you know `color_palette` is a real setting a theme actually defines, not something Shopify invents automatically.

## Iterating over a palette

`color_palette`'s value is also directly iterable, which is the pattern Horizon itself uses to compute the lightest and darkest color in the palette (used as a smart fallback elsewhere in its CSS):

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

A loop like `for palette_color in settings.color_palette` yields each color value in the `default` object's key order — but only the *values*; the keys themselves (`background`, `foreground`, …) aren't available inside that loop. If you need to know which named entry you're looking at while iterating, read it by key directly (`settings.color_palette.background`) instead of looping.

:::note[Don't confuse this with Horizon's `palette_*`-prefixed settings]
Horizon also defines dozens of individual, standalone settings with names like `palette_primary_button_background` and `palette_primary_button_text`. Despite the shared word "palette" in their IDs, these are ordinary `color` settings, each independent and merchant-overridable on its own — they are **not** part of the `color_palette` object, and you can't reach them as `settings.color_palette.primary_button_background`. What they actually do is use the dynamic-default pattern above: `palette_primary_button_background`'s own default is the string `"{{ settings.color_palette.foreground }}"`. One small `color_palette` setting feeds its two raw colors into many separate, individually named settings as *starting points* — it doesn't replace them. See [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) for Horizon's complete, real implementation of this pattern.
:::

## What happens when a merchant deletes a palette color

A merchant can remove an entry from `color_palette` in the theme editor (as long as at least 2 remain). When they do, Shopify doesn't just silently break every setting that referenced it — the editor prompts the merchant to choose a replacement color from what's left in the palette, and every setting that was pointing at the deleted entry is repointed to that replacement.

## `color_palette` vs. `color_scheme_group`: not a replacement, a different layer

It's a reasonable question to ask whether `color_palette` replaces `color_scheme_group`, given both are about "a theme's colors" at a glance. They don't compete — they solve different problems, and Shopify's own documentation and changelog are explicit that `color_scheme_group` continues to work and isn't required to be replaced:

- **`color_palette`** is a small set of **raw** brand colors (2 to 20 named hex values, no roles, no bundling). Think of it as the paint cans a brand ships with.
- **`color_scheme_group`** is a set of **pre-coordinated bundles** of color roles — background, text, button, and so on — that a merchant picks between as one unit, covered in full in [17.2. Color Schemes](/all-about-colors/color-schemes/) and [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/). Think of it as a set of rooms, each already painted using some combination of those cans.

In practice the two combine naturally: a `color_scheme_group`'s own `definition` entries can use `"default": "{{ settings.color_palette.background }}"` exactly the same way any other `color` setting can, so a theme's shipped schemes start out built from the same raw palette instead of a second, disconnected set of hardcoded hex values. Shopify's own changelog describes newer reference themes (Horizon 4.0.0 and later) as using the new palette system "throughout" — but that's additive to `color_scheme_group`, not a deprecation of it. Neither mechanism is currently a Theme Store requirement, but Shopify has said it's focusing future development on palettes, which is worth keeping in mind as a direction, not an urgent migration.

## Key takeaways

- `color_palette` is a single, theme-wide setting (`id` + `default` only) holding 2–20 named, fully opaque hex colors — a small source of truth, not a replacement for independent color settings.
- Read an entry with `settings.<id>.<key>`; reference one as another setting's dynamic default with `"default": "{{ settings.<id>.<key> }}"`, including inside a `color_background` gradient string.
- It's directly iterable (`for color in settings.color_palette`), yielding values in `default`'s key order — but not the keys themselves.
- Horizon's own `palette_*`-prefixed settings are separate, standalone `color` settings that merely default *from* `color_palette` — they aren't part of the `color_palette` object itself.
- `color_palette` and `color_scheme_group` are complementary, not competing: one is raw brand colors, the other is pre-coordinated role bundles built (optionally) from those same raw colors.

## Further reading

- [Input settings: `color_palette`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_palette) (shopify.dev)
- [Shopify changelog: Color palettes](https://shopify.dev/changelog/posts/color-palettes) (shopify.dev)
- [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) — Horizon's real, current source using this exact setting
- [17.2. Color Schemes](/all-about-colors/color-schemes/) — `color_scheme_group`, `role`, and `color_background`
