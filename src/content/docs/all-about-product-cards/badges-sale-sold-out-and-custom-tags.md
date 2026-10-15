---
title: "Badges: Sale, Sold Out & Custom Tags"
description: Deriving sale and sold-out badges from real product data instead of a setting, plus a tag-based convention for merchant-controlled custom badges.
---

**TL;DR:** Deriving sale and sold-out badges from real product data instead of a setting, plus a tag-based convention for merchant-controlled custom badges.

A badge is a small label — "Sale," "Sold Out," "New" — overlaid on a product card. The two most common ones, sale and sold out, should never be something a merchant manually toggles per product; they should be computed directly from data that's already true or false.

## Sold out: `product.available`, not a manual flag

```liquid
{% unless card_product.available %}
  <span class="sol-product-card__badge sol-product-card__badge--sold-out">
    {{ 'products.badges.sold_out' | t }}
  </span>
{% endunless %}
```

`product.available` is `true` the moment *any* variant has inventory (or is set to continue selling when out of stock) — it's already the correct, continuously accurate answer to "should this show a sold-out badge," computed from real inventory data. A theme should never ask a merchant to manually mark a product "sold out," since that flag would immediately go stale the moment inventory changes, in either direction.

## Sale: comparing price to compare-at price, not a toggle

```liquid
{% liquid
  assign on_sale = false
  if card_product.compare_at_price_min > card_product.price_min
    assign on_sale = true
  endif
%}

{% if on_sale %}
  <span class="sol-product-card__badge sol-product-card__badge--sale">
    {{ 'products.badges.sale' | t }}
  </span>
{% endif %}
```

Same reasoning as sold-out: whether a product is "on sale" is already fully determined by comparing its current price against its compare-at price — [32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/) covers exactly why `compare_at_price_min`/`price_min` (not `product.compare_at_price`/`product.price` directly) are the correct comparison for a product with more than one variant, since a single-variant check can miss a sale that only applies to some variants.

:::caution[`compare_at_price` can be set without the product actually being on sale]
Some apps and import tools set a `compare_at_price` for reasons unrelated to an active sale — a manufacturer's suggested retail price shown for comparison, for instance, with no intention of implying a discount. A badge that fires on `compare_at_price_min > price_min` with no further check is the right default for a store that uses compare-at prices exclusively for real sales; a store with a different convention needs to decide that case by case, not something this theme chapter can resolve generically.
:::

## Custom badges: a tag-based convention a merchant actually controls

Sale and sold-out are derived facts; something like "New" or "Staff Pick" is a merchant *decision*, which means it needs a mechanism a merchant can actually set from the admin, without a developer's involvement. A plain product tag, read with a naming convention, is the simplest option that doesn't require a metafield definition or an app:

```liquid
{% liquid
  assign custom_badge = nil
  for tag in card_product.tags
    if tag contains 'badge:'
      assign custom_badge = tag | remove_first: 'badge:'
    endif
  endfor
%}

{% if custom_badge %}
  <span class="sol-product-card__badge sol-product-card__badge--custom">
    {{ custom_badge }}
  </span>
{% endif %}
```

A merchant tags a product `badge:New` or `badge:Staff Pick` directly in the admin's product tag field — no theme editor setting, no metafield setup, and it's visible and editable by anyone who can edit a product, which a metafield (hidden behind Settings → Custom data) usually isn't for a merchant unfamiliar with metafields.

:::tip[A metafield is the better choice once a store needs more than plain text]
This `badge:` tag convention is deliberately the simplest option — it's one plain string, with no color, icon, or expiry date attached. A store that needs a badge with its own color (a "Limited Edition" badge in gold, versus a "New" badge in the theme's accent color) outgrows a tag and is better served by a proper metafield definition instead, which can carry structured data a plain tag string can't.
:::

## Layering more than one badge

```liquid
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
```

Sold-out intentionally suppresses the sale and custom badges, rather than stacking all three — a sold-out product being simultaneously marked "Sale" reads as confusing (why advertise a discount on something unavailable to buy?), so the `{% else %}` here establishes a simple priority: sold-out wins outright; sale and a custom tag can coexist with each other.

## Key takeaways

- Sold-out and sale badges should always be derived from `product.available` and a price comparison — never a manual per-product toggle, which drifts out of sync with real inventory and pricing the moment either changes.
- A `badge:` tag prefix gives a merchant a zero-setup way to control a custom badge's text directly from the admin's tag field; a metafield is the better choice once a badge needs more than plain text (a color, an icon, an expiry).
- Decide a priority when more than one badge could apply at once — sold-out suppressing sale is a sensible default, not a universal rule every store needs to follow.

## Further reading

- [32.4. Availability, Pricing & Compare-At in Depth](/all-about-products/availability-pricing-and-compare-at-in-depth/)
- [32.6. Metafields, Tags & Categorization](/all-about-products/metafields-tags-and-categorization/)
- [33.4. Price Formatting: Single, Compare-At & Ranges](/all-about-product-cards/price-formatting-single-compare-at-and-ranges/)
