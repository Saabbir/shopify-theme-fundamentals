---
title: All About JavaScript
description: Everything about JavaScript in a Shopify theme, from where it lives to Web Components, theme editor events, and loading strategy.
---

**TL;DR:** Everything about JavaScript in a Shopify theme, from where it lives to Web Components, theme editor events, and loading strategy.

This chapter is a complete, standalone reference on JavaScript in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

This chapter covers theme JavaScript as a mechanism — where it lives, how a component is structured, how it talks to Liquid and to the theme editor. A full treatment of the Cart and Section Rendering AJAX APIs is its own planned chapter; this one touches cart interaction only enough to show a complete, realistic component.

## What's in this chapter

| Page | Answers |
|---|---|
| [30.1. JavaScript Fundamentals in a Shopify Theme](/all-about-javascript/javascript-fundamentals/) | Where JS lives, `{% javascript %}` in full, script loading, and the one-tag-per-file rule |
| [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) | Custom element lifecycle callbacks, observed attributes, and encapsulation without a build step |
| [Shadow DOM, Slots & ::part()](/all-about-javascript/shadow-dom-slots-and-part/) | `<slot>`, `::slotted()`, `::part()`/`exportparts`, declarative Shadow DOM, and the real theme situations worth the isolation trade-off |
| [30.4. Talking to Liquid: Data Attributes & JSON Islands](/all-about-javascript/talking-to-liquid-data-attributes-and-json-islands/) | Getting server-rendered data into JavaScript safely, beyond a single `data-*` attribute |
| [30.5. Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/) | Every `shopify:section:*` and `shopify:block:*` event, and writing a component that survives live re-rendering |
| [30.6. Custom Events & Cross-Component Communication](/all-about-javascript/custom-events-and-cross-component-communication/) | Letting two Web Components talk without either one knowing the other exists |
| [30.7. Performance & Loading Strategy for Theme JS](/all-about-javascript/performance-and-loading-strategy-for-theme-js/) | Lazy-loading heavy components, and what `defer` already buys you for free |
| [30.8. A Complete Web Component Example](/all-about-javascript/a-complete-web-component-example/) | One component combining lifecycle, ARIA state, theme editor events, and custom events at once |

## Further reading

- [The `javascript` tag](https://shopify.dev/docs/api/liquid/tags/javascript) (shopify.dev)
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
- [Theme editor events](https://shopify.dev/docs/storefronts/themes/architecture/theme-editor/theme-editor-events) (shopify.dev)
