---
title: Availability, Pricing & Compare-At in Depth
description: What actually makes a product or variant available, and the price-range properties that cover a product whose variants don't all cost the same.
---

**TL;DR:** What actually makes a product or variant available, and the price-range properties that cover a product whose variants don't all cost the same.

## "Available" has a precise, three-part definition

A variant is available when **any one** of these is true — not all three, just one:

```liquid
{{ variant.inventory_quantity }}
{{ variant.inventory_policy }}
{{ variant.inventory_management }}
```

- `inventory_quantity` is greater than `0`, **or**
- `inventory_policy` is `"continue"` (the merchant has explicitly allowed overselling past zero stock), **or**
- `inventory_management` is `nil` (inventory isn't tracked for this variant at all, so Shopify has no basis to call it "out of stock")

```liquid
{% if variant.available %}
  Add to cart
{% else %}
  Sold out
{% endif %}
```

`variant.available` already does this three-way check for you — there's essentially never a reason to re-derive it manually from the three underlying properties above. They're worth knowing individually mainly for understanding *why* a specific variant shows as available when its `inventory_quantity` happens to be zero or negative.

`product.available` is `true` the moment *any* variant on the product is available — a product can show as "available" on a collection grid while the one specific variant a shopper actually wants is sold out, which is exactly why a product page always checks the *variant's* availability for its own add-to-cart button, not the product's.

## Price properties: one value vs. a range

```liquid
{{ product.price }}
{{ product.price_min }}
{{ product.price_max }}
{{ product.price_varies }}
```

`product.price` and `product.price_min` are identical — both the lowest price across every variant. `price_max` is the highest. `price_varies` is `true` the moment those two differ, which is the actual check that decides whether a product card shows one plain price or a "from $X" price:

```liquid
{% if product.price_varies %}
  From {{ product.price_min | money }}
{% else %}
  {{ product.price | money }}
{% endif %}
```

The identical four-property pattern repeats for the **compare-at** price (the "was" price shown struck through next to a sale price):

```liquid
{{ product.compare_at_price }}
{{ product.compare_at_price_max }}
{{ product.compare_at_price_min }}
{{ product.compare_at_price_varies }}
```

## A product can look "on sale" without actually being on sale

A compare-at price only means something when it's genuinely higher than the real price:

```liquid
{% if variant.compare_at_price > variant.price %}
  <span class="sale-badge">Sale</span>
  <s>{{ variant.compare_at_price | money }}</s>
  {{ variant.price | money }}
{% endif %}
```

:::caution[A set compare_at_price isn't automatically a real discount]
A variant can have a `compare_at_price` set to a value that's equal to, or even lower than, its actual `price` — a leftover from a past sale that was never cleared, or simple admin data entry. Checking `compare_at_price > price` explicitly, rather than just `{% if variant.compare_at_price %}`, is what prevents a "Sale" badge from appearing on a product that isn't actually discounted.
:::

## Pricing is always per-variant at the source

Every price property on `product` (`price`, `price_min`, `price_max`, and their compare-at equivalents) is *derived* from the underlying variants — there's no independent "product price" stored anywhere. This is worth internalizing because it explains why a price can only ever be set, in the admin or through an app, at the variant level, never the product level directly, even for a single-variant product where that distinction barely seems to matter.

## Key takeaways

- `variant.available` already checks `inventory_quantity > 0`, `inventory_policy == 'continue'`, and `inventory_management == nil` together — reach for it directly rather than re-deriving it.
- `product.available` means *any* variant is available; a product page's own add-to-cart state should check the specific selected variant instead.
- `price_varies`/`compare_at_price_varies` are the correct checks for whether to show a single price or a range — not manually comparing `price_min` and `price_max` yourself.
- A `compare_at_price` only represents a real discount when it's genuinely greater than the actual price; check that explicitly before showing a sale badge.

## Further reading

- [Liquid objects: product](https://shopify.dev/docs/api/liquid/objects/product) (shopify.dev)
- [Liquid objects: variant](https://shopify.dev/docs/api/liquid/objects/variant) (shopify.dev)
- [Money filters](https://shopify.dev/docs/api/liquid/filters/money-filters) (shopify.dev)
