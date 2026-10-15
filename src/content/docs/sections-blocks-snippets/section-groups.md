---
title: Section Groups (Header & Footer)
description: How a header or footer stays merchant-editable across every page, instead of being hardcoded.
---

**TL;DR:** How a header or footer stays merchant-editable across every page, instead of being hardcoded.

A header and footer appear on every page, which might suggest hardcoding them directly into [`theme.liquid`](/theme-architecture/theme-liquid-explained/). Don't — that would make them uneditable in the theme editor, exactly like any other hardcoded markup there. Instead, Shopify has a dedicated mechanism for this: **section groups**.

## What a section group is

A section group is a JSON file in `sections/` (not `templates/`) that lists sections the same way a template does, but it's meant to be rendered from the layout, not assigned to one specific page. The two standard ones are `header-group.json` and `footer-group.json`.

```json
{
  "type": "header",
  "sections": {
    "announcement-bar": {
      "type": "announcement-bar",
      "settings": {}
    },
    "main-header": {
      "type": "header",
      "settings": {}
    }
  },
  "order": ["announcement-bar", "main-header"]
}
```

This is `sections/header-group.json`. It lists two sections — an announcement bar and the main header — in order. Each one is a perfectly normal section file, written exactly like any other section covered in [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/).

## Rendering a section group

In `theme.liquid`, you render the group instead of listing individual sections:

```liquid
{% comment %} layout/theme.liquid {% endcomment %}
<body>
  {% sections 'header-group' %}

  <main>
    {{ content_for_layout }}
  </main>

  {% sections 'footer-group' %}
</body>
```

Because the group lives in `theme.liquid`, it renders on every page automatically — but because it's still built from ordinary sections with their own schemas, a merchant can add, remove, reorder, and configure everything inside it from the theme editor, exactly like page-level sections. You get "appears on every page" and "merchant-editable" at the same time, which hardcoding directly into `theme.liquid` could never give you.

## Key takeaways

- A section group is a JSON file (`header-group.json`, `footer-group.json`) listing sections, rendered from the layout rather than a page template.
- `{% sections 'group-name' %}` renders a group; it appears on every page because it's called from `theme.liquid`.
- Sections inside a group are ordinary sections — merchant-editable in the theme editor, same as any page-level section.

## Further reading

- [Section groups](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-groups) (shopify.dev)
