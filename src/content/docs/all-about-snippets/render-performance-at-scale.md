---
title: Render Performance at Scale
description: What actually costs performance when render is called a large number of times.
---

**TL;DR:** What actually costs performance when `render` is called a large number of times.

A single `{% render %}` call is cheap. The question this page answers is what happens once a snippet is rendered dozens or hundreds of times on one page — which, same as [Section Performance Considerations](/all-about-sections/section-performance-considerations/), usually traces back to an uncapped loop rather than `render` itself being slow.

## The actual cost is multiplication, not `render` itself

```liquid
{% for product in collection.products %}
  {% render 'product-card', product: product %}
{% endfor %}
```

`render`ing `product-card` once costs whatever `product-card` costs. Rendering it inside a loop over `collection.products` with no `limit` costs that same amount, multiplied by however many products that collection actually holds in production. This is the exact same lesson as the section-level performance page, just one level further down the rendering chain — cap the loop, and the snippet's own per-call cost stops being the thing to worry about.

## Nested `render` calls multiply further

A recursive snippet (see [Recursive Snippets](/all-about-snippets/recursive-snippets/)), or simply one snippet that itself renders other snippets, multiplies cost at each level. A `product-card` snippet that renders a `product-price` snippet and a `product-badge` snippet isn't a performance problem on its own — but if that `product-card` is itself inside an uncapped loop, every snippet it calls internally is now also running once per item in that loop. Keep this in mind when a snippet rendered inside a loop is itself fairly "heavy" (several nested `render` calls, or an expensive filter chain) — the loop's cap matters even more the heavier each individual iteration's work is.

## `{% render %}` vs. `{% include %}`

Older Liquid code sometimes uses the deprecated `{% include %}` tag instead of `{% render %}`. Beyond the scope-isolation difference already covered in [What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/)'s caution, `{% include %}` is also considered worse for performance in large themes, which is one of the reasons it's deprecated — always use `{% render %}` in new code, and treat any `{% include %}` found in an older codebase as worth migrating when you're already touching that file.

## Key takeaways

- `render` itself isn't slow — the real cost is however many times it's called, which usually traces back to an uncapped loop, exactly as with section-level performance.
- Nested `render` calls (a snippet rendering other snippets, or a recursive snippet) multiply that same cost further — worth noticing when a "heavy" snippet sits inside a loop.
- Always use `{% render %}`, never the deprecated `{% include %}` — migrate old `{% include %}` calls when you're already working in that file.

## Further reading

- [The render tag](https://shopify.dev/docs/api/liquid/tags/render) (shopify.dev)
- [Section Performance Considerations](/all-about-sections/section-performance-considerations/)
