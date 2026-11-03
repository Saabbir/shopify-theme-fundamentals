---
title: Color Fundamentals
description: The mental model, vocabulary, and accessibility stakes behind every color-related setting covered in this chapter.
---

**TL;DR:** The mental model, vocabulary, and accessibility stakes behind every color-related setting covered in this chapter — read this one first.

## Color isn't something you write — it's something you let a merchant choose

In ordinary web development, you write `color: #2c6e5c;` in a stylesheet and you're done — the color is baked into the code, and changing it means editing and redeploying that code. A Shopify theme works backwards from that. The actual hex value a shopper sees is chosen by a merchant, in the theme editor, after your theme is already installed on their store — your code never hardcodes it.

What you write instead is a schema *setting* that tells Shopify "let the merchant pick a color here," and your Liquid and CSS read back whatever they chose. This is the one idea the rest of this chapter assumes you already have: a theme developer's job with color is building the mechanism for choosing, not doing the choosing yourself.

## From a merchant's click to a rendered pixel

It's worth seeing that mechanism end to end, once, with the simplest possible example, before the rest of this chapter builds on it. Take the most common case — a `color` setting defined on a *section* — and follow one merchant's click all the way to a rendered pixel:

1. A merchant opens the theme editor and clicks a color swatch for a setting you defined on that section.
2. Shopify stores whatever hex value they picked in that page's JSON template (`templates/index.json`, say) — specifically, in that one section instance's own `settings` object.
3. Your Liquid reads it back with `section.settings.<id>`, scoped to that exact instance.
4. It usually gets written straight into an inline CSS custom property: `style="--accent: {{ section.settings.accent_color }};"`.
5. Your stylesheet reads that property with `var(--accent)`, and the browser renders it.

Step 2 is worth being precise about, because it's easy to assume every setting's value lives in one place: it doesn't. A *section* setting's value lives in that page's own template file, which is exactly why `section.settings.<id>` only ever returns a value for the one instance currently rendering — a different page with a different instance of the same section gets its own, independently stored value. A *theme* setting — the kind that's the same everywhere, not tied to one placement — is the other case, and it's stored differently: in `config/settings_data.json`, read with `settings.<id>` instead, no `section.` prefix. [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) covers that distinction — and the concrete test for telling the two apart — in full; this page's examples are all section settings, the one most developers reach for first.

None of this is unique to color — every schema setting follows the same path from editor to rendered page. But color is where most developers meet this pattern for the first time, so it's worth walking through explicitly here rather than assuming it's obvious.

## What a color value actually looks like: hex, at a glance

Whatever a merchant picks, a `color` setting always hands it back to you as a hex string — six (or eight, with transparency) characters after a `#`, like `#2c6e5c`. That's the one format you can count on without converting anything, and most of the time you'll pass it straight through unchanged.

Two other formats describe the exact same colors, just structured differently: RGB (separate red, green, and blue numbers) and HSL (hue, saturation, and lightness). You'll see both later in this chapter, and Shopify can convert between all three with filters — the full treatment, including why you'd ever reach for one over another, is in [17.4. Color Formats & Conversions](/all-about-colors/color-formats-and-conversions/). For now, just know hex is the default you'll meet first.

## A single, independent choice: the `color` setting

```json
{ "type": "color", "id": "accent_color", "label": "t:labels.accent_color" }
```

A `color` setting gives a merchant a color picker in the theme editor and returns a plain hex string. This is the right choice for one specific, independent color decision — an accent color on a button, say — where nothing else needs to stay visually coordinated with it.

The JSON above is identical no matter *where* you declare it — the `color` type itself doesn't know or care whether it's a theme setting, a section setting, or a block setting. What changes is where it's defined and how you read it back:

| Declared in | Shared across | Read in Liquid as |
|---|---|---|
| `config/settings_schema.json` | Every page, every section — one value, theme-wide | `settings.accent_color` |
| A section's own `{% schema %}` | Just that one section instance | `section.settings.accent_color` |
| A block's own `{% schema %}` | Just that one block instance | `block.settings.accent_color` |

Most of the examples in this chapter use the section case, since it's the one most developers reach for first — but a block picking its own icon color, or a theme-wide setting controlling one color everywhere, both use this exact same `color` type underneath. [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) covers the full distinction between these three, including the concrete test for telling a theme setting from a section/block setting at a glance.

## Why color coordination isn't cosmetic: contrast and accessibility

*Contrast* measures the difference in brightness between two colors placed next to each other — practically, how easy text is to actually read against its background. WCAG, the standard most accessibility requirements point back to, sets minimum contrast ratios: **4.5:1** for normal body text, **3:1** for large text and meaningful UI elements like icon buttons. Fall below that, and real users struggle to read the text — not only people with low vision, but anyone using a phone in bright sunlight or a lower-quality screen.

