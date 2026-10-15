---
title: A Complete Example
description: A real add-to-cart button combining a variant, every interactive state, an accessible loading state, and an icon — in one working whole.
---

**TL;DR:** A real add-to-cart button combining a variant, every interactive state, an accessible loading state, and an icon — in one working whole.

Every earlier page in this chapter covered one piece in isolation. This page combines all of them into one realistic add-to-cart button, built as a Web Component since the loading state genuinely needs JavaScript to manage — following the same pattern [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) establishes for interactive theme behavior generally.

## The markup

```liquid
{% # snippets/add-to-cart-button.liquid %}
<add-to-cart-button>
  <button
    type="submit"
    class="button"
    aria-busy="false"
  >
    <svg class="button__icon" aria-hidden="true" width="16" height="16"><!-- cart icon --></svg>
    <span class="button__label">{{ 'products.product.add_to_cart' | t }}</span>
    <svg class="button__spinner" aria-hidden="true" hidden><!-- spinner --></svg>
  </button>
</add-to-cart-button>
```

## The CSS

```css
.button {
  /* --- Variant: covered in "Button Variants" and "Settings-Driven Styling in Depth" --- */
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: var(--button-background-color, var(--style-button-background-primary));
  color: var(--button-color, var(--style-button-text-primary));
  border: 1px solid var(--button-border-color, var(--style-button-border-primary));
  border-radius: var(--style-border-radius-buttons-primary);
  font-family: var(--button-font-family-primary);

  /* --- Sizing & icon composition: covered in "Sizing & Icon+Text Composition" --- */
  width: var(--size-style-width, fit-content);
  padding-inline: 1.5em;
  padding-block: 0.75em;
}

.button__icon,
.button__spinner {
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
}

/* --- Interactive states: covered in "Interactive States" --- */
.button:hover {
  background: var(--button-hover-background-color);
}

.button:focus-visible {
  outline: 2px solid var(--button-focus-outline-color, var(--color-focus-ring));
  outline-offset: 2px;
}

.button:disabled {
  cursor: not-allowed;
  opacity: var(--opacity-disabled, 0.5);
}

/* --- Loading state: covered in "Accessible Loading & Busy States" --- */
.button[aria-busy='true'] .button__label {
  visibility: hidden;
}

.button__spinner {
  position: absolute;
}
```

## The Web Component

```js
// assets/add-to-cart-button.js
class AddToCartButton extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.form = this.closest('form');
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.button.getAttribute('aria-busy') === 'true') {
      return;
    }

    this.setLoadingState(true);

    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(this.form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Add to cart failed');
        }
        this.dispatchEvent(new CustomEvent('item:added', { bubbles: true }));
      })
      .catch(() => {
        this.announceError();
      })
      .finally(() => {
        this.setLoadingState(false);
      });
  }

  setLoadingState(isLoading) {
    this.button.setAttribute('aria-busy', isLoading);
    this.button.disabled = isLoading;
    this.button.querySelector('.button__spinner').hidden = !isLoading;
  }

  announceError() {
    this.button.setAttribute('aria-label', 'Add to cart failed — please try again');
  }
}

customElements.define('add-to-cart-button', AddToCartButton);
```

## Reading it in order

A shopper clicking this button triggers `handleSubmit`, which first checks `aria-busy` to guard against a duplicate request — exactly the problem [36.4. Accessible Loading & Busy States](/all-about-buttons/accessible-loading-and-busy-states/) covers. `setLoadingState(true)` then does three things together: sets `aria-busy="true"` (announced to a screen reader), disables the button natively (blocks a second click), and reveals the spinner (visible proof to a sighted shopper) — all three problems, solved by the one method, every time it's called.

The button's own look — its background, text color, border, border-radius, and font — comes entirely from CSS custom properties with fallbacks (`var(--button-background-color, var(--style-button-background-primary))`), exactly the pattern [36.6. Settings-Driven Styling in Depth](/all-about-buttons/settings-driven-styling-in-depth/) covers: if this button is ever placed inside a block that picked "Custom," the block-scoped override wins automatically; otherwise it falls through to the theme-wide primary tokens, with no conditional CSS needed to decide which applies.

`.finally()` guarantees `setLoadingState(false)` always runs, success or failure — the button can never get stuck disabled and spinning forever, even if the network request itself fails outright.

:::note[This is one deliberately linear example, not production-ready markup]
A real implementation would likely split the icon markup into its own snippet (covered in the forthcoming All About Icons chapter), handle a sold-out or unavailable variant by disabling the button for a different reason entirely (covered in [32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/)), and probably update a cart count or open a cart drawer on `item:added` rather than just dispatching the event and stopping. Keeping all of that out is deliberate — the goal here is seeing every concept from this chapter working together once, not a copy-paste-ready component.
:::

## Key takeaways

- A real button combines every layer this chapter covers at once: a variant resolved through settings-driven tokens, full interactive states including an accessible focus outline, and a loading state that solves all three of its real problems (duplicate requests, visual feedback, screen-reader announcement) through one method.
- `aria-busy`, `disabled`, and a visible spinner are three separate signals set together, not one signal standing in for all three.
- CSS custom properties with fallbacks mean a button's styling logic lives entirely in CSS — the component's JavaScript never needs to know or care which variant is active.

## Further reading

- [36.1. Button Fundamentals](/all-about-buttons/button-fundamentals/)
- [36.2. Button Variants](/all-about-buttons/button-variants/)
- [36.3. Interactive States](/all-about-buttons/interactive-states/)
- [36.4. Accessible Loading & Busy States](/all-about-buttons/accessible-loading-and-busy-states/)
- [36.5. Sizing & Icon+Text Composition](/all-about-buttons/sizing-and-icon-text-composition/)
- [36.6. Settings-Driven Styling in Depth](/all-about-buttons/settings-driven-styling-in-depth/)
- [8.1. The Product Form](/forms/the-product-form/)
