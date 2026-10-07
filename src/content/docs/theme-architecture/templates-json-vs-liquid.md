---
title: "Templates: JSON vs. Liquid"
description: The two ways a template file can be written, and why almost every theme uses JSON today.
---

**TL;DR:** The two ways a template file can be written, and why almost every theme uses JSON today.

A **template** lives in `templates/` and determines which sections appear on one specific page type — home, product, collection, cart, and so on. There are two formats a template file can be written in: JSON, or Liquid. Modern themes use JSON for virtually everything.

## JSON templates (the modern default)

A JSON template just lists which sections to render, and in what order, plus each section's default settings. It contains no markup or logic at all — just data.

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {}
    },
    "related": {
      "type": "related-products",
      "settings": {
        "products_to_show": 4
      }
    }
  },
  "order": ["main", "related"]
}
```

This is `templates/product.json`. It says: on a product page, render the `main-product` section, then a `related-products` section, in that order.

The reason this matters so much: once a template is JSON, a merchant can rearrange, add, or remove sections for that page entirely from the theme editor, without a developer touching code. That's the whole point of the block-based editing model Shopify themes use today.

## Liquid templates (the older way)

A template can also be a `.liquid` file, with markup and logic written directly inside it, instead of just listing sections.

```liquid
{% comment %} templates/page.liquid (a Liquid template, not JSON) {% endcomment %}
<div class="page-width">
  <h1>{{ page.title }}</h1>
  <div class="rte">{{ page.content }}</div>
</div>
```

This still works, but a merchant can't rearrange or add sections to a page built this way — whatever's hardcoded in the file is all they get. You'll still encounter `.liquid` templates in simpler theme setups, but new templates on a modern theme are written as JSON by default.

## When you'd still reach for a Liquid template

In practice: rarely, for a brand-new theme. The main case is a page type so simple that section-based flexibility doesn't add value (a one-off literal redirect page, for example). Even then, a JSON template with a single appropriate section is usually still the better default, since it keeps every page consistently editable the same way.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Default to JSON templates for every page type in a new theme. | **Writing a new template as `.liquid`** just because it feels like less setup for one section's worth of content — you lose merchant editability for no real benefit. |
| Keep a JSON template's job limited to "which sections, in what order, with what default settings." | **Putting markup or logic directly in a JSON template.** JSON templates can't contain either — all markup belongs in the sections they reference. |

## Key takeaways

- A template decides which sections appear on a page type, and in what order.
- JSON templates (the modern default) contain only section references and settings — no markup, no logic — which is exactly what makes them editable by merchants in the theme editor.
- Liquid templates still work, but hardcode their content and lose that editability.

## Further reading

- [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) (shopify.dev)
