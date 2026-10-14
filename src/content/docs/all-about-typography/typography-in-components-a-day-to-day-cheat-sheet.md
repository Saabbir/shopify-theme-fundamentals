---
title: "Typography in Components: A Day-to-Day Cheat Sheet"
description: A decision tree and example set for what typography CSS belongs in a section, block, or snippet's own stylesheet — and what should always come from a token or preset instead.
---

**TL;DR:** A decision tree and example set for what typography CSS belongs in a section, block, or snippet's own stylesheet — and what should always come from a token or preset instead.

[Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), [Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/), and [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) each cover one piece of this mechanism in depth. This page doesn't introduce anything new — it's the practical recap, written for the moment you're actually writing a section's `{% stylesheet %}` and need a fast, concrete answer to "does this typography CSS belong here?"

## The one rule

A component's own `{% stylesheet %}` or `{% style %}` should almost never contain `font-family`, `font-weight`, `font-size`, or `line-height` as a literal value, and should almost never reconstruct a full preset by hand-listing several `--type-preset-*` tokens either. Two different things already supply typography — a **role token** or a **preset class** — and almost everything a component needs is one of those two, applied correctly. Knowing which one to reach for is the entire skill this page teaches.

## Two layers, two different jobs

It's easy to blur these together, so it's worth being precise about what each one actually is, since they look similar but answer different questions.

| | Role token | Preset class |
|---|---|---|
| What it carries | `family`, `weight`, `style` only — **never a size** | A full bundle: family, weight, size, line-height, usually letter-spacing and case |
| Example | `var(--font-heading-family)` | `.h1`, `.paragraph`, or a purpose-named class like `.display` |
| How a component uses it | Referenced directly, inside the component's own `{% stylesheet %}` | Applied as a class in markup — **never** referenced property-by-property in a stylesheet |
| Right for | A component that wants to "belong" to a font role, with no opinion on size (the surrounding context already controls that) | Any text that needs a complete, consistent typographic treatment |

