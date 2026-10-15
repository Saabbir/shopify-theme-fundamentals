---
title: Naming & Code Conventions in Horizon
description: The patterns that repeat throughout the real code — worth copying even if nothing else is.
---

**TL;DR:** The patterns that repeat throughout the real code — worth copying even if nothing else is.

A theme's naming conventions matter more than any single file — they're what makes a codebase navigable once it's grown past a handful of files. These are the conventions directly observed across the real Horizon files quoted elsewhere in this chapter.

## CSS custom properties: kebab-case, with a double-dash for sub-properties

```css
--color-primary-button-background
--font-heading--family
--font-heading--weight
--section-height-small
```

Most tokens are plain kebab-case. Where a token is really one property of a larger named thing (a font role's family vs. its weight, a type preset's size vs. its case), Horizon separates the "thing" from its "property" with a double dash: `--font-{role}--{property}`. This is a deliberate, scannable way to group related variables by a shared prefix (`--font-heading--`) while still keeping each one addressable individually — worth adopting directly in a new theme's own token naming.

## `util-` prefix for pure utility snippets

```
snippets/util-palette-hover-shift.liquid
```

A snippet that computes a value and returns it (no markup, no settings, nothing merchant-facing) gets a `util-` prefix, visually separating it from a snippet that renders a component's markup. This is the same "markup snippets vs. logic-only snippets" distinction from [16.3. Organizing a Large Snippet Library](/all-about-snippets/organizing-a-large-snippet-library/), with a concrete, real naming convention attached to it.

## Dynamic, per-instance scoping classes

```liquid
.color-custom-{{ section_id }}
```

Rather than one fixed class per component, `contrast-override.liquid` generates a class name from a parameter passed at render time, so the same shared snippet can scope its output independently for a popover, a drawer, and a badge, all on the same page, without their styles colliding. Worth remembering any time a snippet needs to emit scoped CSS for a component that might appear more than once per page, under different settings each time.

## A shared "prose container" class

```liquid
.color-custom-{{ section_id }} .text-block
```

`.text-block` appears repeatedly as a shared class applied to any element holding free-form rich text (a text block, an announcement, inline text, a blog post description). Rather than every one of those component types duplicating the same prose-styling rules, they share one class that carries that styling, with component-specific classes only adding what's actually different about that component. This is the same "shared base, specific modifier" instinct behind BEM's block/element/modifier structure, applied at the level of a whole category of components rather than one component's own internal structure.

## Settings named by role, grouped by prefix

```
type_body_font, type_subheading_font, type_heading_font, type_accent_font
type_size_h1, type_size_h2, ... type_size_paragraph
palette_primary_button_background, palette_primary_button_text, palette_primary_button_border
palette_variant_background, palette_variant_text, palette_variant_border
```

Every setting ID starts with a shared prefix for its category (`type_` for typography, `palette_` for color), followed by the specific role or property. This means every typography setting sorts together and every color setting sorts together in `settings_schema.json` and in `settings.*` autocomplete, the same reasoning behind this project's own "naming: everything gets a prefix" convention — Horizon independently arrived at the same instinct, at a much larger scale.

## Internal variable names don't always match their CSS output names

Worth knowing if you read `theme-styles-variables.liquid` directly: internally, the file calls the four font roles `primary_font`, `secondary_font`, `tertiary_font`, and `accent_font` in its own Liquid variables, while the CSS custom properties they produce are named `--font-body--*`, `--font-subheading--*`, `--font-heading--*`, and `--font-accent--*`. The internal names reflect loading order; the output names reflect what a component author actually needs to know. This is a reasonable pattern — internal variable names in a complex piece of generation logic don't have to match their final, public output names — but worth knowing so the mismatch doesn't cause confusion when reading the source directly.

## Key takeaways

- `--token--sub-property` (double dash) groups a family of related CSS variables while keeping each individually addressable.
- A `util-` prefix marks a snippet as pure logic, no markup — a concrete convention for the markup-vs-logic snippet split taught elsewhere on this site.
- Dynamic per-instance class names let one shared snippet scope its CSS output independently across multiple instances of different components on the same page.
- Settings grouped by a shared category prefix (`type_`, `palette_`) keep a large `settings_schema.json` navigable, the same instinct behind this site's own naming conventions, confirmed independently at real-world scale.

## Further reading

- [18.10. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) — this same `type_`/double-dash convention, generalized into a reusable naming system for any theme
- [`theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
- [`contrast-override.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/contrast-override.liquid)
