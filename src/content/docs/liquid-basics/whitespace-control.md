---
title: Whitespace Control
description: Trimming the blank lines and spaces Liquid tags leave behind in the rendered HTML.
---

**TL;DR:** Trimming the blank lines and spaces Liquid tags leave behind in the rendered HTML.

## The problem

Every Liquid tag you write on its own line leaves behind the line break and indentation around it — Liquid only removes the tag itself, not the whitespace surrounding it. This is harmless for how a browser renders the page (HTML collapses most whitespace visually), but it can leave noticeably messy output if you ever look at the raw HTML, and it occasionally matters for genuinely whitespace-sensitive output, like inline elements that shouldn't have a stray space between them.

```liquid
{% for product in collection.products %}
  <span>{{ product.title }}</span>
{% endfor %}
```

Rendered, this leaves a blank line before and after every `<span>`, plus the loop's own line breaks — once for every single product.

## The fix: `-` on either side of a tag

Adding a hyphen to the inside of a tag's delimiters trims the whitespace on that side.

```liquid
{%- for product in collection.products -%}
  <span>{{ product.title }}</span>
{%- endfor -%}
```

| Syntax | Trims |
|---|---|
| `{%- tag %}` | Whitespace **before** the tag |
| `{% tag -%}` | Whitespace **after** the tag |
| `{%- tag -%}` | Whitespace on **both sides** |

The same hyphen syntax works on output too: `{{- product.title -}}`.

## A concrete before/after

```liquid
{% comment %} Without trimming: {% endcomment %}
<p>
  {% if product.available %}
    In stock
  {% endif %}
</p>
```

Renders as (blank lines and indentation included):

```
<p>

    In stock

</p>
```

```liquid
{% comment %} With trimming: {% endcomment %}
<p>
  {%- if product.available -%}
    In stock
  {%- endif -%}
</p>
```

Renders as:

```
<p>In stock</p>
```

## When this actually matters

Most of the time, extra whitespace in HTML is invisible to a shopper — browsers collapse it. Whitespace control matters in a few specific, real situations:

- **Inline elements where a stray space is visible**, like `<span>{{ a }}</span> <span>{{ b }}</span>` where a loop or conditional between them would otherwise introduce an unwanted gap.
- **`<pre>` or anything with `white-space: pre`**, where whitespace is never collapsed and extra blank lines show up directly.
- **Attribute values**, where leading/trailing whitespace can end up inside a `class` or similar attribute if a tag sits right next to the quotes.

:::tip[Don't over-apply it]
Trimming every single tag in a file for the sake of "clean" raw HTML makes the Liquid source itself harder to read, for a benefit a shopper will never see. Reach for `-` specifically where whitespace is visible or otherwise matters (the cases above), not as a blanket habit across every tag you write.
:::

## Key takeaways

- `{%- -%}` (and `{{- -}}` for output) trims whitespace on whichever side has the hyphen.
- It's purely cosmetic for how a browser renders typical HTML — reach for it where whitespace is actually visible or structurally significant, not everywhere by default.

## Further reading

- [Whitespace control](https://shopify.dev/docs/api/liquid/basics#whitespace-control) (shopify.dev)
