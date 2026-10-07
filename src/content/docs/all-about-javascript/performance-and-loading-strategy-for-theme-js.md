---
title: Performance & Loading Strategy for Theme JS
description: What defer already buys you for free, and lazy-loading a genuinely heavy component with IntersectionObserver.
---

**TL;DR:** What `defer` already buys you for free, and lazy-loading a genuinely heavy component with `IntersectionObserver`.

## What's already handled, without any extra work

[JavaScript Fundamentals in a Shopify Theme](/all-about-javascript/javascript-fundamentals/) covered that `{% javascript %}`'s bundled output loads with `defer` automatically, and that `type="module"` (used for a Web Component's own file) behaves the same way by default. Both mean a theme's JavaScript never blocks the initial HTML from parsing and rendering — the browser downloads it in the background and runs it only once the document is ready. This already covers most of what "don't block rendering with JavaScript" means; it isn't something you need to configure yourself.

## What's still yours to decide: when a component's own setup work happens

`defer` controls when a *script file* runs, not when an *expensive piece of work inside it* runs. A component whose `connectedCallback` does something genuinely costly — initializing a large carousel library, decoding a big embedded dataset, setting up a map — pays that cost the moment it's connected to the DOM, which for most components is immediately, on page load, whether or not a shopper ever scrolls down far enough to see it.

## Lazy-loading a heavy component with `IntersectionObserver`

```js
class ProductMap extends HTMLElement {
  connectedCallback() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.initMap();
        this.observer.disconnect();
      }
    });
    this.observer.observe(this);
  }

  initMap() {
    // the genuinely expensive setup work, deferred until needed
  }
}
```

Rather than doing expensive setup in `connectedCallback` directly, this component only *observes* itself at connect time — a cheap operation — and defers the real work until `IntersectionObserver` reports the element has actually scrolled into (or near) the viewport. `this.observer.disconnect()` afterward stops watching once the work has run once; there's no need to keep observing an element that's already done its expensive setup.

:::tip[Combine this with the markup already being there]
This pattern doesn't conflict with progressive enhancement from [Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) — the element's markup (an image, a placeholder, static content) is still present and correct from the start; only the *behavior* that makes it interactive is deferred until it's actually about to be seen.
:::

## Loading a genuinely large dependency only when needed

```js
class ProductMap extends HTMLElement {
  async initMap() {
    const { renderMap } = await import('./map-renderer.js');
    renderMap(this);
  }
}
```

A dynamic `import()` loads a module on demand, rather than as part of the page's initial script payload — useful specifically for a dependency large enough that paying its download cost on every single page, even the pages that never render this component at all, would be wasteful. Combined with the `IntersectionObserver` pattern above, the module only downloads once a shopper has actually scrolled near the component that needs it.

## A performance habit that costs nothing: scoping your own listeners

```js
// Avoid, if this runs on every page regardless of whether .carousel exists
document.addEventListener('scroll', () => {
  document.querySelectorAll('.carousel').forEach(updateCarousel);
});
```

```js
// Prefer: only attach the listener where the component actually exists
class Carousel extends HTMLElement {
  connectedCallback() {
    this.addEventListener('scroll', () => this.update());
  }
}
```

A Web Component's own lifecycle is already the right place to attach and detach its listeners — `connectedCallback` to add them, `disconnectedCallback` to remove them, covered in [Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/). A listener attached once at the document level, unconditionally, on every page load, regardless of whether anything on the current page actually needs it, is a small but avoidable ongoing cost that scoping to the component itself sidesteps entirely.

## Key takeaways

- `{% javascript %}`'s bundled output and a Web Component's `type="module"` script both load with `defer` automatically — render-blocking is already handled; it isn't something to configure yourself.
- `defer` controls *when a script file runs*, not when expensive work inside it happens — a component with genuinely costly setup should defer that work with `IntersectionObserver`, not just rely on `defer` alone.
- A dynamic `import()` loads a large dependency only when it's actually needed, rather than as part of every page's initial script payload — pair it with `IntersectionObserver` so it only downloads once a shopper is actually near the component that needs it.

## Further reading

- [IntersectionObserver (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Dynamic `import()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
- [Performance best practices for Shopify themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
