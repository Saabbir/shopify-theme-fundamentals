---
title: Turning Settings into CSS Variables
description: The inline custom-property pattern, and why it's the only approach that keeps the theme editor's live preview working.
---

**TL;DR:** The inline custom-property pattern, and why it's the only approach that keeps the theme editor's live preview working.

This page is where color, typography, and spacing settings actually become CSS. The technique is the same regardless of which kind of setting is involved: put each value on the section or block's outermost element as an inline CSS custom property, then read it back inside `{% stylesheet %}` with `var()`.

## The pattern

```liquid
{% liquid
  assign padding_top = section.settings.padding_top | default: 40
  assign padding_bottom = section.settings.padding_bottom | default: 40
  assign padding_top_mobile = section.settings.padding_top_mobile | default: 20
  assign padding_bottom_mobile = section.settings.padding_bottom_mobile | default: 20
  assign accent_color = section.settings.accent_color | default: '#121212'
%}
<div
  class="hero-banner"
  style="
    --padding-top: {{ padding_top }}px;
    --padding-bottom: {{ padding_bottom }}px;
    --padding-top-mobile: {{ padding_top_mobile }}px;
    --padding-bottom-mobile: {{ padding_bottom_mobile }}px;
    --accent-color: {{ accent_color }};
  "
>
  <h1>{{ section.settings.heading }}</h1>
</div>

{% stylesheet %}
  .hero-banner {
    padding-top: var(--padding-top);
    padding-bottom: var(--padding-bottom);
    color: var(--accent-color);
  }

  @media screen and (max-width: 749px) {
    .hero-banner {
      padding-top: var(--padding-top-mobile);
      padding-bottom: var(--padding-bottom-mobile);
    }
  }
{% endstylesheet %}
```

Every setting involved — padding (from [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/)), a color — ends up as one of these inline `--variable: value;` declarations on the outer `<div>`, with the actual `{% stylesheet %}` rules only ever referencing `var(--variable)`, never a literal value or a raw setting reference.

## Why this specific approach, and not a `{% if %}` per setting

You could, in theory, write a different CSS class for every combination of settings, or branch with `{% if %}` inside the stylesheet. Both break down fast: a numeric range setting (padding, in increments of 4px from 0–120) would need dozens of classes to cover every possible value, and `{% if %}` branching doesn't scale past two or three options. Exposing the raw value as a variable sidesteps the problem entirely — one rule, `var(--padding-top)`, correctly handles every possible value a merchant could choose.

## Why this is what keeps the theme editor's live preview working

This is the real reason the pattern matters, beyond convenience. Shopify's theme editor re-renders a section's Liquid instantly whenever a merchant changes a setting, without a full page reload — but it does that by re-rendering the HTML (including this inline `style` attribute), not by re-running your CSS file from scratch. If a setting's value only affected something baked into a separate stylesheet file, there'd be no mechanism for a live change to reach it. Because the value lives in the HTML itself as a custom property, the moment the HTML updates, the CSS that reads `var(--padding-top)` picks up the new value automatically — no extra wiring required.

This is also exactly why the [mobile-spacing caution](/design-tokens/spacing-and-layout-tokens/) on the previous page matters: outputting *both* the desktop and mobile values as variables, and letting a `@media` query pick between them, keeps working no matter how the preview pane is resized. Deciding in Liquid which one to output would not.

## A naming convention is worth adopting early

Pick one short, consistent prefix for every custom property your theme defines (`--theme-color-accent`, `--theme-space-md`), and stick to it everywhere. This avoids colliding with a variable name an installed app's own CSS might define, and makes it obvious at a glance, anywhere in your CSS, that a given variable comes from your theme's own settings rather than from somewhere else.

## Key takeaways

- Expose a setting as a CSS custom property on the section/block's outer element (`style="--x: ...;"`), and only ever reference it with `var(--x)` inside `{% stylesheet %}` — never a literal value.
- This specific approach exists because it's the only one that keeps working as the theme editor live-updates the page on every setting change, including resizing its device preview.
- Pick one consistent naming prefix for every custom property your theme defines, to avoid collisions with CSS from an installed app.

## Further reading

- [CSS custom properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Theme architecture: settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
