---
title: Type Presets & Building a Complete Type System
description: Bundling family, size, weight, and spacing into named presets, the real decisions behind a theme-wide type system, and how to use it properly in sections, blocks, and CSS.
---

**TL;DR:** Bundling family, size, weight, and spacing into named presets, the real decisions behind a theme-wide type system, and how to use it properly in sections, blocks, and CSS.

[Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) built the token layer: one CSS custom property per font-role property (`--font-heading-family`, `--font-heading-weight`, and so on). A **type preset** builds on top of that layer — it's where "the heading font" turns into "what an H1 actually looks like, everywhere, every time." This page covers three things in order: how to design a complete preset system from scratch, how Shopify's own Horizon theme actually built one, and how to wire a preset into a real section, block, or stylesheet without breaking the system you just built.

## What a type preset actually is

A type preset bundles several typographic decisions under one name, the same way a "Heading 1" style works in a design tool like Figma or a word processor:

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

The rule that makes this a *preset system* rather than just four more variables: `--type-preset-h1-font-family` points at `--font-heading-family`, the role token, instead of hardcoding a font name directly. A preset composes role tokens; it never re-derives a font choice from scratch. Change the Heading font setting once, and every preset built on top of `--font-heading-family` updates with it — H1 included.

## Designing a complete type system: the real decisions

"Add a preset for each heading level" sounds simple until you're actually the one deciding how many presets to define, what goes in each one, and whether a merchant gets to touch any of it. Four decisions cover almost every real case.

### Decision 1: how many presets does this theme actually need?

A small theme might need as few as three: `body`, `heading`, and `display` (one large, standalone treatment for a hero or a big promotional banner). A theme built for content-heavy, editorial-style pages typically needs one per semantic heading level plus body text — `paragraph`, `h1` through `h6` — so that every heading level has a defined, consistent look regardless of which section happens to render it. There's no universally correct number; the number of presets should match the number of *distinct, recurring text treatments* the actual designs use, not an arbitrary round number picked in advance. If two "presets" would end up with identical values, that's a sign you only need one.

### Decision 2: what properties belong in a preset?

A preset should bundle every property that's part of *that treatment's identity*, and nothing that varies independently of it:

