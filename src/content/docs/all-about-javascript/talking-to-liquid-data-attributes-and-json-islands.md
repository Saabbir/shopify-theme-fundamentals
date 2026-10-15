---
title: "Talking to Liquid: Data Attributes & JSON Islands"
description: Getting a server-rendered value into JavaScript safely, from one attribute up to a whole object.
---

**TL;DR:** Getting a server-rendered value into JavaScript safely, from one attribute up to a whole object.

## The core problem: JavaScript can't read a Liquid variable directly

Neither `{% javascript %}` nor an `assets/*.js` file ever evaluates Liquid — by the time JavaScript runs, in the browser, Liquid has already finished rendering, server-side, into plain HTML. Any value a script needs that originated from a setting, a product, or any other Liquid object has to be written into that HTML somewhere JavaScript can read it back from.

## One value: a `data-*` attribute

```liquid
<div data-max-items="{{ section.settings.max_items }}">
```

```js
const container = document.querySelector('[data-max-items]');
const maxItems = Number(container.dataset.maxItems);
```

This is the right tool for exactly one, or a handful, of simple scalar values — a number, a short string, a boolean (`data-enabled=""` present vs. absent, read with `.hasAttribute`). Note the explicit `Number(...)` conversion: every `data-*` attribute's value arrives in JavaScript as a string, regardless of what it looked like in Liquid.

## Several related values: still several attributes, or one JSON attribute

```liquid
<div
  data-product-id="{{ product.id }}"
  data-product-price="{{ product.price }}"
  data-product-available="{{ product.available }}"
>
```

A handful of related but simple values can stay as separate attributes, read together. Once there are more than four or five, or the values include something non-trivial (an array, a nested object), a single JSON attribute reads more cleanly:

```liquid
<div data-product='{{ product | json | escape }}'>
```

```js
const container = document.querySelector('[data-product]');
const productData = JSON.parse(container.dataset.product);
```

:::caution[Always escape JSON written into an HTML attribute]
`{{ product | json }}` alone can produce a double quote inside the JSON string, which would prematurely close the HTML attribute it's sitting inside and break the markup (or, worse, allow an attacker-controlled string value to inject new attributes or markup). The `escape` filter after `json` is what makes this safe — never write `json`-filtered output into an HTML attribute without it.
:::

## A whole structured payload: a JSON island

For data too large or too structurally complex to comfortably fit in one attribute — a full set of variant options and their prices, say, meant to drive a whole product-options component — a **JSON island** (a `<script type="application/json">` tag, never executed as code, just read as data) is the cleaner pattern:

```liquid
<script type="application/json" data-product-json>
  {{ product | json }}
</script>
```

```js
const script = document.querySelector('[data-product-json]');
const productData = JSON.parse(script.textContent);
```

Because `type="application/json"` isn't a script MIME type the browser will execute, the browser treats its contents purely as inert text — no escaping concern the way an HTML attribute has, since there's no surrounding attribute-quote for a stray character to break out of. This is the better choice specifically once a JSON attribute would otherwise become unwieldy to read or debug in the rendered HTML.

## Choosing between the three

| Need | Reach for |
|---|---|
| One or two simple scalar values | Separate `data-*` attributes |
| A handful of related simple values | Still separate attributes, or one small JSON attribute |
| A large or deeply nested payload | A JSON island (`<script type="application/json">`) |

## Key takeaways

- JavaScript never reads a Liquid variable directly — a server-rendered value has to be written into the HTML, as a `data-*` attribute or a JSON island, for a script to read it back.
- A `json`-filtered value written into an HTML attribute must also be passed through `escape`, or a stray character in the data can break the markup.
- A JSON island (`<script type="application/json">`) is the cleaner choice once a payload is too large or too nested to comfortably read as one attribute's value.

## Further reading

- [The `json` filter](https://shopify.dev/docs/api/liquid/filters/json) (shopify.dev)
- [30.1. JavaScript Fundamentals in a Shopify Theme](/all-about-javascript/javascript-fundamentals/)
