---
title: Typography Best Practices
description: A practical checklist, distilled from everything else in this chapter.
---

**TL;DR:** A practical checklist, distilled from everything else in this chapter.

This page doesn't introduce new mechanisms — every item below is covered in full somewhere else in this chapter. It exists as a single, scannable checklist to come back to.

## Loading

- **Always pair a font with its load.** Every `font_picker` setting a theme uses needs a matching `font_face` (or custom `@font-face` via `font_url`) output somewhere global. See [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/).
- **Load each font exactly once**, not once per section that happens to use it. Resolving fonts into tokens in a single snippet, as covered in [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), naturally produces this.
- **Set `font-display: swap`** (or build a custom `@font-face` that does) for all but the rarest cases. See [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/).
- **Preload only the one or two fonts visible immediately on page load** — preloading every font a theme uses defeats the purpose.

## Structure

- **Always write a fallback stack**, never a bare font name: `family, fallback_families`, not `family` alone. See [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/).
- **Resolve settings into tokens once**, and have every component read a role token or apply a preset class — never scatter `settings.some_font.family` references, and never reconstruct a preset's properties by hand in a component's own stylesheet. See [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) and the [day-to-day decision tree](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) for exactly which one to reach for.
- **Default to the global tokens**; add a section- or block-scoped font setting only when a component genuinely needs to deviate. See [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/).
- **Offer named presets, not raw controls**, when a merchant needs to choose between typographic treatments — a bounded `select` between tested combinations beats independent font/size/weight settings a merchant could combine into something broken.

## Scale and sizing

- **Use a small, fixed set of sizes** (a type scale) everywhere, rather than letting each section pick its own arbitrary size. See [18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/).
- **Reserve `clamp()` for sizes that actually need to scale** with viewport width (large headings); fixed values are usually fine for body and small text.
- **Limit the number of distinct fonts** a theme uses — two or three font roles, each used consistently, reads as more intentional than five fonts each used once.

## Performance

- **Prefer a variable font** when a design uses several weights of the same family — one file instead of several. See [18.4. Variable Fonts](/all-about-typography/variable-fonts/).
- **Pick a fallback with similar metrics** to the real font, to minimize layout shift during a `font-display: swap` transition.
- **Consider system fonts** for a theme with no specific brand typeface requirement — zero download cost, zero loading delay.

## Internationalization and accessibility

- **Check a display font's actual script coverage** before relying on it broadly for a store that sells in multiple languages or scripts. See [18.15. Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/).
- **Scope a distinctive display font narrowly** (a hero heading, say) and fall back to a broad system stack like `system-ui` for everything else, rather than trying to find one font that covers every script a global store might need.
- **Test with real, translated content**, not just English placeholder text — German and French in particular commonly run 20–35% longer than English, which can break a layout tuned only against English copy.

## Key takeaways

- Nothing on this page is new — it's a single checklist pulling together every rule from the rest of this chapter, meant to be reread before shipping, not studied once.
- The two mistakes worth watching for most: referencing a font without loading it (silent, no error), and scattering raw settings references through CSS instead of resolving them into tokens once.

## Further reading

- Every page in this chapter — this checklist exists to point back to them, not to replace them.
