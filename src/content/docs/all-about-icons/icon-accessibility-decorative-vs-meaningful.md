---
title: "Icon Accessibility: Decorative vs. Meaningful"
description: aria-hidden for an icon next to text that already says the same thing, a <title> or aria-label for one that doesn't — and why an icon font is the wrong tool entirely.
---

**TL;DR:** `aria-hidden` for an icon next to text that already says the same thing, a `<title>` or `aria-label` for one that doesn't — and why an icon font is the wrong tool entirely.

[12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/) covers the core decorative-vs-meaningful split; this page goes further into the actual mechanics of each labeling option, and the specific icon-font anti-pattern that still shows up in older themes.

## The question that decides everything: does the icon repeat information that's already there?

**Decorative** — an icon sitting next to text that already conveys the same meaning:

```liquid
<button class="sol-button">
  <svg class="sol-icon" aria-hidden="true" focusable="false">{% render 'icon', icon: 'heart' %}</svg>
  {{ 'products.add_to_wishlist' | t }}
</button>
```

`aria-hidden="true"` removes the icon from the accessibility tree entirely — a screen reader announces only "Add to Wishlist," never anything about the heart icon itself, because the icon adds no information a sighted user has that the text doesn't already convey. `focusable="false"` is a smaller but real detail: without it, some older browser/screen-reader combinations (particularly Internet Explorer and some legacy Edge/JAWS pairings) can still put an SVG into the keyboard tab order even when `aria-hidden` is set, creating a focusable element with nothing announced.

**Meaningful** — an icon that *is* the only label, with no accompanying visible text:

```liquid
<button class="sol-button sol-button--icon-only" aria-label="{{ 'products.add_to_wishlist' | t }}">
  <svg class="sol-icon" aria-hidden="true" focusable="false">{% render 'icon', icon: 'heart' %}</svg>
</button>
```

The label still goes on the *containing interactive element* (`aria-label` on the `<button>`), not inside the SVG — the icon itself stays `aria-hidden="true"` even here, since the button as a whole is what needs the name, and labeling both the button and the icon separately risks the two falling out of sync if one is ever edited without the other.

## An alternative to `aria-label`: a real `<title>` inside the SVG

```liquid
<svg viewBox="0 0 20 20" fill="currentColor" role="img">
  <title>{{ 'products.add_to_wishlist' | t }}</title>
  {% render 'icon', icon: 'heart' %}
</svg>
```

A `<title>` element inside the SVG, paired with `role="img"` on the `<svg>` itself, is a real alternative to `aria-label` — useful specifically when the icon stands alone with no containing button or link to label (an icon used purely as an inline status indicator, say, not an interactive control). `role="img"` is what tells assistive technology to treat the whole SVG as one labeled image rather than trying to parse its internal `<path>`/`<title>` structure as separate elements; without it, support for `<title>` as an accessible name is inconsistent across browser/screen-reader combinations.

:::tip[Prefer labeling the control over labeling the SVG, whenever there is a control]
`aria-label` on a button or link is the more robust, more consistent choice across assistive technologies — reach for an SVG's own `<title>`/`role="img"` specifically for a standalone, non-interactive icon that has no containing control to label at all.
:::

## The anti-pattern this chapter deliberately avoids: icon fonts

An older, now-discouraged pattern uses an icon font — a custom `@font-face` where certain Unicode code points render as icon glyphs instead of letters — and a `<span class="icon-heart"></span>` with CSS `content` or a special character.

:::caution[Icon fonts are a real accessibility hazard, not just outdated]
A screen reader reads a font's underlying *character*, not however it happens to be visually rendered — an icon font glyph mapped to, say, the letter "a" can be announced literally as "a," with no indication it was meant to be a heart icon at all. This isn't a minor rendering quirk; it was always this system's core, structural problem, discovered widely enough that it's now broadly considered a legacy anti-pattern. Every pattern on this page using real inline SVG avoids this entirely, since an SVG's accessibility is controlled explicitly (`aria-hidden`, `aria-label`, `<title>`), never left to a byproduct of which Unicode character a glyph happens to occupy.
:::

## Key takeaways

- `aria-hidden="true"` plus `focusable="false"` for a decorative icon next to text that already conveys the same meaning — the icon should announce nothing to a screen reader.
- `aria-label` on the containing button or link is the right place for a label when an icon stands in for text with no visible label nearby; don't try to label the icon and its container separately.
- A `<title>` element inside the SVG, paired with `role="img"`, is a real option specifically for a standalone icon with no containing control — `aria-label` on a control remains the more robust default when a control exists.
- Icon fonts are a structural accessibility hazard (a screen reader announces the underlying character, not the icon glyph) — this is why this chapter uses inline SVG throughout, not a legacy habit worth reconsidering case by case.

## Further reading

- [12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/)
- [Accessible icon buttons (Sara Soueidan)](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)
- [ARIA: img role (MDN)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role)
