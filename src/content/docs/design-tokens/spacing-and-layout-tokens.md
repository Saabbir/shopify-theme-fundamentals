---
title: Spacing & Layout Tokens
description: A consistent spacing scale, and handling mobile separately without breaking the theme editor's live preview.
---

**TL;DR:** A consistent spacing scale, and handling mobile separately without breaking the theme editor's live preview.

Spacing is the most common place a theme ends up looking inconsistent — one section with 40px of padding, the next with 37px, not because anyone chose 37 on purpose, but because nothing was reused. A small, consistent spacing scale fixes this the same way a type scale fixes inconsistent font sizes.

## Give every section its own top/bottom spacing — with its own `range` settings

```json
{ "type": "range", "id": "padding_top", "label": "t:labels.padding_top", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 40 },
{ "type": "range", "id": "padding_bottom", "label": "t:labels.padding_bottom", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 40 }
```

This is the `range`-over-`number` preference from [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/), applied specifically to spacing: a bounded `min`/`max` keeps a merchant from accidentally setting 2000px of padding and breaking the page's rhythm.

## Mobile needs its own separate values, not a smaller version of the same ones

Desktop and mobile don't just need smaller padding — they need padding that was chosen for that specific context, and a merchant should be able to set both independently without one affecting the other.

```json
{ "type": "range", "id": "padding_top_mobile", "label": "t:labels.padding_top_mobile", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 20 },
{ "type": "range", "id": "padding_bottom_mobile", "label": "t:labels.padding_bottom_mobile", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 20 }
```

That's four separate settings for one section's vertical spacing — desktop top/bottom, mobile top/bottom — not one "spacing" setting doing double duty.

:::caution[Never decide mobile vs. desktop inside Liquid]
It's tempting to check the device somehow in Liquid (a cookie, a user-agent string) and output a different padding value server-side. Don't — Liquid renders once, when the page loads or when a merchant changes a setting in the editor; it has no way to react to the browser being resized afterward, and critically, it breaks the theme editor's live, resizable device preview, which relies on CSS media queries updating instantly as the preview pane's width changes. Always output both values as CSS custom properties (next page) and let a `@media` query in your stylesheet decide which one applies.
:::

## A reusable spacing scale, beyond just one section's padding

The same idea — a small, fixed set of values instead of arbitrary ones per file — applies to any spacing, not just section padding: gaps between grid items, margins between elements inside a section.

```css
:root {
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
}
```

Reaching for one of these named values, instead of a fresh arbitrary number every time a gap is needed, is what actually produces a theme that feels deliberately, consistently spaced rather than assembled section by section.

## Key takeaways

- Give every section independent desktop and mobile spacing settings (four `range` settings, not one shared value) — see [Turning Settings into CSS Variables](/design-tokens/turning-settings-into-css-variables/) for how to wire the mobile override through CSS instead of Liquid.
- Never decide mobile vs. desktop spacing inside Liquid based on a device check — it can't react to resizing, and it breaks the theme editor's live preview.
- A small, named spacing scale reused everywhere produces a more consistent result than ad hoc pixel values chosen fresh in each file.

## Further reading

- [Modern CSS Units: rem, em, px & Viewport Units](/all-about-css/modern-css-units/) — why this page's settings use `px` while its generated scale uses `rem`, and the desktop/mobile pattern as an alternative to `clamp()`
- [The `range` setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#range) (shopify.dev)
