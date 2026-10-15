---
title: Custom Events & Cross-Component Communication
description: Letting two Web Components talk without either one knowing the other exists.
---

**TL;DR:** Letting two Web Components talk without either one knowing the other exists.

## The problem: two components that need to coordinate

A quantity selector on a product page and a cart icon in the header are two entirely separate Web Components, defined in separate files, with no natural relationship in the DOM — one isn't nested inside the other. But adding a product should still update the cart icon's count. Reaching directly into another component's internals (`document.querySelector('my-cart-icon').updateCount(5)`) works, technically, but it ties the quantity selector's code to the cart icon's exact tag name and method signature — a coupling that makes either component harder to reuse or change independently.

## The fix: dispatch a custom event, let anyone listen

```js
class AddToCartForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  async handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(this.form),
    });
    const item = await response.json();

    this.dispatchEvent(new CustomEvent('cart:item-added', {
      bubbles: true,
      detail: { item },
    }));
  }
}
```

```js
class CartIcon extends HTMLElement {
  connectedCallback() {
    document.addEventListener('cart:item-added', (event) => {
      this.updateCount(event.detail.item.quantity);
    });
  }

  updateCount(addedQuantity) {
    // update the displayed count
  }
}
```

`AddToCartForm` never references `CartIcon` by name, and `CartIcon` never references `AddToCartForm` — each only knows about an event name (`cart:item-added`) and a `detail` shape they've agreed on. Either component could be swapped for a completely different implementation, as long as the new version still dispatches or listens for the same event, and neither side needs to change.

## `bubbles: true` is what makes `document`-level listening work

A `CustomEvent` doesn't bubble up the DOM by default — without `bubbles: true`, only a listener attached to the exact element that dispatched it would ever see the event. Setting `bubbles: true` lets the event travel up through every ancestor, all the way to `document`, which is why `CartIcon` (sitting in the header, nowhere near `AddToCartForm` in the DOM) can still listen for it at the `document` level and receive it.

## Naming convention: a namespace prefix, same instinct as everywhere else

`cart:item-added` rather than just `item-added` follows the same collision-avoidance reasoning as the CSS class prefix and the custom-element tag prefix covered elsewhere in this site — a generic event name like `change` or `update` risks colliding with a browser-native event or an unrelated component's own custom event of the same name. A namespaced event name (`cart:item-added`, `carousel:slide-changed`) makes both the event's origin and its purpose clear at the listening end, and avoids that collision entirely.

## When this is worth it, and when it's overkill

Two sibling components that never need to know about each other, but occasionally need to coordinate, are the clearest case for custom events. A parent component talking to its own direct children (or vice versa) often doesn't need this machinery at all — a parent can call a child's method directly, or pass data through an attribute, since the relationship between them is already explicit in the markup's nesting. Reach for a dispatched custom event specifically when two components have no natural parent-child relationship, and coupling them directly would mean one needs to know the other's exact tag name and internals just to do its job.

## Key takeaways

- `dispatchEvent(new CustomEvent(name, { bubbles: true, detail }))` lets one component announce something happened without knowing who, if anyone, is listening.
- `bubbles: true` is required for a `document`-level listener (or any ancestor) to receive an event dispatched from deep inside the DOM — without it, only the exact dispatching element's own listeners would see it.
- Namespace custom event names (`cart:item-added`, not `item-added`) for the same collision-avoidance reason as every other naming convention in this site — and reserve this pattern for components with no natural parent-child relationship, where direct method calls would otherwise work fine.

## Further reading

- [CustomEvent (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
