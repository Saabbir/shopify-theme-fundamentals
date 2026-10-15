---
title: "Syntax: Tags, Output & Comments"
description: The two kinds of Liquid markup, and how to write comments.
---

**TL;DR:** The two kinds of Liquid markup, and how to write comments.

Every piece of Liquid markup is one of two things: a **tag** or an **output**. Learning to tell them apart on sight is the first real skill in reading Liquid.

## Tags: `{% %}`

A tag performs logic — it doesn't print anything by itself. Assigning a variable, starting a loop, checking a condition: all tags.

```liquid
{% assign page_heading = "Welcome" %}
{% if page_heading != blank %}
  <!-- do something -->
{% endif %}
```

## Output: `{{ }}`

Output prints a value directly into the page. Anything inside `{{ }}` gets evaluated and the result is written to the HTML.

```liquid
{{ page_heading }}
{{ product.title }}
{{ 1 | plus: 1 }}
```

That last example evaluates to `2` and prints `2` — output isn't limited to printing a variable as-is; it can run the expression through filters first (covered in [4.6. Filters: An Overview](/liquid-basics/filters-an-overview/)).

## The one rule that explains most beginner confusion

**Tags never print anything. Output always prints something.** `{% assign x = 5 %}` produces no visible output at all — it just stores a value. If you want to see that value, you need a separate `{{ x }}`. Beginners often expect `{% %}` to render something and get confused when nothing appears; it's working correctly, it's just the wrong delimiter for printing.

## The `{% liquid %}` shorthand

Writing several tags in a row means repeating `{%` and `%}` every single line, which gets noisy fast:

```liquid
{% assign heading = section.settings.heading %}
{% assign subheading = section.settings.subheading %}
{% assign button_label = section.settings.button_label %}
```

A `{% liquid %}` block lets you write multiple tags without repeating the delimiters — just one tag name per line, no `{%`/`%}` around each:

```liquid
{% liquid
  assign heading = section.settings.heading
  assign subheading = section.settings.subheading
  assign button_label = section.settings.button_label
%}
```

This is exactly the pattern you saw throughout [3. Sections, Blocks & Snippets](/sections-blocks-snippets/) for assigning settings to variables at the top of a file. It's purely a convenience for writing several tags together — anything you can write with repeated `{% %}` tags, you can write inside one `{% liquid %}` block, and vice versa.

## Comments

Liquid has two comment forms, for two different situations.

**A block comment**, for commenting out a longer stretch, or leaving an explanation that spans more than one line:

```liquid
{% comment %}
  This section intentionally has no heading setting — the design
  calls for it to always read "Featured," never configurable.
{% endcomment %}
```

**An inline comment** (`{% # ... %}`), for a short, one-line note next to a specific piece of code:

```liquid
{% # Solis-style naming isn't used here — this is a generic example %}
<div class="product-card">
```

:::tip[Comments don't render, but they do cost a tiny bit of processing]
Both comment forms are invisible in the final HTML — Shopify strips them before sending the page to a browser. They're not free to have in a file (Shopify still has to parse past them), but that cost is negligible. Use them freely wherever they genuinely explain something non-obvious; don't avoid them for performance reasons.
:::

## Key takeaways

- `{% %}` is a tag — it performs logic and prints nothing by itself. `{{ }}` is output — it always prints a value.
- `{% liquid %}` lets you write several tags together without repeating the delimiters on every line; it changes nothing about what the tags do.
- Use `{% comment %}...{% endcomment %}` for longer notes, `{% # ... %}` for a short one-liner.

## Further reading

- [Liquid basics](https://shopify.dev/docs/api/liquid/basics) (shopify.dev)
- [The `liquid` tag](https://shopify.dev/docs/api/liquid/tags/liquid) (shopify.dev)
