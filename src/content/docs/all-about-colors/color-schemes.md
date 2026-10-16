---
title: Color Schemes
description: A deep dive into color_scheme_group and color_scheme — definition, common settings and naming conventions, the role field, color_background gradients, and a complete real-world example.
---

**TL;DR:** A deep dive into `color_scheme_group` and `color_scheme` — `definition`, how many settings a scheme should have, common settings and naming conventions, the `role` field, `color_background` gradients, and a complete real-world example.

[17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) ended with a problem: independent `color` settings multiply the number of ways a merchant can accidentally break contrast, and that risk compounds across every section in a theme. This page is the fix.

:::note[Still fully current — not something to migrate away from]
`color_scheme_group` is live, first-class, fully supported documentation — Shopify's own changelog says color schemes "continue to work" and that existing themes "don't need to change." Dawn, Shopify's other current reference theme, ships one today, which is what the real examples on this page are built from. Shopify's newer Horizon theme chose a different approach instead — many individual `color` settings plus the separate `color_palette` setting (see [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) and [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/)) — but that's Horizon's own architectural choice for a new theme, not Shopify deprecating this setting or recommending you move off it.
:::

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
  ]
}
```

`definition` lists the roles every scheme must provide a color for — it's a *template*, not actual schemes yet.

:::note[`color_scheme_group` has no `default` array of its own]
It's tempting to assume the setting also ships its actual schemes inline, the way a `color` setting ships a `default` hex value. It doesn't. `color_scheme_group` only ever has four possible keys: `type`, `id`, `definition`, and the optional `role` (covered below) — never a `default` holding an array of schemes. The real schemes a merchant sees and edits (Scheme 1, Scheme 2, and so on) live in a theme's `config/settings_data.json` file instead, under `presets.<theme name>.color_schemes` — an object keyed by scheme ID, each holding just a `settings` object. [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) and [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) both show this file written out in full. A merchant adding a scheme from the theme editor, or a theme shipping starting schemes, both work by writing into that file — never by editing `definition` itself.
:::

## How many settings should a scheme have? Is there a limit?

Shopify doesn't document a minimum or maximum number of `definition` entries — there's no stated cap, and no error for having "too many" roles. In practice, the number is driven by how many visually distinct things a section actually needs to color, not by any platform limit.

Shopify's own Dawn reference theme ships exactly **seven** `definition` entries in its `color_scheme_group`, and that's a reasonable real-world benchmark for "enough roles to cover a typical section, without overwhelming the merchant with choices":

| Setting ID | Type | What it's for |
|---|---|---|
| `background` | `color` | The scheme's base background color |
| `background_gradient` | `color_background` | An optional gradient alternative to `background` |
| `text` | `color` | Body text color |
| `button` | `color` | Primary button background |
| `button_label` | `color` | Primary button text |
| `secondary_button_label` | `color` | Secondary (outlined) button text, and link color |
| `shadow` | `color` | Drop-shadow color for elevated elements |

A smaller theme can ship fewer — four roles (`background`, `text`, `button`, `button_label`) covers the basics, as the first example on this page shows. A theme with more distinct UI elements that need independent color control (borders, icons, a second accent) can add more roles. The practical ceiling isn't a Shopify limit — it's how many separate color decisions you're comfortable asking a merchant to keep coordinated across every scheme they create or edit.

Real themes (Dawn included) follow a consistent naming pattern for these IDs too — see the Naming conventions table near the end of this page.

## `definition` only allows three setting types

It's easy to assume `definition` accepts any setting type, the way a section's own `settings` array does. It doesn't. Every entry inside `definition` must be one of exactly three types:

- `header` — a plain label, for grouping roles visually in the editor. Doesn't produce a color.
- `color` — a single solid color, same as the standalone `color` setting from [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/).
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
  ]
}
```

In the theme editor, a `color_background` field shows the merchant a toggle between a plain color and a gradient builder, in one control. In the Liquid object it produces, `scheme.settings.background` comes out as a plain hex string for a scheme that picked a solid color, and a full `linear-gradient(...)` string for one that picked a gradient — the theme's CSS has to handle either shape. The CSS-generation loop in [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) uses `background` (the shorthand property) rather than `background-color` for exactly this reason: `background-color` silently drops a gradient value, while `background` accepts a flat color or a gradient interchangeably.

