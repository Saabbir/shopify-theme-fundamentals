---
title: "Responsive CSS, Container Queries & Logical Properties"
description: Breakpoints vs. container queries, and writing CSS that doesn't assume left-to-right.
---

**TL;DR:** Breakpoints vs. container queries, and writing CSS that doesn't assume left-to-right.

## A consistent breakpoint, used everywhere

```css
@media screen and (max-width: 749px) {
  /* mobile styles */
}
```

`749px` (equivalently, "mobile starts below 750px") is the convention used throughout this site's examples — it's not a rule Shopify enforces, just a common, round cutoff separating typical phone/small-tablet widths from larger tablet and desktop widths. What actually matters more than the exact number is picking one breakpoint and applying it consistently across a theme, rather than letting each section decide its own slightly different cutoff — a theme with `748px` in one file and `752px` in another produces a visible, confusing seam where two sections disagree about which layout a given width should get.

## The limit of a media query: it only knows about the viewport

A `@media (max-width: ...)` query answers one question: how wide is the browser window? That's the right question for a layout decision that depends on the whole page — but it's the wrong question for a component that might be placed in more than one context. A product card at full page width and the same product card squeezed into a narrow sidebar both see the same viewport width, even though the card itself has very different available space in each place.

## Container queries: a component responding to its own container

**Container queries** answer a different question: how wide is *this component's own container*, regardless of the viewport? This is directly relevant to a theme, where the same section or block can end up in more than one layout context.

```css
.product-grid {
  container-type: inline-size;
  container-name: product-grid;
}

.product-card {
  display: grid;
  gap: 0.5rem;
}

@container product-grid (min-width: 600px) {
  .product-card {
    grid-template-columns: 100px 1fr;
  }
}
```

`container-type: inline-size` opts an element into being a size-query container for its descendants; `@container` then queries that container's width specifically, not the viewport's. A `product-card` laid out inside a wide `product-grid` gets the two-column treatment; the exact same card, reused inside a narrower sidebar widget, correctly stays single-column — without either needing a different class or a viewport-based media query that can't tell the two contexts apart.

:::tip[Use container queries for component-level layout decisions; viewport media queries for page-level ones]
"Should the whole page switch to a mobile layout?" is a viewport question — keep using `@media`. "Should *this specific card* switch to a two-column layout?" is a container question, especially once that card might be reused somewhere narrower or wider than the full page. Mixing the two isn't wrong; picking whichever one actually answers the question being asked is what matters.
:::

## Fluid sizing without a breakpoint at all: `clamp()`

[Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) covers `clamp()` for font sizing specifically; the same function works for any numeric CSS value that should scale smoothly with the viewport instead of jumping at a fixed breakpoint:

```css
.hero-banner {
  padding-block: clamp(2rem, 5vw, 6rem);
}
```

This reads as: never smaller than `2rem`, never larger than `6rem`, and `5vw` in between — producing padding that grows continuously as the viewport widens, rather than snapping abruptly at `749px`.

## Logical properties: writing CSS that doesn't assume left-to-right

Most CSS tutorials teach physical properties — `margin-left`, `padding-top`, `text-align: left`. These describe a direction tied to how English-language, left-to-right pages happen to be laid out. **Logical properties** describe the same spacing in terms of the flow of text instead of a fixed physical direction.

| Physical property | Logical equivalent |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-top` / `padding-bottom` | `padding-block-start` / `padding-block-end` (shorthand: `padding-block`) |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |
| `width` / `height` (in some contexts) | `inline-size` / `block-size` |
| `text-align: left` | `text-align: start` |

```css
.callout {
  padding-block: var(--space-lg);
  margin-inline-start: var(--space-md);
  text-align: start;
}
```

`inline` always means "along the direction text flows" (horizontal, in English; still horizontal, but reversed, in Arabic or Hebrew) and `block` always means "along the direction lines stack" (vertical, in nearly every writing system in practical use). [RTL, Print & Other Rendering Contexts](/all-about-css/rtl-print-and-other-rendering-contexts/) covers exactly what breaks if physical properties are used instead, once a store's language actually flips direction.

## Key takeaways

- A viewport media query answers "how wide is the browser window?" — right for page-level layout. A container query answers "how wide is this component's own container?" — right for a component that might be reused in more than one context.
- `clamp()` produces smooth, continuous scaling for any numeric value, not just font size, avoiding an abrupt jump at a fixed breakpoint.
- Logical properties (`margin-inline-start`, `padding-block`, `text-align: start`) describe spacing relative to text flow, not a fixed physical direction — using them by default costs nothing and avoids a layout that silently breaks the moment a store adds a right-to-left language.

## Further reading

- [Modern CSS Units: rem, em, px & Viewport Units](/all-about-css/modern-css-units/) — vw/vh and their dvh/svh/lvh variants, and the full rem/em/px decision
- [CSS container queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [CSS logical properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- [Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/)
