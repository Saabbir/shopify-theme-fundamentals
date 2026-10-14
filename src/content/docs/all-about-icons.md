---
title: All About Icons
description: A dedicated UI-component chapter on icons — the dispatcher snippet pattern, systematic sizing/coloring, and accessibility in depth.
---

**TL;DR:** A dedicated UI-component chapter on icons — the dispatcher snippet pattern, systematic sizing/coloring, and accessibility in depth.

This chapter is a complete, standalone reference on icons in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. [Icons & SVGs](/media-and-assets/icons-and-svgs/) in Part 1 covers the same basic inline-SVG-vs-sprite choice at intro level; this chapter goes well beyond it into the reusable snippet pattern Shopify's own Horizon theme actually uses, systematic sizing and coloring, and the accessibility mechanics behind both the decorative and meaningful cases.

## What's in this chapter

| Page | Answers |
|---|---|
| [Icon Fundamentals: Inline SVG vs. a Sprite System](/all-about-icons/icon-fundamentals-inline-svg-vs-a-sprite-system/) | The real trade-off (repeated markup, not extra requests) between the two approaches |
| [A Reusable Icon Snippet Pattern](/all-about-icons/a-reusable-icon-snippet-pattern/) | One dispatcher snippet keyed by name, quoted directly from Horizon's real `snippets/icon.liquid` |
| [Sizing & Coloring Icons with CSS Custom Properties](/all-about-icons/sizing-and-coloring-icons-with-css-custom-properties/) | `currentColor` for free theme-wide color matching, and `--sol-icon-size` instead of hardcoded `width`/`height` |
| [Icon Accessibility: Decorative vs. Meaningful](/all-about-icons/icon-accessibility-decorative-vs-meaningful/) | `aria-hidden`, labeling the control vs. a real `<title>`, and why icon fonts are a structural hazard |
| [A Complete Example](/all-about-icons/a-complete-example/) | One icon-rendering snippet covering all three real accessibility situations at once |

## Further reading

- [Icons & SVGs](/media-and-assets/icons-and-svgs/)
- [Horizon's real `snippets/icon.liquid`](https://github.com/Shopify/horizon/blob/main/snippets/icon.liquid)
- [All About Buttons](/all-about-buttons/)
