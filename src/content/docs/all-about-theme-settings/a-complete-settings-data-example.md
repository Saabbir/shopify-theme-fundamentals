---
title: A Complete settings_data.json Example
description: The matching data file for the schema above, showing exactly what Shopify writes.
---

**TL;DR:** The matching data file for the schema above, showing exactly what Shopify writes.

This is the `config/settings_data.json` that would actually result from a merchant configuring every setting defined in [28.3. A Complete settings_schema.json Example](/all-about-theme-settings/a-complete-settings-schema-example/) — showing precisely what Shopify writes to this file as a merchant uses the theme editor.

```json
{
  "current": {
    "logo": "shopify://shop_images/example-logo.png",
    "logo_width": 180,
    "favicon": "shopify://shop_images/example-favicon.png",
    "color_schemes": {
      "scheme-1": {
        "settings": {
          "background": "#ffffff",
          "text": "#121212",
          "button": "#121212",
          "button_label": "#ffffff",
          "border": "#e5e5e5"
        }
      },
      "scheme-2": {
        "settings": {
          "background": "#121212",
          "text": "#ffffff",
          "button": "#ffffff",
          "button_label": "#121212",
          "border": "#333333"
        }
      },
      "scheme-3": {
        "settings": {
          "background": "#f4ede4",
          "text": "#2c2416",
          "button": "#8a5a3b",
          "button_label": "#ffffff",
          "border": "#ddd0bd"
        }
      }
    },
    "heading_font": "playfair_display_n7",
    "body_font": "assistant_n4",
    "heading_scale": 110,
    "page_width": 1280,
    "grid_spacing": 20,
    "cart_type": "drawer",
    "cart_show_vendor": false,
    "social_instagram_link": "https://instagram.com/example",
    "social_facebook_link": "https://facebook.com/example",
    "social_tiktok_link": ""
  },
  "presets": {
    "Default": {
      "heading_font": "assistant_n4",
      "body_font": "assistant_n4",
      "heading_scale": 100,
      "page_width": 1200,
      "grid_spacing": 16,
      "cart_type": "drawer",
      "cart_show_vendor": false
    }
  }
}
```

## Reading this file correctly

Every key under `current` corresponds directly to an `id` from the schema file — `heading_font`, `page_width`, and so on — holding whatever value the merchant actually picked. Notice `color_schemes` has grown a third entry, `scheme-3`, beyond the two the schema shipped as defaults: a merchant can add their own additional schemes from the theme editor, and each one gets stored here the same way, keyed by its scheme ID.

`social_tiktok_link` is present with an empty string, not omitted — once a merchant has interacted with a setting (even to leave it blank), Shopify typically still writes an entry for it, rather than removing the key entirely.

`presets.Default` holds a complete, named bundle of settings a merchant could switch their whole store to — in this example, the theme's original, unmodified defaults, preserved as a preset even after the merchant has since changed `current` away from them. A theme can ship more than one named preset here, letting a merchant switch their entire storefront's look with one click in the "Change style" part of the editor, if the theme is built to support it.

:::caution[Don't hand-edit this file on a live store]
Everything in this file reflects a specific merchant's real, saved configuration. Hand-editing `settings_data.json` directly (outside of setting sensible defaults before a theme's first install) risks silently overwriting choices a merchant has already made — always go through the theme editor, or through the Shopify CLI's theme pull/push commands, which handle this file correctly.
:::

## Key takeaways

- Every `current` key matches an `id` from `settings_schema.json` one-to-one — this file holds values, the schema file holds structure.
- A merchant can add more entries to a `color_scheme_group` value (or any repeatable structure) beyond what the schema's own `default` shipped — those additions are saved here too.
- `presets` in this file is a theme-level concept (complete, named, swappable style bundles) — unrelated to a section's own `presets` array covered in [6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/).

## Further reading

- [28.3. A Complete settings_schema.json Example](/all-about-theme-settings/a-complete-settings-schema-example/)
- [settings_data.json](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json) (shopify.dev)
