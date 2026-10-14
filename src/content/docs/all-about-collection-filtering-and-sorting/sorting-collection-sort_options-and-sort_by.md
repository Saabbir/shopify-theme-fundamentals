---
title: "Sorting: collection.sort_options & sort_by"
description: A merchant-controlled default, a shopper-controlled override, and the one Liquid idiom that correctly combines both.
---

**TL;DR:** A merchant-controlled default, a shopper-controlled override, and the one Liquid idiom that correctly combines both.

## Three related properties, each with a different job

```liquid
{{ collection.default_sort_by }}
{{ collection.sort_by }}
{{ collection.sort_options }}
```

- **`collection.default_sort_by`** — the order a merchant picked in the admin for this specific collection (`manual`, `best-selling`, `title-ascending`, `price-ascending`, `price-descending`, `created-ascending`, `created-descending`). This is a per-collection setting, not a theme-wide default.
- **`collection.sort_by`** — the order actually applied *right now*, from the `sort_by` URL parameter. This is `nil` the moment a shopper hasn't picked anything, which is exactly why reading it alone, with no fallback, is wrong.
- **`collection.sort_options`** — the list of choices to actually render in a sort dropdown, each a real `sort_option` object with `.name` (customer-facing, editable via the language editor) and `.value` (what goes in the URL).

## The one correct idiom

```liquid
{% liquid
  assign sort_by = collection.sort_by | default: collection.default_sort_by
%}
```

This single line is the entire mechanism: use the shopper's explicit choice if they made one, otherwise fall back to the merchant's own configured default for this collection. Skipping the `default:` fallback and reading `collection.sort_by` directly means a shopper who hasn't touched the sort dropdown sees an un-set, effectively undefined sort order, rather than the order the merchant actually intended as the collection's starting state.

## Rendering the dropdown

```liquid
<select onchange="window.location.href = this.value" aria-label="{{ 'collection.sort.label' | t }}">
  {% for option in collection.sort_options %}
    <option value="?sort_by={{ option.value }}" {% if option.value == sort_by %}selected{% endif %}>
      {{ option.name }}
    </option>
  {% endfor %}
</select>
```

`option.value == sort_by` (using the fallback-applied variable, not `collection.sort_by` directly) is what correctly pre-selects the right choice in the dropdown on page load — without the fallback, a merchant's actual default sort order would never show as selected, even though it's genuinely the order currently in effect.

:::note[A raw `<select onchange>` navigation works without JavaScript enhancement, with one caveat]
The inline `onchange` above is a reasonable, minimal exception to this site's usual "JavaScript in its own asset file" convention, same reasoning as the image loading-state fade-in covered in [All About Images](/all-about-images/lazy-load-and-loading-state-patterns/) — one line, tightly coupled to one element. The real caveat: this loses whatever filters are currently active, since it navigates to a bare `?sort_by=...` URL. A theme that also supports filtering needs to preserve the existing filter parameters when changing sort — covered next, in [How Theme-Side Filtering Interacts With the Search & Discovery App](/all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery/).
:::

## Key takeaways

- `collection.default_sort_by` is the merchant's per-collection setting; `collection.sort_by` is `nil` until a shopper picks something — combine them with `| default:`, never read `sort_by` alone.
- `collection.sort_options` provides the real, merchant-editable choices to render — `.name` for the label, `.value` for the URL parameter.
- A plain `<select onchange>` navigation works with zero JavaScript, but naively discards active filters unless it's built to preserve them.

## Further reading

- [`collection` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/collection)
- [`sort_option` (shopify.dev)](https://shopify.dev/docs/api/liquid/objects/sort_option)
- [How Theme-Side Filtering Interacts With the Search & Discovery App](/all-about-collection-filtering-and-sorting/how-theme-side-filtering-interacts-with-search-and-discovery/)
