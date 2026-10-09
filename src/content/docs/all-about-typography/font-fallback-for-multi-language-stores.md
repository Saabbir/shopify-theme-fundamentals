---
title: Font Fallback for Multi-Language Stores
description: What happens when a merchant's chosen font doesn't support every character a shopper's language needs.
---

**TL;DR:** What happens when a merchant's chosen font doesn't support every character a shopper's language needs.

## The problem `fallback_families` alone doesn't fully solve

`fallback_families` — the ready-made list of substitute fonts covered in [Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) — handles the case where a font is still loading or fails to load at all. It doesn't handle a different, easy-to-miss problem: a font that loads perfectly fine, but simply doesn't include glyphs (character shapes) for every language a store sells in. A Latin-script display font, however beautifully it renders English headings, usually has no glyphs at all for Japanese, Arabic, or Cyrillic text — and a browser's behavior when a font is missing a specific character is to silently substitute a different font for just that character, which can look visually jarring mid-sentence.

## Where this actually bites in a Shopify theme

This matters most for any text a shopper controls or a translator provides, not just a merchant's own copy: a customer's name on an order confirmation, a translated storefront in a language the chosen display font wasn't designed for, or a product title entered in a different script. [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) already covered translating a theme's own interface text — this is the follow-on concern once that translated text actually needs to render in a specific font.

## Checking whether a font actually covers what you need

Before shipping a decorative or display font as a theme default, it's worth checking which scripts it actually covers — most font foundries' own specimen pages list supported languages or scripts, and tools like Google Fonts' own site show a glyph-coverage view for each font. If a theme is meant to support markets using non-Latin scripts, a display font with no coverage for those scripts needs an explicit fallback plan, not just whatever the browser happens to substitute automatically.

## A practical strategy: scope the display font narrowly

Rather than trying to find one font that covers every script a global store might need, the more common real-world approach is scoping a distinctive display font to just the Latin-script content it was chosen for (a hero heading in English, say), and falling back to a broad, well-covered system font stack for everything else:

```css
--font-display-family: 'Chosen Display Font', sans-serif;
--font-body-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
```

`system-ui` and its related fallbacks resolve to whatever font the shopper's own operating system already uses as its default UI font — which is virtually guaranteed to already cover whatever script that operating system is configured for, since it's the same font the OS uses for its own menus and system text.

## Key takeaways

- A font can load successfully and still lack glyphs for a specific language's script — a separate problem from the font simply failing to load.
- This matters most for shopper- or translator-provided text (names, translated storefronts, non-Latin product titles), not just a merchant's own English copy.
- Check a display font's actual script coverage before relying on it broadly, and consider scoping a distinctive display font narrowly, falling back to a broad system font stack (like `system-ui`) for everything else.

## Further reading

- [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/)
- [`system-ui` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#syntax)
