---
title: Design Tokens & Type Presets
description: Turning a handful of font settings into a reusable, named system the whole theme draws from.
---

**TL;DR:** Turning a handful of font settings into a reusable, named system the whole theme draws from.

## The problem a token system solves

A theme with one `font_picker` setting and a handful of `{{ settings.font.family }}` references scattered through its CSS works fine at a small scale. It stops working well the moment a theme grows past a handful of components: every place that wants "the heading font" has to independently know to write `settings.type_heading_font.family, settings.type_heading_font.fallback_families`, correctly, every time — and if a theme later adds a second heading-style font (for subheadings, say), every one of those scattered references has to be found and updated individually.

A **design token** is a named variable that stands in for a design decision, so every component references the name instead of re-deriving the value itself. [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) showed a real, production example of exactly this pattern for typography; this page generalizes it into something you can build in any theme.

## Step 1: define typography roles, not just fonts

Before writing any code, decide what roles your theme's typography actually needs to fill. Horizon's four — **Body**, **Subheading**, **Heading**, **Accent** — are a reasonable, proven starting point, but the right set depends on the design:

| Role | Used for |
|---|---|
| Body | The default font for paragraphs, product descriptions, most running text |
| Heading | Section titles, product titles, anything acting as a headline |
| Subheading | A secondary heading role, often a lighter or more condensed companion to Heading |
| Accent | A distinct, often more expressive font for a small amount of text meant to stand out (a badge, a kicker label, a pull quote) |

A smaller theme might only need Body and Heading. A theme with a strong editorial design voice might need all four, or even more. The number of roles is a design decision, not a fixed requirement.

## Step 2: one `font_picker` setting per role

```json
{
  "type": "font_picker",
  "id": "type_heading_font",
  "label": "t:labels.heading_font",
  "default": "assistant_n4"
},
{
  "type": "font_picker",
  "id": "type_body_font",
  "label": "t:labels.body_font",
  "default": "assistant_n4"
}
```

Each role gets its own independent `font_picker` setting in `settings_schema.json`, so a merchant can mix fonts across roles (a serif Heading font paired with a sans-serif Body font, say) rather than being locked into one font for the entire theme.

## Step 3: resolve every role into CSS custom properties, once

This is the step that actually makes it a token system, rather than just four separate settings. In one snippet, rendered once near the top of `theme.liquid`, resolve every role's font object into a small, predictable set of CSS custom properties:

```liquid
{% comment %} snippets/typography-tokens.liquid {% endcomment %}
{% style %}
  :root {
    --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
    --font-body-weight: {{ settings.type_body_font.weight }};
    --font-body-style: {{ settings.type_body_font.style }};

    --font-heading-family: {{ settings.type_heading_font.family }}, {{ settings.type_heading_font.fallback_families }};
    --font-heading-weight: {{ settings.type_heading_font.weight }};
    --font-heading-style: {{ settings.type_heading_font.style }};
  }

  {{ settings.type_body_font | font_face }}
  {{ settings.type_heading_font | font_face }}
{% endstyle %}
```

Notice this single snippet does two jobs at once: it defines the CSS custom properties (the tokens), and it loads the actual font files (`font_face`) — both only need to happen in exactly one place, ever, no matter how many sections and blocks go on to use these fonts.

## Step 4: every component reads the token, never the setting

```css
.product-card__title {
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
  font-style: var(--font-heading-style);
}
```

From here on, no section or block CSS should reference `settings.type_heading_font` directly — it reads `var(--font-heading-family)` instead. This is the entire payoff: a merchant changing the Heading font setting updates every component that reads `--font-heading-family`, automatically, with zero code changes anywhere else.

:::note[Notice what's missing: a font-size]
A role token resolves `family`, `weight`, and `style` only — never a size. `.product-card__title` above is deliberately incomplete as written; a real product title needs an actual `font-size` and `line-height` from somewhere, and a role token has neither to give it. That's exactly the gap a type preset exists to fill — covered next, and in full on [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/).
:::

## Beyond fonts: type presets, briefly

A **type preset** extends this same idea beyond just which font to use — it bundles font family, weight, size, and line-height together under one name, the same way a "Heading 1" style works in a design tool like Figma:

```css
:root {
  --type-preset-h1-font-family: var(--font-heading-family);
  --type-preset-h1-font-weight: 700;
  --type-preset-h1-font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --type-preset-h1-line-height: 1.1;
}

.h1 {
  font-family: var(--type-preset-h1-font-family);
  font-weight: var(--type-preset-h1-font-weight);
  font-size: var(--type-preset-h1-font-size);
  line-height: var(--type-preset-h1-line-height);
}
```

Notice `--type-preset-h1-font-family` still points at `--font-heading-family` rather than hardcoding a font directly — a preset is a composition of tokens, not a replacement for them. Changing the underlying Heading font setting still cascades through; the preset layer only adds size and line-height as additional, bundled decisions on top.

Building a *complete* preset system — how many presets a theme actually needs, what properties belong in one, whether to hardcode preset values or drive them from per-level merchant settings, and how Shopify's own Horizon theme answers all three at real production scale — is involved enough to deserve its own page: see [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/).

## Key takeaways

- A token is a named variable standing in for a design decision; every component reads the token, never the original setting, so a single change cascades everywhere automatically.
- Define typography by role (Body, Heading, Subheading, Accent, or whatever set a design actually needs), one `font_picker` setting per role, resolved into CSS custom properties exactly once.
- Font-role tokens pay off in almost any theme — they're the foundation a full preset system builds on top of, covered in full on [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/).

## Further reading

- [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) — designing a full preset system, and how Horizon built its own
- [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) — a role token vs. a preset, and when a component reaches for which
- [18.2. Reading Typography from a Figma Design](/all-about-typography/reading-typography-from-a-figma-design/) — turning a client's actual text styles into this chapter's roles, before writing any settings
- [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)
- [Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/) — the same idea, applied to color
