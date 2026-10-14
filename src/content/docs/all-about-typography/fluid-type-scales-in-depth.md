---
title: Fluid Type Scales in Depth
description: Building a full clamp()-based scale across every heading level, not just one example size.
---

**TL;DR:** Building a full `clamp()`-based scale across every heading level, not just one example size.

A **type scale** is a small, fixed list of font sizes (for a heading, a subheading, body text, a caption) that every section pulls from, instead of each one choosing its own arbitrary size. A **fluid** type scale goes one step further: rather than a fixed pixel size, each size scales smoothly between a minimum and maximum as the viewport width changes, using CSS's `clamp()` function. This page builds out a complete fluid scale and covers the reasoning behind the specific numbers you'd actually pick.

## A full scale, across every heading level

```css
:root {
  --font-size-h1: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --font-size-h2: clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem);
  --font-size-h3: clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem);
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
}
```

Notice the two smallest sizes, `--font-size-body` and `--font-size-small`, are plain fixed values, not `clamp()`. Body text and small text don't usually need to scale with the viewport the way a large heading does — a heading that's too small on mobile and too small again blown up on a wide desktop monitor is a real, visible problem; 16px of body text reads fine at nearly any viewport width. Reserve `clamp()` for sizes that actually benefit from scaling, rather than applying it to every single size out of habit.

## Reading a `clamp()` value correctly

`clamp(min, preferred, max)` takes three values: the smallest the size is ever allowed to go, a formula for how it scales in between, and the largest it's ever allowed to go. The middle value is the one worth understanding properly:

```css
--font-size-h1: clamp(2rem, 1.5rem + 2vw, 3.5rem);
```

`1.5rem + 2vw` isn't an arbitrary formula — it's a fixed base size (`1.5rem`) plus a viewport-relative amount (`2vw`, meaning 2% of the viewport's width) that grows as the window gets wider. The fixed part keeps the size from ever starting at zero on a tiny viewport; the viewport-relative part is what actually makes it "fluid." A larger `vw` coefficient makes the size grow faster as the viewport widens; a larger fixed base raises the size at every viewport width equally.

## Choosing sensible min/max values

The `min` and `max` in a `clamp()` aren't arbitrary either — they should correspond to sizes that already look right at the smallest and largest realistic viewport widths a theme supports. A reasonable way to arrive at them: pick the size that looks right on a 375px-wide phone (that's your `min`), pick the size that looks right on a 1920px-wide desktop (that's your `max`), then use an online `clamp()` calculator (searching "css clamp calculator" turns up several) to derive a `preferred` value that interpolates smoothly between the two across that range.

## Why one scale, applied everywhere, matters more than any single value

The real payoff of a type scale isn't any individual `clamp()` formula — it's that every heading level in the theme pulls from the same small, fixed set of variables, rather than each section inventing its own size. A merchant (or another developer) changing `--font-size-h1` once, in one place, should be enough to resize every H1 across the entire theme consistently.

## Key takeaways

- Reserve `clamp()` for sizes that genuinely need to scale with viewport width (large headings); fixed values are usually fine for body and small text.
- The middle value in `clamp()` combines a fixed base size with a viewport-relative amount — the `vw` coefficient controls how fast it grows.
- Derive `min`/`max` from how a size actually looks at your smallest and largest supported viewport widths, not arbitrary round numbers.

## Further reading

- [Modern CSS Units: rem, em, px & Viewport Units](/all-about-css/modern-css-units/) — when to reach for `clamp()` at all, versus a fixed `rem` value
- [`clamp()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Typography & font_picker](/design-tokens/typography-and-font-picker/)
