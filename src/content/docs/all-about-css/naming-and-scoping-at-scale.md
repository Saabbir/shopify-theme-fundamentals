---
title: Naming & Scoping at Scale
description: BEM in full depth, and the real Theme Check rule that catches a cross-file CSS dependency before it ships.
---

**TL;DR:** BEM in full depth, and the real Theme Check rule that catches a cross-file CSS dependency before it ships.

## Why scoping is entirely a naming discipline, not a technical feature

`{% stylesheet %}` makes it easy to assume a section's CSS is somehow isolated to that section, the way a component-scoped stylesheet works in some JavaScript frameworks, or the way Shadow DOM isolates styles. **It isn't.** Every `{% stylesheet %}` block across a theme contributes to one shared CSS surface, and a class defined in one file is visible to the whole page. A `.title` in one section and an unrelated `.title` in another will collide — whichever rule happens to apply wins, silently overriding the other wherever both class names appear.

## BEM, in full

**BEM** (Block, Element, Modifier) is the standard fix: name every class after the component it belongs to, so the name itself prevents collisions.

```css
.product-card { }
.product-card__title { }
.product-card__image { }
.product-card--sold-out { }
```

- **Block** — the component itself (`product-card`).
- **Element** — a part of that block, joined with a double underscore (`product-card__title`). An element belongs to exactly one block; it's never reused as a standalone class elsewhere.
- **Modifier** — a variant of a block or element, joined with a double hyphen (`product-card--sold-out`). A modifier always applies *alongside* the base class, never instead of it: `class="product-card product-card--sold-out"`, not `class="product-card--sold-out"` alone.

### A common BEM mistake: nesting elements inside elements

```css
/* Avoid */
.product-card__header__title { }

/* Prefer */
.product-card__title { }
```

An element's name reflects its relationship to the *block*, not to another element. Even if `title` sits visually inside a `header` inside `product-card`, it's still just `product-card__title` — BEM intentionally stays flat one level deep, rather than mirroring the DOM's nesting in the class name.

### Boolean modifiers vs. valued modifiers

```css
.product-card--sold-out { } /* a boolean state: present or not */
.product-card--columns-3 { } /* a valued variant: one of several */
```

Both are valid BEM; which to reach for depends on whether the variation is a yes/no state or a choice among several named options.

## One prefix for the whole theme

Beyond BEM's own structure, pick one short prefix and apply it to every class a theme defines — not just to avoid colliding with your own other sections, but to avoid colliding with a class name an installed app injects, or one that happens to match a different theme framework's own naming:

```css
.my-theme-product-card { }
.my-theme-product-card__title { }
```

This is the same instinct behind the CSS custom property prefix covered in [29.4. CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/), and the custom-element tag prefix covered in [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) — one consistent namespace, applied everywhere, specifically because nothing else protects you from a collision.

## The real linter that catches this: `ValidScopedCSSClass`

Shopify's CSS doesn't just risk collisions — since [Stylesheet content subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting) (covered in full in [29.7. Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/)), a page only loads CSS from files that are actually in its render tree. That makes a specific mistake newly costly: using a class in one file that's only ever *defined* in a different, unrelated file.

```liquid
{% comment %} sections/header.liquid {% endcomment %}
{% stylesheet %}
  .site-banner { background: var(--color-accent); padding: 0.5rem 1rem; }
{% endstylesheet %}
<div class="site-banner">{{ section.settings.announcement }}</div>
```

```liquid
{% comment %} sections/footer.liquid — relies on header.liquid's CSS being on the same page {% endcomment %}
<div class="site-banner">
  {{ section.settings.promo_text }}
</div>
```

`footer.liquid` uses `.site-banner` but never defines it — it only happens to work on a page that also renders `header.liquid`. On a page that doesn't render the header, the footer silently loses its styling, because that CSS was never included for that page at all.

Running `shopify theme check` catches exactly this, through the `ValidScopedCSSClass` check (on by default):

```
CSS class `site-banner` is defined in another liquid file's stylesheet tags
that isn't an explicit ancestor: `sections/header.liquid`
```

A class defined in a *parent* file and used by a file it renders through `{% render %}` is fine — the parent is always in the render tree whenever the child is, so that dependency is safe. It's only a cross-file dependency between two *unrelated* files, neither one rendering the other, that the check flags.

### Fixing a flagged class

- **If it's used in only a few files**, either duplicate the definition into each file's own `{% stylesheet %}`, or move it up into their common parent.
- **If it's genuinely global** — a reset, shared typography, utility classes used all over the theme — move it into an asset stylesheet in `assets/`, loaded via `stylesheet_tag` in the layout. Asset stylesheets aren't subject to subsetting, so they're always available, on every page, regardless of render tree.

## Keep selectors simple

A few habits make collisions both less likely and easier to spot when they do happen:

- **One class per selector** — `.product-card__title`, not a descendant chain like `.product-card .content .title`. A long chain is fragile (any markup nesting change breaks it) and more likely to accidentally match something unrelated.
- **No ID selectors for styling** — IDs must be unique per page, which a section added more than once can't guarantee; a class has no such restriction.
- **No `!important`** — it's a sign a collision has already happened and is being patched over, rather than prevented by naming in the first place.

## Key takeaways

- `{% stylesheet %}` provides no automatic scoping — a consistent BEM naming pattern plus one theme-wide prefix is what actually prevents collisions.
- An element's class name reflects its block, never another element's name nested inside it — BEM stays flat, one level deep.
- `shopify theme check`'s `ValidScopedCSSClass` rule catches a cross-file CSS dependency that CSS subsetting would otherwise silently break — fix it by moving the class to the file(s) that use it, or to an asset stylesheet if it's genuinely global.

## Further reading

- [BEM methodology](https://getbem.com/)
- [29.10. Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/) — including why `@scope` doesn't change the BEM recommendation here, and why native CSS nesting isn't a reason to bring back descendant-chain selectors
- [Stylesheet content subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting) (shopify.dev)
- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
