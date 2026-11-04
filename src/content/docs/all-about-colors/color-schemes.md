---
title: Color Schemes
description: color_scheme_group and color_scheme — bundling several color roles into one pre-tested "scheme" a merchant picks as a whole.
---

**TL;DR:** `color_scheme_group` and `color_scheme` — bundling several color roles into one pre-tested "scheme" a merchant picks as a whole, instead of assembling colors independently.

[17.1. Color Fundamentals](/all-about-colors/color-fundamentals/) ended with a problem: independent `color` settings multiply the number of ways a merchant can accidentally break contrast, and that risk compounds across every section in a theme. `color_scheme_group` is Shopify's answer — a theme author bundles several roles into a pre-tested "scheme," so a merchant picks one whole, already-coordinated look instead of assembling colors independently.

:::note[Horizon doesn't use this setting at all]
Shopify's current reference theme, Horizon, solves the same coordination problem a completely different way — it lets a merchant keep picking individual colors, then checks and corrects the result automatically, live, every time the page renders. There's no `color_scheme_group`, `color_scheme`, `definition`, or `role` anywhere in Horizon's current source. That approach is covered briefly at the end of [17.1](/all-about-colors/color-fundamentals/) and in full, from Horizon's real source, in [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/). `color_scheme_group` isn't deprecated, though — Shopify's own changelog says schemes "continue to work" and that existing themes don't need to change. It's the pattern you're more likely to inherit maintaining an existing theme (Dawn ships it) than reach for building a new one from scratch, and this page is entirely about it.
:::

## Bundling roles into a scheme

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
It's tempting to assume the setting also ships its actual schemes inline, the way a `color` setting ships a `default` hex value. It doesn't. `color_scheme_group` only ever has four possible keys: `type`, `id`, `definition`, and `role` (covered below, and required) — never a `default` holding an array of schemes. The real schemes a merchant sees and edits (Scheme 1, Scheme 2, and so on) live in a theme's `config/settings_data.json` file instead, under `presets.<theme name>.color_schemes` — an object keyed by scheme ID, each holding just a `settings` object. [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) and [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) both show this file written out in full. A merchant adding a scheme from the theme editor, or a theme shipping starting schemes, both work by writing into that file — never by editing `definition` itself.
:::

## How many settings should a scheme have? Is there a limit?

Shopify doesn't document a minimum or maximum number of `definition` entries — there's no stated cap, and no error for having "too many" roles. In practice, the number is driven by how many visually distinct things a section actually needs to color, not by any platform limit.

Dawn, Shopify's other current reference theme, ships exactly **seven** `definition` entries in its `color_scheme_group`, and that's a reasonable real-world benchmark for "enough roles to cover a typical section, without overwhelming the merchant with choices":

| Setting ID | Type | What it's for |
|---|---|---|
| `background` | `color` | The scheme's base background color |
| `background_gradient` | `color_background` | An optional gradient alternative to `background` |
| `text` | `color` | Body text color |
| `button` | `color` | Primary button background |
| `button_label` | `color` | Primary button text |
| `secondary_button_label` | `color` | Secondary (outlined) button text, and link color |
| `shadow` | `color` | Drop-shadow color for elevated elements |

A smaller theme can ship fewer — four roles (`background`, `text`, `button`, `button_label`) covers the basics, the same four shown in the opening example above. A theme with more distinct UI elements that need independent color control (borders, icons, a second accent) can add more roles, up toward Dawn's seven. The practical ceiling isn't a Shopify limit — it's how many separate color decisions you're comfortable asking a merchant to keep coordinated across every scheme they create or edit.

Real themes (Dawn included) follow a consistent naming pattern for these IDs too — see the Naming conventions table near the end of this page.

## `definition` only allows three setting types

It's easy to assume `definition` accepts any setting type, the way a section's own `settings` array does. It doesn't. Every entry inside `definition` must be one of exactly three types:

- `header` — a plain label, for grouping roles visually in the editor. Doesn't produce a color.
- `color` — a single solid color, same as the standalone `color` setting from [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/).
- `color_background` — a color **or** a gradient, picked from one merchant-facing control. Covered next.

All three, together — this is the complete set `definition` will accept, nothing more:

```json
"definition": [
  { "type": "header", "content": "t:headers.surface" },
  { "type": "color", "id": "background", "label": "t:labels.background" },
  { "type": "color_background", "id": "background_gradient", "label": "t:labels.background_gradient" }
]
```

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

In the theme editor, a `color_background` field shows the merchant a toggle between a plain color and a gradient builder, in one control. In the Liquid object it produces, `scheme.settings.background` comes out as a plain hex string for a scheme that picked a solid color, and a full `linear-gradient(...)` string for one that picked a gradient — the theme's CSS has to handle either shape.

:::note[`color_background` can't do everything "background" can]
A `color_background` field accepts any valid CSS background value — a flat color or a gradient — but Shopify's own documentation is explicit that it does not support image-related background properties. If a role genuinely needs a merchant-uploaded image, that has to live outside `color_scheme_group` entirely, as a separate `image_picker` setting.
:::

The CSS-generation loop in [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) uses `background` (the shorthand property) rather than `background-color` for exactly this reason: `background-color` silently drops a gradient value, while `background` accepts a flat color or a gradient interchangeably.

## `role`: telling the editor which swatch means what

`color_scheme_group` has one more field, `role`, that doesn't change what a merchant can pick — it only tells Shopify's own theme editor how to render the small preview swatch next to each scheme in the scheme picker. Without `role`, the editor has no way to know which of your `definition` IDs is "the background" versus "the button," so it can't draw an accurate preview.

:::note[`role` is required, not optional]
Shopify's prose docs describe `role` as being "just" for the editor preview, which makes it sound optional — but it isn't. Shopify's own JSON Schema for `settings_schema.json` (the one editor extensions like the Shopify Liquid extension for VS Code/Cursor, and `theme-check`, validate against) lists `role` in `color_scheme_group`'s own `required` array, right alongside `definition`. Leave it out and you'll get a real "missing property `role`" warning, not a stylistic nitpick — add it to fix the error, not just to improve the preview.
:::

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

## Letting a section pick a scheme: the `color_scheme` setting

A section or block picks from the available schemes with a `color_scheme` setting:

```json
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "t:labels.color_scheme",
  "default": "scheme-1"
}
```

:::note[`type` and `id` matching here is a convention, not a rule]
`"type": "color_scheme"` is the fixed string Shopify requires to get this picker setting at all. `"id": "color_scheme"` is just this setting's own, developer-chosen id — it could just as easily be `id: "scheme"` or `id: "section_color_scheme"`, and you'd read it back as `section.settings.scheme` or `section.settings.section_color_scheme` instead. The two matching here is a readable, common convention (it's what you'll see in most real themes, including the examples on this page), not something Shopify checks or enforces.
:::

`section.settings.color_scheme` then holds whichever scheme ID a merchant picked (`"scheme-1"`, `"scheme-2"`, or any custom one they've added via the editor). Shopify doesn't generate the actual CSS for you automatically — the theme still needs to loop over `settings.color_schemes` itself and output a class per scheme, each holding that scheme's colors as CSS custom properties. A section then applies the right one with a matching class, like `color-{{ section.settings.color_scheme }}`, on its outer element. That loop is the next piece.

## Turning `settings.color_schemes` into CSS

A `color_scheme_group` setting only ever gives you *data* — a merchant's chosen colors, available in Liquid as `settings.color_schemes`. Nothing renders yet. Write the loop once, in a snippet rendered near the top of `layout/theme.liquid`, using the same four-role scheme from the opening example on this page:

```liquid
{% comment %} snippets/color-scheme-css-variables.liquid — rendered once, in layout/theme.liquid's <head> {% endcomment %}
{% style %}
  {% for scheme in settings.color_schemes %}
    .color-{{ scheme.id }} {
      --color-background: {{ scheme.settings.background }};
      --color-text: {{ scheme.settings.text }};
      --color-button: {{ scheme.settings.button }};
      --color-button-label: {{ scheme.settings.button_label }};
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

`scheme.id` becomes the class name, and each `scheme.settings.*` value becomes one CSS custom property. Rendered for two schemes — a light one and a dark one, defined in `settings_data.json` —

```json
"color_schemes": {
  "scheme-1": { "settings": { "background": "#ffffff", "text": "#121212", "button": "#121212", "button_label": "#ffffff" } },
  "scheme-2": { "settings": { "background": "#121212", "text": "#ffffff", "button": "#ffffff", "button_label": "#121212" } }
}
```

— it outputs:

```css
.color-scheme-1 {
  --color-background: #ffffff;
  --color-text: #121212;
  --color-button: #121212;
  --color-button-label: #ffffff;
}
.color-scheme-2 {
  --color-background: #121212;
  --color-text: #ffffff;
  --color-button: #ffffff;
  --color-button-label: #121212;
}
```

A section consumes those classes through CSS alone — reusing the `color_scheme` setting from the example above:

```liquid
{% comment %} sections/testimonials.liquid (abridged) {% endcomment %}
<div class="testimonials color-{{ section.settings.color_scheme }}">
  {% content_for 'blocks' %}
</div>
```

```css
.testimonials {
  background: var(--color-background);
  color: var(--color-text);
}

.testimonials .button {
  background: var(--color-button);
  color: var(--color-button-label);
}
```

The section's own CSS never hardcodes a color — it only reads `var(--color-background)` and similar. Whichever class `color-{{ section.settings.color_scheme }}` resolves to at render time is what supplies those variables' actual values, so the same stylesheet produces a completely different look depending only on which scheme a merchant picked.

This version keeps things simple with a flat background and four roles. A real theme usually ships more roles (Dawn ships seven — see the table earlier on this page) and often a `color_background` gradient role too, which needs a `default` fallback in the loop since `background_gradient` is `nil` on any scheme that didn't choose a gradient. [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/) shows this same loop handling both, across four full schemes (including a gradient one) and two independent sections consuming them.

## Why `color_scheme_group` is worth the extra setup

A merchant choosing one scheme from a list you already tested for contrast can't accidentally produce an unreadable combination the way independent pickers can. It's also simpler for the merchant: one decision ("which look?") instead of four ("which four colors, that happen to need to work together?"). The trade-off: this guarantee is made once, by you, ahead of time — which means nothing needs to be computed at render time, but the guarantee is only as good as the schemes you actually tested, and less flexible for a merchant who wants a color no shipped scheme offers. (Horizon's live-correction approach makes the opposite trade — see the note at the top of this page.)

## How `color_scheme_group` relates to the `color_palette` setting

Everything on this page is about letting a merchant *pick* a pre-coordinated bundle of colors. There's a separate, theme-wide setting called `color_palette` that's about something else: giving a theme a small set of named "raw" brand colors (think of it as the paint cans a brand ships with). A `color_scheme_group`'s own `definition` entries can use one of those raw colors as their `default`, instead of hand-typing the same hex value into every scheme:

```json
{
  "type": "color",
  "id": "background",
  "label": "t:labels.background",
  "default": "{{ settings.color_palette.background }}"
}
```

`settings.color_palette` here is the **theme-wide** palette setting — it's covered in full on [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Built-in reference

**Setting types used on this page**

| Type | Used for |
|---|---|
| `color` | A `color_scheme_group` `definition` entry |
| `color_scheme_group` | Bundles several color roles into one named scheme |
| `color_scheme` | Lets a section or block pick one scheme |
| `color_background` | A `definition` entry — solid color or gradient |
| `header` | A `definition` entry — visual grouping, no color |

**Liquid tags used on this page**

| Tag | Purpose |
|---|---|
| `{% comment %}...{% endcomment %}` | Inline and file-path notes in the examples |
| `{% style %}...{% endstyle %}` | Outputs a `<style>` block built from Liquid |
| `{% for %}...{% endfor %}` | Loops over `settings.color_schemes` |
| `{% render %}` | Includes a snippet in another file |
| `{% content_for 'blocks' %}` | Renders a section's blocks |

**Property keys exclusive to `color_scheme_group`**

| Key | Required? | Purpose |
|---|---|---|
| `definition` | Yes | Lists every role a scheme must fill |
| `role` | Yes | Maps your `definition` IDs to Shopify's fixed role names, for the editor preview |

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
| `content_for_header` | String | Shopify's required head-injection output — must be rendered once in `<head>`, regardless of colors |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| `color_scheme_group` setting `id` | snake_case, plural/collective | `color_schemes` |
| `definition` entry `id` | snake_case, name the role, not the appearance | `background`, `button`, not `white` |
| Sub-element of a role | `{role}_{aspect}` | `button_label`, `background_gradient` |
| Secondary/alternate variant | `{modifier}_{role}` | `secondary_button_label`, not `button_label_2` |
| `label` value | Always a `t:` translation key, never literal English | `t:labels.background` |
| CSS class that applies a scheme | `color-{{ scheme.id }}` | `.color-scheme-1` |
| CSS custom property per role | `--color-{role}` | `--color-background`, `--color-button-label` |

## Key takeaways

- `color_scheme_group` bundles several color roles into one pre-tested "scheme," so a merchant picks one coordinated look rather than assembling colors independently. It's a real, current, fully-supported Shopify setting — not deprecated.
- Horizon, Shopify's current reference theme, doesn't use this setting at all — it corrects individually-picked colors live instead. That's a different, equally real mechanism, covered in [27.2](/horizon-codebase-tour/how-horizon-sets-up-colors/).
- `color_scheme_group` only ever has `type`, `id`, `definition`, and `role` — never a `default` array of schemes. Real schemes live in `settings_data.json`.
- There's no documented limit on how many `definition` roles a scheme can have. Dawn ships seven as a real-world reference point; four is enough to cover the basics.
- `definition` only accepts three entry types — `header`, `color`, and `color_background` — nothing else. `color_background` lets a role be a gradient as well as a flat color; consume it with the `background` CSS shorthand, not `background-color`.
- The `role` field maps your own `definition` IDs to ten standardized roles Shopify's editor needs for an accurate scheme-picker preview — all ten are required, even the four that aren't currently drawn in the preview. It only affects that preview; your own Liquid still reads `scheme.settings.<your-id>` exactly as it would without `role`.
- Shopify only ever hands back scheme data — `settings.color_schemes`. Turning it into real CSS is a loop the theme has to write once, outputting a `.color-{{ scheme.id }}` class per scheme with each role as a custom property. [17.9](/all-about-colors/a-complete-color-scheme-example/) shows that same loop handling a gradient role and all ten role keys, across four full schemes.
- `color_palette` is a separate, theme-wide setting for a small set of named brand colors a scheme's `definition` entries can default from — not a replacement for `color_scheme_group`, and not required by it. See [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Further reading

- [Input settings: `color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme_group) (shopify.dev)
- [Input settings: `color_scheme`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme) (shopify.dev)
- [Dawn's real `color_scheme_group` definition (GitHub)](https://github.com/Shopify/dawn/blob/main/config/settings_schema.json)
- [27.2. How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) — Horizon's real, current source, for the theme that doesn't use schemes at all
- [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/)
