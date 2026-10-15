---
title: A Complete Template Example
description: A full JSON template, showing exactly where section and block settings live instead.
---

**TL;DR:** A full JSON template, showing exactly where section and block settings live instead.

[28.2. Where Global Settings Data Actually Lives](/all-about-theme-settings/where-global-settings-data-lives/) stated that section and block settings are never stored in `settings_data.json` — they live in the JSON template itself. This page shows exactly what that looks like, with a complete, realistic `templates/index.json`.

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "settings": {
        "heading": "Summer Collection",
        "button_label": "Shop now",
        "button_url": "/collections/summer",
        "color_scheme": "scheme-2"
      }
    },
    "featured": {
      "type": "featured-collection",
      "settings": {
        "heading": "New Arrivals",
        "collection": "new-arrivals",
        "products_to_show": 8,
        "color_scheme": "scheme-1"
      }
    },
    "testimonials": {
      "type": "testimonials",
      "blocks": {
        "testimonial-1": {
          "type": "testimonial",
          "settings": {
            "quote": "The best purchase I've made all year.",
            "author": "Jordan R."
          }
        },
        "testimonial-2": {
          "type": "testimonial",
          "settings": {
            "quote": "Shipping was fast and the quality is excellent.",
            "author": "Morgan T."
          }
        }
      },
      "block_order": ["testimonial-1", "testimonial-2"],
      "settings": {
        "heading": "What our customers say",
        "color_scheme": "scheme-3"
      }
    }
  },
  "order": ["hero", "featured", "testimonials"]
}
```

## Reading this file against the settings data example

Compare this to [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) — notice `color_scheme` here holds a scheme *ID* (`"scheme-2"`, `"scheme-3"`), referencing a scheme whose actual color values live over in `settings_data.json`'s `color_schemes` object. This is the connective tissue between the two files: a section's settings (stored here, in the template) can point at a global resource (stored there, in the settings data), without duplicating that resource's actual values in every template that uses it.

## Three levels of settings, all visible in one file

This single template demonstrates every scope of settings from [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) at once:

- **`color_scheme`** on each section is a *reference* to a global resource (a color scheme defined once, in `settings_data.json`).
- **`heading`**, `button_label`, `collection`, and similar are **section-level settings** — each section instance here (`hero`, `featured`, `testimonials`) has entirely its own values, independent of any other instance of the same section type elsewhere in the theme.
- **`quote`** and `author` inside each block are **block-level settings** — nested one level deeper, under that specific block's own entry, itself nested under the section that contains it.

## `block_order` controls sequence, the block keys don't

Notice the `testimonials` section's blocks are keyed by arbitrary IDs (`testimonial-1`, `testimonial-2`) — those keys don't determine display order. The separate `block_order` array does, exactly the same role `order` plays for sections at the top level of the file. A merchant reordering blocks in the theme editor changes this array, not the keys themselves.

## What actually changes when a merchant edits this page

If a merchant edits the `hero` section's heading on this specific homepage, only this file changes — specifically, `sections.hero.settings.heading`. No other file is touched, and no other page is affected, even if `hero-banner` as a section *type* is also used on a completely different page (which would have its own separate template file, with its own separate `sections.hero.settings.heading` value, entirely independent of this one).

## Key takeaways

- Section settings live under `sections.<section-id>.settings` in the template; block settings live one level deeper, under `sections.<section-id>.blocks.<block-id>.settings`.
- A setting like `color_scheme` stores a reference (a scheme ID) to something defined globally — the template doesn't duplicate the scheme's actual color values.
- `order` (for sections) and `block_order` (for blocks within a section) control display sequence independently of whatever keys are used to identify each instance.

## Further reading

- [28.2. Where Global Settings Data Actually Lives](/all-about-theme-settings/where-global-settings-data-lives/)
- [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/)
