---
title: Theme Settings Fundamentals
description: "Theme settings vs. a section's or block's own settings — two genuinely different things that use similar-looking schema."
---

**TL;DR:** "Theme settings" vs. a section's or block's own settings — two genuinely different things that use similar-looking schema.

A theme has exactly two kinds of merchant-configurable setting, and mixing them up is one of the most common sources of confusion for someone new to theme development, because they're defined with the exact same JSON setting-type syntax. This page draws the line between them clearly, before anything else in this chapter.

## Theme settings: one value, shared everywhere

**Theme settings** (sometimes called **global settings**) are configured once, in one place — the theme editor's "Theme settings" panel, separate from any individual page — and that single value applies identically everywhere in the theme, on every page, for every section that reads it.

```json
{
  "type": "font_picker",
  "id": "heading_font",
  "label": "t:labels.heading_font",
  "default": "assistant_n4"
}
```

Defined in `config/settings_schema.json`, read anywhere in any Liquid file with `settings.heading_font`. A merchant sets this exactly once — it's not something they configure separately per page or per section.

## Section settings and block settings: one value per instance

**Section settings** and **block settings** look structurally identical in JSON, but behave completely differently: each one belongs to one specific instance of that section or block, wherever it's been added.

```json
{
  "type": "text",
  "id": "heading",
  "label": "t:labels.heading",
  "default": "Welcome"
}
```

Defined inside a section's own `{% schema %}` block, read as `section.settings.heading` only within that section's own file. If a merchant adds the same section type to three different pages, each of those three instances has its **own**, independently-set value for `heading` — changing one doesn't touch the other two. This per-instance behavior is sometimes referred to as **theme content**, to distinguish it from the single, shared theme settings described above — the same JSON setting types, but a completely different storage and sharing model.

## The test that actually distinguishes them

Ask: *if a merchant changes this value, does it change everywhere this type of section appears, or only in the one place they're currently editing?*

| | Theme settings | Section/block settings |
|---|---|---|
| Where it's configured | The theme editor's global "Theme settings" panel | Inside that specific section/block, in the page editor |
| How many values exist | One, theme-wide | One per instance of that section/block |
| Liquid reference | `settings.your_id` | `section.settings.your_id` / `block.settings.your_id` |
| Defined in | `config/settings_schema.json` | That section or block's own `{% schema %}` |

## A concrete example of the difference

Picture a `heading_font` theme setting and a `heading` text setting on a "Hero banner" section. A merchant:

1. Picks "Heading Font: Playfair Display" once, in Theme settings. Every heading anywhere in the theme — every hero banner, every other section that reads `settings.heading_font` — now renders in that font.
2. Adds a Hero banner section to the homepage and types "Summer Sale" into its Heading field.
3. Adds a *second* Hero banner section to a different page and types "New Arrivals" into its own Heading field.

The font choice from step 1 applies to both hero banners equally. The heading text from steps 2 and 3 are completely independent — "Summer Sale" and "New Arrivals" don't interfere with each other, because each section instance stores its own settings separately.

:::tip[A decision rule for your own settings]
When you're deciding whether a new setting you're adding should be a theme setting or a section/block setting, this is usually the right question: would a merchant ever reasonably want two instances of this section to have *different* values for this setting? If yes, it has to be a section/block setting. If a shared, theme-wide value is always correct, a theme setting avoids making the merchant set the same thing redundantly on every instance.
:::

## Key takeaways

- Theme settings are configured once and shared everywhere (`settings.*`); section/block settings are configured per-instance and don't affect other instances (`section.settings.*`/`block.settings.*`).
- "Theme content" is a term for the second kind — the per-instance values a merchant fills in each time they add a section or block, as distinct from the shared, theme-wide "theme settings."
- Both use the exact same JSON setting-type syntax (`text`, `color`, `font_picker`, and so on) — the difference is entirely about *where* the setting is declared and how its stored value is scoped, not what the setting itself looks like.

## Further reading

- [Global theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/global) (shopify.dev)
- [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) (shopify.dev)
