---
title: Old Patterns vs. New CSS Features
description: A catalog of old CSS/JS workarounds and the modern CSS feature that now replaces each one, with real browser support.
---

**TL;DR:** A catalog of old CSS/JS workarounds and the modern CSS feature that now replaces each one, with real browser support.

[Modern CSS Units](/all-about-css/modern-css-units/) covers the rem/em/px/viewport-unit decision, and [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/) covers logical properties (`padding-block-start`, `margin-inline-start`, and the rest) in depth — both are "old pattern → new feature" swaps in their own right, just common enough to deserve their own pages. This page catalogs the rest: selectors and nesting, layout shortcuts, color functions, and motion/scoping — each framed as *this is what we used to write, this is what replaces it, and here's exactly how far it can be trusted in production.*

:::note[Every feature below is checked against real browser support, not assumed]
"New" doesn't automatically mean "safe to ship." Each section states Baseline status and minimum browser versions as of this site's last update, and flags the handful of features here that still need a fallback or a `@supports` check rather than unconditional use.
:::

## Selectors & nesting

### `:has()` instead of a JavaScript class toggle

The old way needed JavaScript to answer a question CSS itself couldn't ask: "does this element contain a specific kind of descendant?"

```js
// Old: JS has to add a class before CSS can react to it
const card = document.querySelector('.product-card');
if (card.querySelector('.product-card__badge')) {
  card.classList.add('product-card--has-badge');
}
```

```css
/* New: :has() asks the question directly, in CSS */
.product-card:has(.product-card__badge) {
  padding-top: 2rem;
}
```

`:has()` is a **relational pseudo-class** — it matches the element it's attached to (`.product-card`, here) based on what's *inside or near* it, not based on its own classes or attributes. It also works for siblings, not just descendants:

```css
/* Style a label whenever the checkbox right after it is checked,
   with zero JavaScript */
.form-field:has(input:checked) .form-field__label {
  font-weight: bold;
}
```

:::note[Browser support: safe to use without a fallback]
`:has()` reached Baseline Widely Available in June 2026 — Chrome/Edge 105+, Safari 15.4+, Firefox 121+. Every browser a real storefront needs to support in 2026 has it.
:::

### Native CSS nesting instead of a Sass/SCSS build step

```scss
/* Old: this syntax only ever worked through a Sass/SCSS build step */
.product-card {
  border: 1px solid var(--color-border);

  &__title {
    font-weight: bold;
  }

  &:hover {
    border-color: var(--color-accent);
  }
}
```

```css
/* New: the browser understands this directly, no build step needed */
.product-card {
  border: 1px solid var(--color-border);

  &:hover {
    border-color: var(--color-accent);
  }

  @media (max-width: 749px) {
    border-width: 2px;
  }
}
```

:::caution[Nesting is not a reason to bring back descendant chains]
[Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) established "one class per selector, no descendant chains" as this chapter's rule, specifically because a chain breaks the moment markup nesting changes. Native nesting doesn't change that advice — the `&__title` pattern shown crossed out above is exactly the mistake to avoid; a Sass-style nested element selector compiles down to the same flat `.product-card__title`, so there was never a reason to write it nested in the first place, with or without a build step. Native nesting is genuinely useful for the cases the example above keeps: a pseudo-class (`&:hover`) or a media query scoped to one block, where the nesting reflects a *state* or *condition* on the same element, not a different element lower in the DOM.
:::

:::note[Browser support: safe to use without a fallback]
Native CSS nesting reached Baseline Widely Available in June 2026 — Chrome/Edge 120+, Firefox 117+, Safari 17.2+, over 94% global support.
:::

### `:is()` and `:where()` instead of repeating a selector list

```css
/* Old: every one of these needs updating if the list of headings changes */
.article h1,
.article h2,
.article h3 {
  margin-block-end: var(--space-sm);
}
```

```css
/* New: one list, named once */
.article :is(h1, h2, h3) {
  margin-block-end: var(--space-sm);
}
```

`:where()` does the exact same matching as `:is()`, with one difference that matters for overriding things later: `:is()` takes on the specificity of its *most specific* argument, while `:where()` always has **zero specificity** — useful specifically for a reset or a base style that should be trivially easy for any later, more specific rule to override, without needing `!important` or an extra class to win.

```css
/* A reset written with :where() can always be overridden by a single
   class later, with no specificity fight */
:where(ul, ol) {
  margin: 0;
  padding: 0;
}
```

