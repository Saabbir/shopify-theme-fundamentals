---
title: "Worked Example: Building a Simple Section"
description: A complete section, block, and snippet, built from nothing, with every decision explained.
---

**TL;DR:** A complete section, block, and snippet, built from nothing, with every decision explained.

This page builds one small feature end to end — a "featured collection" section, showing a heading and a row of product cards — using everything covered so far in this section of the site. Every file, and every decision behind it, is explained as we go.

## The brief

"Add a section merchants can place anywhere on a page, showing a heading and a configurable number of products from a collection they choose."

## Step 1: Is this a section?

Walking through the [decision guide](/sections-blocks-snippets/choosing-the-right-piece/): a merchant needs to add, remove, and reorder this on a page, and configure it (which collection, how many products). That's a **section**.

## Step 2: Does it need blocks?

The products shown come automatically from whatever collection the merchant picks — they're not individually, manually curated items a merchant adds one at a time. So: no blocks needed here. (Compare this to the testimonials example in [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/), where each testimonial genuinely is a separate, manually-added item — that's the case where blocks make sense.)

## Step 3: Is there reusable markup?

Rendering a single product (image, title, price) is something this section needs, and it's exactly the kind of markup likely to be reused elsewhere — a search results page, a "related products" section, anywhere a product needs a compact visual representation. That reuse is the signal to extract it into a **snippet**.

## The snippet

```liquid
{% comment %} snippets/product-card.liquid {% endcomment %}
{% doc %}
  Renders a single product card.

  @param {object} product - A product object to render.
{% enddoc %}

<div class="product-card">
  <a href="{{ product.url }}">
    <img
      src="{{ product.featured_image | image_url: width: 400 }}"
      alt="{{ product.featured_image.alt | escape }}"
      loading="lazy"
    >
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </a>
</div>
```

## The section

```liquid
{% comment %} sections/featured-collection.liquid {% endcomment %}
{% liquid
  assign heading = section.settings.heading
  assign collection = section.settings.collection
  assign products_to_show = section.settings.products_to_show
%}

<div class="featured-collection">
  <h2>{{ heading }}</h2>

  {% if collection != blank %}
    <div class="featured-collection__grid">
      {% for product in collection.products limit: products_to_show %}
        {% render 'product-card', product: product %}
      {% endfor %}
    </div>
  {% else %}
    <p>Select a collection to show products here.</p>
  {% endif %}
</div>

{% stylesheet %}
  .featured-collection__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Featured collection",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured products"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "label": "Products to show",
      "min": 2,
      "max": 12,
      "step": 1,
      "default": 4
    }
  ],
  "presets": [
    {
      "name": "Featured collection"
    }
  ]
}
{% endschema %}
```

## Why each piece looks the way it does

- **Settings are assigned to variables at the top**, via one `{% liquid %}` block, instead of writing `section.settings.heading` repeatedly further down. This keeps the markup readable and makes it obvious, at a glance, exactly which settings this section uses.
- **The empty state is handled explicitly** (`{% else %}` when no collection is selected) instead of letting the section silently render nothing. A merchant adding this section for the first time, before configuring it, sees a clear instruction rather than a blank space that looks broken.
- **The snippet takes `product` as an explicit parameter**, not something it reads implicitly from the surrounding section — so it works identically no matter where it's rendered from later.
- **The schema's `range` setting has real `min`/`max`/`step` values**, not an unbounded number input — this keeps a merchant from accidentally setting an unreasonable value, like showing 500 products in a grid designed for a dozen.
- **`presets` includes a `name`**, so the section looks complete and sensible the moment it's added, before a merchant has touched any setting.

## Key takeaways

- The same decision process from the previous page applies to every new feature: section first, then ask about blocks, then ask about shared/reusable markup.
- A well-built section handles its own empty/unconfigured state, not just the "happy path" where every setting is already filled in.
- This exact shape — settings assigned to variables up top, a schema with real presets, a stylesheet scoped to this section — is the pattern to reach for by default.

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
- [Input settings reference](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) (shopify.dev)
