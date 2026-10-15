---
title: Forms
description: "The {% form %} tag's anatomy, and the four kinds of form every theme needs."
---

**TL;DR:** The `{% form %}` tag's anatomy, and the four kinds of form every theme needs.

Every form that actually does something on a Shopify store — adding to cart, logging in, updating quantities, signing up for a newsletter — goes through Liquid's `{% form %}` tag, not a plain HTML `<form>`. This chapter covers what that tag does for you automatically, and the specific fields each kind of form expects.

## What's in this section

| Page | Answers |
|---|---|
| [8.1. The Product Form](/forms/the-product-form/) | Adding a specific variant to the cart, and showing a sold-out state |
| [8.2. The Cart Form](/forms/the-cart-form/) | Updating line item quantities, and a 1-indexed detail easy to miss |
| [8.3. Customer Forms](/forms/customer-forms/) | Login, registration, and account updates, plus reading form errors |
| [8.4. Contact & Newsletter Forms](/forms/contact-and-newsletter-forms/) | The storefront contact form, and signing a shopper up for marketing |

## What `{% form %}` does for you

```liquid
{% form 'product', product %}
  <!-- your fields -->
{% endform %}
```

Writing `{% form 'type', object %}` instead of a plain `<form>` tag gets you three things automatically: the correct `action` URL for that form type, the correct HTTP method, and a `form` variable available inside the block, carrying the result of a submission — most importantly `form.errors` and `form.posted_successfully?`.

The second argument (`product` above) isn't required for every form type — it's only needed when the form is about one specific object, like a product or the cart. A login form, for instance, doesn't need one.

:::note[You still write every actual field yourself]
`{% form %}` only handles the wrapper — the `<form>` tag itself, its destination, and the result object. Every input inside it (which variant, how many, what email) is markup you write by hand, using the specific field names each form type expects. The rest of this chapter is mostly that: which names are required for which form.
:::

## Further reading

- [The `form` tag](https://shopify.dev/docs/api/liquid/tags/form) (shopify.dev)
