---
title: Theme Editor Events in Depth
description: Every shopify:section:* and shopify:block:* event, and writing a component that survives live re-rendering.
---

**TL;DR:** Every `shopify:section:*` and `shopify:block:*` event, and writing a component that survives live re-rendering.

## Why the theme editor breaks an ordinary script's assumptions

An ordinary web page loads its JavaScript once, and the page it's attached to doesn't fundamentally change shape afterward. The theme editor breaks that assumption on purpose: a merchant can add, remove, reorder, or reconfigure a section while the page is open, without a full reload, and Shopify re-renders just that section's Liquid in place when they do. A component whose setup only ever runs once, in `connectedCallback`, at the very first page load, can end up broken the moment a merchant interacts with it live — the section's markup gets replaced with freshly-rendered HTML, but nothing tells your JavaScript to run its setup again on that new DOM.

Shopify surfaces this as a set of custom events, dispatched on `document`, specifically so a component has a hook to react correctly.

## Every event

| Event | Fires when |
|---|---|
| `shopify:section:load` | A section's markup has just been (re-)rendered — including the very first time the page loads, and every time a merchant changes a setting |
| `shopify:section:unload` | A section is about to be removed or replaced |
| `shopify:section:select` | A merchant clicks a section in the editor's sidebar, selecting it |
| `shopify:section:deselect` | A merchant selects something else, deselecting this section |
| `shopify:section:reorder` | A merchant drags a section to a new position |
| `shopify:block:select` | A merchant selects an individual block within a section |
| `shopify:block:deselect` | A merchant deselects a block |
| `shopify:inspector:activate` / `shopify:inspector:deactivate` | The editor's preview inspector (a separate overlay tool merchants can toggle on) is turned on or off |

Each event bubbles and isn't cancelable. `event.target` is the section or block element itself — the detail that makes it possible to scope whatever you do next to just that one element, rather than re-querying the whole page. Section and block events also carry a `detail` object (for example, `{ sectionId, load }`, where `load` is `true` when the event was triggered by a re-render rather than a merchant's click) — see [Shopify's own reference table](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks) for the exact shape of each event's `detail`.

## The pattern: re-run setup from `shopify:section:load`, not just `connectedCallback`

```js
function initCarousel(carousel) {
  // set up slide-change behavior, event listeners, etc.
}

document.addEventListener('shopify:section:load', (event) => {
  const carousel = event.target.querySelector('[data-carousel]');
  if (carousel) {
    initCarousel(carousel);
  }
});
```

Listening for `shopify:section:load` and re-running setup logic from there — rather than only from a one-time `connectedCallback` — is what keeps a carousel, slider, or any other stateful component working correctly no matter how many times a merchant edits that section's settings during one editing session. If the same logic lives inside a Web Component's own `connectedCallback`, this often needs no extra code at all: the theme editor's re-render naturally disconnects the old element and connects a new one, and `connectedCallback` fires again on its own, on the new element.

## Cleaning up on `shopify:section:unload`

```js
document.addEventListener('shopify:section:unload', (event) => {
  const carousel = event.target.querySelector('[data-carousel]');
  if (carousel && carousel._autoplayInterval) {
    clearInterval(carousel._autoplayInterval);
  }
});
```

A component that starts an interval, attaches a `window`-level listener, or holds any other resource that outlives the element itself should clean it up here — the same reasoning as a Web Component's `disconnectedCallback`, covered in [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/), just surfaced as a theme-editor-specific event instead of (or alongside) the standard lifecycle callback.

## Reacting to selection, when it's actually useful

```js
document.addEventListener('shopify:block:select', (event) => {
  const slide = event.target.closest('[data-carousel-slide]');
  if (slide) {
    slide.scrollIntoView({ behavior: 'smooth' });
  }
});
```

`shopify:block:select` and `shopify:section:select` are optional, not something every component needs to handle — reach for them specifically when a merchant actively clicking a block or section in the editor's sidebar should visibly do something in the live preview, like scrolling a carousel to the slide containing the block they just selected, so they can see what they're editing without hunting for it manually.

## These events are specific to the theme editor

:::note[They don't fire for an ordinary shopper]
A regular visitor loading the storefront never triggers any of these events — there's no live re-rendering happening on an ordinary page view, only in the editor's own preview. To check whether code is currently running inside the editor at all (to adjust behavior specifically for that context), check `Shopify.designMode` in JavaScript (`true` inside the editor, `undefined` otherwise) or `request.design_mode` in Liquid (`true`/`false`).
:::

```js
if (Shopify.designMode) {
  // behavior that should only run in the theme editor's preview
}
```

Two related, narrower checks exist for specific editor states: `Shopify.inspectMode` is `true` only while a merchant has the preview inspector overlay turned on, and `Shopify.visualPreviewMode` (or `request.visual_preview_mode` in Liquid) is `true` only in the thumbnail-style preview shown when a merchant is choosing a preset to add — useful if a section should render slightly differently there, such as an accordion that should default to expanded specifically in that preview so it doesn't look empty.

## Key takeaways

- The theme editor re-renders a section's markup in place, live, without a full page reload — `shopify:section:load` is the hook to re-run setup logic every time that happens, not just on the page's first load.
- `shopify:section:unload` is the cleanup counterpart — anything a component started that outlives the element itself (an interval, a global listener) should be torn down here.
- `shopify:section:select`/`deselect` and the block equivalents are optional hooks for when a merchant actively focusing on a section or block in the sidebar should visibly do something in the preview. `Shopify.designMode` is `true` only inside the editor, for anything that needs to differ there versus the live storefront.

## Further reading

- [Integrate sections and blocks with the theme editor](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks) (shopify.dev)
- [Dawn's `theme-editor.js`](https://github.com/Shopify/dawn/blob/main/assets/theme-editor.js) — a real theme's handling of these events, linked directly from Shopify's own docs
- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
