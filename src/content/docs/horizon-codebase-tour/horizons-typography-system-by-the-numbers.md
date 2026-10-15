---
title: Horizon's Typography System by the Numbers
description: The real settings count, variant count, token count, and preset count behind Horizon's typography — verified against its current source, not estimated.
---

**TL;DR:** The real settings count, variant count, token count, and preset count behind Horizon's typography — verified against its current source, not estimated.

[How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) and [27.3. How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) cover the *mechanism* — how fonts load, how presets get built. This page answers a different, more literal question: exactly how many settings, variants, tokens, and presets does that mechanism actually produce? Every number below was counted directly from Horizon's real `config/settings_schema.json` and `snippets/theme-styles-variables.liquid`, fetched fresh for this page — not estimated from the simplified examples shown elsewhere in this chapter.

:::note[Numbers, not just mechanism]
It's entirely possible to understand how Horizon's typography system works — settings resolve to tokens, tokens resolve to presets — without ever knowing it adds up to 36 settings and roughly 130 font-related custom properties. Both matter: the mechanism tells you *how* to extend it; the count tells you *how much is already there* before you add anything.
:::

## Font-role settings: 4

```
type_body_font        default: work_sans_n4
type_subheading_font  default: work_sans_n5
type_heading_font     default: anonymous_pro_n4
type_accent_font      default: anonymous_pro_n4
```

Already covered in full elsewhere in this chapter — four `font_picker` settings, one per role.

## Per-level typography settings: 32 more — 36 total

This is the part that isn't covered elsewhere on this site. Beyond the four font-role settings, Horizon's Typography settings category defines **32 more settings**, one small cluster per text level:

| Level | Settings | Count |
|---|---|---|
| `paragraph` | `type_size_paragraph`, `type_line_height_paragraph` | 2 |
| `h1` through `h6` | `type_font_h{n}`, `type_size_h{n}`, `type_line_height_h{n}`, `type_letter_spacing_h{n}`, `type_case_h{n}` | 5 × 6 = 30 |

**36 settings total** in the Typography category (4 + 2 + 30). `paragraph` only gets a size and a line-height — no separate font, letter-spacing, or case setting for it, which is why the preset token breakdown below treats it slightly differently from every heading level.

