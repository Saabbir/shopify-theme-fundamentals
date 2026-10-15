---
title: "Interactive States: Hover, Focus, Active & Disabled"
description: Four states every button needs, one of which is routinely implemented wrong — and a real, automatic way to compute one of them.
---

**TL;DR:** Four states every button needs, one of which is routinely implemented wrong — and a real, automatic way to compute one of them.

A button isn't one static appearance — it's at least four, and skipping any of them is a real, specific failure for someone using the keyboard, not a cosmetic nitpick.

## The four states

```css
.button { }              /* resting */
.button:hover { }        /* pointer is over it */
.button:focus-visible { }/* keyboard focus */
.button:active { }       /* being pressed, mouse or keyboard */
.button:disabled,
.button[aria-disabled="true"] { } /* not currently actionable */
```

`:hover` and `:active` are familiar. The two worth slowing down on are focus and disabled — both are where real bugs live.

## Focus: use `:focus-visible`, not `:focus`

```css
.button:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

`:focus` matches *every* time an element receives focus, including a mouse click — which is exactly why so many sites remove the focus outline with `:focus { outline: none; }`, to stop an outline "flashing" on every click, and in doing so remove it for keyboard users too, who have no other way to see where they are on the page. `:focus-visible` solves this at the CSS level: the browser itself decides when focus should be visibly indicated (reliably, on keyboard navigation; not on a plain mouse click), so there's no need to choose between "no ugly click outline" and "keyboard users can see where they are" — both are possible at once.

:::caution[Never remove a focus outline without replacing it]
`outline: none` with nothing in its place is one of the most common, and most damaging, button accessibility bugs — it works perfectly for a mouse user and makes the entire page unusable for a keyboard-only user, who loses any visual sense of where they currently are. If the default outline doesn't match a theme's design, replace it with a custom one (as above) — never remove it outright.
:::

## Disabled: `disabled` vs. `aria-disabled` are not interchangeable

```html
<button type="submit" disabled>Add to cart</button>
<button type="submit" aria-disabled="true">Add to cart</button>
```

These look similar and behave very differently:

- **The native `disabled` attribute** removes the button from the tab order entirely, and the browser blocks all interaction with it — no click, no focus, no keyboard activation. A screen reader announces it as "dimmed" or "unavailable." This is correct for a button that's genuinely not actionable yet (an unselected required option, say) where there's nothing useful to tell the user by focusing it.
- **`aria-disabled="true"`** keeps the element focusable and in the tab order, but signals to assistive technology that activating it won't do anything right now. The *visual* disabled look still needs a CSS hook (`[aria-disabled="true"]`), and a click handler still needs to check it and bail out — `aria-disabled` is announcement-only; it doesn't block anything on its own.

The real reason to reach for `aria-disabled` instead of `disabled`: a genuinely disabled (removed-from-tab-order) element can't be reached by keyboard at all, which means a keyboard user can never discover *why* it's disabled if that reason is explained nearby (a tooltip, a validation message). Keeping it focusable with `aria-disabled` means that explanation stays reachable.

:::note[Horizon's own disabled-link pattern]
[36.1. Button Fundamentals](/all-about-buttons/button-fundamentals/) already showed this: when Horizon's button block has no destination set yet, it renders `role="link" aria-disabled="true"` rather than removing the `href` and leaving a silently broken element. It stays reachable and correctly announced as disabled, exactly the pattern described above.
:::

## A hover color doesn't have to be hand-picked

A hover state is usually "slightly darker" or "slightly lighter" than the resting color — and hand-picking that shade for every color a merchant might choose is both a lot of manual work and something that can go visibly wrong the moment a merchant picks an unexpected base color. Horizon computes it instead, read directly from its real source:

```liquid
{%- liquid
  assign hover_bg_brightness = effective_hover_bg | color_brightness
  if hover_bg_brightness > 128
    assign effective_hover_text = 'var(--palette-darkest)'
  else
    assign effective_hover_text = 'var(--palette-lightest)'
  endif
-%}
```

`color_brightness` returns a 0–255 brightness value for any color — Horizon checks it and picks dark or light text automatically, rather than a merchant having to separately choose a hover text color that happens to stay readable against whatever hover background gets computed. [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/) covers `color_brightness` and its relatives generically; this is that exact filter solving a real, specific accessibility problem — unreadable hover text — automatically.

:::tip[The same instinct, applied to a focus ring]
Horizon's real custom-button styling goes one step further: when a button's background is fully transparent (`alpha == 0`), it uses the *text* color for the focus outline instead of the background color, since outlining a transparent background in its own color would be invisible. The underlying idea generalizes: don't hardcode a hover or focus color by hand when a merchant's own color choice could make it unreadable or invisible — compute it from what's actually there.
:::

## Key takeaways

- A button needs at least four real states (resting, hover, focus, active) plus a disabled state — skipping focus or getting disabled wrong is a real accessibility failure, not a visual nitpick.
- Use `:focus-visible`, not `:focus` — it shows an outline reliably on keyboard navigation without the "flash on every mouse click" problem that leads many sites to remove focus outlines entirely.
- Never remove a focus outline without replacing it with a custom one.
- The native `disabled` attribute removes an element from the tab order entirely; `aria-disabled="true"` keeps it reachable while announcing it as inactive — reach for the latter when a nearby explanation (a tooltip, a validation message) needs to stay discoverable by keyboard.
- A hover (or focus) color doesn't need to be hand-picked per theme color — `color_brightness` can decide automatically whether light or dark text stays readable against whatever color actually ends up there.

## Further reading

- [`:focus-visible` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [WAI-ARIA: `aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- [17.5. Every Color Filter in Depth](/all-about-colors/every-color-filter-in-depth/)
- [`snippets/resolve-custom-hover.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/resolve-custom-hover.liquid)
