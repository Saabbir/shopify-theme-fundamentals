---
title: "RTL, Print & Other Rendering Contexts"
description: What actually changes once a store ships a right-to-left language, or a page gets printed.
---

**TL;DR:** What actually changes once a store ships a right-to-left language, or a page gets printed.

## RTL isn't a hypothetical edge case

A theme becomes translatable the moment `locales/` exists at all — covered in [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) — and a merchant can add a right-to-left language (Arabic, Hebrew) to their store without a developer doing anything special for it, *unless* the theme's CSS was written with physical properties that silently assume left-to-right. [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/) introduced logical properties; this page covers what actually happens, concretely, when a page flips direction.

## What `dir="rtl"` actually changes

When a page's language is right-to-left, the browser (driven by the `dir` attribute Shopify sets based on the store's language) mirrors the entire layout: text flows right-to-left, and anything written with *logical* properties mirrors correctly along with it.

```css
.card {
  padding-inline-start: 1rem;
  text-align: start;
}
```

In a left-to-right page, `padding-inline-start` behaves exactly like `padding-left`, and `text-align: start` like `text-align: left`. In a right-to-left page, both automatically flip — `padding-inline-start` becomes padding on the *right*, and `text-align: start` becomes right-aligned — with zero extra code, because `inline-start` always means "wherever text starts," not a fixed physical side.

## What breaks, concretely, with physical properties

```css
/* This stays stuck on the visual left, even in a right-to-left page */
.card {
  padding-left: 1rem;
  text-align: left;
}
```

This is the failure mode worth seeing explicitly: a card meant to have breathing room before its content, correctly padded on the left in English, keeps that padding glued to the visual left even once the whole page has flipped to flow right-to-left — producing lopsided spacing that reads as broken, specifically because the padding is now on the side text is *ending*, not starting. This kind of bug is easy to miss during development (an English-only theme never shows it) and easy to find, once a merchant actually adds a right-to-left language and looks at the result.

## Things logical properties alone don't fix

Logical properties handle spacing, alignment, and positioning — they don't automatically fix:

- **Directional icons** — an arrow icon pointing right (meaning "next" or "forward" in English) should visually point left in a right-to-left context. This needs an explicit rule, often as simple as `[dir="rtl"] .icon-arrow { transform: scaleX(-1); }`.
- **Any hardcoded `left`/`right` in JavaScript** — if a script reads or sets `style.left` directly (rather than letting CSS handle positioning), it needs its own RTL-aware branch; logical properties are a CSS-only concept.
- **Background images with inherent directionality** — an image containing a left-to-right arrow or a left-aligned design element doesn't automatically mirror just because its container's text direction did.

## Testing this for real

:::tip[A quick way to check, without changing a store's actual language]
Add `dir="rtl"` directly to an element via browser devtools (or temporarily to `<html>`) and look at the page. Anything that visually breaks — padding on the wrong side, an arrow pointing the wrong way, content overflowing oddly — is exactly what a real right-to-left shopper would see. This is a much faster check than actually switching a store's language setting during development.
:::

## Print stylesheets: a different, narrower rendering context

A print stylesheet answers a different question than responsive or RTL CSS: what should this page look like on paper, where there's no hover state, no viewport to resize, and often no need for a site's full navigation or decorative chrome?

```css
@media print {
  .site-header,
  .site-footer,
  .announcement-bar,
  [data-add-to-cart] {
    display: none;
  }

  body {
    color: #000;
    background: #fff;
  }
}
```

A print stylesheet is usually about *removing* things (navigation, interactive controls, anything that makes no sense on paper) and simplifying color (printing a light-on-dark hero section in its screen colors usually wastes ink and prints poorly). Most Shopify themes need, at most, a small `@media print` block for genuinely print-relevant pages (an order confirmation, perhaps) rather than a comprehensive print design for the entire storefront.

## Key takeaways

- Logical properties aren't just a nice-to-have abstraction — they're the specific, concrete reason a theme's spacing and alignment survive a merchant adding a right-to-left language, where physical properties silently produce lopsided results.
- Logical properties don't cover everything RTL needs — directional icons and any hardcoded `left`/`right` positioning in JavaScript need their own explicit handling.
- A print stylesheet is a narrow, separate concern from responsive or RTL CSS — mostly about hiding irrelevant chrome and simplifying color for paper, not a full redesign.

## Further reading

- [CSS logical properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/)
- [The print media type (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/print)
