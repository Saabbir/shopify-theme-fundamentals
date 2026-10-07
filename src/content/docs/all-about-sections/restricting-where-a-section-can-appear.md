---
title: Restricting Where a Section Can Appear
description: "enabled_on / disabled_on — keeping a section off pages it would break on."
---

**TL;DR:** `enabled_on` / `disabled_on` — keeping a section off pages it would break on.

## Why this exists

Recall the caution from [Shopify's Global Objects](/global-objects/): `product` and `collection` are only in scope on specific pages. A "related products" section built around `product.id` renders correctly on a product page — and breaks, or quietly shows nothing, if a merchant adds it to a page where there's no product in context, like the cart page. `enabled_on` and `disabled_on` let you prevent that mistake from being possible in the first place, rather than just defending against it with Liquid conditionals.

## `enabled_on`: an allow-list

```json
{
  "enabled_on": {
    "templates": ["product"]
  }
}
```

With this, the section only shows up as addable on product pages — a merchant can't accidentally add it anywhere else, because the theme editor never offers it as an option outside that context.

## `disabled_on`: a block-list

```json
{
  "disabled_on": {
    "groups": ["header", "footer"]
  }
}
```

The inverse: this section can be added anywhere *except* the listed [section groups](/sections-blocks-snippets/section-groups/). Useful for a section that makes sense almost everywhere, but clearly not in a header or footer.

## Restricting by template or by group

Both keys accept either `templates` (page types like `product`, `collection`, `cart`) or `groups` (section groups like `header`, `footer`), or both at once:

```json
{
  "enabled_on": {
    "templates": ["product", "collection"],
    "groups": ["header"]
  }
}
```

:::note[Use one or the other, not both]
`enabled_on` and `disabled_on` are two ways of expressing the same kind of restriction — an allow-list versus a block-list. Pick whichever is shorter to write for a given section (an allow-list if it belongs on just one or two templates; a block-list if it belongs almost everywhere except a couple). Using both on the same section schema is contradictory and not a supported pattern.
:::

## Key takeaways

- `enabled_on` is an allow-list; `disabled_on` is a block-list. Use exactly one, never both, on the same section.
- Both accept `templates` and/or `groups`, restricting a section to specific page types and/or specific section groups.
- This solves the same problem as checking `request.page_type` in Liquid, but earlier and more completely — the section is never offered as an option in the wrong place at all, rather than rendering broken there and being caught after the fact.

## Further reading

- [Section schema: `enabled_on`/`disabled_on`](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema#enabled_on-and-disabled_on) (shopify.dev)
