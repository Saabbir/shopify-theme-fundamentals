---
title: Color Fundamentals
description: The color setting, and why bundling related colors together beats a pile of standalone color settings.
---

**TL;DR:** The `color` setting, and why bundling related colors together beats a pile of standalone color settings.

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

## Where the solution lives

Shopify's answer to this is `color_scheme_group`: bundling several color roles into a single named "scheme," so a merchant picks one pre-coordinated look instead of assembling colors one at a time. It's a big enough topic — `definition`, `color_scheme`, the `role` field, `color_background` gradients, and how a section actually consumes a scheme — that it has its own page: [17.2. Color Schemes](/all-about-colors/color-schemes/). Read that next.

## Built-in reference

**Setting types used on this page**

| Type | Used for |
|---|---|
| `color` | A single, independent color picker |

**Liquid object properties**

| Property | Returns | Notes |
|---|---|---|
| `section.settings.<id>` | Hex color string | Reads a `color` setting's value — `<id>` is whatever you named it |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| `color` setting `id` | snake_case, name the role the color plays, not its appearance | `accent_color`, `button_label_color` — not `green_color` |

## Key takeaways

- A standalone `color` setting is right for one specific, independent color that doesn't need to stay visually coordinated with anything else.
- Several independent `color` settings on the same section multiply the number of ways a merchant can accidentally break contrast — four settings means four independent chances to pick a broken combination.
- [17.2. Color Schemes](/all-about-colors/color-schemes/) covers the fix: bundling related colors into a single, pre-coordinated choice.

## Further reading

- [Input settings: `color`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color) (shopify.dev)
- [17.2. Color Schemes](/all-about-colors/color-schemes/)