:::note[Browser support: safe to use without a fallback]
Both have been supported in every major browser since early 2021 — Chrome/Edge 88+, Firefox 78+, Safari 14+. There's no reason left to avoid either one.
:::

## Layout shortcuts

### `aspect-ratio` instead of the padding-top percentage hack

```css
/* Old: the "padding hack" — percentage padding on a height-0 box,
   with the real content pulled out of flow to fill it */
.video-wrapper {
  position: relative;
  height: 0;
  padding-top: 56.25%; /* 16:9, calculated by hand */
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
}
```

```css
/* New: say the ratio directly, no layout trick needed */
.video-wrapper {
  aspect-ratio: 16 / 9;
}
```

The old technique works, but only by accident — it repurposes `padding`, a spacing property, to fake a sizing constraint, and it needs the content pulled out of normal flow with `position: absolute` to avoid being pushed down by that fake padding. `aspect-ratio` says what's actually meant: hold this ratio, regardless of width.

:::note[Browser support: safe to use without a fallback]
`aspect-ratio` has been Baseline Widely Available since 2021 — Chrome/Edge 88+, Firefox 89+, Safari 15+.
:::

### `gap` instead of margin between flex/grid children

```css
/* Old: margin on every child except the last one, or a negative-margin
   trick on the parent to cancel the outer edges */
.card-list {
  display: flex;
}

.card-list > * {
  margin-inline-end: var(--space-md);
}

.card-list > *:last-child {
  margin-inline-end: 0;
}
```

```css
/* New: one declaration on the parent, no child selector needed */
.card-list {
  display: flex;
  gap: var(--space-md);
}
```

`gap` puts space **only between** children, never on the outer edges — which is exactly what the `:last-child` exception above exists to fake by hand. It works the same way for `display: grid`, and `row-gap`/`column-gap` split the two axes apart when a grid needs different spacing in each direction.

:::note[Browser support: safe to use without a fallback]
`gap` in flexbox has been Baseline Widely Available since 2021 — Chrome/Edge 84+, Firefox 63+, Safari 14.1+ (gap in grid layout is older still). Around 95% global support.
:::

### `subgrid` instead of manually re-aligning a nested grid

A grid inside another grid normally has no awareness of its parent's tracks — getting a nested card's internal rows to line up with its siblings' rows has traditionally meant either abandoning the nested grid and flattening everything into one giant grid, or eyeballing fixed heights by hand.

```css
/* New: a nested grid can line up with its parent's tracks directly */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: auto auto auto;
}

.product-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

With `grid-template-rows: subgrid`, `.product-card`'s own three rows (image, title, price, say) size themselves against the *parent* grid's row tracks — so every card in the grid gets matching row heights, even when one card's title wraps to two lines and another's doesn't, without either card needing a fixed height.

:::note[Browser support: safe to use without a fallback]
Subgrid reached Baseline Widely Available in March 2026 — Chrome/Edge 117+, Firefox 71+, Safari 16+, over 95% global support.
:::

## Color functions

### `color-mix()` instead of a hardcoded tint or a Sass color function

```scss
/* Old: either a hand-picked hex value, or a Sass function only
   available at build time */
.button--hover {
  background: darken($color-accent, 10%);
}
```

```css
/* New: mix two colors, including CSS custom properties, at runtime */
.button:hover {
  background: color-mix(in srgb, var(--color-accent) 90%, black 10%);
}
```

`color-mix()` runs in the browser, not a build step — so it can mix a CSS custom property that itself comes from a merchant's color-picker setting, something a Sass function could never do, since Sass has no idea what value a Liquid `color` setting will resolve to at runtime.

```css
/* A hover state that's always 10% darker than whatever accent color
   a merchant picked, with no second setting needed */
.button {
  --button-background: var(--color-accent);
}

.button:hover {
  --button-background: color-mix(in srgb, var(--color-accent) 90%, black 10%);
}
```

### Relative color syntax instead of multiple handwritten variants

```css
/* Old: a merchant's one accent-color setting, with 3 more hardcoded
   variants that silently go stale if the setting ever changes format */
