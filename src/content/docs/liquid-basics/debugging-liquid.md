---
title: Debugging Liquid
description: Inspecting a value, reading errors, and Liquid's most common silent failure.
---

**TL;DR:** Inspecting a value, reading errors, and Liquid's most common silent failure.

## Inspecting a value with `json`

The fastest way to see what's actually inside a variable — especially an object or array you're not sure about — is the `json` filter, which dumps its full structure as readable JSON.

```liquid
{{ product | json }}
```

Drop this anywhere temporarily to see every property `product` actually has, with its current values, instead of guessing. Remove it before you ship — it's a debugging tool, not something that belongs in finished code.

## Liquid's most common silent failure: it rarely errors on a typo

This is the single most important thing to know about debugging Liquid, and it's the opposite of how most programming languages behave. If you reference a property that doesn't exist, Liquid doesn't throw an error — it silently returns `nil` and keeps going.

```liquid
{{ product.titel }}
```

That typo (`titel` instead of `title`) doesn't crash the page or show an error. It just prints nothing. The same is true for a deeper chain:

```liquid
{{ product.metafields.custom.nonexistent_key.value }}
```

If `nonexistent_key` doesn't exist, this doesn't error either — it resolves to `nil` at whatever point the chain breaks, and the whole expression prints nothing.

:::caution[Why this matters so much in practice]
Because a typo fails silently instead of loudly, "nothing is showing up" is almost always a typo or wrong property name, not a deeper bug. When something renders blank that you expected to have content, the very first thing to check is whether you spelled every property in the chain correctly — before assuming the data itself is missing. The `json` filter above is the fastest way to confirm: dump the object one level up in the chain and see what properties it actually has.
:::

## Reading Liquid syntax errors

Unlike a silent `nil`, a genuine **syntax** error (a malformed tag, a missing `{% endif %}`, invalid filter syntax) does show up — usually as visible error text directly in the rendered page, or as a build/theme-check failure, depending on how you're previewing the theme. These errors are usually specific about what's wrong and on which line; read the message fully before assuming you know the cause.

## Isolating a problem

When something isn't rendering as expected and the cause isn't obvious, narrow it down by commenting out pieces of the file and adding them back one at a time:

```liquid
{% comment %}
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}
{% endcomment %}

<p>If you see this, the problem is somewhere inside the commented block above.</p>
```

This is a blunt tool, but it's reliable: it tells you definitively whether the problem is inside or outside the commented section, which narrows your search space quickly even when you have no other leads.

## Key takeaways

- `{{ value | json }}` is the fastest way to see everything inside an object or array — use it liberally while debugging, remove it before shipping.
- A wrong or misspelled property anywhere in a chain resolves to `nil` silently — it will not error. "Nothing is showing up" means check spelling first, not "the data must be missing."
- Genuine syntax errors (malformed tags, missing closing tags) do surface visibly — read the error message fully, it's usually specific about the line and the problem.

## Further reading

- [The `json` filter](https://shopify.dev/docs/api/liquid/filters/json) (shopify.dev)
