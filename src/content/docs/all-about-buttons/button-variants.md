---
title: Button Variants
description: Primary, secondary, text, and custom — a small, named set of button styles, not an unbounded one.
---

**TL;DR:** Primary, secondary, text, and custom — a small, named set of button styles, not an unbounded one.

A theme with twenty different button appearances scattered across twenty sections is a theme nobody can keep visually consistent. The fix is the same one [18.6. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) teaches for text: a small, named, reusable set of variants, not a fresh style invented per section.

## Four variants cover nearly everything

```
Primary    — the one action on a page that matters most ("Add to cart", "Checkout")
Secondary  — a real action, but not the main one ("View details", "Compare")
Text/link  — the lowest-emphasis action, styled like a plain link ("Learn more")
Custom     — an explicit, deliberate escape hatch for the rare one-off
```

This isn't a theoretical list — it's Horizon's real, shipped set, read directly from its button block's schema:

```json
{
  "type": "select",
  "id": "style_class",
  "label": "t:settings.style",
  "options": [
    { "value": "button", "label": "t:options.primary" },
    { "value": "button-secondary", "label": "t:options.secondary" },
    { "value": "button-unstyled", "label": "t:options.link" },
    { "value": "button-custom", "label": "t:options.custom" }
  ],
  "default": "button"
}
```

A merchant adding a Button block picks one of these four from a dropdown — not a color picker, not a free-form style builder. The constraint is the feature: four well-designed, consistent options are more useful to a merchant (and more maintainable for a developer) than unlimited, uncoordinated ones.

## Primary and secondary: two base styles, theme-wide

Primary and secondary each resolve to a small set of global settings a merchant sets once, in Theme Settings — not per block:

```json
{ "type": "color", "id": "palette_primary_button_background", "alpha": true },
{ "type": "color", "id": "palette_primary_button_text", "alpha": true },
{ "type": "color", "id": "palette_primary_button_border", "alpha": true },
{ "type": "range", "id": "button_border_radius_primary", "min": 0, "max": 100, "unit": "px", "default": 100 },
{ "type": "select", "id": "type_font_button_primary", "options": ["body", "accent"], "default": "body" }
```

(Secondary repeats the identical five settings with a `_secondary` suffix.) Every primary-styled button anywhere in the theme — in a section, a block, the cart, the product form — reads from these same settings, which is exactly what keeps every "primary" button looking identical no matter which component rendered it. [36.6. Settings-Driven Styling in Depth](/all-about-buttons/settings-driven-styling-in-depth/) covers how these settings actually reach a button's CSS.

## Text/link: a button that doesn't look like one

```
button-unstyled → styled like a plain inline link, not a filled or outlined rectangle
```

The lowest-emphasis tier intentionally doesn't look like a button at all — underlined or colored text, no background, no border. This matters for visual hierarchy: a page with one primary button, one secondary button, and three "Learn more" links reads clearly at a glance as "here's the one thing to do, here's an alternative, and here's some further reading" — the same hierarchy a page of five identical filled buttons can't communicate no matter how it's arranged.

## Custom: the deliberate escape hatch, not a fifth default style

```json
{
  "type": "color", "id": "custom_button_background", "alpha": true,
  "visible_if": "{{ block.settings.style_class == 'button-custom' }}"
},
{
  "type": "color", "id": "custom_button_text", "alpha": true,
  "visible_if": "{{ block.settings.style_class == 'button-custom' }}"
}
```

Every block-level button can be switched to Custom, which reveals its own background/text/border color settings — a one-off override for the specific case where neither Primary nor Secondary fits (a single promotional banner that needs an unusual, campaign-specific color, say). The `visible_if` pattern here is what [6. Schema & Settings](/schema-and-settings/) calls conditional settings — these three color settings don't exist, to the merchant, until Custom is actually selected.

:::tip[Custom is an escape hatch, not a style to reach for by default]
A theme where every third button is set to Custom has, in effect, abandoned the point of having a small set of named variants at all — it's back to unlimited, uncoordinated styles, just spread across many blocks' settings instead of many sections' CSS. Reserve it for the genuine one-off; reach for Primary or Secondary otherwise.
:::

## Key takeaways

- A small, named set of variants (primary/secondary/text/custom) is more useful than unlimited per-section styles — the same lesson text presets teach, applied to buttons.
- Primary and secondary are theme-wide settings, not per-component choices — every primary button anywhere in the theme reads from the same settings and looks identical as a result.
- A text/link-styled button is a real, lower-emphasis tier, not a lesser version of the others — it communicates visual hierarchy on a page with more than one action.
- A "Custom" variant is a deliberate, visible escape hatch (revealed via `visible_if` only when selected) — useful for genuine one-offs, but overusing it defeats the purpose of having variants at all.

## Further reading

- [`blocks/button.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/blocks/button.liquid)
- [18.6. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — the same small-named-set idea, for text styles
- [36.6. Settings-Driven Styling in Depth](/all-about-buttons/settings-driven-styling-in-depth/)
