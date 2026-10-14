---
title: A Complete Example
description: One product-card snippet combining the hover image, a badge, range/sale-aware pricing, color swatches, quick add, and a compact ratings summary.
---

**TL;DR:** One product-card snippet combining the hover image, a badge, range/sale-aware pricing, color swatches, quick add, and a compact ratings summary.

Every piece below was covered on its own page earlier in this chapter; this example exists to show them composed together in one real snippet, in the order they'd actually appear on a card, and to show how each piece's own guard conditions (no second image, no swatch data, zero reviews) interact without stepping on each other.

```liquid
{% comment %}
  snippets/product-card.liquid

  Accepts:
  - card_product: the product to render a card for
{% endcomment %}
{% liquid
  assign primary_image = card_product.featured_image
  assign secondary_image = card_product.images[1]
  assign on_sale = false
  if card_product.compare_at_price_min > card_product.price_min
    assign on_sale = true
  endif
  assign custom_badge = nil
  for tag in card_product.tags
    if tag contains 'badge:'
      assign custom_badge = tag | remove_first: 'badge:'
    endif
  endfor
  assign color_option = card_product.options_with_values | where: 'name', 'Color' | first
%}

<div class="sol-product-card">
  <a href="{{ card_product.url }}" class="sol-product-card__media">
    <img
      class="sol-product-card__image sol-product-card__image--primary"
      src="{{ primary_image | image_url: width: 600 }}"
      alt="{{ primary_image.alt | escape }}"
      loading="lazy"
      width="600"
      height="{{ 600 | divided_by: primary_image.aspect_ratio }}"
    >
    {% if secondary_image %}
      <img
        class="sol-product-card__image sol-product-card__image--secondary"
        src="{{ secondary_image | image_url: width: 600 }}"
        alt=""
        loading="lazy"
        width="600"
        height="{{ 600 | divided_by: secondary_image.aspect_ratio }}"
      >
    {% endif %}

    <div class="sol-product-card__badges">
      {% unless card_product.available %}
        <span class="sol-product-card__badge sol-product-card__badge--sold-out">{{ 'products.badges.sold_out' | t }}</span>
      {% else %}
        {% if on_sale %}
          <span class="sol-product-card__badge sol-product-card__badge--sale">{{ 'products.badges.sale' | t }}</span>
        {% endif %}
        {% if custom_badge %}
          <span class="sol-product-card__badge sol-product-card__badge--custom">{{ custom_badge }}</span>
        {% endif %}
      {% endunless %}
    </div>
  </a>

  <h3 class="sol-product-card__title">
    <a href="{{ card_product.url }}">{{ card_product.title }}</a>
  </h3>

  {% render 'product-rating', product: card_product, size: 'compact' %}

  <span class="sol-product-card__price">
    {% if card_product.price_varies %}{{ 'products.price.from' | t }}{% endif %}
    <span class="{% if on_sale %}sol-product-card__price--sale{% endif %}">{{ card_product.price_min | money }}</span>
    {% if on_sale %}
      <s class="sol-product-card__price--compare">{{ card_product.compare_at_price_min | money }}</s>
    {% endif %}
  </span>

  {% if color_option %}
    <ul class="sol-product-card__swatches" role="list">
      {% for value in color_option.values limit: 5 %}
        <li>
          <a
            href="{{ value.variant.url | default: value.product_url }}"
            class="sol-swatch"
            style="{% if value.swatch.color %}--sol-swatch-color: {{ value.swatch.color }};{% endif %}"
            aria-label="{{ value.name }}"
            {% unless value.available %}aria-disabled="true"{% endunless %}
          ></a>
        </li>
      {% endfor %}
    </ul>
  {% endif %}

  <product-form class="sol-quick-add">
    <form action="/cart/add" method="post" enctype="multipart/form-data">
      <input type="hidden" name="id" value="{{ card_product.selected_or_first_available_variant.id }}">
      <button type="submit" class="sol-button" {% unless card_product.selected_or_first_available_variant.available %}disabled{% endunless %}>
        {{ 'products.quick_add.add_to_cart' | t }}
      </button>
    </form>
  </product-form>
</div>
```

## Reading the composition, piece by piece

- **Image and badges share one wrapper** (`sol-product-card__media`) because the badges are positioned relative to the image, not the card as a whole — this keeps a badge from drifting if the title below ever wraps to a different number of lines.
- **The sold-out/sale/custom badge priority** from [Badges](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/) is preserved exactly: the `{% else %}` means a sold-out product never also shows "Sale," regardless of its actual compare-at price.
- **The ratings summary is rendered via the shared snippet from [All About Product Reviews](/all-about-product-reviews/)**, passed `size: 'compact'`, rather than this chapter reimplementing star-rating markup — a card's rating display and a product page's should always come from the same source, never two parallel implementations.
- **Swatches are capped at `limit: 5`** — a product with ten colors would otherwise overflow a card's limited width; a "+5 more" affordance or linking straight to the product page for the full set is a reasonable addition a real theme would likely want, left out here to keep the example focused.
- **Quick add is the very last element**, after price and swatches — a shopper needs to see the price and have a chance to pick a color before committing to add it to the cart, so its position in the markup (and, visually, in the card's layout) reflects that order of decisions.

## Key takeaways

- Every independent guard condition from earlier pages (no second image, no swatch data, no reviews, sold-out suppressing sale) needs to keep working correctly once combined — composing components doesn't remove the need for each one's own edge-case handling.
- A card's rating display should always call the same shared snippet a product page uses, parameterized by size, rather than reimplementing star markup twice.
- Capping how many swatches render inline (and linking elsewhere for the rest) keeps a card's layout stable regardless of how many color options a specific product happens to have.

## Further reading

- [Product Card Fundamentals](/all-about-product-cards/product-card-fundamentals/)
- [All About Product Reviews](/all-about-product-reviews/)
- [All About Products](/all-about-products/)
