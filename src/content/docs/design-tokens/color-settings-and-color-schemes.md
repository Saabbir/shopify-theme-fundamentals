---
title: Color Settings & Color Schemes
description: "color_scheme_group, and why bundling related colors together beats a pile of standalone color settings."
---

**TL;DR:** `color_scheme_group`, and why bundling related colors together beats a pile of standalone color settings.

You met the `color` setting type back in [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/) — one setting, one color. That works fine for a single, specific thing (an accent color, say). It breaks down once you want a merchant to switch between a few complete, coordinated looks — light, dark, a bold brand color — without hunting down and changing five separate settings every time.

## The problem with standalone color settings at scale

```json
{ "type": "color", "id": "background_color", "label": "t:labels.background_color" },
{ "type": "color", "id": "text_color", "label": "t:labels.text_color" },
{ "type": "color", "id": "button_color", "label": "t:labels.button_color" },
{ "type": "color", "id": "button_label_color", "label": "t:labels.button_label_color" }
```

Nothing stops a merchant from picking a light background with a light text color, by accident, on one specific section — four independent settings means four independent chances to break contrast. Multiply that across every section in a theme and the risk compounds.

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

`section.settings.color_scheme` then holds whichever scheme ID a merchant picked (`"scheme-1"`, `"scheme-2"`, or any custom one they've added via the editor) — Shopify handles generating the actual CSS for every defined scheme and applying it wherever that scheme ID is referenced, typically through a class you add to the section's outer element. The exact mechanics of how that generated CSS is structured are worth reading directly from Shopify's own docs (linked below) rather than guessing at the specifics here.

## Why this is worth the extra setup

A merchant choosing one scheme from a list you already tested for contrast can't accidentally produce an unreadable combination the way four independent pickers can. It's also simpler for the merchant: one decision ("which look?") instead of four ("which four colors, that happen to need to work together?").

## Key takeaways

- A standalone `color` setting is right for one specific, independent color. `color_scheme_group` is right whenever several colors need to change together as a coordinated unit.
- `definition` lists the roles every scheme provides; `default` ships one or more real, ready-to-use schemes.
- Bundling related colors into schemes you've already checked for contrast removes an entire category of "technically allowed but broken" combinations a merchant could otherwise create.

## Further reading

- [Color schemes](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes) (shopify.dev)
- [The `color_contrast` filter](https://shopify.dev/docs/api/liquid/filters/color_contrast) (shopify.dev), for checking a pairing programmatically