## `role`: telling the editor which swatch means what

`color_scheme_group` has one more optional field, `role`, that doesn't change what a merchant can pick — it only tells Shopify's own theme editor how to render the small preview swatch next to each scheme in the scheme picker. Without `role`, the editor has no way to know which of your `definition` IDs is "the background" versus "the button," so it can't draw an accurate preview.

Here's the real, complete `role` object from Shopify's Dawn theme, mapped against the seven settings from the table above:

```json
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "definition": [
    { "type": "color", "id": "background", "label": "t:settings_schema.colors.settings.background.label", "default": "#FFFFFF" },
    { "type": "color_background", "id": "background_gradient", "label": "t:settings_schema.colors.settings.background_gradient.label" },
    { "type": "color", "id": "text", "label": "t:settings_schema.colors.settings.text.label", "default": "#121212" },
    { "type": "color", "id": "button", "label": "t:settings_schema.colors.settings.button_background.label", "default": "#121212" },
    { "type": "color", "id": "button_label", "label": "t:settings_schema.colors.settings.button_label.label", "default": "#FFFFFF" },
    { "type": "color", "id": "secondary_button_label", "label": "t:settings_schema.colors.settings.secondary_button_label.label", "default": "#121212" },
    { "type": "color", "id": "shadow", "label": "t:settings_schema.colors.settings.shadow.label", "default": "#121212" }
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
```

Every key in `role` maps a standardized role name (the left-hand side, which the editor understands) to one of your own `definition` IDs (the right-hand side, which you chose). Ten role keys exist in total, and **every one of them is required** — Shopify's own docs mark all ten as required, with no optional roles:

| Role key | What the editor does with it | Gradient-capable? |
|---|---|---|
| `background` | Fills the swatch's background. | Yes — can map to a single `definition` ID, or to an object with `solid` and `gradient` sub-keys, so the editor shows whichever one the active scheme actually set. |
| `text` | Colors the swatch's sample text. | No |
| `primary_button` | Renders the first, filled preview "button" pill. | Yes — same `{ "solid": ..., "gradient": ... }` pattern as `background` |
| `primary_button_border` | Renders that same pill's border. | No |
| `on_primary_button` | Not used in the preview. | No |
| `secondary_button` | Renders a second, outlined preview "button" pill. | Yes — same `{ "solid": ..., "gradient": ... }` pattern |
| `secondary_button_border` | Renders that second pill's border. | No |
| `on_secondary_button` | Not used in the preview. | No |
| `links` | Not used in the preview. | No |
| `icons` | Not used in the preview. | No |

Two things worth noticing: all ten roles are required even though four of them (`on_primary_button`, `on_secondary_button`, `links`, `icons`) aren't currently drawn anywhere in the editor's preview swatch — Shopify validates that you've mapped every one regardless, so an incomplete `role` object fails theme check even though some of those mappings "wouldn't visibly show up anyway." And `role` only affects the *editor's own preview swatch* — it has no effect on the scheme object your Liquid code receives. The `scheme` object looped at render time still only exposes `scheme.id` and `scheme.settings` — there's no `scheme.role` to read. Whatever meaning a role carries, your own section or snippet markup has to apply it by reading `scheme.settings.<your-own-id>`, the same way it would without `role` defined at all.

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

