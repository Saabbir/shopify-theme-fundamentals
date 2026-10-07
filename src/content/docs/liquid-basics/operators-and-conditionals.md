---
title: "Operators & Conditionals"
description: "if/unless/case, comparison operators, and how and/or actually evaluate."
---

**TL;DR:** `if`/`unless`/`case`, comparison operators, and how `and`/`or` actually evaluate.

## `if`, `elsif`, `else`

```liquid
{% if product.available %}
  <p>In stock</p>
{% elsif product.tags contains "preorder" %}
  <p>Available for preorder</p>
{% else %}
  <p>Sold out</p>
{% endif %}
```

## `unless`: `if not`, spelled more clearly

`unless` runs its block when the condition is **false** — the inverse of `if`. It exists purely for readability, for cases where "unless X" reads more naturally than "if not X."

```liquid
{% unless product.available %}
  <p>Sold out</p>
{% endunless %}
```

This is identical in behavior to `{% if product.available == false %}`, just easier to read for this particular case.

## `case`/`when`: comparing one value against several options

`case` avoids a long chain of `elsif`s when you're comparing the same variable against several specific values.

```liquid
{% case section.settings.layout %}
  {% when "grid" %}
    <div class="layout--grid">...</div>
  {% when "list" %}
    <div class="layout--list">...</div>
  {% else %}
    <div class="layout--default">...</div>
{% endcase %}
```

## Comparison operators

| Operator | Meaning |
|---|---|
| `==` | Equal to |
| `!=` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal to |
| `<=` | Less than or equal to |
| `contains` | String contains a substring, or array contains an exact item |

```liquid
{% if product.price > 10000 %}
{% if product.title contains "Shirt" %}
{% if product.tags contains "new" %}
```

:::note[`contains` has a size limit on strings]
`contains` only checks for an exact substring in a string, or an exact item in an array — it can't check "does this array contain a string that includes this substring." For anything more flexible than an exact match, you'll usually loop through the array and check each item individually instead.
:::

## Logical operators: `and` / `or`

```liquid
{% if product.available and product.price > 0 %}
  <p>Buyable</p>
{% endif %}

{% if product.tags contains "sale" or product.tags contains "clearance" %}
  <p>Discounted</p>
{% endif %}
```

:::caution[Liquid has no parentheses for grouping conditions]
Unlike most programming languages, Liquid's `and`/`or` can't be grouped with parentheses to control evaluation order. Conditions are evaluated strictly left to right, which can produce a different result than you'd expect from a language that does support grouping.

```liquid
{% if a or b and c %}
```

In a language with standard operator precedence, this would mean `a or (b and c)`. In Liquid, it's evaluated left to right as written, which can mean something closer to `(a or b) and c` instead — the exact behavior isn't guaranteed to match either reading. If a condition has more than two parts, don't trust your intuition for how it groups: break it into separate `{% assign %}` boolean variables instead, and combine those.

```liquid
{% liquid
  assign is_a_or_b = false
  if a or b
    assign is_a_or_b = true
  endif
%}
{% if is_a_or_b and c %}
```
:::

## Key takeaways

- `if`/`elsif`/`else` for branching, `unless` for a readable inverse of a single condition, `case`/`when` for comparing one value against several options.
- `contains` checks for an exact substring or array item — not a flexible "any item matches partially" search.
- Liquid has no parentheses for grouping `and`/`or`. For anything beyond a simple two-part condition, break the logic into intermediate `{% assign %}` variables instead of guessing at evaluation order.

## Further reading

- [Liquid basics: operators](https://shopify.dev/docs/api/liquid/basics#operators) (shopify.dev)
- [The `if` tag](https://shopify.dev/docs/api/liquid/tags/if) (shopify.dev)
- [The `case` tag](https://shopify.dev/docs/api/liquid/tags/case) (shopify.dev)
