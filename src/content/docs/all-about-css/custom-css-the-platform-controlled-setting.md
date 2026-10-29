---
title: 'Custom CSS: The Platform-Controlled Setting'
description: What Shopify's built-in custom_css setting is for, why a developer shouldn't add or edit it, and where real styling options belong instead.
---

**TL;DR:** Shopify adds a CSS field to every section (and the theme as a whole) automatically, for merchants — not developers. Knowing what it's for keeps it from quietly ending up in your Liquid review.

## What `custom_css` actually is

Every section gets a "Custom CSS" field in the theme editor, and so does the theme overall, without a developer ever adding one. Unlike every other setting covered elsewhere on this site, this one isn't declared in a `{% schema %}` block at all — Shopify exposes it automatically, outside any theme's own code, as a platform-controlled setting.

Whatever a merchant types into that field ends up stored as raw CSS text, not as a theme file. For a section, it lands in that section's own entry in a JSON template, under a `custom_css` key:

```json
{
  "sections": {
    "feature_callouts_1": {
      "type": "feature-callouts",
      "settings": { ... },
      "custom_css": [
        "@media screen and (min-width: 750px) { .feature-callouts__heading { font-size: 32px; } }"
      ]
    }
  }
}
```

For the theme-wide field, it lands in `settings_data.json`, under a `platform_customizations` object rather than the `current` settings object a developer normally edits.

## What it's for

It exists so a merchant can make a genuinely one-off, store-specific visual tweak — nudge a heading's size on one page, add a touch of extra spacing somewhere, adjust a single color — directly from the editor, without filing a request with a developer or waiting on a code change. It's a release valve for the long tail of small preferences no settings panel could ever fully anticipate.

That's also exactly its limit: it's meant for a merchant's own personalization, made and owned through the editor, not for a developer's styling decisions. Shopify says this directly:

> As a theme developer, you shouldn't add this setting, or edit the value of this setting after it's set. Instead, you should use dedicated CSS assets and stylesheet Liquid tags, and introduce customization options for CSS in these areas using theme settings.

## Why committing to it is the wrong move, even when it's tempting

It's possible to open a JSON template or `settings_data.json` directly and hand-write a `custom_css` entry — nothing stops a developer from doing it, and from the browser the visual result is identical to a real `{% stylesheet %}` rule. It's worth resisting anyway, for reasons that aren't obvious until something breaks:

- **It bypasses CSS subsetting.** [29.7. Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/) covers how Shopify only loads a section's `{% stylesheet %}` when that section is actually on the page. A `custom_css` entry doesn't go through that pipeline at all — it's just a string sitting in JSON data.
- **It bypasses `shopify theme check`.** CSS written in a `{% stylesheet %}` tag is linted along with everything else. CSS sitting inside a JSON value is invisible to the linter — there's no rule that will ever catch a typo, an unused selector, or a specificity problem in there.
- **It's invisible from the component's own file.** Anyone reading `feature-callouts.liquid` to understand how it's styled has no reason to suspect part of its appearance is actually determined by a string buried in a JSON template three directories away.
- **It's the editor's field, not the codebase's.** The moment a merchant opens that same section in the editor and touches *anything* in its Custom CSS panel, they're editing — and can overwrite — exactly the value a developer hand-committed. Code and merchant customization end up fighting over the same field.

## What a developer should do instead

Whatever the merchant-facing problem actually is, it already has a home elsewhere on this site:

- **A one-off value tweak someone will want to revisit** → a real setting, exposed through `{% schema %}`, read into a custom property. Covered throughout [29.4. CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/).
- **The same block needs to look different in just one section** → the four-step override path in [Styling a Shared Block for One Section](/all-about-css/styling-a-shared-block-for-one-section/), not a style pasted into a settings field.
- **Shared rules used all over the theme** → an asset stylesheet in `assets/`, loaded with `stylesheet_tag`, as described in [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/).

If a merchant has already used the Custom CSS field on a live store and a developer is reviewing that section later, the right move is to read it as what it is — a merchant's own content, like any other setting value — not to "clean it up" by quietly moving it into the theme's own files without being asked. If the tweak turns out to be something the theme should really support properly, that's worth raising with the merchant as a reason to add a real setting, rather than a reason to edit a platform-controlled field on their behalf.

## Key takeaways

- `custom_css` is exposed automatically by Shopify, at theme and section level — it's never declared in a theme's own `{% schema %}`.
- It's stored as a raw string, in a JSON template's section attributes or in `settings_data.json`'s `platform_customizations` object — not in any `.liquid` or `.css` file.
- It exists for merchant-made, editor-driven, one-off tweaks. A developer shouldn't add it or edit its value — doing so bypasses CSS subsetting and `shopify theme check`, and conflicts with the editor the moment a merchant touches that field themselves.
- A developer's equivalent need almost always already has a real home: a theme setting and custom property, a one-level selector override, a block setting, or a shared asset stylesheet.

## Further reading

- [Styling a Shared Block for One Section](/all-about-css/styling-a-shared-block-for-one-section/) — the decision tree to use instead of reaching for `custom_css`
- [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/)
- [29.7. Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/) — how CSS subsetting works, and why `custom_css` sits outside it
