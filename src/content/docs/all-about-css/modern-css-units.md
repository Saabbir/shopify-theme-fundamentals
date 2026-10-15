---
title: "Modern CSS Units: rem, em, px & Viewport Units"
description: Choosing the right unit for the job — rem vs em vs px, viewport units (vw, dvh, svh), ch, lh, and when to reach for clamp() instead of a fixed value.
---

**TL;DR:** Choosing the right unit for the job — rem vs em vs px, viewport units (vw, dvh, svh), ch, lh, and when to reach for clamp() instead of a fixed value.

Every CSS length needs a unit, and modern CSS offers far more than `px`: `rem`, `em`, `vw`, `dvh`, `svh`, `ch`, `lh`, and `clamp()` all exist for real, different reasons — not as interchangeable alternatives to the same thing. Picking the wrong one doesn't usually break anything visibly today; it quietly breaks for a shopper who's resized their browser's default font size, or on a phone whose address bar shows and hides as they scroll. This page covers what each unit is actually relative to, and a concrete decision for when each one is the right choice in a Shopify theme.

## rem vs. em vs. px: what each is actually relative to

| Unit | Relative to |
|---|---|
| `px` | Nothing — an absolute length (roughly one device pixel at default zoom) |
| `rem` | The root (`<html>`) element's font-size |
| `em` | The current element's own font-size (or its inherited one) |

### `px`: absolute, and that's exactly the point sometimes

A `px` value never changes, no matter what font-size a shopper's browser is set to. That's a problem for anything meant to scale with text — but it's the right choice for the handful of properties that genuinely shouldn't scale with text at all: a 1px hairline border, a 2px focus outline offset, a box-shadow's blur radius. These are fixed visual details, not typographic ones.

```css
.card {
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}
```

:::note[Shopify's merchant-facing range settings use px too — for a different reason]
[7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) explains why a `padding_top` `range` setting is defined in `px`, even though the CSS it generates ultimately resolves to a `rem`-based scale: a merchant dragging a slider thinks in pixels, not root-relative units, and `px` is simply the more legible unit for *that* UI, independent of what the underlying token system does with it.
:::

### `rem`: the default for almost everything else

`rem` ("root em") is always relative to the `<html>` element's font-size — usually `16px` by default, but a real, respected number: if a shopper has increased their browser's default text size (a common accessibility adjustment for low vision), every `rem` value on the page scales right along with it. A `px` value does not — it stays exactly the same size regardless of that preference, which is a real, measurable accessibility problem at scale.

```css
.product-title {
  font-size: 1.5rem;
  margin-block-end: 1rem;
}
```

Use `rem` as the default unit for font sizes, spacing (margin, padding, gap), and most component dimensions. It's predictable — a `2rem` value means the same thing no matter how deeply the element is nested in the DOM — and it respects the one accessibility preference most directly tied to text size.

### `em`: relative to *this* element, which is the whole point — and the whole risk

`em` is relative to the font-size of the element it's used on (or, for `font-size` itself, the *parent's* font-size). That makes it the right unit specifically when a property should scale proportionally with whatever that one element's font-size happens to be — not the page's root size.

```css
.eyebrow {
  letter-spacing: 0.08em;
}
```

