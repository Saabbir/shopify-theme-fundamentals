---
title: Contact & Newsletter Forms
description: The storefront contact form, and signing a shopper up for marketing without a full account.
---

**TL;DR:** The storefront contact form, and signing a shopper up for marketing without a full account.

## The contact form

```liquid
{% form 'contact' %}
  {% if form.posted_successfully? %}
    <p>Thanks — we'll get back to you soon.</p>
  {% endif %}

  <input type="text" name="contact[name]">
  <input type="email" name="contact[email]" required>
  <input type="tel" name="contact[phone]">
  <textarea name="contact[body]" required></textarea>
  <button type="submit">Send</button>
{% endform %}
```

Same shape as the customer forms from the previous page — a `contact[...]` prefix on every field, `form.posted_successfully?` to show a confirmation after a successful send, `form.errors` (from [Customer Forms](/forms/customer-forms/)) if something was missing or invalid.

## Newsletter signup

A newsletter-only signup is deliberately lighter than full account creation — a shopper gets added to a mailing list without a password or a real account being created. The general shape still follows the `{% form %}` pattern from this chapter, with a hidden field marking the intent as a subscription rather than a full registration.

```liquid
{% form 'customer' %}
  <input type="email" name="contact[email]" required>
  <input type="hidden" name="contact[tags]" value="newsletter">
  <button type="submit">Subscribe</button>
{% endform %}
```

:::note[Check the exact field names against current Shopify docs before shipping this]
Exactly which fields represent marketing-consent intent (a tag-based approach like the one above versus a dedicated consent field) is the kind of detail Shopify has refined over time, and getting it wrong has real consequences — a shopper who didn't actually consent to marketing emails shouldn't end up receiving them. Treat the shape above as the general pattern, not a value to copy without checking it against [Shopify's current documentation](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers) first.
:::

## Key takeaways

- Both forms follow the same `{% form 'type' %}` pattern as the rest of this chapter — only the field-name prefix (`contact[...]`) and the specific fields involved change.
- `form.posted_successfully?` is the right check for a one-time "thanks, we got it" confirmation after either form.
- Marketing-consent field names specifically are worth double-checking against current Shopify documentation rather than assuming a pattern seen once still applies.

## Further reading

- [Contact form](https://shopify.dev/docs/storefronts/themes/architecture/templates/contact) (shopify.dev)
- [Customer forms](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers) (shopify.dev)
