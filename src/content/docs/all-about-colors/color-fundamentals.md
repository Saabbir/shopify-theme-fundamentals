---
title: Color Fundamentals
description: The color setting, a deep dive into color_scheme_group (including role and color_background), and why bundling related colors together beats a pile of standalone color settings.
---

**TL;DR:** The `color` setting, a deep dive into `color_scheme_group` — including its `role` field and `color_background` gradient support — and why bundling related colors together beats a pile of standalone color settings.

## A single color: the `color` setting

```json
{ "type": "color", "id": "accent_color", "label": "t:labels.accent_color" }
```

A `color` setting gives a merchant a color picker in the theme editor and returns a plain hex string, like `#2c6e5c`, read in Liquid as `section.settings.accent_color`. This is the right choice for one specific, independent color decision — an accent color on a button, say — where nothing else needs to stay visually coordinated with it.

## The problem with standalone color settings at scale

```json
{ "type": "color", "id": "background_color", "label": "t:labels.background_color" },
{ "type": "color", "id": "text_color", "label": "t:labels.text_color" },
{ "type": "color", "id": "button_color", "label": "t:labels.button_color" },
{ "type": "color", "id": "button_label_color", "label": "t:labels.button_label_color" }
```

Independent `color` settings break down once several colors need to stay coordinated. Nothing stops a merchant from picking a light background with a light text color, by accident, on one specific section — four independent settings means four independent chances to break contrast. Multiply that across every section in a theme and the risk compounds.

## `color_scheme_group`: several coordinated roles, picked as one unit

A `color_scheme_group` setting, defined once in `settings_schema.json`, bundles several color roles into a single named "scheme" — then any section or block can offer a merchant a single choice between whole, pre-coordinated schemes, instead of four separate color pickers.

```json
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
    {
      "id": "scheme-1",
      "settings": { "background": "#ffffff", "text": "#121212", "button": "#121212", "button_label": "#ffffff" }
    },
    {
      "id": "scheme-2",
      "settings": { "background": "#121212", "text": "#ffffff", "button": "#ffffff", "button_label": "#121212" }
    }
  ]
}
```

`definition` lists the roles every scheme must provide a color for. `default` ships one or more actual schemes a merchant can pick between right away — here, a light one and a dark one, each with all four roles already filled in and already contrasting correctly.

## `definition` only allows three setting types

It's easy to assume `definition` accepts any setting type, the way a section's own `settings` array does. It doesn't. Every entry inside `definition` must be one of exactly three types:

- `header` — a plain label, for grouping roles visually in the editor. Doesn't produce a color.
- `color` — a single solid color, same as the standalone `color` setting shown earlier.
- `color_background` — a color **or** a gradient, picked from one merchant-facing control. Covered next.

Nothing else is allowed here — not `range`, not `image_picker`, not `checkbox`. A scheme is strictly a bundle of colors (and, with `color_background`, gradients); anything else that needs to vary per scheme has to live outside `color_scheme_group` entirely.

## Letting a scheme hold a gradient: `color_background`

A plain `color` role can only ever be a flat color. If a scheme's background should sometimes be a gradient — a common look for a hero or a bold promotional scheme — give that role's `definition` entry the type `color_background` instead of `color`:

```json
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "definition": [
    { "type": "color", "id": "text", "label": "t:labels.text" },
    { "type": "color_background", "id": "background", "label": "t:labels.background" },
    { "type": "color", "id": "button", "label": "t:labels.button" },
    { "type": "color", "id": "button_label", "label": "t:labels.button_label" }
  ],
  "default": [
    {
      "id": "scheme-1",
      "settings": { "text": "#121212", "background": "#ffffff", "button": "#121212", "button_label": "#ffffff" }
    },
    {
      "id": "scheme-2",
      "settings": {
        "text": "#ffffff",
        "background": "linear-gradient(180deg, #2c6e5c, #121212 100%)",
        "button": "#ffffff",
        "button_label": "#121212"
      }
    }
  ]
}
```

In the theme editor, a `color_background` field shows the merchant a toggle between a plain color and a gradient builder, in one control. In the Liquid object it produces, `scheme.settings.background` is a plain hex string for `scheme-1` and a full `linear-gradient(...)` string for `scheme-2` — the theme's CSS has to handle either shape. The CSS-generation loop in [17.8. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) uses `background` (the shorthand property) rather than `background-color` for exactly this reason: `background-color` silently drops a gradient value, while `background` accepts a flat color or a gradient interchangeably.

## `role`: telling the editor which swatch means what

`color_scheme_group` has one more optional field, `role`, that doesn't change what a merchant can pick — it only tells Shopify's own theme editor how to render the small preview swatch next to each scheme in the scheme picker. Without `role`, the editor has no way to know which of your `definition` IDs is "the background" versus "the button," so it can't draw an accurate preview.

