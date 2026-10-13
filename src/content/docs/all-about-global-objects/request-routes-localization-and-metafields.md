---
title: request, routes, localization & Metafield Access Patterns
description: The objects that describe the current request, generate correct URLs, and connect custom data back into Liquid.
---

**TL;DR:** The objects that describe the current request, generate correct URLs, and connect custom data back into Liquid.

## request

`request` describes the current page request itself — which page type it is, whether it's being viewed inside the theme editor, and a few URL-related values.

```liquid
{{ request.design_mode }}
{{ request.visual_preview_mode }}
{{ request.page_type }}
{{ request.path }}
{{ request.host }}
{{ request.origin }}
{{ request.locale }}
```

`request.design_mode` is `true` only when a merchant is actively inside the theme editor — the standard way to adjust theme *behavior* (skip firing an analytics event, say) based on editor context. `request.visual_preview_mode` is narrower still: it's specifically the editor's live section preview, not the full editor shell.

:::caution[request.design_mode is for behavior, never for what a merchant sees]
Shopify's own documentation is explicit about this: don't use `request.design_mode` to change what's customer-facing, because the whole point of the theme editor's preview is that it matches what a real shopper actually sees. Reach for it to silence a script that shouldn't fire during editing, never to alter layout or content between the editor and the live store.
:::

`request.page_type` returns one of a fixed set of values (`product`, `collection`, `article`, `blog`, `cart`, `search`, `404`, `password`, `index`, several `customers/*` values, and more) — a reliable way to branch behavior by page type from a snippet that's rendered everywhere, like `theme.liquid` itself, without needing to check which specific global object happens to be populated.

`request.origin` (protocol + host) is the piece worth remembering for building a genuinely absolute URL, since every other URL-producing object or filter in Liquid returns a relative path:

```liquid
{{ product.url | prepend: request.origin }}
{% # => https://example.com/products/example-product %}
```

## routes

`routes` generates the standard storefront URLs a theme needs constantly, so none of them have to be hardcoded:

```liquid
{{ routes.root_url }}
{{ routes.cart_url }}
{{ routes.all_products_collection_url }}
{{ routes.collections_url }}
{{ routes.search_url }}
{{ routes.account_url }}
{{ routes.account_login_url }}
{{ routes.account_logout_url }}
{{ routes.account_register_url }}
{{ routes.cart_add_url }}
{{ routes.cart_change_url }}
{{ routes.cart_update_url }}
{{ routes.predictive_search_url }}
{{ routes.product_recommendations_url }}
```

Using `routes.cart_url` instead of hardcoding `/cart` matters for a reason that's easy to overlook until a store actually needs it: a multi-language store's URLs are prefixed per language (`/en/cart`, `/fr/panier`), and `routes` already accounts for that automatically. A hardcoded path silently sends every shopper to the English, unprefixed version regardless of which language they're actually browsing in.

## localization

`localization` exposes the languages and countries a store has published, plus whichever one a shopper currently has selected:

```liquid
{{ localization.country }}
{{ localization.language }}
{{ localization.available_countries }}
{{ localization.available_languages }}
{{ localization.market }}
```

`localization.country` and `localization.language` are the *currently selected* ones for this shopper; `available_countries`/`available_languages` are the full published lists, which is what a language/country switcher actually loops over to build its options.

## Metafield and metaobject access patterns

A **metafield** attaches custom data to an existing resource (a product, a page, the shop itself); a **metaobject** is its own independent, structured resource type, not attached to anything else. Both are created in the admin or by an app — never directly from Liquid.

```liquid
{{ product.metafields.namespace.key.value }}
{{ product.metafields.namespace.key.type }}
```

A metafield's `.value` is typed according to the metafield's own type — a `product_reference` metafield's `.value` is a full `product` object, a `rich_text_field`'s `.value` is renderable rich text, a `number_integer`'s `.value` is a plain number, and so on; `.type` tells you which of these you're dealing with when it isn't already obvious from context.

```liquid
{% for location in product.metafields.info.pickup_locations.value %}
  {{ location }}
{% endfor %}

Similar products: {{ product.metafields.info.similar_products.value.count }}
```

A **list** metafield's `.value` is an array — loop over it directly. Measuring a list's length depends on its underlying type: a reference-type list (`list.product_reference`, say) uses `.count`; every other list type uses the ordinary [`size` filter](https://shopify.dev/docs/api/liquid/filters/size).

:::caution[A metafield key named size, first, or last needs square brackets]
`product.metafields.namespace.size` is ambiguous: `size` is also a built-in Liquid filter reachable via dot notation. If a metafield's key happens to be `size`, `first`, or `last`, dot notation silently applies the *filter* instead when no metafield by that key exists, or returns the real metafield when one does — which is exactly the kind of thing that works in testing and breaks the moment a differently-named metafield is added later. Use square-bracket notation for these three specific key names to always get the metafield itself, unambiguously: `product.metafields.namespace['size']`.
:::

A metaobject is reached two different ways depending on whether you already know which one you want:

```liquid
{{ metaobjects.testimonials.homepage.title }}
{{ metaobjects['testimonials']['homepage'].quote.value }}
```

The access path is always `metaobjects.{type}.{handle}` — the metaobject definition's type, then that specific entry's own handle. Square-bracket notation is required the moment either the type or handle contains a character dot notation can't parse (a hyphen, for instance).

## Key takeaways

- `request.design_mode` is for adjusting theme *behavior* during editing, never for changing what a shopper sees — the editor preview is supposed to match the live store exactly.
- `routes.*` should always be preferred over a hardcoded path; it's what keeps URLs correct on a multi-language store without a theme having to handle language prefixes itself.
- A metafield's `.value` type depends entirely on the metafield's own configured type — check `.type` when it isn't already obvious which kind of value to expect.
- A metafield keyed `size`, `first`, or `last` needs square-bracket access (`['size']`) to avoid silently colliding with Liquid's own built-in filters of the same name.
- A metaobject is reached as `metaobjects.{type}.{handle}`, completely separate from the metafield system, even though the two are often used together.

## Further reading

- [Liquid objects: request](https://shopify.dev/docs/api/liquid/objects/request) (shopify.dev)
- [Liquid objects: routes](https://shopify.dev/docs/api/liquid/objects/routes) (shopify.dev)
- [Liquid objects: localization](https://shopify.dev/docs/api/liquid/objects/localization) (shopify.dev)
- [Liquid objects: metafield](https://shopify.dev/docs/api/liquid/objects/metafield) (shopify.dev)
- [Liquid objects: metaobject](https://shopify.dev/docs/api/liquid/objects/metaobject) (shopify.dev)
