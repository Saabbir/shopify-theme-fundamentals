---
title: Font-Loading Performance
description: font-display, preloading, and avoiding layout shift while a font loads.
---

**TL;DR:** `font-display`, preloading, and avoiding layout shift while a font loads.

## The problem: text has to render before the custom font arrives

A font file, even a small one, takes real time to download. Browsers have to decide what to do with text that's ready to display before that download finishes — and the choice they make by default isn't always the right one for a storefront.

## `font-display`: controlling what happens during that gap

`font_face` generates the `@font-face` rule, but you can control its `font-display` behavior, which decides how the browser handles the gap between "text is ready" and "custom font has loaded":

- `swap` — show a fallback font immediately, then swap to the real font once it loads. The most common choice for storefronts: text is readable right away, at the cost of a visible font swap once loading finishes.
- `block` — show nothing (an invisible placeholder) for a short period, then swap in the real font. Avoids a visible swap, but means text is briefly invisible, which is rarely the better trade for actual store content.
- `optional` — the browser is free to skip the font swap entirely if the download isn't fast enough, keeping the fallback instead. Best for a font that's a nice-to-have detail rather than important to the brand.

:::tip[swap is the right default for most storefronts]
Unless there's a specific reason not to, `swap` is the sensible default — reading or shopping is rarely worth delaying for a specific typeface, and a brief font swap is a smaller problem than text that's invisible while loading.
:::

## Avoiding layout shift during the swap

A `swap` strategy solves "text is readable immediately," but introduces a different problem: if the fallback font and the real font have noticeably different letter widths, text can visibly reflow once the swap happens — headings jumping to a new line, buttons resizing. This is a real, measurable layout shift, the kind Core Web Vitals specifically penalizes.

The most reliable fix is picking a fallback font with metrics (character widths, line height) close to the real font, rather than an arbitrary generic fallback. Some type foundries publish a matched fallback specifically for this purpose; when one isn't available, testing a few common system fonts side-by-side with the real font and picking whichever causes the least visible reflow is a reasonable manual alternative.

## Preloading a critical font

For a font used in a highly visible, above-the-fold element (a heading in the hero section, say), you can hint to the browser to start downloading it earlier than it otherwise would, by adding a `<link rel="preload">` for that specific font file in `theme.liquid`'s `<head>`. This matters most for the one or two fonts visible the instant a page loads — preloading every font a theme uses defeats the purpose, since preloading too much just competes for the same early bandwidth it was meant to protect.

## Key takeaways

- `font-display: swap` is the sensible default for most storefronts — readable text immediately, with an acceptable visible swap once the real font loads.
- A fallback font with similar letter-width metrics to the real font reduces the layout shift that a font swap can otherwise cause.
- Preloading is worth it only for a font visible immediately on page load — preloading everything cancels out the benefit.

## Further reading

- [`font-display` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [Theme performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
