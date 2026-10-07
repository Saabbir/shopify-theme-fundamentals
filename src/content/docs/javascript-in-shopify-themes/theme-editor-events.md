---
title: Theme Editor Events
description: Why a component sometimes needs to react to a page that's changing live, underneath it.
---

**TL;DR:** Why a component sometimes needs to react to a page that's changing live, underneath it.

Every other page in this chapter assumed a fairly ordinary situation: a script loads once, the page it's attached to doesn't fundamentally change shape afterward. The theme editor breaks that assumption on purpose — a merchant can add, remove, reorder, or reconfigure a section while the page is open, without a full reload, and Shopify re-renders just that section's Liquid in place when they do.

## Why this matters for a Web Component specifically

A component whose `connectedCallback` only ever runs once, when the page first loads, can end up broken the moment a merchant interacts with it live in the editor — a section gets re-rendered with fresh HTML, but your component's JavaScript doesn't automatically know to run its setup again on that new markup. Shopify surfaces this situation as a set of custom events, dispatched on `document`, specifically so your code has a hook to react correctly.

## The events

| Event | Fires when |
|---|---|
| `shopify:section:load` | A section's markup has just been (re-)rendered — including the very first time the page loads, and every time a merchant changes a setting |
| `shopify:section:unload` | A section is about to be removed or replaced |
| `shopify:section:select` | A merchant clicks a section in the editor's sidebar, selecting it |
| `shopify:section:deselect` | A merchant selects something else, deselecting this section |
| `shopify:block:select` / `shopify:block:deselect` | The same pair of events, one level down, for an individual block |

```js
document.addEventListener('shopify:section:load', (event) => {
  const carousel = event.target.querySelector('[data-carousel]');
  if (carousel) {
    initCarousel(carousel);
  }
});
```

Listening for `shopify:section:load` and re-running your setup logic from there — rather than only from a one-time `connectedCallback` — means a carousel, slider, or any other stateful component keeps working correctly no matter how many times a merchant edits that section's settings during one editing session.

## These events are specific to the theme editor

:::note[They don't fire for an ordinary shopper]
A regular visitor loading the storefront never triggers these events — there's no live re-rendering happening on an ordinary page view, only in the editor's own preview. If you need to tell whether your code is currently running inside the editor at all (to adjust behavior specifically for that context), check `Shopify.designMode`, which Shopify sets to `true` only there.
:::

## Key takeaways

- The theme editor re-renders a section's markup in place, live, without a full page reload — `shopify:section:load` is your hook to re-run setup logic whenever that happens, not just on the page's very first load.
- `shopify:section:select`/`deselect` and the block equivalents let a component react to a merchant actively focusing on it in the editor sidebar, if that's ever useful.
- `Shopify.designMode` is `true` only inside the theme editor — use it if behavior genuinely needs to differ there versus on the live storefront.

## Further reading

- [Theme editor events](https://shopify.dev/docs/storefronts/themes/architecture/theme-editor/theme-editor-events) (shopify.dev)
