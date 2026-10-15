---
title: A Complete Web Component Example
description: One quantity-selector component combining lifecycle, ARIA state, theme editor events, and a custom event at once.
---

**TL;DR:** One quantity-selector component combining lifecycle, ARIA state, theme editor events, and a custom event at once.

Every other page in this chapter looked at one JavaScript concern at a time. This page combines them into a single, realistic quantity selector: a native `<input>` the browser already understands, enhanced by a Web Component that manages its own ARIA live region, reads its starting data from a `data-*` attribute, survives the theme editor re-rendering its section, and announces changes to the rest of the page with a custom event.

## The markup, working before any script loads

```liquid
{% comment %} snippets/quantity-selector.liquid {% endcomment %}
{% doc %}
  Renders a quantity stepper for a cart line item or product form.

  @param {number} quantity - The current quantity.
  @param {number} [max] - The maximum allowed quantity, if any.
{% enddoc %}
<my-quantity-selector data-max="{{ max | default: 99 }}">
  <button type="button" data-decrease aria-label="{{ 'products.quantity.decrease' | t }}">&minus;</button>
  <input
    type="number"
    min="1"
    max="{{ max | default: 99 }}"
    value="{{ quantity | default: 1 }}"
    data-quantity-input
  >
  <button type="button" data-increase aria-label="{{ 'products.quantity.increase' | t }}">&plus;</button>
  <p data-quantity-status class="sr-only" role="status" aria-live="polite"></p>
</my-quantity-selector>
```

The native `<input type="number">` already works correctly with no JavaScript at all — a shopper can type a quantity, or use the browser's own built-in step controls, before the component's script has even loaded. The custom `+`/`−` buttons and the live-announced status message are enhancements on top of that, not a replacement for it.

## The component

```js
// assets/quantity-selector.js
class QuantitySelector extends HTMLElement {
  static get observedAttributes() {
    return ['data-max'];
  }

  connectedCallback() {
    this.input = this.querySelector('[data-quantity-input]');
    this.status = this.querySelector('[data-quantity-status]');

    this.decreaseButton = this.querySelector('[data-decrease]');
    this.increaseButton = this.querySelector('[data-increase]');

    this.handleDecrease = () => this.changeBy(-1);
    this.handleIncrease = () => this.changeBy(1);

    this.decreaseButton.addEventListener('click', this.handleDecrease);
    this.increaseButton.addEventListener('click', this.handleIncrease);
  }

  disconnectedCallback() {
    this.decreaseButton.removeEventListener('click', this.handleDecrease);
    this.increaseButton.removeEventListener('click', this.handleIncrease);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-max') {
      this.input.max = newValue;
    }
  }

  changeBy(amount) {
    const max = Number(this.dataset.max);
    const current = Number(this.input.value);
    const next = Math.min(Math.max(current + amount, 1), max);

    if (next === current) return;

    this.input.value = next;
    this.status.textContent = `Quantity: ${next}`;

    this.dispatchEvent(new CustomEvent('quantity:changed', {
      bubbles: true,
      detail: { quantity: next },
    }));
  }
}

customElements.define('my-quantity-selector', QuantitySelector);
```

```liquid
<script type="module" src="{{ 'quantity-selector.js' | asset_url }}"></script>
```

## Surviving the theme editor

```js
document.addEventListener('shopify:section:load', (event) => {
  // Nothing extra needed here: connectedCallback already re-runs
  // automatically once the editor reconnects a re-rendered
  // <my-quantity-selector> to the document.
});
```

This component needs no `shopify:section:load` handler at all — because its setup lives in `connectedCallback` rather than a one-time script that only ran at initial page load, the theme editor re-rendering this section's markup naturally disconnects the old element (firing `disconnectedCallback`, which removes its listeners) and connects the new one (firing `connectedCallback` again, which attaches fresh listeners to the new buttons). This is the payoff mentioned in [30.5. Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/): building on the standard lifecycle callbacks, rather than a one-time setup function, often means the theme-editor-specific events aren't needed at all.

## A sibling component reacting to the custom event

```js
// assets/cart-line-item.js
class CartLineItem extends HTMLElement {
  connectedCallback() {
    this.addEventListener('quantity:changed', (event) => {
      this.updateLineTotal(event.detail.quantity);
    });
  }

  updateLineTotal(quantity) {
    // recalculate and display this line's total
  }
}
```

`CartLineItem` listens for `quantity:changed` on itself, catching the event as it bubbles up from the `<my-quantity-selector>` nested somewhere inside it — exactly the pattern from [30.6. Custom Events & Cross-Component Communication](/all-about-javascript/custom-events-and-cross-component-communication/), just scoped to a listener on a specific ancestor rather than `document`, since here the relationship between the two components actually is a parent-child one.

## Every concern from this chapter, in one place

- **Progressive enhancement** — the `<input>` and buttons work as ordinary HTML before the script runs, per [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/).
- **The full lifecycle** — `connectedCallback` wires up listeners, `disconnectedCallback` tears them down, and `observedAttributes` plus `attributeChangedCallback` keep the input's `max` in sync if `data-max` ever changes after the component has already connected.
- **ARIA state managed in JavaScript** — the `role="status" aria-live="polite"` element's text is updated every time the quantity actually changes, not just set once in the initial markup.
- **Data passed from Liquid safely** — `data-max` carries the starting maximum from a setting or a product's inventory, per [30.4. Talking to Liquid: Data Attributes & JSON Islands](/all-about-javascript/talking-to-liquid-data-attributes-and-json-islands/).
- **A namespaced custom event** — `quantity:changed`, dispatched with `bubbles: true`, lets any ancestor (here, a specific `CartLineItem`; elsewhere, potentially a `document`-level cart icon) react without either component needing to know the other's tag name.
- **No theme-editor-specific code needed at all** — a direct consequence of building on the standard lifecycle rather than a one-time setup script, per [30.5. Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/).
- **A prefixed custom element tag** (`my-quantity-selector`) and **translated labels** (`t:products.quantity.decrease`), consistent with the naming and localization conventions used throughout this site.

## Key takeaways

- A component built on `connectedCallback`/`disconnectedCallback` from the start often needs no theme-editor-specific event handling at all — the standard lifecycle already does the right thing when the editor reconnects re-rendered markup.
- ARIA live-region text should update every time state actually changes, inside the same method that changes the state — not as a separate, easy-to-forget step.
- A custom event dispatched from a child, with `bubbles: true`, is the right way for a parent to react without the child needing any awareness of what, if anything, contains it.

## Further reading

- [14.6. A Complete Section Example](/all-about-sections/a-complete-section-example/)
- [16.5. A Complete Snippet Example](/all-about-snippets/a-complete-snippet-example/)
- [30.5. Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/)