```json
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "definition": [
    { "type": "color", "id": "background", "label": "t:labels.background" },
    { "type": "color_background", "id": "background_gradient", "label": "t:labels.background_gradient" },
    { "type": "color", "id": "text", "label": "t:labels.text" },
    { "type": "color", "id": "button", "label": "t:labels.button" },
    { "type": "color", "id": "button_label", "label": "t:labels.button_label" },
    { "type": "color", "id": "secondary_button_label", "label": "t:labels.secondary_button_label" },
    { "type": "color", "id": "shadow", "label": "t:labels.shadow" }
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
  },
  "default": [
    {
      "id": "scheme-1",
      "settings": {
        "background": "#ffffff",
        "text": "#121212",
        "button": "#121212",
        "button_label": "#ffffff",
        "secondary_button_label": "#121212",
        "shadow": "#121212"
      }
    }
  ]
}
```

Every key in `role` maps a standardized role name (the left-hand side, which the editor understands) to one of your own `definition` IDs (the right-hand side, which you chose). Ten role keys exist, and the editor's preview requires most of them to be present:

| Role key | Required? | What the editor does with it |
|---|---|---|
| `background` | Yes | Fills the swatch's background. Can map to a single `definition` ID, or to an object with `solid` and `gradient` sub-keys, so the editor shows whichever one the active scheme actually set. |
| `text` | Yes | Colors the swatch's sample text. |
| `primary_button` | Yes | Renders a filled preview "button" pill. |
| `on_primary_button` | Yes | Required by the schema, but not currently drawn in the preview. |
| `primary_button_border` | Yes | Required by the schema, but not currently drawn in the preview. |
| `secondary_button` | Yes | Renders a second, outlined preview "button" pill. |
| `on_secondary_button` | Yes | Required by the schema, but not currently drawn in the preview. |
| `secondary_button_border` | Yes | Required by the schema, but not currently drawn in the preview. |
| `links` | Yes | Required by the schema, but not currently drawn in the preview. |
| `icons` | Yes | Required by the schema, but not currently drawn in the preview. |

Two things worth noticing: several roles are required even though the current editor preview doesn't visibly use them yet — Shopify validates that you've mapped all ten regardless, so an incomplete `role` object fails theme check even if the missing role "wouldn't show up anyway." And `role` only affects the *editor's own preview swatch* — it has no effect on the scheme object your Liquid code receives. The `scheme` object looped at render time still only exposes `scheme.id` and `scheme.settings` — there's no `scheme.role` to read. Whatever meaning a role carries, your own section or snippet markup has to apply it by reading `scheme.settings.<your-own-id>`, the same way it would without `role` defined at all.

## Letting a section use it

A section or block picks from the available schemes with a `color_scheme` setting:

```json
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "t:labels.color_scheme",
  "default": "scheme-1"
}
```

`section.settings.color_scheme` then holds whichever scheme ID a merchant picked (`"scheme-1"`, `"scheme-2"`, or any custom one they've added via the editor). Shopify doesn't generate the actual CSS for you automatically — the theme still needs to loop over `settings.color_schemes` itself (usually once, in a snippet rendered near the top of `theme.liquid`) and output a class per scheme, each holding that scheme's colors as CSS custom properties. A section then applies the right one with a matching class, like `color-{{ section.settings.color_scheme }}`, on its outer element. See [17.8. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) for this loop written out in full.

## Why this is worth the extra setup

A merchant choosing one scheme from a list you already tested for contrast can't accidentally produce an unreadable combination the way four independent pickers can. It's also simpler for the merchant: one decision ("which look?") instead of four ("which four colors, that happen to need to work together?").

## How this relates to the `color_palette` setting

Everything on this page — `color`, `color_scheme_group`, `color_scheme` — is about letting a merchant *pick* colors, individually or as pre-coordinated bundles. There's a separate, theme-wide setting called `color_palette` that's about something else: giving a theme a small set of named "raw" brand colors (think of it as the paint cans a brand ships with) that other settings, including the `default` values inside a `color_scheme_group`, can point back to. It's covered in full on [17.2. The Color Palette Setting](/all-about-colors/color-palette-setting/) — read that next if you want to see how a theme ties its schemes back to one shared source of brand color, instead of hand-typing the same hex values into every scheme.

## Key takeaways

- A standalone `color` setting is right for one specific, independent color. `color_scheme_group` is right whenever several colors need to change together as a coordinated unit.
- `definition` only accepts three entry types — `header`, `color`, and `color_background` — nothing else.
- `color_background` lets a role be a gradient as well as a flat color; consume it with the `background` CSS shorthand, not `background-color`, so a gradient value isn't silently dropped.
- The optional `role` field maps your own `definition` IDs to the ten standardized roles Shopify's editor needs to draw an accurate scheme-picker preview swatch. It only affects that preview — your own Liquid still reads `scheme.settings.<your-id>` exactly as it would without `role`.
- `color_palette` is a separate, theme-wide setting for a small set of named brand colors — not a replacement for `color_scheme_group`, and not required by it. See [17.2. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Further reading

- [Input settings: `color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme_group) (shopify.dev)
- [Input settings: `color_scheme`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme) (shopify.dev)
- [The `color_contrast` filter](https://shopify.dev/docs/api/liquid/filters/color_contrast) (shopify.dev), for checking a pairing programmatically
