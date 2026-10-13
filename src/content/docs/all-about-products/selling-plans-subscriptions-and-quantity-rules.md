---
title: Selling Plans, Subscriptions & Quantity Rules
description: How a subscription option actually attaches to a line item, and the B2B-oriented rules that constrain how much of a variant can be ordered at once.
---

**TL;DR:** How a subscription option actually attaches to a line item, and the B2B-oriented rules that constrain how much of a variant can be ordered at once.

## The three-object chain behind a subscription option

A subscription ("deliver every 2 weeks, 10% off") is built from three connected objects, each answering a different question:

```liquid
{{ product.selling_plan_groups }}
{{ selling_plan_group.selling_plans }}
{{ selling_plan.price_adjustments }}
```

- A **`selling_plan_group`** is a named collection of related plans ("Subscribe & Save"), grouped together because they share the same option names (like "Delivery frequency").
- A **`selling_plan`** is one specific option within that group ("Every 2 weeks, 10% off") — its `price_adjustments` describe the *intent* of the discount, not the final dollar amount.
- A **`selling_plan_allocation`** is what actually ends up on a line item: the real, computed price once a specific selling plan is applied to a specific variant.

```liquid
{% for group in product.selling_plan_groups %}
  <fieldset>
    <legend>{{ group.name }}</legend>
    {% for plan in group.selling_plans %}
      <label>
        <input type="radio" name="selling_plan" value="{{ plan.id }}" {% if plan.selected %}checked{% endif %}>
        {{ plan.name }}
      </label>
    {% endfor %}
  </fieldset>
{% endfor %}
```

## Showing the actual subscription price

Once a plan is selected, the real price to display comes from the **allocation**, not the plan itself — the plan only describes intent:

```liquid
{% assign allocation = product.selected_or_first_available_selling_plan_allocation %}
{% if allocation %}
  {{ allocation.price | money }}
  {% if allocation.compare_at_price > allocation.price %}
    <s>{{ allocation.compare_at_price | money }}</s>
  {% endif %}
{% endif %}
```

`selling_plan_allocation.compare_at_price` is specifically the line item's price *without* the selling plan applied — the natural "was" price to show struck through next to a subscription discount.

## One-time purchase vs. subscription-only

```liquid
{{ product.requires_selling_plan }}
{{ variant.requires_selling_plan }}
```

`product.requires_selling_plan` is `true` only when *every* variant requires a selling plan — meaning there's no one-time-purchase option at all for this product, and a theme shouldn't render a plain "Add to cart" that skips the plan selector. Check the per-variant version when a theme needs to know about one specific variant rather than the product as a whole.

:::tip[A selling plan is selected the same way a variant is]
Exactly like `product.selected_variant` reads the `variant` URL parameter, a selected selling plan reads the `selling_plan` URL parameter — `product.selected_selling_plan`, `product.selected_or_first_available_selling_plan_allocation`, and the `plan.selected`/`group.selling_plan_selected` booleans shown above all key off that same parameter.
:::

## Quantity rules: minimums, maximums, and increments

Separately from subscriptions, a variant can carry ordering constraints — most commonly set as part of a B2B/wholesale catalog, but available on any store:

```liquid
{{ variant.quantity_rule.min }}
{{ variant.quantity_rule.max }}
{{ variant.quantity_rule.increment }}
```

```liquid
<input
  type="number"
  min="{{ variant.quantity_rule.min }}"
  max="{{ variant.quantity_rule.max }}"
  step="{{ variant.quantity_rule.increment }}"
  value="{{ variant.quantity_rule.min }}"
>
```

The quantity rule's three properties map directly onto a native `<input type="number">`'s own `min`/`max`/`step` attributes — no custom validation logic needed for the common case. `max` is `nil` when there's no upper bound (unlimited), so guard the `max` attribute specifically:

```liquid
<input
  type="number"
  min="{{ variant.quantity_rule.min }}"
  {% if variant.quantity_rule.max %}max="{{ variant.quantity_rule.max }}"{% endif %}
  step="{{ variant.quantity_rule.increment }}"
>
```

:::note[Every variant has a quantity rule, even without one explicitly configured]
If no rule has been set for a variant, `variant.quantity_rule` still returns a real object with sensible defaults (`min: 1, max: nil, increment: 1`) rather than `nil` — meaning the `<input>` pattern above is always safe to use unconditionally, with no `{% if variant.quantity_rule %}` guard needed first.
:::

## Key takeaways

- A subscription option is three connected objects: `selling_plan_group` (the named collection), `selling_plan` (one specific option, describing intent), and `selling_plan_allocation` (the actual computed price for a line item).
- Always display price from the allocation, never the plan — the plan's `price_adjustments` describes intent, not a final dollar amount.
- `product.requires_selling_plan` is `true` only when every variant is subscription-only; check it before assuming a plain one-time "Add to cart" is always available.
- `variant.quantity_rule` always returns a real object, defaulting to `min: 1, max: nil, increment: 1` — safe to read from unconditionally, with `max` being the one property that still needs its own guard since it can be `nil`.

## Further reading

- [Liquid objects: selling_plan_group](https://shopify.dev/docs/api/liquid/objects/selling_plan_group) (shopify.dev)
- [Liquid objects: selling_plan](https://shopify.dev/docs/api/liquid/objects/selling_plan) (shopify.dev)
- [Liquid objects: selling_plan_allocation](https://shopify.dev/docs/api/liquid/objects/selling_plan_allocation) (shopify.dev)
- [Liquid objects: quantity_rule](https://shopify.dev/docs/api/liquid/objects/quantity_rule) (shopify.dev)
- [Purchase options](https://shopify.dev/themes/pricing-payments/purchase-options) (shopify.dev)
