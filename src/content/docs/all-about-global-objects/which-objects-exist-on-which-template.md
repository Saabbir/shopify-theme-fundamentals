---
title: Which Objects Exist on Which Template
description: A practical reference for the single most common source of a silent, unexplained nil in a Shopify theme.
---

**TL;DR:** A practical reference for the single most common source of a silent, unexplained nil in a Shopify theme.

Every other page in this chapter covers what an object *contains*. This page covers something just as important and far more likely to actually bite you: where each one is even populated in the first place. A snippet rendered from `theme.liquid` runs on every template — including ones its author never tested it against — so knowing this table isn't trivia, it's the difference between a snippet that works everywhere and one that works on exactly the page it was written and tested on.

## Always populated, on every template

```liquid
{{ shop.name }}
{{ cart.item_count }}
{{ settings.heading_font }}
{{ routes.cart_url }}
{{ localization.country }}
{{ request.page_type }}
```

`shop`, `cart`, `settings`, `routes`, `localization`, and `request` are the objects this site's earlier pages keep coming back to for a reason: none of them need a guard. They're populated identically no matter which template is rendering, which is exactly why a header or footer snippet — itself rendered on every page — leans on these so heavily and so safely.

## Populated only on a matching template

`request.page_type` returns one of a fixed set of values, and most of the table below lines up directly with it:

| `request.page_type` | What's populated there |
|---|---|
| `index` | Nothing product/collection/article-specific. Just the always-available objects above. |
| `product` | `product` (and everything reached through it — `product.selected_variant`, and so on). |
| `collection` | `collection`. **Not** a single `product` — only `collection.products`, an array. |
| `list-collections` | The site's full list of collections, reached through `collections` (every published collection) rather than one specific `collection`. |
| `article` | `article`, plus its parent `blog`. |
| `blog` | `blog`, plus `blog.articles` — no single `article`. |
| `cart` | Nothing beyond the always-available `cart` itself — there's no cart-page-specific object. |
| `search` | `search`. |
| `page` | `page`. |
| `metaobject` | `metaobject` — the specific entry being rendered, reached directly as `{{ metaobject }}`. |
| `gift_card` | `gift_card`, including `gift_card.customer` when applicable. |
| `policy` | The relevant policy through `shop.refund_policy`/`shop.shipping_policy`/etc. — no separate standalone object. |
| `customers/account`<br/>`customers/addresses`<br/>`customers/order` | `customer`, guaranteed non-nil — these templates require a signed-in shopper to reach at all. |
| `customers/login`<br/>`customers/register`<br/>`customers/activate_account`<br/>`customers/reset_password` | `customer` is `nil` here — these are exactly the logged-*out* flows. |
| `404` / `password` / `captcha` | Nothing beyond the always-available objects — these are deliberately minimal pages. |

## The two objects that don't follow request.page_type at all

`predictive_search` and `recommendations`, covered in full on [search, predictive_search & recommendations](/all-about-global-objects/search-predictive-search-and-recommendations/), don't depend on which template is rendering at all — they depend on *how* a section was rendered. A section referencing `recommendations` renders identically whether it's included on a product page's JSON template or anywhere else; what actually determines whether `recommendations.performed?` is `true` is whether that specific render request came through the Product Recommendations API. Template type is irrelevant to these two; rendering method is everything.

## Why a header or footer snippet needs this table the most

A section or snippet rendered from `sections/header.liquid` or `sections/footer.liquid` runs on *every single page*, across every row in the table above — which means any reference to `product`, `collection`, `article`, or `customer` inside one has to be guarded, every time, with no exception:

```liquid
{% comment %} snippets/header-announcement.liquid — rendered from every page {% endcomment %}
{% if product %}
  Now viewing: {{ product.title }}
{% endif %}
```

Without the `{% if product %}` guard, this line renders nothing on every template except `product` — not an error, just silently blank — which is exactly the failure mode [Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/) opened this chapter with.

## Key takeaways

- `shop`, `cart`, `settings`, `routes`, `localization`, and `request` are the only global objects safe to reference unconditionally from anywhere in a theme.
- `request.page_type` is the reliable way to know which template is currently rendering, and lines up directly with which page-specific object (if any) is populated.
- `collection` and `blog` templates expose an array (`collection.products`, `blog.articles`), never a single `product` or `article` directly.
- `predictive_search` and `recommendations` are governed by rendering method, not template type — unlike everything else on this page.
- Any snippet rendered from `theme.liquid`, a header, or a footer runs on every template in this table, which makes guarding page-specific objects there mandatory, not optional.

## Further reading

- [Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/)
- [Liquid objects: request](https://shopify.dev/docs/api/liquid/objects/request) (shopify.dev) — the full, current list of `page_type` values
- [Theme architecture: templates](https://shopify.dev/docs/storefronts/themes/architecture/templates) (shopify.dev)
