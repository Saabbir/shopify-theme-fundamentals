---
title: theme.liquid Explained
description: The one file every theme must have, and exactly what it's responsible for.
---

**TL;DR:** The one file every theme must have, and exactly what it's responsible for.

`layout/theme.liquid` is the only file strictly required for a theme to work at all. It's the outermost wrapper around every single page — the layout layer from the [rendering chain](/theme-architecture/how-a-page-gets-rendered/). If you deleted every other file in a theme and kept only this one, Shopify would still render a (very plain) page.

## A minimal example

```liquid
{% comment %} layout/theme.liquid {% endcomment %}
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ page_title }}</title>
    {{ content_for_header }}
  </head>
  <body>
    {% section 'header' %}

    <main>
      {{ content_for_layout }}
    </main>

    {% section 'footer' %}
  </body>
</html>
```

Two Liquid outputs here are not optional — every theme needs both, and they're specific to this one file:

| Output | What it does |
|---|---|
| `{{ content_for_header }}` | Shopify injects required `<head>` content here: analytics scripts, SEO meta tags, and anything Shopify or an installed app needs in the page's head. Always place this inside `<head>`. |
| `{{ content_for_layout }}` | This is where the current page's **template** output gets inserted — the sections and blocks that are specific to whatever page the shopper is on. Without it, no page content would ever render inside your layout. |

## Why so little lives here

Because `theme.liquid` wraps every page, anything you put directly in it (outside the two outputs above) appears on every single page, with no way to vary it per page type. That's exactly right for a handful of things — the overall HTML skeleton, a header and footer rendered via [section groups](/sections-blocks-snippets/section-groups/), global analytics or font loading — and exactly wrong for anything page-specific, which belongs in a template or section instead.

:::caution[A common beginner mistake]
Don't add page-specific markup directly into `theme.liquid` because "it's just one page and this was the fastest place to add it." It will appear on every page, not just the one you meant, and you'll likely need to wrap it in conditional Liquid logic to hide it elsewhere — more work than putting it in the right layer from the start.
:::

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep `theme.liquid` limited to the HTML skeleton, header/footer, and anything genuinely global (analytics, fonts, the two required content outputs). | **Adding page-specific sections directly into `theme.liquid`.** Build them as a section on the relevant template instead, so they only appear where intended. |
| Always include both `{{ content_for_header }}` in `<head>` and `{{ content_for_layout }}` in `<body>` — both are required for a working theme. | **Forgetting `{{ content_for_header }}`.** Without it, required scripts and meta tags that Shopify and installed apps depend on never load. |

## Key takeaways

- `layout/theme.liquid` is the only strictly required file in a theme.
- `{{ content_for_header }}` (in `<head>`) and `{{ content_for_layout }}` (in `<body>`) are both required outputs, unique to this file.
- Anything placed outside those two outputs appears on every page with no per-page variation — keep it limited to genuinely global markup.

## Further reading

- [Layout architecture](https://shopify.dev/docs/storefronts/themes/architecture/layouts) (shopify.dev)