:::note[h1 and h2 can't be set to every font role — h3 through h6 can]
`type_font_h1` and `type_font_h2` each only offer two options: Heading or Accent. `type_font_h3` through `type_font_h6` offer all four: Heading, Accent, Subheading, or Body. A real, deliberate constraint, not an oversight — the two largest headings are restricted to the two roles meant for display-sized text.
:::

A separate, single `type_preset` setting also exists under the theme's Input fields category — it lets a merchant choose which of Horizon's 7 presets an input's own label text uses. It isn't part of the typography system itself, but its option list (blank/default, `paragraph`, `h1`–`h6`) is a second, independent confirmation that Horizon defines exactly seven presets, not a rounder or different number.

## Font variants loaded: up to 16

Already covered in [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) — 4 roles × 4 variants each (normal, bold, italic, bold-italic), deduplicated so a font picked for two roles isn't downloaded twice.

## Role tokens: 12

```
--font-body--family       --font-subheading--family       --font-heading--family       --font-accent--family
--font-body--style        --font-subheading--style        --font-heading--style        --font-accent--style
--font-body--weight       --font-subheading--weight       --font-heading--weight       --font-accent--weight
```

Already covered elsewhere in this chapter — 4 roles × 3 properties each.

## Presets: 7 — and they're not all built the same

**Paragraph, h1, h2, h3, h4, h5, h6 — seven presets total.** What isn't covered elsewhere: a heading preset and the paragraph preset don't carry the same number of properties.

| Preset | Properties | Count |
|---|---|---|
| `paragraph` | weight, size, family, style, case, line-height | 6 |
| `h1` through `h6` | weight, **letter-spacing**, size, family, style, case, line-height | 7 × 6 = 42 |

**48 preset tokens total.** The paragraph preset is missing a letter-spacing property entirely — a direct consequence of `type_letter_spacing_paragraph` not existing as a setting (confirmed above). A component reading `--font-paragraph--letter-spacing` would get nothing; there's no fallback built in, so that's worth knowing before assuming every preset is shaped identically.

## The supporting scales presets are built from

Presets don't hold raw values directly — most of their properties are `var()` references into smaller, shared scales defined once and reused across every preset:

| Scale | Shape | Count |
|---|---|---|
| Letter-spacing | `display`/`heading`/`body` × tight/normal/loose, plus one standalone `--letter-spacing-sm` | 9 + 1 = 10 |
| Line-height | Same shape — `display`/`heading`/`body` × tight/normal/loose, plus one base `--line-height` | 9 + 1 = 10 |
| Max-width (measure) | `body` (normal/narrow), `heading` (normal/narrow), `display` (normal/narrow/tight) | 2 + 2 + 3 = 7 |
| Font-size | 7 preset-driven (`--font-size--paragraph` through `--font-size--h6`, one per level) + 12 hardcoded utility sizes (`3xs` through `6xl`) | 7 + 12 = 19 |

None of these are "font settings" a merchant edits directly — they're infrastructure a preset points at. Changing `type_letter_spacing_h2` from Normal to Tight doesn't write a new value; it just points `--font-h2--letter-spacing` at a different one of the three already-defined `--letter-spacing--heading-*` tokens.

## Font tokens that live outside the preset system entirely

A handful of components get their own dedicated font tokens, built from the 4 role tokens but never routed through a preset at all:

| Component | Tokens | Count |
|---|---|---|
| Menu | `--menu-font-{sm,md,xl,2xl}--size` and `--line-height` | 4 × 2 = 8 |
| Buttons | `--button-font-family-{primary,secondary}`, `--button-text-case-{primary,secondary}` | 4 |
| Cart | `--cart-{primary,secondary}-font-{family,style,weight}` | 2 × 3 = 6 |

`--cart-secondary-font-family` is a good example of why these exist separately: it resolves to `var(--font-{{ settings.cart_price_font }}--family)` — `cart_price_font` is its own merchant setting (not one of the main four roles directly), so the cart needed a token that could point at whichever role got picked, rather than reusing a role token that already means something more specific elsewhere.

## Everything added up

| Category | Count |
|---|---|
| Typography settings (4 font-role + 32 per-level) | 36 |
| Font variants loaded (max, before dedup) | 16 |
| Role tokens | 12 |
| Presets | 7 |
| Preset tokens | 48 |
| Supporting scale tokens (letter-spacing, line-height, max-width, font-size) | 46 |
| Component-scoped font tokens (menu, button, cart) | 18 |
| **Total font/typography-related custom properties** | **~130** |

That total is deliberately approximate — it depends on where you draw the line between "a font token" and "a token a font preset happens to reference," and reasonable people could draw that line differently. The individual category counts above are exact; the sum is a rough sense of scale, not a number to quote precisely.

## Key takeaways

- Horizon's Typography settings category has 36 settings, not 4 — the four font-role pickers are the most visible, but 32 more settings control size, line-height, letter-spacing, case, and font-role-per-level for `paragraph` and `h1`–`h6`.
- `h1` and `h2` can only be set to the Heading or Accent font role; `h3`–`h6` can be set to any of the four roles.
- There are exactly 7 presets (`paragraph`, `h1`–`h6`), confirmed two ways: the source's own `type_presets` array, and the independent `type_preset` input-field setting that offers the same seven as options.
- The paragraph preset has 6 properties; every heading preset has 7 — paragraph has no letter-spacing property at all, because no `type_letter_spacing_paragraph` setting exists to drive one.
- Presets don't hold raw values — they're built from smaller shared scales (letter-spacing, line-height, max-width, font-size), each defined once and referenced by every preset that needs it.
- A handful of components (menu, buttons, cart) get their own font tokens outside the preset system, built from the role tokens but never routed through a preset.

## Further reading

- [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)
- [27.3. How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/)
- [18.14. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/)
- [`config/settings_schema.json` (GitHub)](https://github.com/Shopify/horizon/blob/main/config/settings_schema.json)
- [`snippets/theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
