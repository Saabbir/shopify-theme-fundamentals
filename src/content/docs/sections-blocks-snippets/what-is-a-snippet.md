---
title: What Is a Snippet?
description: Reusable Liquid code with no settings UI of its own — for developers, not merchants.
---

**TL;DR:** Reusable Liquid code with no settings UI of its own — for developers, not merchants.

A **snippet** is a small, reusable chunk of Liquid code, stored in `snippets/`. It's the simplest of the three building blocks on this site: no schema, no settings a merchant can configure, no visibility in the theme editor at all. A snippet exists purely to avoid repeating the same markup or logic in more than one place in your code.

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

You render it with `{% render %}`, passing in whatever data it needs explicitly:

```liquid
{% render 'product-card', product: product %}
```

Snippets are intentionally isolated: a snippet can only see variables you explicitly pass to it. It can't reach into the surrounding section's settings or other variables by accident — which keeps a snippet predictable no matter where it's rendered from.

## Why a snippet isn't a block

It's tempting to reach for a snippet any time you want to avoid repeating code — but that's only half the question. The other half: does a merchant need to configure this piece visually, from the theme editor? If yes, it should be a [block](/sections-blocks-snippets/what-is-a-block/), not a snippet, even if a snippet would technically "work." A snippet has no settings UI at all; wrapping settings-worthy content in one just hides those settings from the person who should be able to change them.

A good rule of thumb: snippets are for developers avoiding repetition in their own code. Blocks are for merchants who need visible, editable control over something. The `product-card` snippet above is a good fit — a merchant never needs to directly configure "how a product card renders," they just see it as part of whatever section uses it.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Pass every variable a snippet needs explicitly, as named parameters to `{% render %}`. | **Relying on a snippet implicitly reading variables from its caller's scope.** `{% render %}` deliberately isolates a snippet's scope — pass in what it needs. |
| Reach for a snippet to avoid repeating markup across multiple sections or blocks. | **Reaching for a snippet when a merchant actually needs to configure the content visually.** That's a sign you need a block, not a snippet. |
| Add a `{% doc %}` comment to every snippet, documenting the parameters it expects. | **Leaving a snippet's expected parameters undocumented**, forcing anyone using it later to read through the snippet's internals just to call it correctly. |

## Key takeaways

- A snippet is reusable Liquid code with no settings UI — purely for developers avoiding repetition.
- `{% render %}` isolates a snippet's scope; it only sees variables explicitly passed to it.
- If something needs merchant-visible settings, it's a block, not a snippet — even if a snippet would technically work.

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture#snippets) (shopify.dev)
- [The render tag](https://shopify.dev/docs/api/liquid/tags/render) (shopify.dev)
