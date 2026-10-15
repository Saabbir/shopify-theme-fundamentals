---
title: A Complete Example
description: A real product page section combining variants, media, availability, pricing, and selling plans into one working whole.
---

**TL;DR:** A real product page section combining variants, media, availability, pricing, and selling plans into one working whole.

This page doesn't introduce anything new — it's every earlier page in this chapter, combined into one realistic `sections/main-product.liquid`-style example, to show how these pieces actually fit together on a real product page rather than in isolation.

## The section

```liquid
{% # sections/main-product.liquid %}
{% liquid
  assign current_variant = product.selected_or_first_available_variant
  assign gallery_media = current_variant.featured_media | default: product.featured_media
%}

<div class="product">
  {% # --- Media gallery: covered in "The Media Gallery" --- %}
  <div class="product__gallery">
    {% for item in product.media %}
      <div class="product__media" {% if item == gallery_media %}data-active{% endif %}>
        {% case item.media_type %}
          {% when 'image' %}
            {{ item | image_url: width: 800 | image_tag }}
          {% when 'video' %}
            {{ item | media_tag }}
          {% when 'external_video' %}
            {{ item | external_video_tag }}
          {% when 'model' %}
            {{ item | model_viewer_tag }}
        {% endcase %}
      </div>
    {% endfor %}
  </div>

  <div class="product__info">
    <h1>{{ product.title }}</h1>

    {% # --- Pricing: covered in "Availability, Pricing & Compare-At in Depth" --- %}
    <div class="product__price">
      {% if product.price_varies %}
        From {{ product.price_min | money }}
      {% else %}
        {% if current_variant.compare_at_price > current_variant.price %}
          <span class="product__sale-badge">Sale</span>
          <s>{{ current_variant.compare_at_price | money }}</s>
        {% endif %}
        {{ current_variant.price | money }}
      {% endif %}
    </div>

    {% # --- Option picker: covered in "The Variants & Options Matrix in Depth" --- %}
    {% unless product.has_only_default_variant %}
      <variant-picker>
        {% for option in product.options_with_values %}
          <fieldset>
            <legend>{{ option.name }}</legend>
            {% for value in option.values %}
              <label>
                <input
                  type="radio"
                  name="option-{{ option.position }}"
                  value="{{ value }}"
                  {% if current_variant.options[forloop.parentloop.index0] == value %}checked{% endif %}
                >
                {{ value }}
              </label>
            {% endfor %}
          </fieldset>
        {% endfor %}
        <script type="application/json" data-variants-json>
          {{ product.variants | json }}
        </script>
      </variant-picker>
    {% endunless %}

    {% # --- Selling plans: covered in "Selling Plans, Subscriptions & Quantity Rules" --- %}
    {% if product.selling_plan_groups.size > 0 %}
      <fieldset class="product__selling-plans">
        <legend>Purchase options</legend>
        <label>
          <input type="radio" name="selling_plan" value="" checked>
          One-time purchase
        </label>
        {% for group in product.selling_plan_groups %}
          {% for plan in group.selling_plans %}
            <label>
              <input type="radio" name="selling_plan" value="{{ plan.id }}">
              {{ plan.name }}
            </label>
          {% endfor %}
        {% endfor %}
      </fieldset>
    {% endif %}

    {% # --- Quantity rule: covered in "Selling Plans, Subscriptions & Quantity Rules" --- %}
    <label>
      Quantity
      <input
        type="number"
        min="{{ current_variant.quantity_rule.min }}"
        {% if current_variant.quantity_rule.max %}max="{{ current_variant.quantity_rule.max }}"{% endif %}
        step="{{ current_variant.quantity_rule.increment }}"
        value="{{ current_variant.quantity_rule.min }}"
        name="quantity"
      >
    </label>

    {% # --- Availability: covered in "Availability, Pricing & Compare-At in Depth" --- %}
    <button type="submit" {% unless current_variant.available %}disabled{% endunless %}>
      {% if current_variant.available %}
        Add to cart
      {% else %}
        Sold out
      {% endif %}
    </button>
  </div>
</div>
```

## Reading the section in order

A shopper landing on this page sees a gallery built from `product.media` (not `product.images`, so a video or 3D model shows up alongside photos), a price that's either a single value or a "from" range depending on `product.price_varies`, an option picker rendered from `product.options_with_values` (skipped entirely via `product.has_only_default_variant` when there's nothing to pick), an optional subscription choice only when `product.selling_plan_groups` actually has entries, a quantity input pre-filled from `quantity_rule`, and an add-to-cart button whose enabled state follows `current_variant.available` specifically — never `product.available`, which would stay `true` even while this exact variant is sold out.

`product.selected_or_first_available_variant` is doing real work at the top: it's the Liquid-side equivalent of "whatever the `variant_picker.js` from [32.2. The Variants & Options Matrix in Depth](/all-about-products/the-variants-and-options-matrix-in-depth/) would resolve" on first page load, before any JavaScript has run — it reads the `variant` URL parameter when present, and falls back to the first available variant otherwise. The `<variant-picker>` Web Component then takes over for any *change* a shopper makes after that, dispatching a `variant:changed` event that a real implementation would listen for to update the price, gallery, and availability shown above without a full page reload — wiring that event up is exactly what [8.1. The Product Form](/forms/the-product-form/) covers.

:::note[This is one deliberately linear example, not a template to copy as-is]
A real section would split several of these pieces into their own snippets (the gallery, the price, the option picker), and would listen for `variant:changed` to update the DOM in place rather than relying on a page reload after the variant parameter changes. Keeping everything inline here is deliberate — the goal is seeing all five chapters' concepts in one place, not production-ready markup.
:::

## Key takeaways

- A real product section pulls from every object this chapter covers at once: `product.media` for the gallery, `price_varies` for pricing, `options_with_values` for the picker, `selling_plan_groups` for subscriptions, `quantity_rule` for the quantity input, and the *variant's* `available` for the add-to-cart state.
- `product.selected_or_first_available_variant` is what resolves the correct starting variant on first page load, before any client-side JavaScript runs.
- Splitting a section like this into snippets, and wiring up `variant:changed` to update the page without a reload, is real production work this example intentionally leaves out to stay focused.

## Further reading

- [32.1. Product Fundamentals](/all-about-products/product-fundamentals/)
- [32.2. The Variants & Options Matrix in Depth](/all-about-products/the-variants-and-options-matrix-in-depth/)
- [32.3. The Media Gallery](/all-about-products/the-media-gallery/)
- [32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/)
- [32.5. Selling Plans, Subscriptions & Quantity Rules](/all-about-products/selling-plans-subscriptions-and-quantity-rules/)
- [8.1. The Product Form](/forms/the-product-form/)
