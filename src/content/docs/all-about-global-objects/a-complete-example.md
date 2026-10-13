---
title: A Complete Example
description: A header utility bar combining cart, customer, and shop, rendered safely from every single template.
---

**TL;DR:** A header utility bar combining cart, customer, and shop, rendered safely from every single template.

Here's a realistic case that pulls every habit from this chapter into one piece of real markup: a small utility bar, rendered from `theme.liquid` so it appears on every page, greeting a logged-in shopper by name, showing a live cart count, and falling back sensibly for a logged-out shopper — without ever producing a silent blank or a broken link on any template.

```liquid
{% comment %}
  snippets/header-utility-bar.liquid

  Rendered from theme.liquid, so this runs on every single page —
  which is exactly why every object below that isn't guaranteed to
  exist everywhere (customer) gets checked before use, per
  Which Objects Exist on Which Template.
{% endcomment %}
<div class="utility-bar">
  {% if customer %}
    <span class="utility-bar__greeting">
      Hi, {{ customer.first_name | default: customer.email }}
    </span>
    <a href="{{ routes.account_url }}">My Account</a>
    <a href="{{ routes.account_logout_url }}">Log out</a>
  {% else %}
    <a href="{{ routes.account_login_url }}">Log in</a>
  {% endif %}

  <a href="{{ routes.cart_url }}" class="utility-bar__cart">
    Cart
    {% if cart.item_count > 0 %}
      <span class="utility-bar__cart-count">{{ cart.item_count }}</span>
    {% endif %}
  </a>

  {% if shop.enabled_currencies.size > 1 %}
    <span class="utility-bar__currency">{{ cart.currency.iso_code }}</span>
  {% endif %}
</div>
```

Walking through why each piece is written the way it is:

- **`{% if customer %}` wraps everything customer-related**, because `customer` is `nil` on every template for a logged-out shopper — per [cart, customer & shop in Full](/all-about-global-objects/cart-customer-and-shop-in-full/), this is the one guard in this whole snippet that's genuinely mandatory, not just careful.
- **`customer.first_name | default: customer.email`** handles a real edge case: a customer record doesn't strictly require a first name (an account created through a bare email signup, say) — falling back to the email keeps the greeting from ever rendering as just "Hi, ".
- **`cart` and `routes` are used with no guard at all**, because both are part of the small set of objects guaranteed to exist on every template, confirmed in [Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/) — adding a defensive `{% if cart %}` here would be the "unnecessary defensive programming" this site's own conventions warn against, not real safety.
- **`routes.account_url`/`routes.account_login_url`/`routes.account_logout_url`/`routes.cart_url`** are used instead of hardcoded paths, so this snippet keeps working correctly on a multi-language store where those URLs carry a locale prefix.
- **`cart.item_count > 0`**, not just `cart.item_count`, guards the count badge specifically so an empty cart doesn't render a visible `0` badge — a `0` is truthy in Liquid the same as any other number, so checking count alone (`{% if cart.item_count %}`) wouldn't have worked here.
- **`shop.enabled_currencies.size > 1`** only shows a currency indicator on a store that actually has more than one currency enabled — on a single-currency store, this block never renders, rather than showing a currency label nobody needs to see.

## Key takeaways

- The only mandatory guard in this entire snippet is around `customer` — every other object used here (`cart`, `routes`, `shop`) is safe unconditionally, confirmed by which objects this chapter establishes as always-populated.
- `default:` is a clean way to handle a property that's technically present on the object but might itself be blank, not just an object that might be entirely `nil`.
- Checking `cart.item_count > 0` instead of truthiness avoids a `0` badge rendering, since `0` and an empty cart are both still "present" values in Liquid.
- `routes.*` instead of a hardcoded path is what keeps this exact snippet correct on a multi-language store without any extra logic.

## Further reading

- [Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/)
- [Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/)
- [cart, customer & shop in Full](/all-about-global-objects/cart-customer-and-shop-in-full/)
