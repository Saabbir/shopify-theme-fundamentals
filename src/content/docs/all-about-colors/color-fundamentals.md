---
title: Color Fundamentals
description: The mental model, vocabulary, and accessibility stakes behind every color-related setting covered in this chapter.
---

**TL;DR:** The mental model, vocabulary, and accessibility stakes behind every color-related setting covered in this chapter — read this one first.

## Color isn't something you write — it's something you let a merchant choose

In ordinary web development, you write `color: #2c6e5c;` in a stylesheet and you're done — the color is baked into the code, and changing it means editing and redeploying that code. A Shopify theme works backwards from that. The actual hex value a shopper sees is chosen by a merchant, in the theme editor, after your theme is already installed on their store — your code never hardcodes it.

```css
/* Ordinary CSS: this color is baked in. Changing it means editing
   and redeploying the stylesheet. */
.price {
  color: #2c6e5c;
}
```

What you write instead is a schema *setting* that tells Shopify "let the merchant pick a color here," and your Liquid and CSS read back whatever they chose:

```json
// Horizon, config/settings_schema.json (theme-wide — global, not tied to
// one section) — the real, complete setting, exactly as Horizon ships it
{
  "type": "color",
  "id": "page_text_color",
  "label": "t:settings.page_text_color",
  "default": "{{ settings.color_palette.foreground }}",
  "info": "t:info.page_text_color_default_info"
}
```

This is the one idea the rest of this chapter assumes you already have: a theme developer's job with color is building the mechanism for choosing, not doing the choosing yourself.

## From a merchant's click to a rendered pixel

It's worth seeing that mechanism end to end, once, with the simplest possible example, before the rest of this chapter builds on it. Take the most common real-world case — a *theme-wide* `color` setting, the kind Horizon itself leans on for most of its own colors (`page_text_color`, `palette_primary_button_background`, and dozens more, all declared once in `config/settings_schema.json`) — and follow one merchant's click all the way to a rendered pixel:

1. A merchant opens the theme editor's own Colors settings and clicks a color swatch for a setting you defined.
2. Shopify stores whatever hex value they picked in `config/settings_data.json`, under `current` — one value, the same on every page, not tied to any single section instance.
3. Your Liquid reads it back with `settings.<id>`, no `section.` or `block.` prefix.
4. It usually gets written once into a CSS custom property on `:root`, high up in the page — `style="--accent: {{ settings.accent_color }};"` — rather than repeated inline on every element that needs it.
5. Your stylesheet reads that property with `var(--accent)`, anywhere in the theme, and the browser renders it.

Steps 3 through 5, as actual code — **a theme setting**, so `settings`, not `section.settings`. A complete, minimal example, schema included, not just the fragment that reads it:

```liquid
{% comment %} layout/theme.liquid, somewhere in <head> {% endcomment %}
<style>
  :root {
    --accent: {{ settings.accent_color }};
  }
</style>
```

```json
// config/settings_schema.json
{
  "name": "t:settings.colors",
  "settings": [
    { "type": "color", "id": "accent_color", "label": "t:labels.accent_color" }
  ]
}
```

```css
.price {
  color: var(--accent);
}
```

The exact same mechanism, scoped to one section instead of the whole theme, looks like this:

```liquid
{% comment %} sections/announcement-bar.liquid {% endcomment %}
<div class="announcement-bar" style="--accent: {{ section.settings.accent_color }};">
  {{ section.settings.message }}
</div>

{% schema %}
{
  "name": "t:sections.announcement_bar.name",
  "settings": [
    { "type": "color", "id": "accent_color", "label": "t:labels.accent_color" },
    { "type": "text", "id": "message", "label": "t:labels.message" }
  ]
}
{% endschema %}
```

Only step 2 and step 3 actually change. A *section* setting's value lives in that page's own JSON template (`templates/index.json`, say) instead of `settings_data.json` — specifically, in that one section instance's own `settings` object, which is exactly why `section.settings.<id>` only ever returns a value for the instance currently rendering; a different page with a different instance of the same section gets its own, independently stored value. And it's read back with `section.settings.<id>` instead of `settings.<id>`. A block setting works identically to the section case, just one level deeper: `block.settings.<id>`, stored inside that block's own entry in the section's settings. [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) covers all three in full, including the concrete test for telling them apart at a glance.

None of this is unique to color — every schema setting follows the same path from editor to rendered page. But color is where most developers meet this pattern for the first time, so it's worth walking through explicitly here rather than assuming it's obvious.

## What a color value actually looks like: hex, at a glance

Whatever a merchant picks, a `color` setting always hands it back to you as a hex string — six (or eight, with transparency) characters after a `#`, like `#2c6e5c`. That's the one format you can count on without converting anything, and most of the time you'll pass it straight through unchanged.

Horizon's own `color_palette` setting (theme-wide — global, `settings.color_palette.<key>`) is a real, concrete example of exactly this shape — two hex strings, nothing fancier:

```json
// Horizon, config/settings_schema.json
"default": {
  "background": "#ffffff",
  "foreground": "#000000"
}
```

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

Most of the examples in this chapter use the theme-wide case, since that's what Horizon itself leans on for most of its own real colors — but everything shown applies identically to a section setting or a block setting too, right down to the exact same `color` type underneath. [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) covers the full distinction between these three, including the concrete test for telling a theme setting from a section/block setting at a glance.