The detail most worth remembering: **a role token has no size property at all.** [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/#step-3-resolve-every-role-into-css-custom-properties-once) resolves each role into exactly three properties — family, weight, style. If a component reaches for a role token and then also needs a `font-size`, that's a sign it actually needs a *preset* (apply the class), not a role token with a hand-picked size bolted on.

## The decision tree

Work through these in order; stop at the first one that applies.

1. **Does this text need a complete typographic treatment** — the kind of thing that has a size and a line-height, not just a family? Apply the matching **preset class** directly in markup (`class="h3"`, `class="display"`). Never re-declare `font-family`/`weight`/`size`/`line-height` for it inside the component's own `{% stylesheet %}`.
2. **Does this text just need to "belong" to a font role** — most often just `font-family` — with size and line-height controlled by something else (a button's own sizing, a form field inheriting from its context)? Reference the **role token** directly: `font-family: var(--font-accent-family);`.
3. **Is there no element in the markup to attach a class to** — a generated `::before`/`::after`, or content injected by JavaScript with nowhere convenient to add a class? This is the one documented exception where referencing a preset's individual tokens directly, inside a component's own stylesheet, is correct. Treat it as rare, not a shortcut.
4. **Does a merchant need to choose between presets for this component?** A bounded `select` setting whose option `value`s are the literal preset class names, applied via `class="{{ setting_value }}"` — no translation step converting one vocabulary into another.
5. **Does one specific instance need exactly one property of a preset nudged** — a hero that wants the `.h1` preset, just bigger, only there? A scoped CSS custom property override on an ancestor (`.hero { --type-preset-h1-font-size: ...; }`), with the preset class left untouched on the element itself.

If none of these five apply, the honest answer is usually "this text needs a new preset" (back to [Decision 1](/all-about-typography/type-presets-and-building-a-complete-type-system/#decision-1-how-many-presets-does-this-theme-actually-need)), not a one-off value invented on the spot.

## What *does* belong in a component's own stylesheet

Typography is the exception, not the rule, for what a component's `{% stylesheet %}` should own. Nearly everything else is exactly where it belongs:

```css
.product-card {
  /* Layout, spacing, color, borders — all genuinely this component's own */
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--style-border-radius-inputs);
}
```

None of that is typography, and none of it has an equivalent "global class" the way a preset does — spacing and layout are inherently specific to where a component sits, which is exactly why [Decision 2 of Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/#decision-2-what-properties-belong-in-a-preset) deliberately leaves color and margin/padding *out* of a preset in the first place.

## `{% stylesheet %}` vs. `{% style %}`, for typography specifically

[CSS Fundamentals in a Shopify Theme](/all-about-css/css-fundamentals/) covers the general difference; here's what it means for typography in particular:

- **`{% stylesheet %}`** is where a component applies a preset class in its markup and writes its own non-typography CSS. It can't evaluate Liquid, so it never contains a settings-driven value — which is exactly right, since a component consuming existing tokens and presets shouldn't need to.
- **`{% style %}`** is for *defining* a token from a setting, not for *consuming* one. Its two legitimate typography uses are both covered elsewhere: the theme-wide token-resolution snippet rendered once near the top of `theme.liquid` ([Design Tokens & Type Presets, Step 3](/all-about-typography/design-tokens-and-type-presets/#step-3-resolve-every-role-into-css-custom-properties-once)), and a section- or block-scoped font setting that needs its own `font_face` output ([the `story_font` example](/all-about-typography/wiring-typography-into-sections-and-blocks/#when-a-section-genuinely-needs-its-own-font-setting)).

A component that's just *using* typography — the overwhelming majority of sections, blocks, and snippets — should essentially never need `{% style %}` for it at all. If you find yourself reaching for `{% style %}` to output a font-related value and the component doesn't have its own `font_picker` setting, that's usually a sign the value should have come from an existing token or preset instead.

## Good vs. not-good, side by side

### A product card title

```liquid
<!-- Good: the preset supplies family/weight/size/line-height -->
<h3 class="product-card__title h3">{{ product.title }}</h3>

{% stylesheet %}
  .product-card__title {
    margin-block-end: var(--space-xs);
  }
{% endstylesheet %}
```

```liquid
<!-- Not good: re-deriving what the .h3 class already provides -->
<h3 class="product-card__title">{{ product.title }}</h3>

{% stylesheet %}
  .product-card__title {
    font-family: var(--type-preset-h3-font-family);
    font-weight: var(--type-preset-h3-font-weight);
    font-size: var(--type-preset-h3-font-size);
    line-height: var(--type-preset-h3-line-height);
    margin-block-end: var(--space-xs);
  }
{% endstylesheet %}
```

The second version works, but it's a silent maintenance liability: it now has to be kept in sync by hand with the global `.h3` rule it's duplicating, and it's exactly the kind of redeclaration [Decision 5](/all-about-typography/type-presets-and-building-a-complete-type-system/#decision-5-one-global-class-per-preset-not-a-redeclaration-per-component) exists to eliminate.

### A testimonial quote that just wants the Accent font-family

```liquid
<!-- Good: a role token, because only family/style matter here — no preset fits -->
<blockquote class="testimonial">{{ block.settings.quote }}</blockquote>

{% stylesheet %}
  .testimonial {
    font-family: var(--font-accent-family);
    font-style: var(--font-accent-style);
  }
{% endstylesheet %}
```

```liquid
<!-- Not good: forcing a preset class onto text that doesn't want the preset's size -->
<blockquote class="testimonial display">{{ block.settings.quote }}</blockquote>
```

Reaching for a preset here forces the quote to also take on whatever size and line-height the `.display` preset carries — properties this component never asked for. When only `family` (and maybe `style`) actually matter, a role token is the correct, smaller tool, not a preset used for one property out of four.

### A hero that wants the H1 preset, just bigger, in one place

```liquid
<!-- Good: the class stays, only the one property that changes gets overridden -->
<div class="hero">
  <h1 class="hero__heading h1">{{ section.settings.heading }}</h1>
</div>

{% stylesheet %}
  .hero {
    --type-preset-h1-font-size: clamp(2.5rem, 2rem + 3vw, 4.5rem);
  }
{% endstylesheet %}
```

```liquid
<!-- Not good: a brand-new preset for a one-off tweak used in exactly one place -->
<h1 class="hero__heading h1-large">{{ section.settings.heading }}</h1>
```

A new preset is the right call once a treatment genuinely recurs in more than one place — not for a single section's single tweak. See [Overriding one property of a preset](/all-about-typography/type-presets-and-building-a-complete-type-system/#overriding-one-property-of-a-preset-locally-without-breaking-the-system) for the full reasoning.

### A section letting a merchant choose a heading treatment

```json
// Good: option values are the real class names, no translation needed
{
  "type": "select",
  "id": "heading_style",
  "options": [
    { "value": "display", "label": "t:options.display" },
    { "value": "standard", "label": "t:options.standard" }
  ],
  "default": "standard"
}
```

```json
// Not good: a free-form number invites an inconsistent, untested combination
{ "type": "range", "id": "heading_font_size", "min": 16, "max": 96, "step": 2, "unit": "px", "default": 32 }
```

A raw size control lets a merchant land on a value that doesn't match any tested treatment and may not pair sensibly with the line-height or letter-spacing the design actually needs at that size — the bounded `select` keeps every available choice a real, designed preset.

## Common mistakes, at a glance

- Redeclaring a preset's properties by hand in a component's own stylesheet, instead of applying the class.
- Reaching for a preset class when only `font-family` actually matters, forcing an unwanted size onto the component.
- Writing a raw `font-size`/`line-height`/`font-weight` value with no token or preset behind it at all — even one that happens to match a token's current value today will silently drift the moment that token changes.
- Giving a `select` setting's option values a separate vocabulary from the actual preset class names, requiring a translation step (a Liquid `case` statement) that duplicates logic Decision 5 already eliminated once.
- Inventing a new preset for a tweak that's only ever used in one place, instead of a scoped custom-property override.
- Reaching for `{% style %}` to output typography CSS in a component that has no `font_picker` setting of its own — a sign the value should already exist as a token or preset.

## Key takeaways

- A role token carries `family`/`weight`/`style` only, never a size — if a component wants a size too, it needs a preset, not a role token with a size added on.
- Apply a preset as a class in markup; never reconstruct one by referencing its individual tokens property-by-property in a component's own stylesheet, except for the one documented exception (no element to attach a class to).
- Everything that genuinely belongs to one component — spacing, layout, color, borders — stays in that component's own stylesheet exactly as before; typography is the specific exception that routes through a shared token or preset instead.
- `{% style %}` is for defining a token from a setting; `{% stylesheet %}` is for consuming one. A component just using existing typography should rarely need `{% style %}` at all.
- When none of the standard patterns fit, the usual answer is a new preset, not a one-off hardcoded value.

## Further reading

- [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — the role-token layer
- [Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) — designing presets, and Decision 5's global-class pattern in full
- [Wiring Typography Settings into Sections & Blocks](/all-about-typography/wiring-typography-into-sections-and-blocks/) — the broader section/block consumption patterns, including the scoped-setting case
- [Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) — how every identifier referenced on this page got its name
- [Typography Best Practices](/all-about-typography/typography-best-practices/) — the broader, chapter-wide checklist this page's narrower focus sits alongside
- [CSS Fundamentals in a Shopify Theme](/all-about-css/css-fundamentals/) — the general `{% stylesheet %}` vs. `{% style %}` distinction
