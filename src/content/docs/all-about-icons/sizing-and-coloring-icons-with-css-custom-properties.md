---
title: Sizing & Coloring Icons with CSS Custom Properties
description: currentColor for free theme-wide color matching, and a --icon-size token instead of hardcoding width/height per use.
---

**TL;DR:** `currentColor` for free theme-wide color matching, and a `--icon-size` token instead of hardcoding width/height per use.

[12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/) introduces `fill: currentColor`; this page covers the full, systematic pattern — sizing through one custom property instead of a `width`/`height` attribute repeated at every use, and what to do with an icon that uses `stroke` instead of `fill`.

## Color: `currentColor` is almost always the right default

```liquid
<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
  {% render 'icon', icon: 'heart' %}
</svg>
```

```css
.button {
  color: var(--color-button-label);
}

.button svg {
  /* No color rule needed here at all — the icon already
     inherits the button's text color via currentColor. */
}
```

`fill="currentColor"` on the `<svg>` itself means every icon automatically matches whatever `color` applies to its containing element — a button's icon matches the button's label color, a link's icon matches the link's text color, with zero icon-specific CSS and zero separate "dark mode" icon variant needed. This is the single biggest reason inline SVG (rather than a plain `<img>` referencing an external `.svg` file) is the common default: an `<img>`-referenced SVG can't see the page's `currentColor` at all, since it's loaded as an isolated external document.

### The one case `currentColor` doesn't cover: a multi-color icon

```liquid
<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
  <path d="..." fill="#2c6e5c" />
  <path d="..." fill="#f4a73e" />
</svg>
```

A genuinely multi-color icon (a brand mark with more than one fixed color, say) has to hardcode its own colors on each path — `currentColor` only ever applies to the element's own single inherited color. This is a legitimate exception, not a reason to abandon `currentColor` for the far more common single-color icon.

## Size: one custom property, not a repeated `width`/`height`

```css
svg.icon {
  width: var(--icon-size, 1.25rem);
  height: var(--icon-size, 1.25rem);
  flex-shrink: 0;
}
```

```liquid
<svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
  {% render 'icon', icon: 'heart' %}
</svg>

<svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" style="--icon-size: 2rem;">
  {% render 'icon', icon: 'heart' %}
</svg>
```

A single `.icon` class carries the default size as a fallback inside `var(--icon-size, 1.25rem)`; any specific use that needs a different size overrides just the one custom property inline, rather than repeating `width`/`height` as HTML attributes (which can't respond to a settings-driven value) or writing a new CSS class per size variant. `flex-shrink: 0` is a small, easy-to-forget detail — without it, an icon sitting next to text inside a flex container can get visually squeezed narrower than its own `viewBox` the moment the text runs long, distorting the icon's proportions.

### A settings-driven icon size

```liquid
{% liquid
  assign icon_size = block.settings.icon_size | default: 24
%}
<svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" style="--icon-size: {{ icon_size }}px;">
  {% render 'icon', icon: block.settings.icon %}
</svg>
```

Because sizing flows through one custom property, a merchant-facing `range` setting for icon size needs nothing more than writing that one setting's value into `--icon-size` — the icon's own markup, and the `.icon` class's CSS, never need to change per instance.

## Icons built with `stroke` instead of `fill`

```css
svg.icon--stroke {
  stroke: currentColor;
  fill: none;
}
```

A different icon style (outline-style icons, common in some icon sets) draws its shape with `stroke` rather than `fill` — `currentColor` works exactly the same way on `stroke`, it's just a different SVG property to apply it to. Check which property a given icon set actually uses (usually visible in the raw SVG's own `fill`/`stroke` attributes) rather than assuming every icon set works the same way.

## Key takeaways

- `fill="currentColor"` (or `stroke="currentColor"` for outline-style icons) on the `<svg>` wrapper is what makes an icon automatically match its surrounding text color, with no separate color variant needed per theme or context.
- A multi-color icon is a real, legitimate exception to `currentColor` — its paths need their own hardcoded colors.
- Size through one `--icon-size` custom property (with a sensible fallback) scales to a settings-driven size with zero markup changes, unlike hardcoded `width`/`height` attributes or a CSS class per size variant.
- `flex-shrink: 0` on an icon inside a flex row prevents it from being visually squeezed when neighboring text runs long.

## Further reading

- [12.3. Icons & SVGs](/media-and-assets/icons-and-svgs/)
- [29.4. CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/)
- [37.2. A Reusable Icon Snippet Pattern](/all-about-icons/a-reusable-icon-snippet-pattern/)
