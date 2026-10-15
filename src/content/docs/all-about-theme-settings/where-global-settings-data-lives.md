---
title: Where Global Settings Data Actually Lives
description: settings_schema.json vs. settings_data.json, the current/presets keys, and exactly where everything else is stored instead.
---

**TL;DR:** `settings_schema.json` vs. `settings_data.json`, the `current`/`presets` keys, and exactly where everything else is stored instead.

Two files in `config/` together power every theme setting from [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/). They have genuinely different jobs, and knowing which does what prevents a whole category of confusion once a theme has more than a handful of settings.

## `settings_schema.json`: structure, not values

This file defines which global settings *exist* — their types, labels, defaults, and grouping into panels — the same way a section's `{% schema %}` defines what settings that section offers. It's an array of groups, each with a `name` and its own `settings` array:

```json
[
  {
    "name": "theme_info",
    "theme_name": "Example Theme",
    "theme_version": "1.0.0",
    "theme_author": "Your Name",
    "theme_documentation_url": "https://example.com/docs",
    "theme_support_url": "https://example.com/support"
  },
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
  }
]
```

Two things worth noting immediately: the first entry, `theme_info`, isn't a visible setting at all — it's metadata about the theme itself (name, version, author), and every theme includes exactly one of these. Every other entry is a group that becomes its own expandable panel in the theme editor's Theme Settings screen.

This file is part of the theme's own code — checked into version control, identical for every store that installs this theme, and changed only by a developer editing the theme, never by a merchant through the editor.

## `settings_data.json`: the merchant's actual chosen values

This file stores what a specific merchant has actually set each of those settings *to*, for their specific store:

```json
{
  "current": {
    "heading_font": "playfair_display_n4"
  },
  "presets": {
    "Default": {
      "heading_font": "assistant_n4"
    }
  }
}
```

`current` holds the live values — whatever the merchant has actually configured right now, which is what `settings.heading_font` actually returns in Liquid at render time. `presets` (a different, theme-level concept from a section's own `presets` array) holds one or more complete, named bundles of settings a merchant can switch their entire storefront between, from the theme editor's "Change style" feature if the theme supports it — a "Default" look, a "Bold" look, and so on, each a full set of settings values.

:::caution[`presets` here is theme-level, not the same thing as a section's `presets`]
[15.6. Advanced Preset Patterns](/all-about-blocks/advanced-preset-patterns/) and [6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/) both cover a different `presets` — the array inside a *section's* own schema, which supplies starting settings/blocks the moment that section is added to a page. The `presets` key in `settings_data.json` is unrelated: it's a set of complete, swappable theme-wide style bundles, not anything to do with how a single section starts out.
:::

This file is **not** part of the theme's checked-in code the same way `settings_schema.json` is — conceptually, it's closer to per-store data. Shopify writes to it automatically whenever a merchant changes something in the Theme Settings panel; you don't typically hand-edit a live store's `settings_data.json`. The one exception: when you're building a brand-new theme, you set sensible starting values in this file yourself, before any merchant has configured anything — those become what a merchant sees the moment they first install the theme.

## Where section and block settings actually live instead

This is the detail most worth getting right: **`settings_data.json` only stores global theme settings.** A section's own settings, and a block's own settings, are **never** stored here — they live inside whichever JSON template placed that section (or a section group file, for a header/footer), as part of that specific section's own JSON object, covered in full with a complete worked example on [28.5. A Complete Template Example](/all-about-theme-settings/a-complete-template-example/).

| Settings for... | Values actually stored in |
|---|---|
| Global theme settings (`settings.*`) | `config/settings_data.json` |
| A section's own settings (`section.settings.*`) | The JSON template that placed it, or a section group file |
| A block's own settings (`block.settings.*`) | The same JSON template/group file, nested under that section's entry |

## Key takeaways

- `settings_schema.json` defines which global settings exist and is part of the theme's own code; `settings_data.json` stores what a specific merchant has actually set them to, for their specific store.
- `settings_data.json`'s `current` key is the live values read at render time; its `presets` key holds complete, swappable theme-wide style bundles — a different concept from a section's own `presets` array.
- Section and block settings are never stored in `settings_data.json` at all — they live in the JSON template or section group file that placed that specific instance.

## Further reading

- [Global theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/global) (shopify.dev)
- [settings_data.json](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json) (shopify.dev)