## Why color coordination isn't cosmetic: contrast and accessibility

*Contrast* measures the difference in brightness between two colors placed next to each other — practically, how easy text is to actually read against its background. WCAG, the standard most accessibility requirements point back to, sets minimum contrast ratios: **4.5:1** for normal body text, **3:1** for large text and meaningful UI elements like icon buttons. Fall below that, and real users struggle to read the text — not only people with low vision, but anyone using a phone in bright sunlight or a lower-quality screen.

This is why a bad color pairing isn't just an aesthetic miss. Text a shopper can't comfortably read is a real accessibility failure, and in some jurisdictions a compliance risk for the merchant running the store. Keep that in mind for everything that follows — color coordination exists to prevent this specific, measurable problem, not to enforce good taste.

Liquid can measure this directly, with the `color_contrast` filter — this is the one line of code the rest of this chapter's contrast checks all build on:

```liquid
{{ settings.background_color | color_contrast: settings.text_color }}
{% # => a number, e.g. 7.2 — compare it against 4.5 (normal text) or 3 (large text/UI) %}
```

Both settings here are **theme-wide** (`settings.<id>`) — the same filter works identically on section settings (`section.settings.<id>`) or block settings (`block.settings.<id>`); `color_contrast` only cares about the two hex values, not where they came from. `background_color` and `text_color` are ordinary `color` settings — the schema defining exactly these two IDs is the next example below.

## The problem with standalone settings at scale

```json
{ "type": "color", "id": "background_color", "label": "t:labels.background_color" },
{ "type": "color", "id": "text_color", "label": "t:labels.text_color" },
{ "type": "color", "id": "button_color", "label": "t:labels.button_color" },
{ "type": "color", "id": "button_label_color", "label": "t:labels.button_label_color" }
```

Independent `color` settings break down once several colors need to stay coordinated. Nothing stops a merchant from picking a light background with a light text color on one specific section — four independent settings means four independent chances to accidentally fall below the contrast thresholds above. Multiply that across every section in a theme, and the risk compounds fast.

Two real, current fixes exist. Shopify's current reference theme, Horizon, checks and corrects a merchant's independent choices automatically, live, every time the page renders. Dawn, Shopify's other current reference theme, bundles roles into a single pre-tested "scheme" instead, so a merchant picks one coordinated look rather than assembling colors one at a time. Both are big enough topics — and different enough from each other — that they share one page: [17.2. Color Schemes](/all-about-colors/color-schemes/), Horizon's approach first. Read that next.

## Name the job, not the appearance

`accent_color`, never `green_color`. The reason is simple once you say it out loud: the actual color behind a role will change — a rebrand, a seasonal refresh, a dark-mode remap — but the *role* a color plays stays constant. A setting named `green_color` holding a blue value, after a rebrand, is actively confusing to the next person who opens your schema. A setting named `accent_color` is still accurate no matter what hex value sits behind it.

Horizon's own settings follow this exactly — this one is **theme-wide** (`settings.palette_primary_button_background`), not a section setting:

```json
// Horizon, config/settings_schema.json — named for the job ("primary
// button background"), not a color word
{
  "type": "color",
  "id": "palette_primary_button_background",
  "label": "t:settings.background",
  "default": "{{ settings.color_palette.foreground }}",
  "alpha": true
}
```

This isn't just a style nicety — it's a principle the rest of this chapter assumes without re-explaining. Schemes bundle *roles*. A palette holds raw colors other settings point at *by role*. Tokens, covered in [17.7. Building a Token System](/all-about-colors/building-a-token-system/), are named by purpose instead of appearance as their entire reason for existing. Learning this once, here, means none of those pages have to teach it again.

## Four words you'll see constantly

This chapter leans on four terms that build on each other. Worth having them straight before you hit them in context for the first time:

| Term | What it means | Covered in depth |
|---|---|---|
| Role | The *job* a color plays — background, accent, border — not the literal value | This page |
| Scheme | A bundle of roles, pre-coordinated, picked by a merchant as one unit | [17.2. Color Schemes](/all-about-colors/color-schemes/) |
| Palette | A theme's own small set of raw, named brand colors other settings point back to | [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) |
| Token | A reusable, named CSS value (usually a custom property) standing in for a literal one | [17.7. Building a Token System](/all-about-colors/building-a-token-system/) |

All four, in Horizon's own real theme-wide settings — `palette_primary_button_background` plays the primary-button-background **role**; it defaults from the **palette** (`settings.color_palette.foreground`); Horizon has no **scheme** setting at all (that's Dawn's pattern); and the CSS custom property it ultimately feeds is a **token**:

```json
// Horizon, config/settings_schema.json (theme-wide)
{ "type": "color", "id": "palette_primary_button_background", "default": "{{ settings.color_palette.foreground }}" }
```

```liquid
{% # Horizon, snippets/color-palette.liquid %}
--color-primary-button-background: rgb({{ settings.palette_primary_button_background.rgba }});
```

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
- A color value's real journey: editor swatch → a theme setting's value lands in `settings_data.json`, a section's value lands in that page's own JSON template instead → `settings.<id>` or `section.settings.<id>` in Liquid, depending on which → usually a CSS custom property → rendered page.
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
