---
title: How Shopify's Horizon Theme Loads Typography
description: A real, current theme's typography system, read directly from its source.
---

**TL;DR:** A real, current theme's typography system, read directly from its source.

Everything so far has been the general mechanism. This page looks at one real, current example of that mechanism in production: **Horizon**, the theme Shopify ships as its current flagship reference theme. Reading a real theme's actual approach is worth doing once you understand the pieces individually — it shows how they fit together in practice, under real constraints.

:::note[Source code, not a tutorial]
Everything on this page is drawn directly from Horizon's public source code and Shopify's own documentation. Themes get updated; treat the specific variable names below as accurate as of when this was written, and check [Horizon's repository](https://github.com/Shopify/horizon) directly if something looks different in a theme you're working with.
:::

## Four font roles, not one

Horizon doesn't offer a single "theme font" setting. Its theme settings define four separate `font_picker` settings, each covering a different typographic role: **Body**, **Subheading**, **Heading**, and **Accent**. A merchant picks a font for each role independently — the same four-role split this chapter's [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) page generalizes into a reusable pattern for any theme.

## Turning four settings into CSS custom properties, once

Rather than referencing `settings.type_heading_font.family` repeatedly throughout dozens of section and block files, Horizon resolves each font setting into a small set of CSS custom properties, in exactly one file: `snippets/theme-styles-variables.liquid`. The relevant lines look like this:

```liquid
--font-body--family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
--font-body--style: {{ settings.type_body_font.style }};
--font-body--weight: {{ settings.type_body_font.weight }};

--font-subheading--family: {{ settings.type_subheading_font.family }}, {{ settings.type_subheading_font.fallback_families }};
--font-subheading--style: {{ settings.type_subheading_font.style }};
--font-subheading--weight: {{ settings.type_subheading_font.weight }};

--font-heading--family: {{ settings.type_heading_font.family }}, {{ settings.type_heading_font.fallback_families }};
--font-heading--style: {{ settings.type_heading_font.style }};
--font-heading--weight: {{ settings.type_heading_font.weight }};

--font-accent--family: {{ settings.type_accent_font.family }}, {{ settings.type_accent_font.fallback_families }};
--font-accent--style: {{ settings.type_accent_font.style }};
--font-accent--weight: {{ settings.type_accent_font.weight }};
```

This single snippet is rendered once, early, and every one of Horizon's hundreds of section and block files then reads from these twelve variables instead of touching `settings.type_*_font` directly. This is precisely the "resolve once, consume everywhere" token pattern from [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — Horizon is a real, shipping example of that exact idea, not a theoretical one.

## Consuming the tokens in a component

A component that wants heading typography just reads the token — it never re-derives anything from the original settings:

```css
.product-title {
  font-family: var(--font-heading--family);
  font-style: var(--font-heading--style);
  font-weight: var(--font-heading--weight);
}
```

Any component in the theme that wants "heading" typography uses the same three variables, which is what keeps every heading-styled element in the theme consistent automatically — a merchant changing the Heading font setting once, in the theme editor, updates every single one of them, with nothing further to touch.

## The practical upshot for overriding or debugging

A real, commonly-reported question from people customizing Horizon is "why isn't my custom font showing up everywhere?" The answer, consistently, traces back to this same token system: Horizon's component CSS is scoped fairly specifically (many elements carry their own block-specific classes), so overriding a font by targeting individual selectors one at a time is a losing battle — there are simply too many of them, and new ones appear as the theme is updated.

The reliable fix is to override at the token level, not the component level:

```css
body {
  --font-heading--family: 'Custom Font', sans-serif;
}
```

Because every heading-styled component already reads from `--font-heading--family` rather than hardcoding a font, redefining that one custom property cascades to every one of them automatically — which is the entire point of resolving settings into tokens in the first place, and the same lesson [Building a Token System](/all-about-colors/building-a-token-system/) teaches for color: change the token, not every place that reads it.

## Key takeaways

- Horizon defines four independent font roles (Body, Subheading, Heading, Accent) rather than one single theme font.
- All four are resolved into CSS custom properties exactly once, in `snippets/theme-styles-variables.liquid`, rather than read from `settings.*` repeatedly throughout the theme.
- Every component that needs typography reads from those tokens, not from the original settings directly — which is what makes a single settings change (or a single CSS override, like a custom font app) cascade reliably everywhere, instead of requiring dozens of individual selector overrides.

## Further reading

- [Horizon theme source (GitHub)](https://github.com/Shopify/horizon)
- [`snippets/theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
