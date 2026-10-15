---
title: settings_schema.json & settings_data.json
description: The two files behind global theme settings, and a common misconception about what each one stores.
---

**TL;DR:** The two files behind global theme settings, and a common misconception about what each one stores.

These two files, both in `config/`, work together to power the theme editor's global "Theme settings" panel — the settings that apply across the whole theme, as opposed to one section's own settings.

## `settings_schema.json`: what settings exist

This file defines the global settings themselves — their types, labels, and grouping — using the same setting types covered in [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/). It's an array of groups, each with a `name` and its own `settings` array.

```json
[
  {
    "name": "t:settings.typography",
    "settings": [
      {
        "type": "font_picker",
        "id": "heading_font",
        "label": "t:labels.heading_font",
        "default": "assistant_n4"
      }
    ]
  },
  {
    "name": "t:settings.social_media",
    "settings": [
      {
        "type": "url",
        "id": "social_instagram_link",
        "label": "t:labels.instagram"
      }
    ]
  }
]
```

Each group becomes its own expandable panel in the theme editor's global settings. You read any of these values in Liquid through the `settings` object, covered in [5.3. settings, section & block](/global-objects/settings-section-and-block/) — `settings.heading_font`, `settings.social_instagram_link`.

:::note[One special entry: `theme_info`]
A theme typically includes one extra, non-visual entry at the top of this array — a `theme_info` block with the theme's name, author, version, and documentation URL. It doesn't render as a setting at all; it's metadata about the theme itself.
:::

## `settings_data.json`: the actual saved values

This file stores the current values a merchant has actually chosen for everything defined in `settings_schema.json` — plus, separately, a set of theme-level presets (different from the section-level `presets` covered on the previous page).

```json
{
  "current": {
    "heading_font": "assistant_n4",
    "social_instagram_link": "https://instagram.com/example"
  }
}
```

## The misconception worth clearing up directly

It's tempting to assume `settings_data.json` is where *all* settings data lives — sections, blocks, everything. It isn't. It only stores values for the **global** settings defined in `settings_schema.json`. A section's own settings (`section.settings.*`) and a block's own settings (`block.settings.*`) are stored somewhere else entirely: inside the JSON template that placed that section (covered in [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/)), or inside a section group file for the header/footer.

| Settings for... | Values stored in |
|---|---|
| Global theme settings (`settings.*`) | `config/settings_data.json` |
| A section's own settings (`section.settings.*`) | The JSON template that placed it, or a section group file |
| A block's own settings (`block.settings.*`) | The same JSON template/group file, nested under that section's entry |

## In practice, you rarely hand-edit either file directly

Shopify's theme editor manages both files automatically as a merchant changes settings — a save in the editor is, mechanically, an update to one of these files (or a template JSON file, for section/block settings). As a developer, you mostly interact with them indirectly: you define what's *possible* in `settings_schema.json`, and Shopify handles writing the chosen values. The main time you'd touch `settings_data.json` by hand is setting sensible starting values for a brand-new theme, before a merchant has configured anything.

## Key takeaways

- `settings_schema.json` defines which global settings exist; `settings_data.json` stores the values a merchant has actually chosen for them.
- `settings_data.json` only covers *global* settings — a section's or block's own settings live in that section's JSON template or section group file instead, not here.
- Both files are normally managed automatically by the theme editor; you mostly define structure in `settings_schema.json` rather than hand-editing saved values.

## Further reading

- [Global theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/global) (shopify.dev)