This is why a bad color pairing isn't just an aesthetic miss. Text a shopper can't comfortably read is a real accessibility failure, and in some jurisdictions a compliance risk for the merchant running the store. Keep that in mind for everything that follows — color coordination exists to prevent this specific, measurable problem, not to enforce good taste.

## The problem with standalone settings at scale

```json
{ "type": "color", "id": "background_color", "label": "t:labels.background_color" },
{ "type": "color", "id": "text_color", "label": "t:labels.text_color" },
{ "type": "color", "id": "button_color", "label": "t:labels.button_color" },
{ "type": "color", "id": "button_label_color", "label": "t:labels.button_label_color" }
```

Independent `color` settings break down once several colors need to stay coordinated. Nothing stops a merchant from picking a light background with a light text color on one specific section — four independent settings means four independent chances to accidentally fall below the contrast thresholds above. Multiply that across every section in a theme, and the risk compounds fast.

Shopify's fix is `color_scheme_group`: bundling several color roles into a single named "scheme," so a merchant picks one pre-coordinated look instead of assembling colors one at a time. It's a big enough topic — `definition`, `role`, gradients, and how a section actually consumes a scheme — that it has its own page: [17.2. Color Schemes](/all-about-colors/color-schemes/). Read that next.

## Name the job, not the appearance

`accent_color`, never `green_color`. The reason is simple once you say it out loud: the actual color behind a role will change — a rebrand, a seasonal refresh, a dark-mode remap — but the *role* a color plays stays constant. A setting named `green_color` holding a blue value, after a rebrand, is actively confusing to the next person who opens your schema. A setting named `accent_color` is still accurate no matter what hex value sits behind it.

This isn't just a style nicety — it's a principle the rest of this chapter assumes without re-explaining. Schemes bundle *roles*. A palette holds raw colors other settings point at *by role*. Tokens, covered in [17.7. Building a Token System](/all-about-colors/building-a-token-system/), are named by purpose instead of appearance as their entire reason for existing. Learning this once, here, means none of those pages have to teach it again.

## Four words you'll see constantly

This chapter leans on four terms that build on each other. Worth having them straight before you hit them in context for the first time:

| Term | What it means | Covered in depth |
|---|---|---|
| Role | The *job* a color plays — background, accent, border — not the literal value | This page |
| Scheme | A bundle of roles, pre-coordinated, picked by a merchant as one unit | [17.2. Color Schemes](/all-about-colors/color-schemes/) |
| Palette | A theme's own small set of raw, named brand colors other settings point back to | [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) |
| Token | A reusable, named CSS value (usually a custom property) standing in for a literal one | [17.7. Building a Token System](/all-about-colors/building-a-token-system/) |

## Built-in reference

**Setting types used on this page**

| Type | Used for |
|---|---|
| `color` | A single, independent color picker |

**Liquid object properties**

| Property | Returns | Notes |
|---|---|---|
| `settings.<id>` | Hex color string | Reads a `color` setting declared as a theme setting |
| `section.settings.<id>` | Hex color string | Reads a `color` setting declared in a section's own schema |
| `block.settings.<id>` | Hex color string | Reads a `color` setting declared in a block's own schema |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| `color` setting `id` | snake_case, name the role the color plays, not its appearance | `accent_color`, `button_label_color` — not `green_color` |

## Key takeaways

- A Shopify theme never hardcodes a merchant-facing color — it defines a *setting* that lets the merchant choose, then reads back whatever they picked.
- A color value's real journey: editor swatch → a section's value lands in that page's own JSON template, a theme setting's value lands in `settings_data.json` → `section.settings.<id>` or `settings.<id>` in Liquid, depending on which → usually a CSS custom property → rendered page.
- The same `color` setting JSON works identically as a theme setting, a section setting, or a block setting — only where you declare it and how you read it back changes (`settings.<id>`, `section.settings.<id>`, `block.settings.<id>`).
- A `color` setting always returns hex; RGB and HSL describe the same colors differently, and exist for cases hex alone can't handle cleanly — full depth in [17.4](/all-about-colors/color-formats-and-conversions/).
- Contrast is a measurable accessibility requirement (4.5:1 normal text, 3:1 large text/UI, per WCAG), not a matter of taste — that's the real stakes behind everything else in this chapter.
- Several independent `color` settings on one section multiply the number of ways a merchant can accidentally produce a pairing that fails contrast.
- Name a color setting after the job it does, not its current appearance — the value behind a role changes; the role doesn't.
- Role, scheme, palette, and token are this chapter's four recurring terms, each building on the last.

## Further reading

- [Input settings: `color`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color) (shopify.dev)
- [WCAG 2 contrast minimum (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [17.2. Color Schemes](/all-about-colors/color-schemes/)
