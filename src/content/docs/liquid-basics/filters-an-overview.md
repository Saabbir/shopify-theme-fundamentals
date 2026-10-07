---
title: "Filters: An Overview"
description: The pipe syntax, chaining multiple filters, and passing arguments to a filter.
---

**TL;DR:** The pipe syntax, chaining multiple filters, and passing arguments to a filter.

A **filter** transforms a value. You've already seen several in earlier chapters — `| money`, `| image_url: width: 400`, `| escape` — without a full explanation of how the syntax works. This page is that explanation; the next page catalogs the specific filters you'll use constantly.

## The pipe syntax

A filter is written with a pipe character (`|`) after a value, followed by the filter's name.

```liquid
{{ product.title | upcase }}
```

This prints the product's title, entirely uppercase. The value before the `|` is what gets transformed; the filter name after it says how.

## Chaining filters

Filters chain left to right — each filter's output becomes the next filter's input.

```liquid
{{ product.title | upcase | truncate: 20 }}
```

This uppercases the title, then truncates the *result* to 20 characters. Order matters: `truncate: 20 | upcase` would truncate first, then uppercase whatever was left — same two filters, same final length, but conceptually the steps happen in a different sequence, which matters more once filters do something less commutative than these two.

## Filters with arguments

Some filters take arguments, written after a colon.

```liquid
{{ "Hello World" | truncate: 5 }}
{{ product.price | money }}
{{ product.featured_image | image_url: width: 400 }}
```

`truncate: 5` passes `5` as the argument (the max length). `image_url: width: 400` passes a named argument (`width`) with its own value. A filter can take zero, one, or several arguments — it depends on the specific filter.

## Filters work in output and in some tags

Filters are most common after `{{ }}` output, but they also work inside tags wherever an expression is evaluated — for example, inside an `{% assign %}` or `{% if %}`.

```liquid
{% assign formatted_price = product.price | money %}
{% if product.title | size > 50 %}
  <!-- a long title -->
{% endif %}
```

:::note[A filter never changes the original variable]
`{{ product.title | upcase }}` doesn't modify `product.title` itself — it transforms a *copy* of the value for this one output. The next time you reference `product.title` elsewhere, it's still in its original case. If you want to keep a transformed value around, assign it to a new variable: `{% assign upper_title = product.title | upcase %}`.
:::

## Key takeaways

- `|` applies a filter; filters chain left to right, each one transforming the previous result.
- Arguments come after a colon — some filters take none, some take one, some take several.
- A filter transforms a value for that one expression; it never permanently changes the original variable.

## Further reading

- [Liquid filters](https://shopify.dev/docs/api/liquid/filters) (shopify.dev)
