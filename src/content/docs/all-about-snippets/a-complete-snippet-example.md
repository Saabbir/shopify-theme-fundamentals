---
title: A Complete Snippet Example
description: One full, realistic snippet, with every optional parameter and defensive check, called from two different places.
---

**TL;DR:** One full, realistic snippet, with every optional parameter and defensive check, called from two different places.

[16.1. Snippet Fundamentals](/all-about-snippets/snippet-fundamentals/) introduced `product-card` as a basic example. This page grows that same snippet into a complete, production-realistic version — more parameters, defensive checks for missing data, and two different call sites to show why scope isolation (passing everything explicitly) is what makes that reuse safe.

## The complete snippet: `snippets/product-card.liquid`

```liquid
{% doc %}
  Renders a single product card: image, title, price, and an
  optional vendor name.

  @param {object} product - The product to render. Required.
  @param {number} [image_width] - Image render width, in pixels. Defaults to 400.
  @param {boolean} [show_vendor] - Whether to show the vendor name. Defaults to false.
  @param {string} [heading_tag] - The heading tag to wrap the title in. Defaults to "h3".

  @example
  {% render 'product-card', product: product %}

  @example
  {% render 'product-card', product: product, show_vendor: true, heading_tag: 'h2' %}
{% enddoc %}
{% liquid
  assign image_width = image_width | default: 400
  assign show_vendor = show_vendor | default: false
  assign heading_tag = heading_tag | default: 'h3'
%}

{% if product == blank %}
  {% render 'product-card-empty' %}
{% else %}
  <div class="product-card">
    {% if product.featured_image != blank %}
      <img
        class="product-card__image"
        src="{{ product.featured_image | image_url: width: image_width }}"
        alt="{{ product.featured_image.alt | escape }}"
        width="{{ image_width }}"
        height="{{ image_width | divided_by: product.featured_image.aspect_ratio | default: image_width }}"
        loading="lazy"
      >
    {% else %}
      <div class="product-card__image product-card__image--placeholder" aria-hidden="true"></div>
    {% endif %}

    {% if show_vendor and product.vendor != blank %}
      <p class="product-card__vendor">{{ product.vendor }}</p>
    {% endif %}

    <{{ heading_tag }} class="product-card__title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </{{ heading_tag }}>

    <p class="product-card__price">
      {% if product.compare_at_price > product.price %}
        <span class="product-card__price--sale">{{ product.price | money }}</span>
        <s class="product-card__price--compare">{{ product.compare_at_price | money }}</s>
      {% else %}
        {{ product.price | money }}
      {% endif %}
    </p>
  </div>
{% endif %}
```

```liquid
{% comment %} snippets/product-card-empty.liquid — the fallback rendered above when product is blank {% endcomment %}
<div class="product-card product-card--empty">
  <div class="product-card__image product-card__image--placeholder" aria-hidden="true"></div>
  <p class="product-card__title">{{ 'products.card.unavailable' | t }}</p>
</div>
```

## Called from two different places

### 1. A collection grid

```liquid
{% comment %} sections/featured-collection.liquid {% endcomment %}
{% liquid
  assign collection = collections[section.settings.collection]
  assign products_to_show = section.settings.products_to_show
%}

<div class="featured-collection__grid">
  {% for product in collection.products limit: products_to_show %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

### 2. A "related products" block, with different parameters

```liquid
{% comment %} blocks/related-products.liquid {% endcomment %}
{% liquid
  assign related_products = product.collections.first.products | where: 'available'
%}

<div class="related-products" {{ block.shopify_attributes }}>
  {% for related_product in related_products limit: 4 %}
    {% unless related_product.id == product.id %}
      {% render 'product-card', product: related_product, show_vendor: true, heading_tag: 'h4' %}
    {% endunless %}
  {% endfor %}
</div>
```

The first call site passes only `product` and accepts every default. The second passes `show_vendor: true` and a different `heading_tag`, because a related-products block sits lower in the page's heading hierarchy than a top-level collection grid section. Nothing about the snippet itself changed between these two calls — only what was explicitly passed in.

## Every concern from this chapter, in one place

- **A full `{% doc %}` block** — every parameter is documented with its type, whether it's required, and a default, plus two `@example` calls showing it used both ways, per [16.1. Snippet Fundamentals](/all-about-snippets/snippet-fundamentals/).
- **A defensive check wrapping the whole snippet** — `{% if product == blank %}` branches to a dedicated empty-state snippet instead of letting a blank product fall through and render a broken card further down. Liquid has no early-exit tag for a snippet, so the guard wraps the entire body rather than trying to stop execution partway through.
- **Sensible defaults for every optional parameter** — `image_width`, `show_vendor`, and `heading_tag` all fall back with `default:` rather than erroring or rendering blank when a caller omits them.
- **A guard around a missing image** — `product.featured_image != blank` branches to a placeholder instead of outputting a broken `<img src="">`.
- **Explicit scope, proven by two call sites** — the collection grid and the related-products block pass different parameters and get correctly different output, which only works because `{% render %}` isolates scope and nothing is read implicitly from either caller's surrounding context.
- **A variable heading tag**, so the same card can nest correctly under an `<h2>` section heading in one place and an `<h3>` or `<h4>` in another, without two near-duplicate snippets.

## Key takeaways

- A snippet meant for reuse across a real theme needs documented optional parameters with sensible defaults, not just one hardcoded shape.
- Liquid has no early-return tag, so a defensive check wraps the whole snippet body in an `{% if %}` / `{% else %}`, optionally delegating the "missing data" branch to its own dedicated empty-state snippet, rather than scattering guards throughout the markup.
- Two call sites passing different parameters, and getting correctly different results, is the clearest proof that a snippet's scope isolation is working as intended.

## Further reading

- [16.1. Snippet Fundamentals](/all-about-snippets/snippet-fundamentals/)
- [The render tag](https://shopify.dev/docs/api/liquid/tags/render) (shopify.dev)
