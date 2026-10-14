---
title: Naming Conventions for Font Settings & Type Tokens
description: A consistent way to name every font_picker setting, CSS variable, and type preset in a theme — plus how Horizon really does it.
---

**TL;DR:** A consistent way to name every `font_picker` setting, CSS variable, and type preset in a theme — plus how Horizon really does it.

Typography tends to accumulate more interrelated settings and tokens than almost any other part of a theme — a handful of font-role settings, a size for every heading level, a weight and style for each, and a preset layer bundling them together. Without a deliberate naming scheme, this grows into an unreadable mess fast: `heading_font`, `font_heading`, `headingFontSetting`, and `h_font` could all plausibly refer to the same thing in a theme that didn't decide on one pattern up front. This page is the single place that pattern is written down, start to finish.

## The three things that need names, and why they're different

By the time a theme has a working typography system, per [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), it has three distinct layers, and each one is named differently on purpose:

| Layer | Example | Lives in |
|---|---|---|
| A merchant-facing **setting** | `type_heading_font` | `settings_schema.json` |
| A **CSS custom property token** | `--font-heading-family` | A snippet rendered once, in `:root` |
| A **type preset** | `--type-preset-h1-font-size` | The same token snippet, composed from the above |

Keeping these visually distinct (not just by name, but by which naming pattern each uses) makes it possible to tell, just by glancing at an identifier, which of the three things you're looking at — without needing to go check `settings_schema.json` to find out.

## Naming a font-role setting

```json
{ "type": "font_picker", "id": "type_heading_font", "label": "t:labels.heading_font" }
```

**Pattern: `{category}_{role}_font`.** The category prefix (`type_`, short for "typography") is what groups every typography setting together in `settings_schema.json` and in `settings.*` editor autocomplete — scrolling or searching for `type_` surfaces every typography setting at once, regardless of how many other, unrelated settings a theme has. This is the same instinct behind `palette_` for color settings, covered in [Color Fundamentals](/all-about-colors/color-fundamentals/), and it's not a convention invented for this site — it's the real pattern Shopify's own Horizon theme uses at production scale, covered in full below.

:::tip[Why not just `heading_font`?]
A setting named `heading_font` reads fine in isolation, but it doesn't signal *which system* it belongs to. A theme can easily end up with an unrelated `heading_color` or `heading_alignment` setting too — none of which share any naming relationship with `heading_font`, even though "everything about how a heading is typeset" is exactly the kind of group a developer six months later would want to find all at once. `type_heading_font` makes that grouping explicit in the name itself.
:::

## Naming a per-role size, weight, or spacing setting

Once a theme exposes more than just "which font" per role — a size, perhaps, or an explicit weight override — a second naming question appears: does the category prefix (`type_`) come before or after the specific property?

```
type_heading_size      (role, then property)
type_size_h1            (property, then role)
```

Both are valid `type_`-prefixed names, and Horizon's own real settings actually use *both* patterns, for a reason worth copying rather than treating as inconsistency:

- **`type_{role}_font`** — role first, because there's exactly one setting per role (four roles, four font settings), and each one is a complete, self-contained choice a merchant makes once.
- **`type_size_{level}`** — property first, because there are *many* instances of the same property (a size for h1, h2, h3, h4, h5, and paragraph text), and grouping by the shared property keeps all of them adjacent and scannable together, rather than scattered among unrelated per-role settings.

**The rule to take away: group by whichever axis has more members.** When a property applies to a handful of named roles (font family, by role), put the role first. When one property repeats across many similar levels (size, by heading level), put the property first, so every related instance of it sorts and reads together.

## Naming a CSS custom property token

```css
--font-heading-family
--font-heading-weight
--font-heading-style
```

This site's own worked examples — [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) and [A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/) — use **single-dash kebab-case** throughout: `--font-{role}-{property}`. It's the simpler of two valid conventions, and the right default for most themes.

:::note[Horizon uses a double dash instead — both are legitimate]
Horizon's real, shipped source (quoted directly on [How Shopify's Horizon Theme Loads Typography](/all-about-typography/how-horizon-loads-typography/)) separates the role from the property with a **double dash** instead: `--font-heading--family`, `--font-heading--weight`. The double dash is a deliberate visual signal, grouping every property of one role under a shared, scannable prefix (`--font-heading--`) while keeping each one individually addressable — it reads slightly more explicitly once a token system has grown large. Neither convention is "more correct"; pick one for a given theme and use it everywhere in that theme. This site defaults its own generic examples to the simpler single-dash form; Horizon's double-dash form is worth adopting directly if a theme's token system is large enough that visually grouping a token family matters.
:::