`section.settings.color_scheme` then holds whichever scheme ID a merchant picked (`"scheme-1"`, `"scheme-2"`, or any custom one they've added via the editor). Shopify doesn't generate the actual CSS for you automatically — the theme still needs to loop over `settings.color_schemes` itself (usually once, in a snippet rendered near the top of `theme.liquid`) and output a class per scheme, each holding that scheme's colors as CSS custom properties. A section then applies the right one with a matching class, like `color-{{ section.settings.color_scheme }}`, on its outer element. See [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) for this loop written out in full.

## Why this is worth the extra setup

A merchant choosing one scheme from a list you already tested for contrast can't accidentally produce an unreadable combination the way four independent pickers can. It's also simpler for the merchant: one decision ("which look?") instead of four ("which four colors, that happen to need to work together?").

## How this relates to the `color_palette` setting

Everything on this page is about letting a merchant *pick* a pre-coordinated bundle of colors. There's a separate, theme-wide setting called `color_palette` that's about something else: giving a theme a small set of named "raw" brand colors (think of it as the paint cans a brand ships with). A `color_scheme_group`'s own `definition` entries can use one of those raw colors as their `default`, instead of hand-typing the same hex value into every scheme — it's covered in full on [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Built-in reference

**Setting types used on this page**

| Type | Used for |
|---|---|
| `color_scheme_group` | Bundles several color roles into one named scheme |
| `color_scheme` | Lets a section or block pick one scheme |
| `color` | A `definition` entry — solid color only |
| `color_background` | A `definition` entry — solid color or gradient |
| `header` | A `definition` entry — visual grouping, no color |

**Property keys exclusive to `color_scheme_group`**

| Key | Required? | Purpose |
|---|---|---|
| `definition` | Yes | Lists every role a scheme must fill |
| `role` | No | Maps your `definition` IDs to Shopify's fixed role names, for the editor preview |

**Fixed role names** (the only 10 keys `role` accepts)

| Role | Required? | Rendered in preview? | Gradient-capable? |
|---|---|---|---|
| `background` | Yes | Yes | Yes |
| `text` | Yes | Yes | No |
| `primary_button` | Yes | Yes | Yes |
| `primary_button_border` | Yes | Yes | No |
| `on_primary_button` | Yes | No | No |
| `secondary_button` | Yes | Yes | Yes |
| `secondary_button_border` | Yes | Yes | No |
| `on_secondary_button` | Yes | No | No |
| `links` | Yes | No | No |
| `icons` | Yes | No | No |

**Liquid object properties**

| Property | Returns | Notes |
|---|---|---|
| `scheme.id` | String | The scheme's ID, becomes your CSS class name |
| `scheme.settings` | Object | Holds every `definition` value, keyed by the ID you chose |
| `settings.color_schemes` | Iterable | All of a theme's current schemes; loop over this to generate CSS |
| `section.settings.color_scheme` | String | The scheme ID a merchant picked for a `color_scheme` setting |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| `color_scheme_group` setting `id` | snake_case, plural/collective | `color_schemes` |
| `definition` entry `id` | snake_case, name the role, not the appearance | `background`, `button`, not `white` |
| Sub-element of a role | `{role}_{aspect}` | `button_label`, `background_gradient` |
| Secondary/alternate variant | `{modifier}_{role}` | `secondary_button_label`, not `button_label_2` |
| `label` value | Always a `t:` translation key, never literal English | `t:labels.background` |

## Key takeaways

- `color_scheme_group` bundles several color roles into a single named scheme, so a merchant picks one coordinated look instead of assembling colors independently.
- The setting itself only ever has `type`, `id`, `definition`, and optional `role` — never a `default` array of schemes. Real schemes live in `settings_data.json`.
- There's no documented limit on how many `definition` roles a scheme can have. Dawn ships seven as a real-world reference point; four is enough to cover the basics.
- Name roles by what they're for, not what they look like, following the `{role}`, `{role}_{aspect}`, and `{modifier}_{role}` patterns real themes use.
- `definition` only accepts three entry types — `header`, `color`, and `color_background` — nothing else.
- `color_background` lets a role be a gradient as well as a flat color; consume it with the `background` CSS shorthand, not `background-color`, so a gradient value isn't silently dropped. Three role keys — `background`, `primary_button`, `secondary_button` — support this gradient mapping.
- The `role` field maps your own `definition` IDs to ten standardized roles Shopify's editor needs for an accurate scheme-picker preview — all ten are required, even the four that aren't currently drawn in the preview. It only affects that preview; your own Liquid still reads `scheme.settings.<your-id>` exactly as it would without `role`.
- `color_palette` is a separate, theme-wide setting for a small set of named brand colors — not a replacement for `color_scheme_group`, and not required by it. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Further reading

- [Input settings: `color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme_group) (shopify.dev)
- [Input settings: `color_scheme`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme) (shopify.dev)
- [The `color_contrast` filter](https://shopify.dev/docs/api/liquid/filters/color_contrast) (shopify.dev), for checking a pairing programmatically
- [Dawn's real `color_scheme_group` definition (GitHub)](https://github.com/Shopify/dawn/blob/main/config/settings_schema.json)
- [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/)
