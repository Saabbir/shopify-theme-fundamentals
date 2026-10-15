---
title: A Complete settings_schema.json Example
description: A full, realistic global settings file, every category wired together.
---

**TL;DR:** A full, realistic global settings file, every category wired together.

This is a complete, realistic `config/settings_schema.json` — every group a typical theme actually ships, wired together the way they'd really appear, not isolated fragments. Everything here uses setting types and patterns already covered across this site; this page's job is showing them assembled into one real file.

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
    "name": "t:settings.logo",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "t:labels.logo"
      },
      {
        "type": "range",
        "id": "logo_width",
        "label": "t:labels.logo_width",
        "min": 50,
        "max": 300,
        "step": 10,
        "unit": "px",
        "default": 150
      },
      {
        "type": "image_picker",
        "id": "favicon",
        "label": "t:labels.favicon"
      }
    ]
  },
  {
    "name": "t:settings.colors",
    "settings": [
      {
        "type": "color_scheme_group",
        "id": "color_schemes",
        "definition": [
          { "type": "color", "id": "background", "label": "t:labels.background" },
          { "type": "color", "id": "text", "label": "t:labels.text" },
          { "type": "color", "id": "button", "label": "t:labels.button" },
          { "type": "color", "id": "button_label", "label": "t:labels.button_label" },
          { "type": "color", "id": "border", "label": "t:labels.border" }
        ],
        "default": [
          {
            "id": "scheme-1",
            "settings": {
              "background": "#ffffff",
              "text": "#121212",
              "button": "#121212",
              "button_label": "#ffffff",
              "border": "#e5e5e5"
            }
          },
          {
            "id": "scheme-2",
            "settings": {
              "background": "#121212",
              "text": "#ffffff",
              "button": "#ffffff",
              "button_label": "#121212",
              "border": "#333333"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "t:settings.typography",
    "settings": [
      {
        "type": "font_picker",
        "id": "heading_font",
        "label": "t:labels.heading_font",
        "default": "assistant_n4"
      },
      {
        "type": "font_picker",
        "id": "body_font",
        "label": "t:labels.body_font",
        "default": "assistant_n4"
      },
      {
        "type": "range",
        "id": "heading_scale",
        "label": "t:labels.heading_scale",
        "min": 100,
        "max": 150,
        "step": 5,
        "unit": "%",
        "default": 100
      }
    ]
  },
  {
    "name": "t:settings.layout",
    "settings": [
      {
        "type": "range",
        "id": "page_width",
        "label": "t:labels.page_width",
        "min": 1000,
        "max": 1600,
        "step": 50,
        "unit": "px",
        "default": 1200
      },
      {
        "type": "range",
        "id": "grid_spacing",
        "label": "t:labels.grid_spacing",
        "min": 0,
        "max": 40,
        "step": 4,
        "unit": "px",
        "default": 16
      }
    ]
  },
  {
    "name": "t:settings.cart",
    "settings": [
      {
        "type": "select",
        "id": "cart_type",
        "label": "t:labels.cart_type",
        "options": [
          { "value": "drawer", "label": "t:options.drawer" },
          { "value": "page", "label": "t:options.page" }
        ],
        "default": "drawer"
      },
      {
        "type": "checkbox",
        "id": "cart_show_vendor",
        "label": "t:labels.cart_show_vendor",
        "default": false
      }
    ]
  },
  {
    "name": "t:settings.social_media",
    "settings": [
      { "type": "url", "id": "social_instagram_link", "label": "t:labels.instagram" },
      { "type": "url", "id": "social_facebook_link", "label": "t:labels.facebook" },
      { "type": "url", "id": "social_tiktok_link", "label": "t:labels.tiktok" }
    ]
  }
]
```

## Why each group exists

- **`theme_info`** isn't optional and isn't a visible setting — every theme needs exactly one, for Shopify's own tooling to identify the theme's name, version, and support links.
- **Logo** groups the one-time brand assets a merchant sets once and every layout file reads from — this is exactly the kind of setting that has to be global, since a store has one logo, not one per section.
- **Colors** uses `color_scheme_group` rather than standalone color settings, per [17.2. Color Schemes](/all-about-colors/color-schemes/) — a full, production-realistic version of this appears on [17.9. A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/).
- **Typography** holds the font-role settings covered throughout [18. All About Typography](/all-about-typography/), plus a single `heading_scale` range — a reasonable global knob, since "how large do headings feel overall" is a theme-wide decision, not a per-section one.
- **Layout** holds structural decisions (overall page width, base grid spacing) that every section's CSS can read from as a shared token, rather than each section defining its own.
- **Cart** is a good example of a setting that's genuinely global by necessity — a store has one cart behavior (drawer or full page), not a different one per page.
- **Social media** links are classic global settings — a merchant sets their Instagram URL once, and every section or snippet that renders a social icon reads the same value.

## Key takeaways

- A real settings_schema.json groups related settings under named panels, mixing many setting types from [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/), not just one kind at a time.
- Every theme needs exactly one `theme_info` entry — metadata, not a visible setting.
- Every setting in this file should be something a merchant would only ever want one value for, theme-wide — per [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/), anything that should vary per-instance belongs in a section or block's own schema instead.

## Further reading

- [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) — the matching data file for this exact schema
- [Global theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/global) (shopify.dev)
