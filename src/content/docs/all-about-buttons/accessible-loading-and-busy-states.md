---
title: Accessible Loading & Busy States
description: What has to happen, beyond just showing a spinner, while a button's action is still in flight.
---

**TL;DR:** What has to happen, beyond just showing a spinner, while a button's action is still in flight.

"Add to cart" isn't instant — there's a real network request in between the click and the result. A loading state is what a button shows during that gap, and getting it right is about more than a spinning icon.

## The three real problems a loading state solves

1. **Preventing a second, duplicate request.** A slow connection plus an impatient shopper clicking "Add to cart" twice is a completely ordinary situation — without protection, it fires the request twice.
2. **Telling a sighted user something is happening.** Without any visual feedback, a click that takes a second or two to resolve can look like nothing happened at all, inviting exactly the double-click from problem 1.
3. **Telling a screen-reader user something is happening — and when it's done.** This is the part a spinner alone doesn't solve: a spinner is a purely visual signal, with nothing for assistive technology to announce on its own.

## A real, minimal pattern

```html
<button type="submit" class="button" aria-busy="false">
  <span class="button__label">Add to cart</span>
  <svg class="button__spinner" aria-hidden="true" hidden><!-- ... --></svg>
</button>
```

```js
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  handleSubmit(event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    if (submitButton.getAttribute('aria-busy') === 'true') {
      return;
    }

    this.setLoadingState(submitButton, true);

    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(this.querySelector('form')),
    })
      .then((response) => this.handleResponse(response))
      .finally(() => this.setLoadingState(submitButton, false));
  }

  setLoadingState(button, isLoading) {
    button.setAttribute('aria-busy', isLoading);
    button.disabled = isLoading;
    button.querySelector('.button__spinner').hidden = !isLoading;
  }
}

customElements.define('product-form', ProductForm);
```

Three things in this example map directly to the three problems above:

- **`button.disabled = isLoading`** solves problem 1 — a disabled button can't be clicked again, so a second submit simply can't fire while the first is still in flight. (Using the native `disabled` attribute here, not `aria-disabled`, is deliberate: unlike [36.3. Interactive States](/all-about-buttons/interactive-states/)'s tooltip example, there's no explanation a keyboard user needs to reach while this button is briefly unavailable — it's back to normal in a second or two either way.)
- **The spinner, toggled via `hidden`**, solves problem 2 — visible proof to a sighted user that the click registered and something is happening.
- **`aria-busy="true"`/`"false"`**, toggled on the button itself, solves problem 3 — a screen reader announces the busy state change, which a spinner alone never does.

:::caution[`aria-busy` alone doesn't disable anything]
`aria-busy` is purely an announcement — like `aria-disabled` before it, it tells assistive technology something, but doesn't stop a click from firing on its own. The double-submit guard in the example above is the `if (submitButton.getAttribute('aria-busy') === 'true') return;` check plus `button.disabled`, not the `aria-busy` attribute itself. Setting `aria-busy="true"` without also disabling the button (or otherwise guarding against a second click) solves problem 3 while leaving problem 1 completely unsolved.
:::

## Handling a request that fails

```js
handleResponse(response) {
  if (!response.ok) {
    this.showError('Something went wrong — please try again.');
    return;
  }
  // ...update the cart...
}
```

A loading state needs a defined end on both the success path and the failure path. `.finally()` in the example above is what guarantees `setLoadingState(button, false)` runs either way — a `.then()` alone would leave the button stuck in its busy, disabled state forever if the request rejected or the response wasn't ok, which is a worse experience than no loading state at all: at least a plain, always-clickable button can be retried.

## Key takeaways

- A loading state solves three separate problems: preventing a duplicate request, showing a sighted user that something is happening, and announcing that same thing to a screen reader — a spinner alone only solves the second one.
- `aria-busy` announces the busy state; it doesn't block anything by itself. Pair it with actually disabling the button (or an equivalent guard) to prevent a duplicate submission.
- Toggle the loading state off on every exit path — success and failure alike — with something like `.finally()`, not just the happy path.

## Further reading

- [`aria-busy` (MDN)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
- [8.1. The Product Form](/forms/the-product-form/)