- **Always include:** `font-family`, `font-weight`, `font-size`, `line-height` — the four properties that define "what this text looks like" at the most basic level.
- **Usually include:** `letter-spacing` and `text-transform`/case — per [Typography Fundamentals](/all-about-typography/typography-fundamentals/#letter-spacing-and-text-transform-smaller-often-forgotten-levers), these round out a complete typographic treatment and are exactly the kind of property that causes visible inconsistency if left as one-off inline styles instead of part of the named preset.
- **Leave out:** `color` and `margin`/`padding`. Color belongs to the color token system (see [Building a Token System](/all-about-colors/building-a-token-system/)), not typography, and spacing around an element is almost always contextual to where that element sits on a page, not an inherent property of its text style. Bundling either into a type preset makes the preset less reusable — a heading that needs a different color in one section shouldn't need an entirely different preset just to get it.

### Decision 3: fixed values, or merchant-configurable per-level settings?

This is the decision that most determines how much work a preset system is to build, and it's worth choosing deliberately rather than by accident:

- **Fixed values, hardcoded in one snippet.** The simplest approach: every preset's properties are plain values written directly into the CSS, with no merchant-facing setting at all. A merchant gets a consistent, designer-controlled type system with zero chance of breaking it, at the cost of zero flexibility — if they want a bigger H2, that requires a code change.
- **Per-level settings feeding each preset.** The more flexible approach: expose a setting per property per level (a size for H1, a size for H2, and so on), and have the preset read from `settings.*` instead of a hardcoded value. This is real additional surface area — a theme with six heading levels and five properties each is thirty settings, not three — but it lets a merchant genuinely tune the type system from the theme editor without touching code. [Horizon's real system](#case-study-how-horizon-built-its-type-system), covered below, takes exactly this approach, and is a useful reference point for how far it can reasonably scale.

Neither is "more correct." A theme sold once to a single client with no further merchant-facing configuration can reasonably hardcode every preset value. A theme distributed through the Theme Store, used by thousands of independent merchants with different brands, needs the per-level settings approach — a one-size-fits-all hardcoded H1 size won't suit every merchant's content.

### Decision 4: shared scales, not per-preset raw values

Once a system has more than two or three presets, a specific trap appears: five different presets each defining their own `line-height: 1.3` independently means changing "slightly looser line-height for headings" requires editing five separate places instead of one. The fix is an intermediate layer — a small set of **named, shared scales** that presets point at, rather than values presets own directly:

```css
:root {
  /* Shared scales, defined once */
  --line-height-tight: 1.1;
  --line-height-normal: 1.3;
  --line-height-loose: 1.6;

  /* Presets reference the scale, rather than a raw number */
  --type-preset-h1-line-height: var(--line-height-tight);
  --type-preset-h2-line-height: var(--line-height-tight);
  --type-preset-paragraph-line-height: var(--line-height-normal);
}
```

This is the same primitive/semantic/component tiering [Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/) teaches for color, applied to typography: a shared scale is the primitive layer, and a preset is the semantic layer built from it. Adjusting "tight" once updates every preset that points at it, instead of requiring an edit everywhere `1.1` happens to appear.

## Case study: how Horizon built its type system

Horizon — Shopify's current flagship reference theme — takes the per-level-settings, shared-scales approach from Decisions 3 and 4 above, built at real production scale. The short version, verified directly against its current source:

- **7 presets** — `paragraph`, plus `h1` through `h6`. Confirmed two separate ways in the source: the file's own `type_presets` array, and an independent `type_preset` setting (used for input-field labels elsewhere in the theme) that offers the exact same seven as its option list.
- **36 settings drive them** — 4 font-role settings (`type_body_font`, and so on) plus 32 more: a size and line-height for `paragraph`, and a font, size, line-height, letter-spacing, and case for each of `h1`–`h6`. `h1` and `h2` can only be set to the Heading or Accent font role; `h3`–`h6` can be set to any of the four roles — a deliberate constraint keeping the two largest headings restricted to roles meant for display-sized text.
- **Each heading preset carries 7 properties** (weight, letter-spacing, size, family, style, case, line-height); the `paragraph` preset carries only 6 — it has no letter-spacing property at all, because no corresponding setting exists to drive one.
- **Every preset is built from shared scales, not raw values** — dedicated letter-spacing and line-height scales (`display`/`heading`/`body`, each with tight/normal/loose variants), a max-width (measure) scale, and a computed fluid font-size per level. Changing a per-level setting from Normal to Tight doesn't write a new number; it just points that preset's token at a different, already-defined scale value.
- **Font sizes are computed, not hand-picked `clamp()` values.** Each size's fluid minimum is derived from the next-smaller size in the scale, and sizes below a 48px cutoff get a plain fixed value instead of `clamp()` — the same "reserve fluid scaling for what needs it" rule from [Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/), applied programmatically rather than picked by hand per size.

This is a direct, real-world illustration of why Decision 3 matters: Horizon chose the more flexible, higher-effort path because it ships to thousands of independent merchants who each need to tune their own type system without a developer's help — the 32 extra settings are the cost of that flexibility, paid once, by Shopify's own team, rather than by every merchant individually.

For the full, source-quoted detail behind every number above — the actual Liquid that builds the scales, the exact `type_presets` loop, and every supporting token Horizon defines — see [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) and [Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/), both part of the [Horizon Theme Codebase Tour](/horizon-codebase-tour/) chapter.

## Using a preset in a section or block setting

Once presets exist, the most common way a section or block actually uses one is a bounded `select` setting that chooses between them — never a free-form font/size control, for the same reason [Spacing settings](/design-tokens/spacing-and-layout-tokens/) and [color schemes](/design-tokens/color-settings-and-color-schemes/) stay bounded, named choices rather than unbounded ones:

```json
{
  "type": "select",
  "id": "heading_style",
  "label": "t:labels.heading_style",
  "options": [
    { "value": "h1", "label": "t:options.display" },
    { "value": "h2", "label": "t:options.large" },
    { "value": "h3", "label": "t:options.standard" }
  ],
  "default": "h2"
}
```

```liquid
{% liquid
  assign heading_style = section.settings.heading_style
%}
<h2 class="section-heading section-heading--{{ heading_style }}">{{ section.settings.heading }}</h2>

{% stylesheet %}
  .section-heading--h1 {
    font-family: var(--type-preset-h1-font-family);
    font-weight: var(--type-preset-h1-font-weight);
    font-size: var(--type-preset-h1-font-size);
    line-height: var(--type-preset-h1-line-height);
  }

  .section-heading--h2 {
    font-family: var(--type-preset-h2-font-family);
    font-weight: var(--type-preset-h2-font-weight);
    font-size: var(--type-preset-h2-font-size);
    line-height: var(--type-preset-h2-line-height);
  }

  .section-heading--h3 {
    font-family: var(--type-preset-h3-font-family);
    font-weight: var(--type-preset-h3-font-weight);
    font-size: var(--type-preset-h3-font-size);
    line-height: var(--type-preset-h3-line-height);
  }
{% endstylesheet %}
```

Notice the `<h2>` tag and the `heading_style` value are independent — a merchant can render visually large "Display" typography on an element that's still semantically an `<h2>` for document-outline purposes. The setting controls *appearance*, not the HTML tag; keep those two decisions separate, since picking the heading tag should follow the page's actual document structure (see [Typography Fundamentals](/all-about-typography/typography-fundamentals/)), not whichever preset happens to look right.

## Using a preset directly in CSS, with no setting at all

Most components shouldn't expose a preset choice as a setting — they should simply commit to one preset, the same way a product card title is "always H3-styled" regardless of merchant input:

```css
.product-card__title {
  font-family: var(--type-preset-h3-font-family);
  font-weight: var(--type-preset-h3-font-weight);
  font-size: var(--type-preset-h3-font-size);
  line-height: var(--type-preset-h3-line-height);
}
```

This is the right default for the vast majority of components. Reserve the `select`-setting pattern above for the specific cases where a section genuinely has more than one plausible typographic treatment and a merchant should be the one choosing between them — adding a setting "just in case" produces a theme editor cluttered with choices that don't meaningfully change anything.

## Overriding one property of a preset, locally, without breaking the system

Occasionally one specific section wants a preset's typography with one property tweaked — a hero that wants the H1 preset, but noticeably larger, only in that one section. The right fix is a scoped CSS custom property override, not a new preset and not an inline style:

```css
.hero {
  --type-preset-h1-font-size: clamp(2.5rem, 2rem + 3vw, 4.5rem);
}

.hero__heading {
  font-family: var(--type-preset-h1-font-family);
  font-weight: var(--type-preset-h1-font-weight);
  font-size: var(--type-preset-h1-font-size);
  line-height: var(--type-preset-h1-line-height);
}
```

Because the override is scoped to `.hero`, every other element reading `--type-preset-h1-font-size` elsewhere on the page is completely unaffected — only descendants of `.hero` see the larger value. This is the same "override at the token level, scoped to where it should apply" technique [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/) shows for overriding a font globally, just scoped to one section instead of the whole page. Resist the temptation to invent a second preset (`h1-large`) for a one-off size tweak like this — a scoped override keeps the preset system itself small and meaningful, reserving a genuinely new preset for a treatment that actually recurs across more than one place.

## Key takeaways

- A type preset bundles family, weight, size, line-height, and usually letter-spacing/case under one name — and it composes role tokens (`--font-heading-family`), never hardcodes a font directly.
- Decide how many presets a theme needs by how many distinct, recurring text treatments its real designs use — not an arbitrary round number. Decide what belongs in each preset by whether a property is part of that treatment's identity (include) or contextual to where it's placed (leave out, like color and margin).
- The biggest design fork: hardcode preset values directly (simple, zero flexibility) versus driving them from per-level merchant settings (more settings to build, real flexibility) — Horizon's real system, with 36 settings behind 7 presets, is a production example of choosing the flexible path.
- Presets should reference small, shared, named scales (a line-height scale, a letter-spacing scale) rather than owning raw values directly, so adjusting "tight" or "loose" once updates every preset built on it.
- Expose a preset choice as a bounded `select` setting only when a section genuinely has more than one plausible treatment and a merchant should pick; most components should just commit to one preset directly in their CSS.
- Override one property of a preset locally with a scoped custom-property override, rather than inventing a near-duplicate preset for a one-off tweak.

## Further reading

- [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — the role-token layer presets are built on top of
- [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) — the real Liquid behind every claim in the case study above
- [Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) — every setting, variant, token, and preset counted directly from source
- [Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) — how to name a preset token so it stays distinct from a role token
- [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) — the broader section/block consumption patterns this page's select-setting example is part of
- [Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/) — the same shared-scale idea, applied to color
- [Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) — the `clamp()` mechanics behind a preset's font-size property
