---
title: All About CSS
description: Everything about CSS in a Shopify theme, from where it lives to cascade layers, container queries, and loading performance.
---

**TL;DR:** Everything about CSS in a Shopify theme, from where it lives to cascade layers, container queries, and loading performance.

This chapter is a complete, standalone reference on CSS in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

This chapter covers CSS *mechanics* — where it lives, how it's scoped, how it cascades, how it loads. For how a theme's settings become the actual colors, fonts, and spacing a stylesheet reads, see [All About Colors](/all-about-colors/) and [All About Typography](/all-about-typography/) — this chapter cross-links to both rather than repeating them.

## What's in this chapter

| Page | Answers |
|---|---|
| [CSS Fundamentals in a Shopify Theme](/all-about-css/css-fundamentals/) | Where CSS lives, `{% stylesheet %}` and `{% style %}` in full, and the one-tag-per-file rule |
| [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) | BEM in depth, and the real linter check that catches a cross-file CSS dependency |
| [CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/) | `var()` fallbacks, inheritance, `@property`, and where the token tiers actually live on this site |
| [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/) | Breakpoints vs. container queries, and writing CSS that doesn't assume left-to-right |
| [Cascade Layers & Managing Specificity](/all-about-css/cascade-layers-and-managing-specificity/) | `@layer`, and taming specificity across sections, blocks, and app-injected CSS |
| [Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/) | Shopify's real CSS subsetting behavior, and what's actually left for you to optimize |
| [RTL, Print & Other Rendering Contexts](/all-about-css/rtl-print-and-other-rendering-contexts/) | What changes once a store ships a right-to-left language, or a page gets printed |
| [A Complete CSS Example](/all-about-css/a-complete-css-example/) | One section's stylesheet combining tokens, layers, container queries, and logical properties at once |

## Further reading

- [The `stylesheet` tag](https://shopify.dev/docs/api/liquid/tags/stylesheet) (shopify.dev)
- [Stylesheet content subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting) (shopify.dev)
