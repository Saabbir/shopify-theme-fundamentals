---
title: The Cart Form
description: Updating line item quantities, and a 1-indexed detail that's easy to miss.
---

**TL;DR:** Updating line item quantities, and a 1-indexed detail that's easy to miss.

## The basic pattern

```liquid
{% form 'cart', cart %}
  {% for line_item in cart.items %}
    <div class="cart-line">
      <span>{{ line_item.product.title }}</span>
      <input
        type="number"
        name="updates[{{ forloop.index }}]"
        value="{{ line_item.quantity }}"
        min="0"
      >
      <span>{{ line_item.line_price | money }}</span>
    </div>
  {% endfor %}

  <button type="submit" name="checkout">Check out</button>
{% endform %}
```

Submitting this updates every line item's quantity at once — setting a quantity to `0` removes that line entirely — and a button with `name="checkout"` sends the shopper straight to checkout instead of just saving the updated quantities.

## The detail that's genuinely easy to get wrong

Each `updates[]` field needs to be indexed by the line item's **1-based position** in the cart — not its variant ID, not a 0-based index.

:::caution[Why `forloop.index`, not `forloop.index0`]
Back in [Loops](/liquid-basics/loops/), `forloop.index` starts at 1 and `forloop.index0` starts at 0. The cart's update endpoint expects line positions starting at 1, matching `cart.items`' own order — so this is one of the few places where reaching for `index0` instead of `index`, out of habit from a language where arrays are 0-indexed, produces a form that updates the *wrong* line item instead of failing loudly.
:::

## Reading cart totals alongside the form

Nothing about displaying the cart's totals needs to be inside the `{% form %}` block itself — `cart.total_price`, `cart.item_count`, and the rest from [cart, customer & shop](/global-objects/cart-customer-and-shop/) can be read anywhere on the page.

```liquid
<p>Subtotal: {{ cart.total_price | money }}</p>
```

## Key takeaways

- `updates[{{ forloop.index }}]` must use the 1-based index matching each line item's position in `cart.items` — not a variant ID, and not `forloop.index0`.
- Setting a line's quantity to `0` through this form removes it from the cart.
- A submit button named `checkout` sends the shopper to checkout directly; any other submit just saves the updated quantities.

## Further reading

- [The cart form](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart) (shopify.dev)
- [Cart API: Update cart](https://shopify.dev/docs/api/ajax/reference/cart#post-locale-cart-update-js) (shopify.dev)
