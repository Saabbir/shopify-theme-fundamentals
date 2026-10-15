---
title: Quick Add
description: A real, working <form> first — the AJAX enhancement that avoids a page reload is a layer on top, not the only way it works.
---

**TL;DR:** A real, working `<form>` first — the AJAX enhancement that avoids a page reload is a layer on top, not the only way it works.

"Quick add" means adding a product to the cart directly from a card, without navigating to the product page first. The temptation is to build this as a JavaScript-only button; the correct foundation is the same real cart form [8.2. The Cart Form](/forms/the-cart-form/) already covers, just placed on a card instead of a product page.

## The foundation: a real form, works with zero JavaScript

```liquid
{% comment %} snippets/product-card.liquid {% endcomment %}
<product-form class="sol-quick-add">
  <form action="/cart/add" method="post" enctype="multipart/form-data">
    <input type="hidden" name="id" value="{{ card_product.selected_or_first_available_variant.id }}">
    <button type="submit" class="sol-button" {% unless card_product.selected_or_first_available_variant.available %}disabled{% endunless %}>
      {{ 'products.quick_add.add_to_cart' | t }}
    </button>
  </form>
</product-form>
```

This posts to `/cart/add` and genuinely works with no JavaScript at all — the browser navigates to the cart page on submit, same as the full product-page form. Everything below is a progressive enhancement layered on top of this, never a replacement for it; if a card's quick-add button only works after a script finishes loading, it was built backwards.

:::note[A card quick-add button can only use the product's *first* available variant, by default]
Unlike the product page, a card usually has no visible variant picker — there's no room for one. `selected_or_first_available_variant` is the right default specifically because it picks something purchasable automatically; a product where the first variant happens to be sold out but a later one isn't still needs *some* variant chosen, and this is the one Shopify itself recommends for exactly this situation. A product that genuinely needs the shopper to choose (several very different variants, not just a size) is usually better served linking straight to the product page instead of offering quick-add at all — that's a product-level, not purely technical, decision.
:::

## The enhancement: intercepting submit to skip the navigation

```js
// assets/sol-product-form.js
class SolProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const button = this.form.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Add to cart failed');
      }

      this.dispatchEvent(new CustomEvent('product-added', { bubbles: true }));
    } catch (error) {
      // Fall back to a real navigation, exactly what would have
      // happened without this script running at all.
      this.form.submit();
    } finally {
      button.disabled = false;
    }
  }
}

customElements.define('product-form', SolProductForm);
```

`event.preventDefault()` only stops the *default* browser navigation — the actual request still goes to the same `/cart/add` endpoint, just through `fetch` instead of a full page load, and to the `.js` variant of that endpoint specifically because it returns the added line item as JSON instead of a full cart-page HTML response. The `catch` block's fallback to a real `this.form.submit()` matters: if the fetch request fails for any reason (a network blip, an unexpected response), the component doesn't fail silently — it falls back to the exact behavior that would have happened if the script had never run.

## What quick-add deliberately doesn't do: update the cart UI itself

Notice `handleSubmit` only dispatches a `product-added` custom event — it doesn't touch a cart drawer or a cart count bubble directly. [30.6. Custom Events & Cross-Component Communication](/all-about-javascript/custom-events-and-cross-component-communication/) covers exactly why: a product card has no business knowing whether the theme shows a cart drawer, a slide-out, or just a header count badge — that's a separate component's job, listening for this same event. A full build-out of what that listener does, and the complete `/cart/add.js` response shape, is the Cart AJAX API's territory — a dedicated future chapter — this page stops at "how a card tells the rest of the page a product was added," which is as much as a card component itself needs to know.

## Key takeaways

- A quick-add button's foundation is a real `<form action="/cart/add">` that works with zero JavaScript, same mechanism as the full product-page cart form — never a JavaScript-only click handler with no underlying form.
- `selected_or_first_available_variant` is Shopify's own recommended default for a card with no visible variant picker; a product that genuinely needs the shopper to choose between very different variants is often better served linking to the product page instead.
- The JavaScript enhancement intercepts `submit`, posts to `/cart/add.js` via `fetch`, and falls back to a real form submission if anything goes wrong — it should never be the only path that works.
- A card component should only announce that a product was added (a custom event), never directly manipulate a cart drawer or count badge it has no reason to know about.

## Further reading

- [8.2. The Cart Form](/forms/the-cart-form/)
- [30.6. Custom Events & Cross-Component Communication](/all-about-javascript/custom-events-and-cross-component-communication/)
- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/)
