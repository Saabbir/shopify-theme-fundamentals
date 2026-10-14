---
title: A Complete Example
description: One image snippet combining the aspect-ratio wrapper, lazy-loading with a placeholder fade-in, and badge/overlay slots — called the same way everywhere in the theme.
---

**TL;DR:** One image snippet combining the aspect-ratio wrapper, lazy-loading with a placeholder fade-in, and badge/overlay slots — called the same way everywhere in the theme.

```liquid
{% comment %}
  snippets/image.liquid

  Accepts:
  - image: the image object (required)
  - aspect_ratio: a number, defaults to 1 (square)
  - sizes_attr: the sizes attribute value (required — varies by call site)
  - priority: true for the single most important image on the page
{% endcomment %}
{% liquid
  assign aspect_ratio = aspect_ratio | default: 1
  assign widths = '400,600,900,1200,1600'
%}

<div class="sol-image-wrapper" style="--sol-image-aspect-ratio: {{ aspect_ratio }};">
  {% if image %}
    <img
      class="sol-image"
      src="{{ image | image_url: width: 600 }}"
      srcset="
        {%- for w in widths | split: ',' -%}
          {{ image | image_url: width: w }} {{ w }}w{% unless forloop.last %},{% endunless %}
        {%- endfor -%}
      "
      sizes="{{ sizes_attr }}"
      alt="{{ image.alt | escape }}"
      {% if priority %}
        loading="eager"
        fetchpriority="high"
      {% else %}
        loading="lazy"
        onload="this.closest('.sol-image-wrapper').classList.add('is-loaded')"
      {% endif %}
      width="600"
      height="{{ 600 | divided_by: aspect_ratio }}"
    >
  {% endif %}
  {% comment %} Badges/overlays are rendered by the caller, as siblings of this snippet's own markup, inside their own wrapping element. {% endcomment %}
</div>
```

```css
.sol-image-wrapper {
  position: relative;
  overflow: hidden;
  background: var(--color-border);
  aspect-ratio: var(--sol-image-aspect-ratio, 1 / 1);
}

.sol-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sol-image-wrapper.is-loaded .sol-image,
.sol-image-wrapper:has(.sol-image[loading="eager"]) .sol-image {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .sol-image {
    transition: none;
  }
}
```

## Calling it from a product card, with a badge layered on top

```liquid
<div class="sol-product-card__media">
  {% render 'image', image: card_product.featured_image, aspect_ratio: 1, sizes_attr: '(min-width: 990px) 25vw, 50vw' %}
  <span class="sol-product-card__badge">{{ 'products.badges.sale' | t }}</span>
</div>
```

The badge is rendered by the *caller*, as a sibling inside its own wrapping element around `{% render 'image' %}` — not as a parameter the image snippet itself understands. This keeps the image snippet generically reusable (a hero banner calling it has no reason to know what a product badge even is) while still letting [Badge & Overlay Composition](/all-about-images/badge-and-overlay-composition/)'s positioning technique work exactly the same way, since `position: relative` lives on the same `.sol-image-wrapper` class either way.

## Reading the `:has()` rule

```css
.sol-image-wrapper:has(.sol-image[loading="eager"]) .sol-image {
  opacity: 1;
}
```

This line exists to handle a real edge case: a `loading="eager"` image has no `onload` handler attached (priority images skip the fade-in entirely, appearing immediately), but without this rule, its `opacity: 0` base style would leave it invisible until something else happened to trigger a repaint. `:has()` — covered in [Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/) — lets this be expressed as a single CSS rule keyed off the image's own `loading` attribute, rather than needing a second JavaScript branch just to toggle a class differently for the priority case.

## Key takeaways

- A shared image snippet's parameters should cover what genuinely varies by call site (`aspect_ratio`, `sizes_attr`, `priority`) while keeping loading strategy and placeholder behavior identical across every call.
- Badges and overlays are composed by the *caller*, around the snippet's output, rather than becoming parameters the image snippet itself needs to understand — this keeps the snippet reusable for contexts that have no concept of a product badge at all.
- `:has()` can resolve a real conditional-styling edge case (a priority image skipping the fade-in) in one CSS rule, instead of a second JavaScript branch.

## Further reading

- [Image Fundamentals: What Belongs in a Reusable Snippet](/all-about-images/image-fundamentals-what-belongs-in-a-reusable-snippet/)
- [All About Product Cards](/all-about-product-cards/)
- [Old Patterns vs. New CSS Features](/all-about-css/old-patterns-vs-new-css-features/)
