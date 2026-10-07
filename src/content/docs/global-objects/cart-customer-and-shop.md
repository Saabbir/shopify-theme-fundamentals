---
title: "cart, customer & shop"
description: The three objects available on every single page, no matter what — and the one that's often nil.
---

**TL;DR:** The three objects available on every single page, no matter what — and the one that's often `nil`.

Unlike `product` and `collection`, these three objects are available **everywhere** — every template, every section, every snippet, regardless of what page a shopper is on.

## `cart`

`cart` represents the shopper's current cart.

```liquid
{{ cart.item_count }}
{{ cart.total_price | money }}
{{ cart.items }}
```

```liquid
{% for line_item in cart.items %}
  {{ line_item.product.title }} × {{ line_item.quantity }}
  {{ line_item.line_price | money }}
{% endfor %}
```

| Property | Is |
|---|---|
| `cart.item_count` | Total number of items across every line (not the number of distinct products) |
| `cart.total_price` | The cart's total, in the shop's smallest currency unit — always run it through `money` |
| `cart.items` | An array of line items, each with its own `product`, `variant`, `quantity`, and `line_price` |

A cart with nothing in it still exists as an object — `cart.item_count` is `0`, `cart.items` is an empty array. You'll never get `nil` by referencing `cart` itself.

## `customer`

`customer` represents the currently logged-in shopper.

```liquid
{% if customer %}
  <p>Welcome back, {{ customer.first_name }}</p>
{% else %}
  <p><a href="{{ routes.account_login_url }}">Log in</a></p>
{% endif %}
```

:::caution[The single most important thing to know about `customer`]
`customer` is `nil` for every guest — which is most shoppers on most stores. Always check `{% if customer %}` before reading any property off it. Writing `{{ customer.first_name }}` directly, with no check, will silently print nothing for a logged-out visitor rather than erroring (the same silent-`nil` behavior from [Debugging Liquid](/liquid-basics/debugging-liquid/)) — but it's easy to test only while logged in yourself and never notice.
:::

Once you've confirmed `customer` exists, the properties themselves are straightforward:

```liquid
{{ customer.first_name }}
{{ customer.last_name }}
{{ customer.email }}
{{ customer.orders }}
{{ customer.orders_count }}
```

## `shop`

`shop` represents the store itself — its settings, not any one shopper's data.

```liquid
{{ shop.name }}
{{ shop.email }}
{{ shop.domain }}
{{ shop.currency }}
{{ shop.money_format }}
```

| Property | Is |
|---|---|
| `shop.name` | The store's name, as set in Shopify admin |
| `shop.domain` | The store's primary domain |
| `shop.currency` | The shop's currency code, like `"USD"` |
| `shop.money_format` | The raw format string behind the `money` filter — rarely needed directly, since `money` already applies it |

## Key takeaways

- `cart`, `customer`, and `shop` are available on every page — unlike `product`/`collection`, you never need to check whether they're "in scope."
- `cart` always exists, even empty — but `customer` is genuinely `nil` for every logged-out visitor. Always guard with `{% if customer %}` first.
- `shop` describes the store itself (name, currency, domain) — it has nothing to do with the current shopper or cart.

## Further reading

- [The `cart` object](https://shopify.dev/docs/api/liquid/objects/cart) (shopify.dev)
- [The `customer` object](https://shopify.dev/docs/api/liquid/objects/customer) (shopify.dev)
- [The `shop` object](https://shopify.dev/docs/api/liquid/objects/shop) (shopify.dev)
