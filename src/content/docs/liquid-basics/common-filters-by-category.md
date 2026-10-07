---
title: Common Filters by Category
description: The filters you'll reach for constantly, grouped by what they do.
---

**TL;DR:** The filters you'll reach for constantly, grouped by what they do.

This page isn't exhaustive — Shopify's own [filter reference](https://shopify.dev/docs/api/liquid/filters) lists every filter that exists. This is the much shorter list of filters you'll actually use on nearly every file you write.

## String filters

```liquid
{{ "hello world" | upcase }}          {% # HELLO WORLD %}
{{ "HELLO WORLD" | downcase }}        {% # hello world %}
{{ "hello world" | capitalize }}      {% # Hello world %}
{{ product.title | truncate: 20 }}    {% # cuts to 20 chars, adds "..." %}
{{ "Hello" | append: " World" }}      {% # Hello World %}
{{ "World" | prepend: "Hello " }}     {% # Hello World %}
{{ product.title | replace: "Shirt", "Tee" }}
{{ "a,b,c" | split: "," }}            {% # ["a", "b", "c"] %}
{{ product.description | strip_html }} {% # removes HTML tags, keeps text %}
{{ product.title | escape }}          {% # escapes HTML special characters %}
```

`escape` matters more than it might look: always escape any value that could contain special characters (`<`, `>`, `&`, quotes) before putting it inside an HTML attribute, like `alt="{{ image.alt | escape }}"`. Without it, a product title or alt text containing a quote character could break the surrounding markup.

## Array filters

```liquid
{{ collection.products | first }}
{{ collection.products | last }}
{{ collection.products | size }}
{{ collection.products | map: "title" }}      {% # an array of just the titles %}
{{ collection.products | where: "available", true }}
{{ collection.products | sort: "price" }}
{{ product.tags | uniq }}
{{ product.tags | join: ", " }}
```

`where` is especially useful: it filters an array down to only the items matching a condition, without writing a manual loop with an `if` inside it.

```liquid
{% assign in_stock_products = collection.products | where: "available", true %}
```

## Math filters

```liquid
{{ 10 | plus: 5 }}        {% # 15 %}
{{ 10 | minus: 5 }}       {% # 5 %}
{{ 10 | times: 5 }}       {% # 50 %}
{{ 10 | divided_by: 5 }}  {% # 2 %}
{{ 10.6 | round }}        {% # 11 %}
{{ 10.2 | ceil }}         {% # 11 %}
{{ 10.8 | floor }}        {% # 10 %}
{{ -5 | abs }}            {% # 5 %}
{{ 10 | modulo: 3 }}      {% # 1 %}
```

:::caution[`divided_by` does integer division on two integers]
`{{ 7 | divided_by: 2 }}` returns `3`, not `3.5` — when both the value and the argument are whole numbers, Liquid performs integer division and discards the remainder. To get a decimal result, make at least one side a float: `{{ 7 | divided_by: 2.0 }}` returns `3.5`.
:::

## Money and date filters

```liquid
{{ product.price | money }}                   {% # formatted using the shop's currency settings %}
{{ product.price | money_with_currency }}      {% # includes the currency code, e.g. "$10.00 USD" %}
{{ "2024-12-25" | date: "%B %d, %Y" }}         {% # December 25, 2024 %}
```

Always use `money` (or `money_with_currency`) to display a price — never print a raw number. It applies the shop's actual currency formatting (symbol placement, decimal separator, thousands separator), which varies by store and region and isn't something you should hardcode yourself.

## HTML and URL filters

```liquid
{{ "theme.css" | asset_url }}                       {% # full URL to a file in assets/ %}
{{ product.featured_image | image_url: width: 400 }} {% # a resized image URL %}
{{ product.url }}                                     {% # most objects expose their own .url, no filter needed %}
{{ "Shop now" | link_to: product.url }}              {% # a full <a> tag %}
```

## Key takeaways

- String filters (`escape`, `truncate`, `strip_html`) and array filters (`where`, `map`, `sort`) are the two categories you'll reach for most often.
- `divided_by` does integer division when both sides are whole numbers — use a float on at least one side if you need a decimal result.
- Never print a raw price number — always go through `money` or `money_with_currency` so it respects the shop's actual currency formatting.

## Further reading

- [Full filter reference](https://shopify.dev/docs/api/liquid/filters) (shopify.dev)
