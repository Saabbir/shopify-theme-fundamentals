---
title: JavaScript in Shopify Themes
description: The {% javascript %} tag for small behavior, Web Components for everything else, and the events a live theme editor fires.
---

**TL;DR:** The `{% javascript %}` tag for small behavior, Web Components for everything else, and the events a live theme editor fires.

The earlier mention in [The Product Form](/forms/the-product-form/) — that intercepting a form submit to add to cart via JavaScript, instead of a full page reload, is "a JavaScript concern, not a Liquid one" — is what this chapter follows up on. It covers how JavaScript actually gets into a theme, the standard pattern for anything beyond the smallest behavior, and the one Shopify-specific wrinkle a storefront script never has to deal with: a merchant actively editing the page live, underneath your running code.

## What's in this section

| Page | Answers |
|---|---|
| [The `{% javascript %}` Tag](/javascript-in-shopify-themes/the-javascript-tag/) | A smaller, file-scoped counterpart to `{% stylesheet %}` — and the same Liquid limitation |
| [Web Components for Theme Behavior](/javascript-in-shopify-themes/web-components-for-theme-behavior/) | The standard pattern for anything more substantial than a one-off toggle |
| [Theme Editor Events](/javascript-in-shopify-themes/theme-editor-events/) | Why a component sometimes needs to react to a page that's changing live, underneath it |

## Further reading

- [JavaScript in themes](https://shopify.dev/docs/storefronts/themes/architecture/javascript) (shopify.dev)
