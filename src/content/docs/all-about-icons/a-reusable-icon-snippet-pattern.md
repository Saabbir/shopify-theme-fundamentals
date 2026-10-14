---
title: A Reusable Icon Snippet Pattern
description: One dispatcher snippet, keyed by icon name, quoted directly from Horizon's real source — plus the native icon block it's already anticipating.
---

**TL;DR:** One dispatcher snippet, keyed by icon name, quoted directly from Horizon's real source — plus the native icon block it's already anticipating.

A separate snippet file per icon (`icon-cart.liquid`, `icon-search.liquid`, `icon-close.liquid`...) works, but scales awkwardly once a theme has dozens of icons — dozens of near-identical files, each wrapping one `<path>` in the same `<svg>` boilerplate. Shopify's own Horizon theme uses a different, more maintainable pattern: one snippet, dispatching on an icon name.

## The real pattern, from Horizon's `snippets/icon.liquid`

```liquid
{% doc %}
  Renders an inline SVG icon path. Used inside an `<svg>` element.

  @param {string} icon - The icon name to render (e.g. 'apple', 'cart', 'search').
{% enddoc %}

{% # To be removed when we can use the icon static block instead %}

{%- case icon -%}
  {%- when 'caret' -%}
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
      fill="currentColor"
    ></path>
  {%- when 'error' -%}
    <path d="M10 14a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5A.75.75 0 0 1 10 14ZM9 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
    <path
      fill-rule="evenodd"
      d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
      clip-rule="evenodd"
    />
  {%- when 'heart' -%}
    <path
      d="M10 5.2393L8.5149 3.77392C6.79996 2.08174 4.01945 2.08174 2.30451 3.77392C0.589562 5.4661 0.589563 8.2097 2.30451 9.90188L10 17.4952L17.6955 9.90188C19.4104 8.2097 19.4104 5.4661 17.6955 3.77392C15.9805 2.08174 13.2 2.08174 11.4851 3.77392L10 5.2393ZM10.765 3.06343C12.8777 0.978857 16.3029 0.978856 18.4155 3.06343C20.5282 5.148 20.5282 8.52779 18.4155 10.6124L10.72 18.2057C10.3224 18.5981 9.67763 18.5981 9.27996 18.2057L1.58446 10.6124C-0.528154 8.52779 -0.528154 5.14801 1.58446 3.06343C3.69708 0.978859 7.12233 0.978858 9.23495 3.06343L10 3.81832L10.765 3.06343Z"
      fill-rule="evenodd"
    />
{%- endcase -%}
```

(Trimmed to three representative branches — Horizon's real file has several dozen more, each with its own real path data, fetched directly from [Horizon's public source](https://github.com/Shopify/horizon/blob/main/snippets/icon.liquid).)

The snippet renders *only* the `<path>` elements for a given name — it deliberately doesn't render the surrounding `<svg>` tag itself, which is left to whatever calls it:

```liquid
<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
  {% render 'icon', icon: 'heart' %}
</svg>
```

This split matters: the caller controls the `<svg>` wrapper's attributes (`viewBox`, sizing, `aria-hidden` vs. a `<title>`) independently per use, while the snippet itself stays purely about *which paths* a given icon name maps to. One `{% case %}` branch per icon scales to dozens of icons in a single file, each new icon just a few more lines, rather than a few more entire files.

:::note[Horizon's own source flags this as temporary]
Directly above the `{% case %}` block in Horizon's real file sits the comment `{% # To be removed when we can use the icon static block instead %}`. This signals Shopify's own direction: a native `icon` static block type already exists in theme architecture (seen in some theme JSON configurations with `"type": "icon"` and an `icon` setting), suggesting icon rendering may eventually move toward a built-in mechanism rather than a hand-maintained `{% case %}` dispatcher. The dispatcher pattern on this page remains the right approach for a custom theme today — it's simply worth knowing Shopify's own flagship theme considers it a stepping stone, not necessarily the final word.
:::

## Why this beats one file per icon, at scale

- **Adding an icon is one new `{% when %}` branch**, not a new file, a new snippet name to remember, and a new place for a typo in the filename to silently produce a 404-like `{% render %}` failure.
- **Every icon shares exactly the same calling convention** (`{% render 'icon', icon: '...' %}`) — a developer who's learned the pattern once can use any icon in the set without checking each icon's own snippet signature.
- **It's trivially greppable** — searching one file for `when 'search'` finds every icon's definition, where searching dozens of separately named files requires knowing the exact filename convention first.

## Key takeaways

- One dispatcher snippet (`{% case icon %}` keyed by name, returning only `<path>` elements) scales far better than one snippet file per icon — confirmed as the real pattern Shopify's own Horizon theme uses.
- The dispatcher snippet should render only the icon's internal paths, leaving the surrounding `<svg>` wrapper (and its accessibility attributes) to the caller, so sizing and labeling stay a per-use decision.
- Horizon's own source comments that this pattern may eventually be replaced by a native icon block mechanism — worth knowing, not yet a reason to build differently today.

## Further reading

- [Horizon's real `snippets/icon.liquid`](https://github.com/Shopify/horizon/blob/main/snippets/icon.liquid)
- [Icon Fundamentals: Inline SVG vs. a Sprite System](/all-about-icons/icon-fundamentals-inline-svg-vs-a-sprite-system/)
- [Static blocks (shopify.dev)](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks)