[18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/#letter-spacing-and-text-transform-smaller-often-forgotten-levers) already covers this exact case: `letter-spacing` in `em` stays proportionally correct as font-size changes, because it's relative to *that* text's own size — a `rem` value wouldn't track a locally larger or smaller font-size the same way.

:::caution[`em` compounds when nested — `rem` doesn't]
Because `em` is relative to the *current* element, nesting elements that each set their own `font-size` in `em` compounds: a `1.2em` inside another `1.2em` inside another `1.2em` multiplies together, producing a font-size nobody actually chose. This is the classic "nested list text keeps shrinking" bug. `rem` never has this problem — it's always relative to the root, no matter how many levels deep an element sits. Reach for `em` deliberately, for a property that should genuinely scale with one specific element's own size (`letter-spacing`, an icon sized relative to its button's text); default to `rem` everywhere else.
:::

## Unitless `line-height`: already covered, still the rule

`line-height` is its own case, covered in full on [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/#line-height-why-the-value-usually-has-no-unit) — a bare number (`line-height: 1.5`), not `1.5em` or `150%`, because only the unitless form recalculates correctly for every descendant's own font-size instead of inheriting a value proportioned for the parent's.

## Viewport units: vw, vh, and why plain vh breaks on mobile

`vw` and `vh` are relative to the browser's viewport: `1vw` is 1% of the viewport's width, `1vh` is 1% of its height.

```css
.hero {
  height: 100vh;
}
```

This looks right until it's tested on an actual phone: most mobile browsers show and hide their address bar as a shopper scrolls, which changes the *actual* visible viewport height without firing a resize event the way a real window resize does — so a section sized with `100vh` can visibly jump or leave a gap the moment the address bar shows or hides.

### `dvh`, `svh`, `lvh`: the fix, and what each one means

Three newer viewport-height units solve this directly. They reached Baseline support across every major browser engine in mid-2025 (Chrome 108+, Safari 15.4+, Firefox 101+), with global usage above 94% as of this writing:

| Unit | Meaning |
|---|---|
| `svh` | **Small** viewport height — the height when the browser's UI (address bar, etc.) is fully *visible*. The safe, worst-case minimum. |
| `lvh` | **Large** viewport height — the height when the browser's UI is fully *hidden*. The maximum possible. |
| `dvh` | **Dynamic** viewport height — tracks the *actual*, current visible height live, updating as the browser UI shows or hides. |

```css
.hero {
  height: 100vh; /* fallback for browsers that don't understand dvh */
  height: 100dvh;
}
```

Write the `vh` fallback first and `dvh` second — a browser that doesn't recognize `dvh` simply ignores that line and keeps the `vh` value above it, no `@supports` block needed. `dvh` is the right choice for a full-height hero or section on mobile specifically because it eliminates the jump; `svh` is worth reaching for instead when a jump is more acceptable than content being covered by the browser's UI at any point (treat `svh` as "the size I can always rely on being visible").

## `ch`: sizing by character width, for readable line length

`1ch` is the width of the `0` character in the current font — not exact for every character, but a reliable enough proxy for "how many characters fit on a line," which makes it the right unit specifically for capping a block of body text at a readable line length (commonly called the *measure*):

```css
.article-body {
  max-width: 65ch;
}
```

A line of body text that's too wide is measurably harder to read — the eye loses track of which line to return to. 50–75 characters per line is the generally accepted readable range for body text; `65ch` is a reasonable, commonly-used default. This is the same "measure" concept [27.4. Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) references in its max-width scale — a real production theme maintaining exactly this kind of bound on several of its text presets.

## `lh`: a newer unit, useful but worth a fallback

`1lh` equals the *computed* `line-height` of the element it's used on — useful for spacing that should stay in vertical rhythm with a block of text (a margin that's always exactly "one line," regardless of what `line-height` that text actually computed to):

```css
.article-body p + p {
  margin-block-start: 1lh;
}
```

`lh` reached broad, Baseline-level support slightly more recently than `dvh`/`svh`/`lvh` (Chrome/Edge 109+, Safari 16.4+, Firefox 120+) — widely available, but newer enough that writing a fallback margin value first (the same "fallback, then modern unit" pattern as `dvh` above) is worth including for a storefront that needs to support slightly older browsers.

## `clamp()` vs. a fixed `rem`: the actual decision

[18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) already covers `clamp()`'s mechanics in full — this is the decision that page doesn't spell out explicitly: *when* to reach for it at all, versus just picking one `rem` value.

**Default to a fixed `rem` value.** Most sizes in a theme — body text, most spacing, most component dimensions — don't need to visually scale smoothly across every possible viewport width. A fixed `1rem` body text size, or a `--space-md: 1rem` spacing token, is simpler to reason about, easier to debug (the computed value is always the same number), and exactly as accessible as a `clamp()`-based one.

**Reach for `clamp()` specifically when a value needs to scale *continuously*, and a fixed value plus one mobile override would visibly look worse.** This is a narrower case than it might seem — mostly large, standalone display headings and generous hero padding, where the gap between a mobile value and a desktop value is large enough that jumping between them at a single breakpoint produces a visible, jarring size change, and a merchant is likely to view the page at many viewport widths in between (resizing a browser, or a tablet somewhere between phone and desktop sizes).

**For most spacing, the existing two-value pattern already solves this without `clamp()`.** [Spacing settings](/design-tokens/spacing-and-layout-tokens/) on this site already expose a desktop value and a separate mobile value (`padding_top` / `padding_top_mobile`), switched at one breakpoint. That's not a worse version of `clamp()` — it's a deliberately simpler tool for a case that doesn't need continuous scaling: a merchant picks two sensible values, and nothing has to be computed in between. Reach for `clamp()` only when continuous scaling is actually the better result, not as a default replacement for this already-established, simpler pattern.

## A quick reference

| What you're sizing | Default choice | Why |
|---|---|---|
| Font size (body, most UI text) | `rem` | Scales with the shopper's font-size preference |
| Font size (large display heading) | `clamp(rem, rem + vw, rem)` | Needs continuous scaling across a wide viewport range |
| `letter-spacing` | `em` | Should track *this* element's own font-size |
| `line-height` | unitless | Recalculates per descendant, doesn't inherit a fixed value |
| Spacing (margin, padding, gap) | `rem`, or a settings-driven `px` scale per [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) | Predictable, scales with root font-size |
| Border width, shadow offsets | `px` | A fixed visual detail, not a typographic one |
| Full-viewport-height section | `100dvh` (with a `100vh` fallback) | Avoids the mobile address-bar jump |
| Readable line length (measure) | `ch` | Proxies character count per line |
| Spacing tied to a text block's rhythm | `lh` (with a fallback) | Tracks the actual computed line-height |

## Key takeaways

- `px` is absolute and ignores a shopper's font-size preference — right only for fixed visual details (borders, shadows), not typography.
- `rem` is relative to the root font-size and is the right default for nearly everything else; it respects a shopper's accessibility font-size preference and never compounds, unlike `em`.
- `em` is relative to the *current* element's own font-size — the right choice for a property that should scale with that specific element (`letter-spacing`), but it compounds when nested, which `rem` never does.
- `line-height` should stay unitless, not `em` or `%` — already covered on [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/).
- `100vh` breaks on mobile because the browser's address bar changes the real visible height without a resize event; `100dvh` (with a `100vh` fallback) fixes this directly. `dvh`/`svh`/`lvh` and `lh` have all reached broad, Baseline browser support, but writing a fallback value first is still worth doing.
- `ch` sizes by character width — the right unit for capping body text at a readable line length (`max-width: 65ch`).
- Default to a fixed `rem` value; reach for `clamp()` only when a value genuinely needs continuous scaling across viewport widths and a fixed value plus a mobile override would look visibly worse — not as a blanket replacement for the simpler, already-established desktop/mobile settings pattern.

## Further reading

- [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/) — unitless line-height, and `em` for letter-spacing, covered in full
- [18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) — `clamp()` mechanics, and choosing real min/max values
- [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) — the same `clamp()` pattern applied programmatically across a full preset scale
- [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) — why spacing settings use `px` while the generated tokens use `rem`, and the desktop/mobile pattern as an alternative to `clamp()`
- [29.5. Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/) — `clamp()` applied beyond font-size, and viewport vs. container queries
- [Small, Large, and Dynamic viewport units (caniuse)](https://caniuse.com/viewport-unit-variants)
- [`<length>` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/length)
