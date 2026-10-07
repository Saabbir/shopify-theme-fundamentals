---
title: Icons & SVGs
description: Inline SVG vs. a sprite, and making an icon accessible either way.
---

**TL;DR:** Inline SVG vs. a sprite, and making an icon accessible either way.

## Inline SVG as a snippet: the common default

The most common approach for a small, specific set of icons is inlining each one's raw `<svg>` markup directly into the page, through its own snippet.

```liquid
{% comment %} snippets/icon-cart.liquid {% endcomment %}
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="..." fill="currentColor"/>
</svg>
```

```liquid
{% render 'icon-cart' %}
```

Inlining it this way — rather than referencing an SVG file as an `<img src="...">` — means the icon can be styled directly with CSS, most usefully `fill: currentColor`, which makes the icon automatically match whatever text color surrounds it, with no separate color variant needed for light or dark contexts.

## A sprite, for a large, shared set of icons

If a theme uses the same large set of icons across many different components, a single sprite — one `<svg>` containing every icon as a `<symbol>`, loaded once — can be more efficient than dozens of separate inline snippets repeating the same handful of icons across the page.

```liquid
<svg aria-hidden="true" focusable="false">
  <use href="#icon-cart"></use>
</svg>
```

This trades a small amount of setup complexity (defining the sprite once, usually in `theme.liquid`) for not repeating the same icon's markup every time it's used. For a smaller, more varied set of icons used inconsistently across different sections, individual inline snippets are usually simpler and perfectly fine.

## Accessibility: decorative vs. meaningful

Whether an icon needs an accessible label depends entirely on whether it's purely decorative or carries meaning on its own.

**A decorative icon** — one sitting next to text that already says the same thing ("Add to cart" next to a cart icon) — should be hidden from screen readers entirely, since announcing it would just repeat information already conveyed by the visible text:

```liquid
<svg aria-hidden="true" focusable="false">...</svg>
```

**A meaningful icon** — one that *is* the only label, like an icon-only close button with no visible text — needs an accessible name from somewhere. Don't try to put that label inside the SVG itself; label the interactive element that contains it instead:

```liquid
<button aria-label="Close">
  {% render 'icon-close' %}
</button>
```

:::caution[A genuinely common accessibility mistake]
Shipping an icon-only button or link with no text and no `aria-label` is invisible to a screen reader — a sighted shopper sees a recognizable close/cart/search icon, but a screen reader announces nothing at all, or just "button," with no indication of what it does. Any icon standing in for text, rather than alongside it, needs that text supplied some other way: `aria-label` on the control, or visually-hidden text inside it.
:::

## Key takeaways

- Inline SVG via a snippet is the common default — it allows `fill: currentColor` styling with no separate color variants, and needs no extra network request.
- A shared sprite (`<symbol>` + `<use>`) is worth the setup only once a large, consistent set of icons is reused heavily across many components.
- `aria-hidden="true"` for a decorative icon next to text that already says the same thing; `aria-label` on the containing control for an icon-only control with no visible text at all.

## Further reading

- [Accessible icon buttons](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)
