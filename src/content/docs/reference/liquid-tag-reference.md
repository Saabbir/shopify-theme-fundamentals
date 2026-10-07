---
title: Liquid Tag Reference
description: Every Liquid tag used across this site, plus a few worth knowing that weren't covered in depth.
---

**TL;DR:** Every Liquid tag used across this site, plus a few worth knowing that weren't covered in depth.

Not exhaustive — see [Shopify's own tag reference](https://shopify.dev/docs/api/liquid/tags) for the complete, current list.

## Variables

| Tag | Does | Taught in |
|---|---|---|
| `{% assign %}` | Sets a variable to a value | [Variables, Types & Truthiness](/liquid-basics/variables-types-and-truthiness/) |
| `{% capture %}...{% endcapture %}` | Sets a variable to rendered markup | [Variables, Types & Truthiness](/liquid-basics/variables-types-and-truthiness/) |
| `{% increment %}` / `{% decrement %}` | Outputs and adjusts a persistent counter variable, independent of `assign` | Not covered in depth — rarely needed in theme code |

## Control flow

| Tag | Does | Taught in |
|---|---|---|
| `{% if %}...{% elsif %}...{% else %}...{% endif %}` | Branches on a condition | [Operators & Conditionals](/liquid-basics/operators-and-conditionals/) |
| `{% unless %}...{% endunless %}` | Runs its block when the condition is false | [Operators & Conditionals](/liquid-basics/operators-and-conditionals/) |
| `{% case %}...{% when %}...{% else %}...{% endcase %}` | Compares one value against several options | [Operators & Conditionals](/liquid-basics/operators-and-conditionals/) |

## Loops

| Tag | Does | Taught in |
|---|---|---|
| `{% for %}...{% endfor %}` | Loops over an array or range | [Loops](/liquid-basics/loops/) |
| `{% break %}` | Exits a loop early | [Loops](/liquid-basics/loops/) |
| `{% continue %}` | Skips to the next iteration | [Loops](/liquid-basics/loops/) |
| `{% cycle %}` | Alternates between values on each iteration of a loop (e.g. alternating row classes) | Not covered in depth |
| `{% tablerow %}...{% endtablerow %}` | Loops over an array, outputting an HTML `<table>`'s rows and cells automatically | Not covered in depth — a narrow-purpose tag, rarely used outside literal tabular data |

## Reuse

| Tag | Does | Taught in |
|---|---|---|
| `{% render %}` | Renders a snippet, with explicitly passed, isolated variables | [What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) |
| `{% include %}` | An older, deprecated equivalent to `render` — shares the caller's variable scope instead of isolating it | Avoid in new code; use `render` instead |
| `{% section %}` | Renders a single named section | [How a Page Gets Rendered](/theme-architecture/how-a-page-gets-rendered/) |
| `{% sections %}` | Renders a section group | [Section Groups](/sections-blocks-snippets/section-groups/) |
| `{% content_for %}` | Renders the blocks (or other dynamic content) a section or block has been given | [What Is a Block?](/sections-blocks-snippets/what-is-a-block/) |

## Code organization

| Tag | Does | Taught in |
|---|---|---|
| `{% liquid %}...%}` | Writes multiple tags without repeating `{%`/`%}` on every line | [Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) |
| `{% comment %}...{% endcomment %}` | A multi-line comment | [Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) |
| `{% # ... %}` | A short, inline comment | [Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) |
| `{% doc %}...{% enddoc %}` | Documents a snippet's or block's expected parameters | [What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) |
| `{% raw %}...{% endraw %}` | Outputs its contents literally, without evaluating any Liquid inside — useful for showing Liquid syntax as text, exactly like the code examples throughout this site | Not covered in depth |

## Assets and schema

| Tag | Does | Taught in |
|---|---|---|
| `{% stylesheet %}...{% endstylesheet %}` | Static CSS, compiled into the theme's CSS asset | [`{% stylesheet %}` and `{% style %}`](/css-in-shopify-themes/stylesheet-and-style-tags/) |
| `{% style %}...{% endstyle %}` | Liquid-evaluated CSS, rendered inline | [`{% stylesheet %}` and `{% style %}`](/css-in-shopify-themes/stylesheet-and-style-tags/) |
| `{% javascript %}...{% endjavascript %}` | Static JavaScript, compiled into the theme's JS asset | [The `{% javascript %}` Tag](/javascript-in-shopify-themes/the-javascript-tag/) |
| `{% schema %}...{% endschema %}` | A section or block's settings, presets, and (for blocks) type definition | [What Is a Section?](/sections-blocks-snippets/what-is-a-section/) |

## Forms and pagination

| Tag | Does | Taught in |
|---|---|---|
| `{% form %}...{% endform %}` | Wraps a form with the correct action, method, and result object | [Forms](/forms/) |
| `{% paginate %}...{% endpaginate %}` | Splits a large array (like a collection's products) across multiple pages, exposing a `paginate` object with page numbers and navigation links | Not covered in depth |

## Whitespace

| Tag | Does | Taught in |
|---|---|---|
| `{%- tag -%}` / `{{- output -}}` | The `-` on either side trims surrounding whitespace | [Whitespace Control](/liquid-basics/whitespace-control/) |

## Further reading

- [Full tag reference](https://shopify.dev/docs/api/liquid/tags) (shopify.dev)
