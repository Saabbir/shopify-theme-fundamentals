---
title: Customer Forms
description: Login, registration, and account updates, plus how to actually read and display form errors.
---

**TL;DR:** Login, registration, and account updates, plus how to actually read and display form errors.

Customer forms don't take a second argument the way the product and cart forms do — there's no specific object to pass, since the form itself (logging in, registering) is what creates or identifies the customer.

## Login

```liquid
{% form 'customer_login' %}
  <input type="email" name="customer[email]" required>
  <input type="password" name="customer[password]" required>
  <button type="submit">Log in</button>
{% endform %}
```

## Registration

```liquid
{% form 'create_customer' %}
  <input type="text" name="customer[first_name]">
  <input type="text" name="customer[last_name]">
  <input type="email" name="customer[email]" required>
  <input type="password" name="customer[password]" required>
  <button type="submit">Create account</button>
{% endform %}
```

Every field name here is namespaced under `customer[...]` — this prefix is what tells Shopify's endpoint which model the submitted fields belong to, the same role the `id`/`quantity` field names played for the product form.

## Account updates and password recovery

The same `customer[...]` pattern extends to updating an existing account (`{% form 'customer' %}`) and to password recovery (`{% form 'recover_customer_password' %}`, which only needs `customer[email]`). The field names and general shape are consistent across all of these — only the form type string and which fields are relevant change.

## Reading and displaying errors

This is the part worth spending real attention on, since a login or registration form is the clearest place a shopper actually needs to see what went wrong.

```liquid
{% form 'create_customer' %}
  {% if form.errors %}
    <ul class="form-errors">
      {% for field in form.errors %}
        <li>{{ form.errors.messages[field] }}</li>
      {% endfor %}
    </ul>
  {% endif %}

  <input type="email" name="customer[email]" value="{{ form.email }}" required>
  <input type="password" name="customer[password]" required>
  <button type="submit">Create account</button>
{% endform %}
```

`form.errors` is only present after a failed submission — `{% if form.errors %}` is both the check for "did this fail" and the thing you loop over to list what specifically went wrong. Note the second line, too: re-populating `value="{{ form.email }}"` after a failed submit means a shopper who mistyped their password doesn't also have to retype their email.

:::tip[Checking success instead of failure]
`form.posted_successfully?` is the complementary check — `true` after a submission that went through with no errors. Useful for showing a one-time confirmation message right after a successful submit, distinct from showing the form again.
:::

## Key takeaways

- Customer forms use a `customer[...]` field-name prefix instead of the bare names used by the product/cart forms, but otherwise follow the same `{% form 'type' %}` pattern.
- `form.errors` is present only after a failed submission — loop over it to show what specifically went wrong, and re-populate any fields the shopper already entered correctly.
- `form.posted_successfully?` is the equivalent check for a successful submission.

## Further reading

- [Customer login/registration](https://shopify.dev/docs/storefronts/themes/architecture/templates/customers) (shopify.dev)
- [The `form` object](https://shopify.dev/docs/api/liquid/objects/form) (shopify.dev)
