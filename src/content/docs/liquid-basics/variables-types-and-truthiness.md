---
title: "Variables, Types & Truthiness"
description: "assign, capture, Liquid's data types, and what actually counts as \"true\" in a condition."
---

**TL;DR:** `assign`, `capture`, Liquid's data types, and what actually counts as "true" in a condition.

## Creating a variable: `assign`

`assign` creates a variable and sets its value in one step.

```liquid
{% assign discount_percent = 20 %}
{% assign is_on_sale = true %}
{% assign heading = "Summer Sale" %}
```

## Building a string from markup: `capture`

`capture` is also for creating a variable, but instead of assigning a single value, it captures everything rendered between its tags — including other Liquid — as one string.

```liquid
{% capture button_html %}
  <a href="{{ product.url }}" class="button">View product</a>
{% endcapture %}

{{ button_html }}
```

This is useful whenever you need to build up a chunk of markup once and reuse or pass it somewhere (like into a snippet parameter) rather than repeating the same markup inline.

## Liquid's data types

| Type | Examples | Notes |
|---|---|---|
| String | `"hello"`, `'hello'` | Single or double quotes both work |
| Number | `5`, `3.14` | Integers and decimals — Liquid doesn't distinguish them with separate syntax |
| Boolean | `true`, `false` | Lowercase, unquoted |
| nil | — | Liquid's "nothing" value — see below |
| Array | `product.images`, `collection.products` | Most arrays you'll use come from Shopify's own objects, not written literally |
| Object | `product`, `cart`, `settings` | A structured value with named properties (`product.title`, `product.price`) |

Shopify data objects (`product`, `cart`, `collection`, and many more) are covered in a later, planned section — for now, treat them as objects whose properties you access with a dot, like `product.title`.

## `nil`, `blank`, and `empty`

Liquid has three related but distinct keywords for "nothing," and mixing them up is a common source of bugs.

| Keyword | Means | Typical use |
|---|---|---|
| `nil` | No value at all — the variable doesn't exist or wasn't set | `{% if my_variable == nil %}` |
| `blank` | nil, an empty string, or a string containing only whitespace | `{% if product.description == blank %}` |
| `empty` | An array or string with zero items/characters | `{% if collection.products == empty %}` |

In practice, `blank` is what you want almost every time you're checking "did the merchant actually fill this in?" — it correctly treats a setting that's untouched (`nil`) the same as one a merchant filled with just spaces.

## Truthiness: Liquid's biggest surprise for newcomers

In an `{% if %}` condition, every value in Liquid is **truthy** except exactly two: `nil` and `false`. Everything else — including values other languages treat as falsy — counts as true.

:::caution[The gotcha that catches almost everyone coming from another language]
In Liquid, **`0` is truthy, and an empty string `""` is truthy.** This is the opposite of JavaScript, Python, and most other languages, where both are falsy.

```liquid
{% assign count = 0 %}
{% if count %}
  This prints! 0 is not nil and not false, so it's truthy in Liquid.
{% endif %}
```

If you want to check "is this number actually zero," compare it explicitly: `{% if count == 0 %}`. Don't rely on `{% if count %}` the way you might in JavaScript.
:::

## Key takeaways

- `assign` sets a variable to a value; `capture` sets a variable to rendered markup.
- `nil` means no value, `blank` means nil-or-empty-string, `empty` means a zero-length array or string — use `blank` for "did the merchant fill this in."
- Only `nil` and `false` are falsy in Liquid. `0` and `""` are both truthy — always compare explicitly (`== 0`, `== blank`) instead of relying on implicit truthiness for numbers or strings.

## Further reading

- [Liquid basics: types](https://shopify.dev/docs/api/liquid/basics#types) (shopify.dev)
- [The `assign` tag](https://shopify.dev/docs/api/liquid/tags/assign) (shopify.dev)
- [The `capture` tag](https://shopify.dev/docs/api/liquid/tags/capture) (shopify.dev)
