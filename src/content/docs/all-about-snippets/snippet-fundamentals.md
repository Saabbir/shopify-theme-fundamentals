---
title: Snippet Fundamentals
description: What a snippet is, why it isn't a block, and how its scope isolation actually works.
---

**TL;DR:** What a snippet is, why it isn't a block, and how its scope isolation actually works.

## What a snippet actually is

A **snippet** is a small, reusable chunk of Liquid code, stored in `snippets/`. It's the simplest of a theme's building blocks: no schema, no settings a merchant can configure, no visibility in the theme editor at all. A snippet exists purely to avoid repeating the same markup or logic in more than one place in your code.

## A basic example

```liquid
{% comment %} snippets/product-card.liquid {% endcomment %}
{% doc %}
  Renders a single product card.

  @param {object} product - A product object to render.
{% enddoc %}

<div class="product-card">
  <img src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.featured_image.alt | escape }}">
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
</div>
```

The `{% doc %}` comment at the top isn't optional busywork — document every snippet's expected parameters this way, so anyone using it later doesn't have to read through its internals just to call it correctly.

You render it with `{% render %}`, passing in whatever data it needs explicitly:

```liquid
{% render 'product-card', product: product %}
```

## Scope isolation: the single most important thing to know about snippets

Snippets are intentionally isolated: a snippet can only see variables you explicitly pass to it. It can't reach into the surrounding section's settings or other variables by accident — which keeps a snippet predictable no matter where it's rendered from.

:::caution[A common mistake if you've used other templating languages]
Don't assume a snippet can read variables from whatever called it, the way some other languages' "partials" or "includes" work. Liquid's `{% render %}` deliberately isolates scope — a snippet only ever sees what you explicitly pass it. Relying on anything else will work in some places and silently fail in others, depending on what happens to be in scope at each call site.
:::

## Why a snippet isn't a block

It's tempting to reach for a snippet any time you want to avoid repeating code — but that's only half the question. The other half: does a merchant need to configure this piece visually, from the theme editor? If yes, it should be a block, not a snippet, even if a snippet would technically "work." A snippet has no settings UI at all; wrapping settings-worthy content in one just hides those settings from the person who should be able to change them.

A good rule of thumb: snippets are for developers avoiding repetition in their own code. Blocks are for merchants who need visible, editable control over something. The `product-card` snippet above is a good fit — a merchant never needs to directly configure "how a product card renders," they just see it as part of whatever section uses it.

## Key takeaways

- A snippet is reusable Liquid code with no settings UI — purely for developers avoiding repetition.
- `{% render %}` isolates a snippet's scope; it only sees variables explicitly passed to it.
- If something needs merchant-visible settings, it's a block, not a snippet — even if a snippet would technically work.

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture#snippets) (shopify.dev)
- [The render tag](https://shopify.dev/docs/api/liquid/tags/render) (shopify.dev)
