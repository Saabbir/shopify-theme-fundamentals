---
title: A Complete CSS Example
description: One section's stylesheet combining tokens, cascade layers, container queries, and logical properties at once.
---

**TL;DR:** One section's stylesheet combining tokens, cascade layers, container queries, and logical properties at once.

Every other page in this chapter looked at one CSS concern at a time. This page combines them into a single, realistic `sections/product-grid.liquid` — BEM naming, custom-property tokens, a container query, logical properties, and a cascade-layer-aware stylesheet, all in one file.

## The complete section

```liquid
{% comment %}
  sections/product-grid.liquid

  A responsive grid of product-card snippets. The grid itself is a
  size-query container, so product-card can respond to its own
  available width rather than the page's viewport width.
{% endcomment %}
{% liquid
  assign collection = collections[section.settings.collection]
  assign color_scheme = section.settings.color_scheme
%}

<div class="product-grid color-{{ color_scheme }}">
  {% for product in collection.products limit: 12 %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>

{% stylesheet %}
  @layer components {
    .product-grid {
      container-type: inline-size;
      container-name: product-grid;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
      padding-block: var(--space-xl);
      background: var(--color-background);
    }

    @container product-grid (min-width: 700px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
{% endstylesheet %}
```

```liquid
{% comment %} snippets/product-card.liquid (abridged — full version in All About Snippets) {% endcomment %}
<div class="product-card">
  <img src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.featured_image.alt | escape }}">
  <h3 class="product-card__title">{{ product.title }}</h3>
  <p class="product-card__price">{{ product.price | money }}</p>
</div>

{% stylesheet %}
  @layer components {
    .product-card {
      padding-inline: var(--space-sm);
      text-align: start;
    }

    .product-card__title {
      font-family: var(--font-heading-family);
      font-weight: var(--font-heading-weight);
      margin-block-end: var(--space-xs);
    }

    .product-card__price {
      font-family: var(--font-body-family);
      color: var(--color-text);
    }
  }
{% endstylesheet %}
```

## Every concern from this chapter, in one place

- **Co-located `{% stylesheet %}` tags**, one per file, exactly as covered in [CSS Fundamentals in a Shopify Theme](/all-about-css/css-fundamentals/) — no Liquid output inside either block, since `{% stylesheet %}` doesn't evaluate it.
- **BEM naming** — `product-card`, `product-card__title`, `product-card__price`, per [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/). Nothing here risks a cross-file dependency: `product-grid` only styles its own outer element, and `product-card`'s classes are defined in the same file that uses them.
- **Design tokens, never a hardcoded value** — `var(--space-md)`, `var(--color-background)`, `var(--font-heading-family)` throughout, resolved once by the snippet shown in full on [A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/).
- **A container query, not a viewport media query** — `product-grid` becomes a size-query container, and its own `@container` rule decides the column count based on the grid's actual available width, per [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/). This is also why `product-card`'s own styling never needs to know how many columns it's sitting in.
- **Logical properties** — `padding-inline`, `padding-block`, `margin-block-end`, and `text-align: start` throughout, per [Responsive CSS, Container Queries & Logical Properties](/all-about-css/responsive-css-container-queries-and-logical-properties/) — this section's spacing survives a merchant adding a right-to-left language with zero extra code, per [RTL, Print & Other Rendering Contexts](/all-about-css/rtl-print-and-other-rendering-contexts/).
- **A cascade layer** — both stylesheets declare their rules inside `@layer components`, per [Cascade Layers & Managing Specificity](/all-about-css/cascade-layers-and-managing-specificity/), so a theme-wide utility class (declared in a later `utilities` layer) can still override either of them when needed, without a specificity fight.
- **A color scheme, consumed correctly** — `color-{{ color_scheme }}` on the outer element supplies `--color-background` and `--color-text` from whichever scheme a merchant picked, per [A Complete Color Scheme Example](/all-about-colors/a-complete-color-scheme-example/).

## Key takeaways

- A real section's CSS draws on every layer of this chapter at once: static `{% stylesheet %}` content, BEM-scoped class names, token custom properties, a container query for component-level responsiveness, logical properties, and a declared cascade layer.
- None of these techniques are mutually exclusive — they compose, and a production theme's stylesheet typically uses most of them in every file, not just as an occasional advanced technique.
- Tying it back to the render-tree subsetting from [Critical CSS & Loading Performance](/all-about-css/critical-css-and-loading-performance/): since `product-card`'s classes are only ever defined and used within its own file, this section is fully subsetting-safe — nothing here risks a class silently losing its styles on a page that doesn't render both files.

## Further reading

- [A Complete Section Example](/all-about-sections/a-complete-section-example/)
- [A Complete Snippet Example](/all-about-snippets/a-complete-snippet-example/)
- [A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/)
