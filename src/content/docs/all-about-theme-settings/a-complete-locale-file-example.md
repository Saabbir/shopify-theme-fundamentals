---
title: A Complete Locale File Example
description: A full en.default.json / en.default.schema.json pair, both tiers working together.
---

**TL;DR:** A full `en.default.json` / `en.default.schema.json` pair, both tiers working together.

A complete, realistic pair of locale files — the storefront-text file shoppers' content comes from, and the schema-text file merchants see in the theme editor — covering enough real keys to show every pattern in practice at once.

## `locales/en.default.json` — storefront text

```json
{
  "general": {
    "search": "Search",
    "close": "Close",
    "loading": "Loading"
  },
  "cart": {
    "title": "Your cart",
    "empty": "Your cart is empty",
    "checkout": "Check out",
    "item_count": {
      "one": "{{ count }} item",
      "other": "{{ count }} items"
    },
    "remove": "Remove {{ product_title }}"
  },
  "products": {
    "add_to_cart": "Add to cart",
    "sold_out": "Sold out",
    "on_sale": "Sale",
    "quantity": "Quantity",
    "price": {
      "regular": "Regular price",
      "sale": "Sale price",
      "from": "From {{ price }}"
    }
  },
  "newsletter": {
    "heading": "Subscribe to our newsletter",
    "email_placeholder": "Your email address",
    "submit": "Subscribe",
    "success": "Thanks for subscribing!"
  }
}
```

```liquid
{{ 'cart.title' | t }}
{{ 'cart.item_count' | t: count: cart.item_count }}
{{ 'cart.remove' | t: product_title: item.product.title }}
{{ 'products.price.from' | t: price: product.price_min | money }}
```

Every key here follows the same shape: nested objects group related strings (`cart.title`, `cart.checkout`, `cart.item_count` all under `cart`), pluralization branches on `one`/`other` based on a `count` argument, and a placeholder like `{{ product_title }}` in the translation string gets filled in by a matching named argument passed to the `t` filter.

## `locales/en.default.schema.json` — schema text

```json
{
  "labels": {
    "heading": "Heading",
    "button_label": "Button label",
    "button_url": "Button link",
    "collection": "Collection",
    "products_to_show": "Products to show",
    "color_scheme": "Color scheme",
    "quote": "Quote",
    "author": "Author"
  },
  "settings": {
    "colors": "Colors",
    "typography": "Typography",
    "layout": "Layout",
    "cart": "Cart",
    "social_media": "Social media"
  },
  "options": {
    "drawer": "Drawer",
    "page": "Page"
  },
  "sections": {
    "hero_banner": {
      "name": "Hero banner",
      "settings": {
        "heading": {
          "label": "Heading"
        }
      }
    }
  }
}
```

```json
{
  "name": "t:sections.hero_banner.name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:labels.heading"
    }
  ]
}
```

Notice two valid patterns for schema keys shown here: a flat, reusable key like `t:labels.heading` (used across many different sections' schemas, since "Heading" means the same thing everywhere it appears), and a deeply-nested, section-specific key like `t:sections.hero_banner.name` (used for text that's genuinely specific to one section, like its display name in the "Add section" picker). Both are valid — reach for the flat, shared form by default (it's what every schema example throughout this site uses, per the `t:labels.*` convention), and reserve a nested, section-specific key only for text that's never reused anywhere else.

## How these two files work together on one page

A single rendered page typically draws from both files at once. A cart drawer, for instance, might show `{{ 'cart.title' | t }}` from the storefront-text file as its heading — text a shopper reads — while the section that contains that drawer has its own display name in the theme editor, `"t:sections.hero_banner.name"`, from the schema-text file — text only a merchant ever sees, and only while editing, never on the live storefront.

## Key takeaways

- A real theme's `en.default.json` nests related storefront strings under shared parent keys, uses `one`/`other` branches for any count-dependent text, and uses named placeholders for any value a Liquid variable needs to fill in.
- A real theme's `en.default.schema.json` mixes flat, broadly-reused keys (`t:labels.heading`) with deeply-nested, section-specific keys (`t:sections.hero_banner.name`) — prefer the flat form unless the text is genuinely unique to one schema.
- These two files never overlap in purpose: one is read by `{{ 'key' | t }}` for anything a shopper sees, the other by a `"t:key"` string for anything a merchant sees while editing.

## Further reading

- [Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/)
- [Locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales) (shopify.dev)
