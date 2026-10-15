---
title: cart, customer & shop in Full
description: The three objects a theme reaches for constantly, with the one of the three guaranteed to exist on every single page.
---

**TL;DR:** The three objects a theme reaches for constantly, with the one of the three guaranteed to exist on every single page.

## cart

`cart` is the one major global object guaranteed to exist on every page of a storefront, not just a specific template — exactly so a header's cart icon can always show a current item count.

```liquid
{{ cart.item_count }}
{{ cart.items }}
{{ cart.empty? }}
{{ cart.total_price }}
{{ cart.original_total_price }}
{{ cart.total_discount }}
{{ cart.items_subtotal_price }}
{{ cart.checkout_charge_amount }}
{{ cart.currency }}
{{ cart.note }}
{{ cart.attributes }}
{{ cart.requires_shipping }}
{{ cart.taxes_included }}
{{ cart.discount_applications }}
```

`cart.items` is an array of `line_item` objects, each one a product/variant combination plus a quantity. `cart.total_price` is after discounts; `cart.original_total_price` is before; `cart.total_discount` is the difference — pick the pair that matches what you're actually telling a shopper. `cart.items_subtotal_price` specifically excludes shipping and cart-level discounts, which matters for a running subtotal shown before those are calculated.

:::tip[Capturing a note or custom attribute]
`cart.note` and `cart.attributes` are populated by an HTML input inside the cart form — a `<textarea name="note">` for the note, an `<input name="attributes[key]">` for a custom attribute — rather than anything set from Liquid directly. Prefixing an attribute name with a double underscore (`__gift_message`) makes it private: it still saves and survives, but can no longer be read back out from Liquid or the AJAX API, which is useful for data that shouldn't affect caching.
:::

## customer

`customer` is `nil` for any shopper who isn't logged in — true on every single template, with no exception, which makes this the one global object where the `{% if customer %}` guard from [31.1. Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/) is genuinely mandatory rather than just good practice.

```liquid
{% if customer %}
  {{ customer.first_name }}
  {{ customer.last_name }}
  {{ customer.name }}
  {{ customer.email }}
  {{ customer.id }}
  {{ customer.tags }}
  {{ customer.orders }}
  {{ customer.orders_count }}
  {{ customer.last_order }}
  {{ customer.total_spent }}
  {{ customer.default_address }}
  {{ customer.addresses }}
  {{ customer.has_account }}
  {{ customer.accepts_marketing }}
  {{ customer.tax_exempt }}
  {{ customer.b2b? }}
{% endif %}
```

`customer.has_account` and the object's own existence aren't the same check: `customer` being truthy means someone is logged in *right now*; `customer.has_account` (available inside checkout-related contexts) means the email on file is tied to an account at all, regardless of whether they're currently signed in. `customer.b2b?` and the related `current_company`/`current_location`/`company_available_locations` properties only return meaningful data for a storefront with B2B/wholesale enabled.

## shop

`shop` describes the store itself — its settings, policies, and aggregate counts — and is always populated, on every template, since it's never tied to a specific page or a specific visitor.

```liquid
{{ shop.name }}
{{ shop.description }}
{{ shop.email }}
{{ shop.domain }}
{{ shop.url }}
{{ shop.currency }}
{{ shop.money_format }}
{{ shop.enabled_currencies }}
{{ shop.enabled_payment_types }}
{{ shop.products_count }}
{{ shop.collections_count }}
{{ shop.types }}
{{ shop.vendors }}
{{ shop.policies }}
{{ shop.refund_policy }}
{{ shop.shipping_policy }}
{{ shop.terms_of_service }}
{{ shop.address }}
{{ shop.brand }}
{{ shop.metafields }}
{{ shop.customer_accounts_enabled }}
{{ shop.published_locales }}
```

`shop.types` and `shop.vendors` return the store's complete set of product types and vendors, store-wide — handy for building a type/vendor filter menu, or a vendor index page. `shop.policies` is every legal policy configured in the admin as one array; the individually-named versions (`shop.refund_policy`, `shop.shipping_policy`, `shop.terms_of_service`, `shop.subscription_policy`) are there for when a theme wants one specific policy rather than looping over all of them.

:::caution[`shop.locale` and `shop.enabled_locales` are deprecated]
Both still technically work, but Shopify's own documentation marks them deprecated in favor of `request.locale` (the active locale of the *current request*, not a store-wide setting) and `shop.published_locales` — worth using the replacements directly in new code rather than the deprecated pair, since a deprecated Liquid property can be removed in the future with no further warning.
:::

## Key takeaways

- `cart` is the one global object guaranteed to exist on every page, by design — everything else on this page can be `nil` somewhere.
- `customer` is `nil` for a logged-out shopper on every template, with no exception — the `{% if customer %}` guard here is mandatory, not optional caution.
- `cart.note`/`cart.attributes` are populated by form inputs, not set directly from Liquid; a double-underscore attribute name makes it private.
- `shop.locale` and `shop.enabled_locales` are deprecated — use `request.locale` and `shop.published_locales` instead.

## Further reading

- [Liquid objects: cart](https://shopify.dev/docs/api/liquid/objects/cart) (shopify.dev)
- [Liquid objects: customer](https://shopify.dev/docs/api/liquid/objects/customer) (shopify.dev)
- [Liquid objects: shop](https://shopify.dev/docs/api/liquid/objects/shop) (shopify.dev)
- [8.2. The Cart Form](/forms/the-cart-form/) — how `cart.note` and `cart.attributes` actually get populated, end to end
