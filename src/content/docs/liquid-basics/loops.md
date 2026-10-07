---
title: Loops
description: "for, the forloop object, break/continue, and looping over a plain range instead of an array."
---

**TL;DR:** `for`, the `forloop` object, `break`/`continue`, and looping over a plain range instead of an array.

## The basic `for` loop

```liquid
{% for product in collection.products %}
  <p>{{ product.title }}</p>
{% endfor %}
```

This runs once per item in `collection.products`, with `product` set to the current item each time.

## Common loop parameters

```liquid
{% for product in collection.products limit: 4 %}
{% for product in collection.products offset: 4 %}
{% for product in collection.products limit: 4 offset: 4 %}
{% for product in collection.products reversed %}
```

| Parameter | Does |
|---|---|
| `limit: n` | Stop after `n` items |
| `offset: n` | Skip the first `n` items |
| `reversed` | Iterate in reverse order |

You've already used `limit` throughout earlier chapters — for example, capping a "related products" strip at 4 items.

## The `forloop` object

Inside any `for` loop, Shopify automatically makes a `forloop` object available, describing the current position in the loop.

```liquid
{% for product in collection.products %}
  {% if forloop.first %}
    <p>First product: {{ product.title }}</p>
  {% endif %}
  <p>{{ forloop.index }} of {{ forloop.length }}: {{ product.title }}</p>
{% endfor %}
```

| Property | Value |
|---|---|
| `forloop.index` | Current iteration, starting at **1** |
| `forloop.index0` | Current iteration, starting at **0** |
| `forloop.first` | `true` on the first iteration |
| `forloop.last` | `true` on the last iteration |
| `forloop.length` | Total number of items being looped over |

A common use: adding a separator between items except after the last one.

```liquid
{% for product in collection.products %}
  {{ product.title }}{% unless forloop.last %}, {% endunless %}
{% endfor %}
```

## An `else` clause for empty collections

`for` can have an `else` block, which runs only if the collection being looped over has zero items — useful for showing a clear empty state instead of silently rendering nothing.

```liquid
{% for product in collection.products %}
  {{ product.title }}
{% else %}
  <p>No products in this collection yet.</p>
{% endfor %}
```

## `break` and `continue`

`break` stops the loop entirely. `continue` skips the rest of the current iteration and moves to the next one.

```liquid
{% for product in collection.products %}
  {% if product.tags contains "hidden" %}
    {% continue %}
  {% endif %}
  {% if forloop.index > 10 %}
    {% break %}
  {% endif %}
  {{ product.title }}
{% endfor %}
```

## Looping over a range, not a collection

`for` doesn't require an array — a `(start..end)` range works too, which is handy for anything number-based that isn't tied to real Shopify data.

```liquid
{% for i in (1..5) %}
  <span>{{ i }}</span>
{% endfor %}
```

## Key takeaways

- `limit`, `offset`, and `reversed` control which items a loop processes and in what order.
- `forloop.index`/`index0`/`first`/`last`/`length` describe the current position — only available inside a `for` loop.
- `for...else` handles the empty-collection case explicitly, the same instinct as the empty-state handling covered in the [Sections, Blocks & Snippets worked example](/sections-blocks-snippets/worked-example/).
- `break` exits a loop early; `continue` skips to the next iteration.

## Further reading

- [The `for` tag](https://shopify.dev/docs/api/liquid/tags/for) (shopify.dev)
- [The `forloop` object](https://shopify.dev/docs/api/liquid/objects/forloop) (shopify.dev)
