---
title: "Price Formatting: Single, Compare-At & Ranges"
description: The three distinct price displays a card needs to handle correctly, and the exact properties that decide which one applies.
---

**TL;DR:** The three distinct price displays a card needs to handle correctly, and the exact properties that decide which one applies.

[32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/) covers where every price property comes from; this page is the condensed, card-specific version — exactly which combination to render for the three cases a card actually needs to tell apart.

## Case 1: a single price, no sale

```liquid
<span class="product-card__price">{{ card_product.price | money }}</span>
```

The plain case — one variant, or variants that all share the same price, with no active compare-at price.

## Case 2: a single price, on sale

```liquid
{% if on_sale %}
  <span class="product-card__price">
    <span class="product-card__price--sale">{{ card_product.price_min | money }}</span>
    <s class="product-card__price--compare">{{ card_product.compare_at_price_min | money }}</s>
  </span>
{% else %}
  <span class="product-card__price">{{ card_product.price_min | money }}</span>
{% endif %}
```

`on_sale` here is the same `compare_at_price_min > price_min` check from [33.3. Badges: Sale, Sold Out & Custom Tags](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/) — reuse the one computed value rather than repeating the comparison in two different places on the same card. The real `<s>` element (not a CSS `text-decoration: line-through` applied to a `<span>`) is deliberate: `<s>` is semantically "no longer accurate," which is exactly what a crossed-out former price means, and it reads correctly to assistive technology without any extra ARIA.

## Case 3: a price range across variants

```liquid
{% if card_product.price_varies %}
  <span class="product-card__price">
    {{ 'products.price.from_html' | t: price: card_product.price_min | money }}
  </span>
{% endif %}
```

`price_varies` is `true` the instant any two variants have different prices — this is the correct check, rather than manually comparing `price_min` and `price_max` yourself, since it's maintained by Shopify directly and already accounts for every variant, not just the two extremes. A range display conventionally shows only the lowest price with a "From" prefix, not the full `$20–$45` span — showing the full range requires `price_max` too, which is a legitimate alternate choice, just a less common one.

:::note[A translated "From" string, not hardcoded English]
`'products.price.from_html' | t: price: ...` pulls the "From" wording from the theme's locale files rather than hardcoding it, so the string translates correctly for a non-English storefront — see [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) for the full `t` filter mechanics this relies on.
:::

## Combining sale and range: a product that's both

```liquid
{% liquid
  assign on_sale = false
  if card_product.compare_at_price_min > card_product.price_min
    assign on_sale = true
  endif
%}

<span class="product-card__price">
  {% if card_product.price_varies %}{{ 'products.price.from' | t }}{% endif %}
  <span class="{% if on_sale %}product-card__price--sale{% endif %}">{{ card_product.price_min | money }}</span>
  {% if on_sale %}
    <s class="product-card__price--compare">{{ card_product.compare_at_price_min | money }}</s>
  {% endif %}
</span>
```

A product can be both ranged and on sale at once — a shirt in three sizes, two of which happen to be discounted. The combined check above is the general case every card should actually implement; Cases 1–3 above are each a simplified version of this, shown separately only to isolate what each condition is independently responsible for.

## Key takeaways

- `price_varies` (not manually comparing `price_min`/`price_max`) is the correct check for whether to show a "From" price at all.
- `compare_at_price_min > price_min` (not `product.compare_at_price`/`product.price` directly) is the correct sale check for a product that might have more than one variant.
- A real `<s>` element for the crossed-out former price is both simpler and more accessible than a `<span>` styled with `text-decoration: line-through`.
- A card's price display is the combination of the range check and the sale check together, not two separate, mutually exclusive cases — a product can be both at once.

## Further reading

- [32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/)
- [33.3. Badges: Sale, Sold Out & Custom Tags](/all-about-product-cards/badges-sale-sold-out-and-custom-tags/)
- [Money filters (shopify.dev)](https://shopify.dev/docs/api/liquid/filters/money-filters)