:::tip[Why `type_` in settings but `--font-` in CSS — shouldn't they match?]
They're solving different problems, so they're allowed to diverge. `type_` exists purely to group every typography **setting** together in `settings_schema.json` — "typography" as a category label, parallel to `palette_` for color settings. `--font-` exists so a developer who already knows CSS's own `font-family`, `font-weight`, and `font-style` properties recognizes a role token on sight, without translating "type" into "oh, this means font" — CSS itself has no such category. Nothing stops a CSS custom property from starting with `--type-` instead; the preset tokens below do exactly that. The difference is what each token maps to: a role token corresponds to one specific CSS property family, so naming it after that family is the more useful signal to whoever's writing the CSS that consumes it. A preset token, covered next, bundles several different properties at once, which is exactly why it reaches for the broader `type` label instead.
:::

## Naming a type preset token

```css
--type-preset-h1-font-family
--type-preset-h1-font-size
--type-preset-h1-line-height
```

**Pattern: `--type-preset-{name}-{property}`.** `type-preset` as a fixed prefix distinguishes a preset token (a bundle of several properties under one named style, covered in full on [Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/)) from a role token (`--font-heading-family`) at a glance — they look related, because they are, but not identical, because a preset composes several role tokens together rather than being one itself.

Name a preset by **what it's for**, not what it looks like:

```
--type-preset-h1-*       (good: named by role in the hierarchy)
--type-preset-display-*  (good: named by purpose — a large, standalone display treatment)
--type-preset-large-*    (avoid: "large" compared to what? breaks the moment a bigger one is added)
```

A preset named `large` has nowhere to go once a theme needs something even larger — `--type-preset-h1`, `--type-preset-display`, or `--type-preset-eyebrow` all describe a *role* the preset plays, which stays meaningful no matter how many other presets get added around it later.

:::note[Horizon actually extends `--font-`, not `--type-preset-`, for its own presets — both are legitimate]
Horizon's real preset tokens (quoted in full on [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/)) are `--font-h2--family`, `--font-h2--size`, `--font-h2--weight`, and so on — it extends the *same* `--font-` family used for role tokens to presets too, rather than introducing a separate prefix. That keeps every typography token, role or preset, under one shared `--font-` umbrella, at the cost of the name alone not telling you whether `h2` refers to a role or a preset (you have to already know Horizon's roles are Body/Subheading/Heading/Accent, not `h1`–`h6`, to tell them apart). This site recommends `--type-preset-{name}-{property}` instead because the distinction is visible in the prefix itself, with no prior knowledge required — but if a theme already follows Horizon's double-dash role tokens, extending that same family to presets, the way Horizon does, is an equally consistent choice. Pick one approach and apply it theme-wide, the same as the single-dash/double-dash decision above.
:::

## Naming a section- or block-scoped font setting

```json
{ "type": "font_picker", "id": "story_font", "label": "t:labels.story_font" }
```

When a specific section genuinely needs its own font setting, independent of the global tokens — the `story_font` example from [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) — it deliberately does **not** get the `type_` prefix. That prefix means "part of the theme-wide typography token system"; a component-scoped setting isn't part of that system, and naming it as if it were would mislead anyone trying to find every theme-wide typography setting by searching for `type_`. Name a scoped setting after the component it belongs to instead (`story_font` for the "Brand Story" section), the same way any other section-specific setting is named.

## A quick reference, all four patterns together

| What it is | Pattern | Example |
|---|---|---|
| Theme-wide font-role setting | `{category}_{role}_font` | `type_heading_font` |
| Theme-wide per-level setting (many instances of one property) | `{category}_{property}_{level}` | `type_size_h1` |
| Role token (CSS custom property) | `--font-{role}-{property}` (or Horizon's `--font-{role}--{property}`) | `--font-heading-family` |
| Type preset token | `--type-preset-{name}-{property}` | `--type-preset-h1-font-size` |
| Section/block-scoped font setting | `{component}_font` (no category prefix) | `story_font` |

## Case study: Horizon's naming, in full

Horizon's real, shipped settings and tokens follow every rule above, confirmed directly from its source (the full tour lives in [Naming & Code Conventions in Horizon](/horizon-codebase-tour/naming-and-code-conventions/), part of the separate [Horizon Theme Codebase Tour](/horizon-codebase-tour/) chapter):

```
type_body_font, type_subheading_font, type_heading_font, type_accent_font
type_size_h1, type_size_h2, ... type_size_paragraph
```

```css
--font-body--family, --font-body--weight, --font-body--style
--font-heading--family, --font-heading--weight, --font-heading--style
```

One detail worth knowing if you ever read `theme-styles-variables.liquid` directly: Horizon's **internal** Liquid variable names for the four font roles (`primary_font`, `secondary_font`, `tertiary_font`, `accent_font`, reflecting the order they're loaded in) don't match either the **setting** names (`type_body_font`, `type_subheading_font`, `type_heading_font`, `type_accent_font`) or the **CSS output** names (`--font-body--*`, `--font-subheading--*`, `--font-heading--*`, `--font-accent--*`). Three different names for the same four roles, each aimed at a different audience — a merchant picking a setting, a developer reading the generation logic, and a developer consuming the output in CSS — is a reasonable, deliberate pattern, not a mistake, but worth recognizing so it doesn't look like an inconsistency when you first encounter it in real source.

## Key takeaways

- A shared category prefix (`type_`) groups every typography setting together in `settings_schema.json` — the same instinct as `palette_` for color, confirmed at real production scale by Horizon.
- When naming a setting that repeats across many similar levels (a size per heading level), put the shared property before the level (`type_size_h1`); when a property has one instance per named role (a font per role), put the role first (`type_heading_font`). Group by whichever axis has more members.
- CSS token names can use a single dash (this site's own default, simpler) or Horizon's double dash (groups a token family more explicitly) — pick one per theme and stay consistent; both are legitimate.
- `type_` (settings) and `--font-` (CSS) don't need to match — one groups a category of setting in `settings_schema.json`, the other mirrors CSS's own `font-*` property family so a role token reads naturally in the CSS that consumes it.
- A type preset gets its own fixed prefix (`--type-preset-`) and should be named by role or purpose, never by a relative description like "large" that breaks the moment something bigger is added. Horizon itself extends `--font-` to its presets instead of using a separate prefix — both are legitimate; pick one per theme.
- A section- or block-scoped font setting deliberately skips the `type_` prefix — that prefix specifically means "part of the theme-wide token system," which a scoped, component-specific setting isn't.

## Further reading

- [Naming & Code Conventions in Horizon](/horizon-codebase-tour/naming-and-code-conventions/)
- [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)
- [Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/)
- [Color Fundamentals](/all-about-colors/color-fundamentals/) — the same `palette_` prefix convention, applied to color
