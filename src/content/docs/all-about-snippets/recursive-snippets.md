---
title: Recursive Snippets
description: A snippet that renders itself, for genuinely recursive data like nested menus.
---

**TL;DR:** A snippet that renders itself, for genuinely recursive data like nested menus.

## The problem: data that nests to an unknown depth

A navigation menu is the clearest real-world example: a top-level link might have child links, and any of those children might have children of their own, to whatever depth a merchant builds in the admin. You don't know ahead of time how deep it goes — which rules out writing a separate snippet (or set of nested `{% for %}` loops) for "menu," then "submenu," then "sub-submenu."

## The solution: a snippet that renders itself

A snippet can call `{% render %}` on itself, passing in whatever smaller piece of the data structure applies at the next level down:

```liquid
{% comment %} snippets/menu-item.liquid {% endcomment %}
{% doc %}
  Renders one menu link, and recursively renders its children, if any.

  @param {object} link - A linklist link object.
{% enddoc %}

<li>
  <a href="{{ link.url }}">{{ link.title }}</a>
  {% if link.links.size > 0 %}
    <ul>
      {% for child_link in link.links %}
        {% render 'menu-item', link: child_link %}
      {% endfor %}
    </ul>
  {% endif %}
</li>
```

Each call to `menu-item` only knows about its own `link` and that link's direct children — it doesn't need to know how deep the overall menu goes, because every level solves the exact same smaller problem by calling itself again.

## Always include a stopping condition

The `{% if link.links.size > 0 %}` check above isn't decorative — it's what stops the recursion. Without a condition like this, a snippet that unconditionally renders itself again would only stop once the data itself runs out of nested children, which is usually fine for a menu, but is worth stating explicitly: a recursive snippet's stopping condition is "no more data to recurse into," not an explicit depth counter, since Liquid itself doesn't give you a clean way to track "how deep am I" across recursive `render` calls.

:::caution[Watch for a reasonable depth ceiling]
A navigation menu is realistically a handful of levels deep at most. If you're building a recursive snippet for data that could plausibly nest very deeply (a comment thread, a deeply nested category tree), consider capping the rendering at a maximum depth by passing a counter through each recursive call, rather than trusting the data to always stay shallow.
:::

## Key takeaways

- A snippet can call `{% render %}` on itself to handle data that nests to an unknown depth, like a navigation menu with child links.
- Each recursive call only needs to know about its own slice of the data — not the overall depth.
- A recursive snippet needs its own stopping condition (typically "no more children to render"); for data that could nest unexpectedly deep, consider passing an explicit depth counter as a safety cap.

## Further reading

- [The render tag](https://shopify.dev/docs/api/liquid/tags/render) (shopify.dev)
