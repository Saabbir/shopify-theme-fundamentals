---
title: The Product Form
description: Adding a specific variant to the cart, and showing a sold-out state correctly.
---

**TL;DR:** Adding a specific variant to the cart, and showing a sold-out state correctly.

## The minimum a product form needs

```liquid
{% form 'product', product %}
  <select name="id">
    {% for variant in product.variants %}
      <option
        value="{{ variant.id }}"
        {% if variant == product.selected_or_first_available_variant %}selected{% endif %}
      >
        {{ variant.title }}
      </option>
    {% endfor %}
  </select>

  <input type="number" name="quantity" value="1" min="1">

  <button type="submit" {% unless product.available %}disabled{% endunless %}>
    {% if product.available %}
      Add to cart
    {% else %}
      Sold out
    {% endif %}
  </button>
{% endform %}
```

## The two field names that are not optional

Two input names in a product form aren't something you choose — Shopify's cart endpoint expects them exactly as written:

| Field name | Must contain |
|---|---|
| `id` | The **variant** ID being added — not the product ID. This is the whole reason [variant vs. product](/global-objects/product-variant-and-collection/) matters: a product form always adds one specific variant, never "the product" in the abstract. |
| `quantity` | How many of that variant to add |

Get `name="id"` wrong (calling it `variant_id`, say) and the form submits, but Shopify has no idea which field represents the variant — the add-to-cart request fails or behaves unpredictably, with no obvious error pointing at the actual cause.

## Showing unavailable correctly

`product.available` (from [product, variant & collection](/global-objects/product-variant-and-collection/)) tells you if *any* variant can currently be purchased — use it to disable the whole form's submit button when nothing on the product is purchasable at all. For a specific variant being unavailable (one size sold out, others still in stock), check that variant's own `.available` instead, typically to disable just that one `<option>`.

```liquid
{% for variant in product.variants %}
  <option value="{{ variant.id }}" {% unless variant.available %}disabled{% endunless %}>
    {{ variant.title }}{% unless variant.available %} - Sold out{% endunless %}
  </option>
{% endfor %}
```

## What happens after submit

By default, submitting this form does a full page navigation to the cart page — the simplest version that works with zero JavaScript. Most themes intercept the submit instead, to add the item via JavaScript and show immediate feedback (a cart drawer, a confirmation message) without leaving the page. That interception is a JavaScript concern, not a Liquid one — the form above works correctly either way; JavaScript only changes what happens to the response, not what the form itself needs to contain.

## Key takeaways

- A product form always submits a specific **variant** ID (`name="id"`), never the product ID directly — this is the practical reason the variant/product distinction matters.
- `product.available` governs the whole form's submit button; an individual variant's own `.available` governs just that option.
- The field names (`id`, `quantity`) are fixed by Shopify's cart endpoint — get them right regardless of how the rest of your markup is structured.

## Further reading

- [The product form](https://shopify.dev/docs/storefronts/themes/architecture/templates/product#product-form) (shopify.dev)
- [Cart API: Add to cart](https://shopify.dev/docs/api/ajax/reference/cart#post-locale-cart-add-js) (shopify.dev)
