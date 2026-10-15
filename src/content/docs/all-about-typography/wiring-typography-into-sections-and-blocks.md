---
title: Wiring Typography Settings into Sections & Blocks
description: The concrete schema-to-CSS path, worked through end to end.
---

**TL;DR:** The concrete schema-to-CSS path, worked through end to end.

[18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) built the token layer, theme-wide. This page works through how an individual section or block actually consumes that layer, plus the two situations where a section needs typography control beyond what the global tokens provide.

## The simple case: a section just uses the real tag

Most of the time, a section needs no typography CSS of its own at all. Per [Decision 5 of Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/#decision-5-one-global-class-per-preset-not-a-redeclaration-per-component), a real heading tag is already paired with its matching preset in one global stylesheet — so a section that renders an actual `<h2>` gets full, correct H2 typography automatically, with nothing typography-related in its own `{% stylesheet %}` at all:

```liquid
{% comment %} sections/featured-collection.liquid {% endcomment %}
<h2 class="featured-collection__heading">{{ section.settings.heading }}</h2>

{% stylesheet %}
  .featured-collection__heading {
    /* Nothing typography-related here, on purpose — the real <h2> tag
       already gets its font-family, weight, size, and line-height
       from the global h2 { ... } rule. Only something genuinely
       specific to this section belongs here. */
    margin-block-end: var(--space-sm);
  }
{% endstylesheet %}
```

No typography-specific setting, class, or CSS is needed here — the section simply renders a real heading tag and the rest follows automatically. This should be the default for most sections; only add a dedicated typography setting when a section genuinely needs to deviate from the theme-wide tokens.

:::note[Not every element wants the full preset — that's a different, narrower case]
Sometimes a component genuinely wants to borrow just a role's `font-family` (and maybe `style`), with no opinion on size at all — the testimonial block further down this page is exactly that case. Reaching for a role token directly, instead of a preset, is correct *there* specifically because the text isn't meant to carry a prescribed size — not because declaring family/weight without size is a smaller, simpler version of the pattern above. [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/#the-decision-tree) covers exactly how to tell the two cases apart.
:::

## Letting a merchant choose between type presets

When a section has more than one plausible typography treatment (a large display heading versus a smaller, standard one, say), offer a `select` setting that chooses between your named type presets, rather than exposing raw font/size controls directly — the same reasoning [Spacing settings](/design-tokens/spacing-and-layout-tokens/) and [color schemes](/design-tokens/color-settings-and-color-schemes/) both apply to their own settings: a bounded, named choice beats an unbounded free-form one. [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/#using-a-preset-in-a-section-or-block-setting) covers this exact pattern in full, with a complete worked example.

## When a section genuinely needs its own font setting

Occasionally a specific section really does need independent control — a "Brand Story" section with a distinctive editorial typeface that shouldn't follow the theme's Heading token, say. In that case, add a scoped `font_picker` directly to that section's own schema, following the exact same load-and-apply pattern as any theme-wide font setting:

```json
{
  "type": "font_picker",
  "id": "story_font",
  "label": "t:labels.story_font",
  "default": "assistant_n4"
}
```

```liquid
{% liquid
  assign story_font = section.settings.story_font
%}
<div class="brand-story" style="--brand-story-font: {{ story_font.family }}, {{ story_font.fallback_families }};">
  {{ section.settings.story_text }}
</div>

{% style %}
  {{ story_font | font_face }}
{% endstyle %}

{% stylesheet %}
  .brand-story {
    font-family: var(--brand-story-font);
  }
{% endstylesheet %}
```

Two things worth noting here, both already covered elsewhere but worth seeing applied together: `font_face` for a section-scoped font setting needs to run inside that section's own file (inside a `{% style %}` tag, since `{% stylesheet %}` can't evaluate Liquid — see [`{% stylesheet %}` and `{% style %}`](/css-in-shopify-themes/stylesheet-and-style-tags/)), and the resulting CSS custom property is set directly on the section's own outer element, following the same "settings become CSS custom properties on the outer element" pattern every section and block in a well-built theme uses.

## Wiring into a block

The exact same pattern works for a block — a testimonial block that wants its quote in the Accent typography token, say, needs nothing special beyond what any block setting already does:

```liquid
{% comment %} blocks/testimonial.liquid {% endcomment %}
<blockquote class="testimonial" {{ block.shopify_attributes }}>
  {{ block.settings.quote }}
</blockquote>

{% stylesheet %}
  .testimonial {
    font-family: var(--font-accent-family);
    font-style: var(--font-accent-style);
  }
{% endstylesheet %}
```

Nothing about typography tokens changes depending on whether they're consumed by a section or a block — both just reference `var(--font-accent-family)` the same way, because the token was already resolved once, globally, regardless of which component ends up reading it.

## Key takeaways

- Most sections should consume the global typography tokens directly, with no typography setting of their own — add one only when a section genuinely needs to deviate.
- Offer a bounded `select` between named type presets rather than exposing raw font/size controls, for the same reason `color_scheme` beats four independent color settings.
- A section or block that truly needs its own font setting follows the identical load-and-apply pattern as a theme-wide one, just scoped to that component's own file and outer element.

## Further reading

- [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)
- [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) — the select-between-presets pattern above, in full
- [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) — the decision tree for picking a role token, a preset, or neither
- [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/)
