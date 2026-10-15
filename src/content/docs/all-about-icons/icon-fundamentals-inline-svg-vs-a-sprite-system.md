---
title: "Icon Fundamentals: Inline SVG vs. a Sprite System"
description: Two real strategies for shipping icons in a theme, and the actual trade-off between them — markup weight vs. network requests.
---

**TL;DR:** Two real strategies for shipping icons in a theme, and the actual trade-off between them — markup weight vs. network requests.

[12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/) introduces the two basic options; this chapter goes further into the reusable snippet pattern, systematic sizing/coloring, and accessibility depth that a real icon system needs once it's used across dozens of components. This page recaps the decision itself, with the actual trade-off spelled out rather than left implicit.

## Option 1: inline SVG, one snippet per icon

```liquid
{% comment %} snippets/icon-cart.liquid {% endcomment %}
<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <path d="..." fill="currentColor"/>
</svg>
```

Every use of `{% render 'icon-cart' %}` repeats the full `<path>` markup at that exact point in the page. This costs nothing extra over the network — it's part of the same HTML response, not a separate request — but it does mean the same path data appears in the HTML every single time the icon is used, which adds up across a page with the same icon repeated dozens of times (a cart icon on every product card, say).

## Option 2: a sprite, defined once, referenced by `<use>`

```liquid
{% comment %} Rendered once, near the top of layout/theme.liquid {% endcomment %}
<svg style="display: none;">
  <symbol id="icon-cart" viewBox="0 0 20 20">
    <path d="..." fill="currentColor"/>
  </symbol>
  <symbol id="icon-search" viewBox="0 0 20 20">
    <path d="..." fill="currentColor"/>
  </symbol>
</svg>
```

```liquid
<svg aria-hidden="true" focusable="false">
  <use href="#icon-cart"></use>
</svg>
```

Every icon's actual path data is defined exactly once, in a hidden `<svg>` of `<symbol>` definitions rendered near the top of the page — every other use is just a tiny `<use href="#icon-cart">` reference. This is the better choice specifically once the same handful of icons repeat heavily across many components, since it keeps the *repeated* markup small, at the cost of a small amount of setup (defining and maintaining the sprite in one place).

## The actual trade-off, stated plainly

| | Inline SVG per use | Sprite with `<use>` |
|---|---|---|
| Setup complexity | None — just a snippet per icon | One sprite definition to maintain |
| Markup repeated per use | Full path data, every time | A tiny `<use href="#...">` reference |
| Extra network request | None | None (the sprite ships inline, in the same HTML) |
| Best for | A smaller, varied set of icons, each used only a few times | A small, consistent icon set reused heavily across many components |

Neither option costs an *extra HTTP request* in a typical theme setup — both are inlined directly into the page's HTML. The real trade-off is markup size at scale: a theme using the same 10 icons across 50 product cards sends that path data 50 times with inline SVG, or once (plus 50 tiny `<use>` references) with a sprite. For a smaller or more varied icon set, inline SVG's simplicity usually wins; the sprite only pays for its setup cost once the repetition is heavy enough to matter.

:::note[A sprite loaded from an external .svg file is a different, less common option]
A sprite can also live in its own `.svg` file in `assets/`, loaded once via `<img>` or fetched and injected — this does cost a real extra network request, in exchange for being cacheable independently of the page's HTML. It's a reasonable choice for a very large, rarely-changing icon set, but adds real complexity (a fetch-and-inject step, or losing `currentColor` styling if loaded as a plain `<img>`) that most theme icon systems don't need.
:::

## Key takeaways

- Inline SVG per icon is the simplest default — no setup, works for any icon count, costs nothing extra until the same icon repeats heavily across many instances on one page.
- A `<symbol>`/`<use>` sprite, defined once near the top of the page, is worth the setup specifically once a small, consistent icon set is reused heavily — it shrinks the *repeated* markup, not the number of network requests.
- Both approaches ship inline, in the same HTML response, in a typical theme setup — a sprite loaded from a separate `.svg` file is a different, rarer choice with its own real trade-offs.

## Further reading

- [12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/)
- [37.2. A Reusable Icon Snippet Pattern](/all-about-icons/a-reusable-icon-snippet-pattern/)
- [19. Media Deep Dive](/media-deep-dive/)
