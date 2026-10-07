---
title: CSS Fundamentals in a Shopify Theme
description: Where CSS actually lives in a theme, the two Liquid tags that deliver it, and the rules that are easy to miss.
---

**TL;DR:** Where CSS actually lives in a theme, the two Liquid tags that deliver it, and the rules that are easy to miss.

## Three places CSS can live in a theme

A Shopify theme's CSS comes from one of three places, and they behave differently enough that mixing them up causes real bugs.

| Source | Where it's written | How it reaches the page |
|---|---|---|
| `{% stylesheet %}` | Inside a section, block, or snippet file | Collected across the theme into a generated `styles.css`, linked automatically |
| `{% style %}` | Anywhere Liquid renders | Rendered inline, as a `<style>` tag, exactly where it's written |
| An asset stylesheet | A `.css` file in `assets/` | Loaded explicitly with `{{ 'file.css' \| asset_url \| stylesheet_tag }}` |

Most of a theme's CSS should live in `{% stylesheet %}` tags, co-located with the markup they style. The other two are for narrower, specific jobs covered below.

## `{% stylesheet %}`: static CSS, bundled per section/block/snippet

```liquid
{% comment %} sections/product.liquid {% endcomment %}
<div class="product-title">{{ product.title }}</div>
<div class="product-price">{{ product.price | money }}</div>

{% stylesheet %}
  .product-title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .product-price {
    color: var(--color-text);
  }
{% endstylesheet %}
```

Shopify collects the CSS from every `{% stylesheet %}` tag across the theme into one generated `styles.css` file, linked automatically through `content_for_header` — you never write that `<link>` tag yourself. [Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/) covers exactly which CSS actually ships on a given page; it's less than "the whole theme's CSS, every time."

:::caution[`{% stylesheet %}` does not evaluate Liquid]
Writing `color: {{ section.settings.accent_color }};` inside a `{% stylesheet %}` block doesn't work — Liquid tags and output inside `{% stylesheet %}` are left as literal text, not rendered. This is exactly why the CSS-custom-property pattern exists: a setting's value gets written as an inline `style="--x: ...;"` attribute on the element itself (which *does* render Liquid, since it's ordinary HTML), and `{% stylesheet %}` reads it back with `var(--x)` — plain CSS, not Liquid. See [CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/) for the full pattern.
:::

:::caution[One `{% stylesheet %}` tag per file]
A section, block, or snippet file can have at most one `{% stylesheet %}` tag. Writing two in the same file is a syntax error, not a way to split styles into two blocks — put everything in the one tag the file has.
:::

## `{% style %}`: Liquid-evaluated, rendered exactly where it's written

```liquid
{% style %}
  :root {
    --accent-color: {{ settings.accent_color }};
  }
{% endstyle %}
```

Unlike `{% stylesheet %}`, `{% style %}` **does** evaluate Liquid, and renders as an inline `<style>` tag at the exact point it appears in the markup — every time that part of the page renders. This is the right tool specifically for CSS that needs a setting's value computed directly into it, most commonly a handful of global custom properties defined once near the top of `layout/theme.liquid`.

## When to reach for an asset stylesheet instead

A `.css` file in `assets/`, loaded with `stylesheet_tag`, is right for CSS that's genuinely global and shared across many unrelated files — a CSS reset, broad utility classes, or anything that doesn't belong to one specific component. [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) covers exactly when this is the better choice over a `{% stylesheet %}` tag.

```liquid
{% comment %} layout/theme.liquid {% endcomment %}
{{ 'global.css' | asset_url | stylesheet_tag }}
```

## Instance-specific CSS: one gotcha worth knowing early

`{% stylesheet %}` content is injected once per **file**, not once per **instance** of that section or block. If a theme allows the same section to be added to a page multiple times, and that section's styling genuinely needs to differ between instances (not just via settings read through custom properties), a `{% stylesheet %}` block can't do it — reach for an inline `<style>` tag, scoped to that one instance, instead.

## Key takeaways

- Most theme CSS belongs in `{% stylesheet %}`, co-located with the file it styles — it's static, doesn't evaluate Liquid, and gets bundled automatically.
- `{% style %}` evaluates Liquid and renders inline exactly where written — reserve it for settings-driven custom properties, not everyday component styling.
- A file can have only one `{% stylesheet %}` tag; `{% stylesheet %}` content is injected once per file, not once per instance, which matters if the same section can appear more than once on a page.

## Further reading

- [The `stylesheet` tag](https://shopify.dev/docs/api/liquid/tags/stylesheet) (shopify.dev)
- [The `style` tag](https://shopify.dev/docs/api/liquid/tags/style) (shopify.dev)
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
