---
title: Cascade Layers & Managing Specificity
description: "@layer, and a practical layer order for a theme where sections, utilities, and app CSS all compete."
---

**TL;DR:** `@layer`, and a practical layer order for a theme where sections, utilities, and app CSS all compete.

## The problem specificity alone can't solve

Ordinary CSS specificity is decided by *how a selector is written* — an ID beats a class, a class beats an element selector, and so on — regardless of which file that selector happens to live in, or what order the browser happened to load it in. In a small theme that's rarely an issue. In a theme with dozens of sections, plus app-injected CSS from installed apps, plus a handful of utility overrides, it becomes genuinely hard to predict which rule wins without checking every selector's exact specificity by hand.

## `@layer`: ordering entire groups of rules, independent of selector specificity

```css
@layer reset, tokens, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer components {
  .product-card { padding: 1rem; }
}

@layer utilities {
  .u-hidden { display: none; }
}
```

The first line declares the layer order once — `reset`, then `tokens`, then `components`, then `utilities` — regardless of where each `@layer` block actually appears in the file or the page's loaded stylesheets. A rule in a *later* layer always wins over a rule in an *earlier* layer, even if the earlier layer's selector would normally have higher specificity. Here, `.u-hidden { display: none; }` in `utilities` overrides `.product-card { padding: 1rem; }` in `components` for any element both could apply to — not because `.u-hidden` is a "stronger" selector (it isn't), but because `utilities` was declared after `components`.

## A practical layer order for a theme

```css
@layer reset, tokens, components, utilities, overrides;
```

- **`reset`** — base, unopinionated resets (box-sizing, margin resets).
- **`tokens`** — the `:root` custom-property declarations from [CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/); layering tokens separately keeps them from accidentally being overridden by a later component rule that happens to also target `:root`.
- **`components`** — the bulk of a theme's CSS: every section, block, and snippet's own `{% stylesheet %}` content.
- **`utilities`** — small, single-purpose classes meant to override a component when applied (`.u-hidden`, `.u-text-center`).
- **`overrides`** — a deliberate escape hatch, reserved for the rare case where something genuinely needs to win over everything else.

Because layer order beats selector specificity, a simple `.u-hidden` class in `utilities` reliably overrides even a more specific component selector in `components`, without needing `!important` or an artificially inflated selector to force the win.

## Unlayered CSS and app-injected CSS

CSS that isn't declared inside any `@layer` block is treated as if it belongs to its own implicit layer, placed *after* every named layer — meaning unlayered CSS always wins over anything inside a named layer, regardless of specificity. This matters because an installed app's injected CSS is very unlikely to use your theme's layers at all; it will typically land unlayered, and therefore win over your own layered CSS by default.

:::caution[Layers don't protect you from CSS you don't control]
`@layer` only helps with CSS *you* write and *you* order. An app's unlayered CSS still sits above all of it in the cascade, by the behavior described above — the naming-prefix discipline from [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) is still the real defense against an app's CSS accidentally matching one of your own selectors in the first place. Layers solve ordering *within* your own CSS; they don't solve collisions with CSS that was never layered to begin with.
:::

## When the extra structure is worth it

A small theme with a handful of sections and no utility-class layer rarely needs `@layer` at all — plain BEM-scoped selectors, each specific enough to only match their own component, are usually sufficient on their own. `@layer` starts paying off once a theme has enough moving pieces — utility classes meant to deliberately override components, a design-system reset, or enough sections that tracking specificity by hand becomes genuinely error-prone — that an explicit, declared order is clearer than hoping every selector was written with exactly the right specificity.

## Key takeaways

- `@layer` orders entire groups of rules; a rule in a later-declared layer wins over one in an earlier layer, regardless of normal selector specificity.
- A practical order for a theme: `reset`, `tokens`, `components`, `utilities`, `overrides` — letting a simple utility class reliably override a component without `!important`.
- Unlayered CSS (including most app-injected CSS) sits above every named layer by default — `@layer` manages your own CSS's internal order; it doesn't protect against collisions with CSS outside your control.

## Further reading

- [CSS cascade layers (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/)