:root {
  --color-accent: #2c6e5c;
  --color-accent-light: #4a9178;
  --color-accent-dark: #1d4a3d;
}
```

```css
/* New: every variant is derived from the one real value, always in sync */
:root {
  --color-accent: oklch(45% 0.08 165);
  --color-accent-light: oklch(from var(--color-accent) calc(l + 0.15) c h);
  --color-accent-dark: oklch(from var(--color-accent) calc(l - 0.15) c h);
}
```

`oklch(from <color> ...)` reads a color's own channels back out — lightness (`l`), chroma (`c`), hue (`h`) for OKLCH specifically — and lets any of them be recalculated, with the rest carried through unchanged. The light/dark variants above are never at risk of drifting out of sync with the base color, because they're computed *from* it, not maintained as separate values.

:::note[Browser support: usable, with one caveat for color-mix()'s color space]
`color-mix()` reached Baseline Widely Available in 2025 — Chrome/Edge 111+, Safari 16.2+, Firefox 113+; the `in srgb` examples above work everywhere that supports the function at all. Relative color syntax (the `oklch(from ...)` form) is newer — Chrome/Edge 119+, Firefox 128+, Safari 16.4+ — with roughly 87% global support for OKLCH overall as of mid-2026. Both are safe to use as the only way a value is produced (there's no older value for an unsupporting browser to fall back to), but double-check the result in Safari's current stable release before shipping anything built on relative color syntax for a storefront with meaningfully older-device traffic.
:::

## Motion & scoping

### `@starting-style` instead of a JavaScript timing hack for entry animations

Animating an element *in* from `display: none` has always been awkward — a transition can't run on a property change that happens in the same instant an element becomes displayable, so the old fix was a JavaScript-driven delay to force the two changes into separate frames.

```js
// Old: force a reflow, then apply the "visible" class a frame later,
// purely so the transition has something to transition from
drawer.classList.add('is-open');
drawer.hidden = false;
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    drawer.classList.add('drawer--visible');
  });
});
```

```css
/* New: the browser handles the timing itself */
sol-drawer[open] {
  transition: opacity 0.2s ease, display 0.2s allow-discrete;

  @starting-style {
    opacity: 0;
  }
}

sol-drawer {
  display: none;
  opacity: 1;

  &[open] {
    display: block;
  }
}
```

`@starting-style` defines the "before" state for a transition that starts right as an element becomes displayed — `allow-discrete` in the `transition` property is what lets `display` itself (normally not transitionable at all, since it's not a continuous value) participate.

:::note[Browser support: usable, but still check your actual browser list]
`@starting-style` and `transition-behavior: allow-discrete` reached cross-browser support across Chrome, Edge, Firefox, and Safari during 2026. It's dependable for a typical storefront's traffic, but since this one is newer than the others in this chapter, confirm current support against the specific browser versions a given store's analytics actually show before relying on it for something business-critical, like a cart drawer.
:::

### Scroll-driven animations instead of `IntersectionObserver`

```js
// Old: watch the viewport in JavaScript, toggle a class when an
// element crosses into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
});
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

```css
/* New: animate purely as a function of scroll position, no JS, no observer */
@keyframes fade-in {
  from {
    opacity: 0;
    translate: 0 2rem;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry;
}
```

`animation-timeline: view()` ties the animation's progress to the element's own position as it crosses the viewport, rather than to time — `animation-range: entry` scopes that to just the entry transition, instead of animating continuously across the entire scroll.

:::note[Browser support: needs a `@supports` fallback]
Scroll-driven animations (`animation-timeline: scroll()`/`view()`) have reached Chrome/Edge 115+ and Firefox 132+, with Safari 18+ shipping full support — but global coverage is still around 84% as of mid-2026, meaningfully lower than everything else on this page. Wrap the enhancement in `@supports (animation-timeline: view())` and make sure the `.reveal` element is fully visible by default outside that block, so the remaining ~16% of visits simply see the content with no animation, rather than permanently hidden content waiting for an animation that never runs.
:::

### `@scope` instead of naming discipline alone — worth knowing, not a reason to drop BEM here

```css
/* @scope limits a selector's reach to one subtree, by itself,
   with no class-naming convention required */
@scope (.product-card) to (.product-card__actions) {
  img {
    border-radius: var(--radius-md);
  }
}
```

The block above styles any `img` inside `.product-card`, but stops at (excludes) anything inside `.product-card__actions` — a "donut scope." This is a genuinely different tool from BEM: BEM prevents collisions through a naming convention that a developer has to follow by hand; `@scope` enforces the boundary structurally, so even a plain `img` or `p` selector inside it can't leak out and affect something outside the block.

