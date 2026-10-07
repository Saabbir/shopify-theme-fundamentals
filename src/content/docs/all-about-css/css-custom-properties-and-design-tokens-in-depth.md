---
title: CSS Custom Properties & Design Tokens in Depth
description: var() fallbacks, inheritance, @property, and where this site's token-tier coverage actually lives.
---

**TL;DR:** `var()` fallbacks, inheritance, `@property`, and where this site's token-tier coverage actually lives.

:::note[This page is about the CSS mechanism, not any one domain's tokens]
Color tokens get their own full treatment in [Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/), and typography tokens in [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — both driven by real Shopify settings, resolved into custom properties. This page doesn't repeat either; it covers how CSS custom properties themselves behave, as plain CSS, regardless of which domain's values they happen to hold.
:::

## A custom property is an ordinary CSS value, until it isn't

```css
:root {
  --space-md: 1.5rem;
}

.card {
  padding: var(--space-md);
}
```

A custom property (`--space-md`) is declared like any other CSS property, and read with the `var()` function. So far, this is no different from a Sass variable — the distinction that matters shows up in three places Sass variables don't have: inheritance, fallback values, and runtime updates.

## Fallback values: `var(--x, default)`

```css
.card {
  padding: var(--space-md, 1rem);
}
```

A custom property's second argument to `var()` is a fallback, used only if `--space-md` is unset (not defined anywhere that would reach this element) — not if it's merely empty or invalid. This matters for a component meant to work even when dropped into a context that hasn't defined every token it expects, such as a snippet reused across more than one section.

## Custom properties inherit — and that's the whole reason the per-section technique works

Unlike most CSS properties, a custom property set on an element is inherited by every descendant, unless something closer overrides it:

```css
:root {
  --color-text: #121212;
}

.dark-section {
  --color-text: #ffffff;
}
```

```html
<div class="dark-section">
  <p style="color: var(--color-text);">This text is white.</p>
</div>
```

This inheritance is exactly what makes the inline-custom-property pattern used throughout this site work at all: a section writes `style="--padding-top: 40px;"` on its own outer element, and every descendant — including its own `{% stylesheet %}` rules — can read `var(--padding-top)` without that value needing to be repeated anywhere else. Redefining a custom property at a more specific selector (like `.dark-section` above) overrides it for that subtree only, without touching the `:root` value anywhere else on the page.

## `@property`: giving a custom property a type and a real default

An ordinary custom property is untyped — it's just a string, as far as the CSS engine initially knows, which is why it can't be animated or transitioned (the browser doesn't know *how* to interpolate between two arbitrary strings). `@property` fixes that by registering a custom property with an actual syntax:

```css
@property --rotation {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.icon {
  transition: --rotation 0.2s ease;
}

.icon:hover {
  --rotation: 15deg;
}
```

Registering `--rotation` as an `<angle>` tells the browser it's safe to interpolate between two angle values during a transition — something that's otherwise not possible for a plain custom property. `@property` also lets you set `inherits: false` (opting a specific token *out* of the default inheriting behavior) and a real `initial-value`, used if the property is referenced somewhere it was never set at all, closer to how a browser's own built-in properties behave.

:::note[Reach for `@property` rarely]
Most theme tokens — colors, spacing, font families — don't need `@property`; they're read once per render and never animated. Reach for it specifically when a custom property needs to be smoothly transitioned or animated, which an ordinary, unregistered custom property cannot do.
:::

## Where each tier of token actually lives on this site

A full primitive → semantic → component tier breakdown is covered once, generically, in [Building a Token System](/all-about-colors/building-a-token-system/) — the same three-tier idea applies regardless of domain:

| Tier | What it is | Where it's covered in depth |
|---|---|---|
| Primitive | Raw values, named by appearance (`--primitive-blue-500`) | [Building a Token System](/all-about-colors/building-a-token-system/) |
| Semantic | Named by purpose, pointing at a primitive (`--color-accent`) | [Building a Token System](/all-about-colors/building-a-token-system/), [Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) |
| Component | Narrowed to one component's specific need (`--button-background-hover`) | [Building a Token System](/all-about-colors/building-a-token-system/) |

[A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/) shows color, typography, and spacing tokens merged into one real snippet, consumed by real components — the clearest single place to see the full mechanism end to end.

## Key takeaways

- `var(--x, fallback)`'s fallback only applies when `--x` is entirely unset, not when it's merely empty or invalid.
- Custom properties inherit by default, which is exactly what makes a section-scoped custom property (set once, on the outer element) readable by every descendant's CSS without repeating the value.
- `@property` gives a custom property a real type, a default value, and the ability to be animated or transitioned — reach for it only when a token genuinely needs that, not as a default for every token.

## Further reading

- [Building a Token System: Primitive, Semantic, Component](/all-about-colors/building-a-token-system/)
- [A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/)
- [CSS custom properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [`@property` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