:::tip[This theme's convention stays BEM — @scope doesn't change that]
[Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) and this theme's project conventions settled on BEM plus one shared prefix specifically because it needs no new syntax, works in every CSS tool and linter already in use (including `shopify theme check`'s `ValidScopedCSSClass` rule, which reasons about class names, not `@scope` blocks), and keeps every selector flat and readable. `@scope` is worth knowing because it solves a real problem elsewhere in CSS, but adopting it here would mean maintaining two different scoping mechanisms side by side for no real gain — stick with BEM for this theme's own components.
:::

:::note[Browser support: Baseline Newly Available, not yet Widely Available]
`@scope` reached Chrome/Edge 118+ and Safari 17.4+ earlier, with Firefox adding support (version 146) in early 2026 — making it Baseline *Newly Available* as of March 2026, the newest status tier, not yet "Widely Available." A meaningful share of real users, especially on older Android devices or managed enterprise machines, are still on versions that predate this. Combined with the point above, there's no real reason to reach for it on this theme regardless.
:::

### `text-wrap: balance` and `text-wrap: pretty` instead of a JS headline-balancing library

```css
/* New: no JavaScript library needed to avoid an orphaned single word
   on the last line of a heading */
.hero__heading {
  text-wrap: balance;
}

.hero__body {
  text-wrap: pretty;
}
```

`balance` redistributes a block's line breaks so every line is closer to the same length — built specifically for short headings (Chromium applies it only up to six lines; longer text silently falls back to normal wrapping, so it's always safe to leave on). `pretty` is a lighter touch, aimed at paragraph text: it mainly prevents a single short word from being stranded alone on the final line, without rebalancing every line the way `balance` does.

:::note[Browser support: safe to use without a fallback — it's a progressive enhancement by nature]
`text-wrap: balance` works in Chrome 114+, Firefox 121+, Safari 17.5+. `text-wrap: pretty` is newer and Safari support only arrived in Safari 26 — but a browser that doesn't recognize a `text-wrap` value simply ignores that line and wraps text normally, so there's never a broken state to guard against. Use both freely; the worst case on an unsupporting browser is identical to never having used it at all.
:::

## Quick reference

| Old approach | New feature | Browser support (2026) |
|---|---|---|
| JS toggles a class based on a child/sibling | `:has()` | Safe everywhere |
| Sass/SCSS nesting (build step) | Native CSS nesting | Safe everywhere |
| Repeating a selector list | `:is()` / `:where()` | Safe everywhere (since 2021) |
| Padding-top percentage hack | `aspect-ratio` | Safe everywhere (since 2021) |
| Margin + `:last-child` exception | `gap` | Safe everywhere (since 2021) |
| Flattening nested grids / fixed heights | `subgrid` | Safe everywhere |
| Hardcoded tints/shades, Sass color functions | `color-mix()` | Safe everywhere |
| Multiple handwritten color variants | Relative color syntax (`oklch(from ...)`) | Usable — verify on older Safari |
| JS double-`requestAnimationFrame` hack | `@starting-style` + `allow-discrete` | Usable — check your traffic's browsers |
| `IntersectionObserver` for reveal-on-scroll | Scroll-driven animations (`animation-timeline`) | Needs a `@supports` fallback (~84% global) |
| BEM naming discipline | `@scope` | Newly available — stick with BEM here |
| JS headline-balancing library | `text-wrap: balance` / `pretty` | Safe everywhere — progressive enhancement |

## Key takeaways

- Most of the features above are already Baseline Widely Available and safe to use with no fallback at all — `:has()`, native nesting, `:is()`/`:where()`, `aspect-ratio`, `gap`, `subgrid`, and `color-mix()` all fall in this group.
- A smaller group is newer and needs a little more care: relative color syntax and `@starting-style` are usable but worth double-checking against a store's actual traffic; scroll-driven animations specifically need a `@supports` guard and a sane unanimated default, since real global support is still meaningfully below 100%.
- Not every new feature is a reason to change this theme's existing conventions — `@scope` is a genuinely interesting alternative to naming-based scoping, but this theme's established BEM-plus-prefix convention ([Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/)) already solves the same problem with zero new syntax, so it stays the standard here.
- Native CSS nesting replaces the *need* for a Sass build step, but it doesn't change this chapter's existing rule against descendant-chain selectors — nest a pseudo-class or a media query on the same block, not a different element further down the DOM.

## Further reading

- [Modern CSS Units: rem, em, px & Viewport Units](/all-about-css/modern-css-units/)
- [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/)
- [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/)
- [CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/)
- [`:has()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [CSS nesting (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [`subgrid` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [`color-mix()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [`@starting-style` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
- [`@scope` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)
- [`text-wrap` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
