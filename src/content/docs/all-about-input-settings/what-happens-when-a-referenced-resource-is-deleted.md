---
title: What Happens When a Referenced Resource Is Deleted
description: The setting silently goes back to nil — there's no error, no broken-link warning in the editor, and no automatic cleanup of the dangling reference.
---

**TL;DR:** The setting silently goes back to `nil` — there's no error, no broken-link warning in the editor, and no automatic cleanup of the dangling reference.

A merchant picks a product for a `product`-type setting, ships the section, and three months later deletes that exact product from the catalog (discontinued, seasonal, whatever the reason). Nothing about this is unusual — and a theme needs to handle it correctly.

## The setting simply becomes `nil` again

```liquid
{{ section.settings.featured_product }}
{% comment %} nil, the moment the referenced product is deleted {% endcomment %}
```

There's no error, no broken object with some properties still populated and others missing — the setting reverts to exactly the same `nil` state as a merchant who never picked anything in the first place. This is actually the simplest possible outcome to design around: the empty-state handling [40.2. Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/) already requires for the unselected case is the *same* code path that correctly handles a since-deleted resource — there's no separate "deleted" state to detect or handle differently.

```liquid
{% if section.settings.featured_product %}
  {% render 'product-card', card_product: section.settings.featured_product %}
{% else %}
  <p class="empty-state">{{ 'sections.featured_product.empty_state' | t }}</p>
{% endif %}
```

This exact guard — written once, for the ordinary unselected case — already correctly covers the deleted-resource case too, with zero extra code.

## The theme editor shows no warning either

A merchant looking at the section in the theme editor won't see an obvious "this product no longer exists" indicator in most cases — the setting's picker field may just appear empty again, the same as if it had never been set. This means a theme's *storefront-facing* empty state (not an admin-only warning) is doing real, user-facing work here: a shopper landing on a page with a since-deleted featured product needs to see something sensible, not a broken-looking gap, since there's no guarantee a merchant has noticed and fixed it yet.

## This applies to every resource-picker type, not just `product`

```liquid
{% if section.settings.featured_collection %}...{% endif %}
{% if section.settings.image %}...{% endif %}
{% if section.settings.menu.links.size > 0 %}...{% endif %}
```

A deleted collection, a removed image, or a deleted navigation menu all behave identically — the setting reverts to `nil` (or, for `image_picker` specifically, simply has no image to resolve a URL from). The same guard-before-rendering pattern is the correct, complete fix across every resource-picker type covered in this chapter, not something that needs a type-specific exception anywhere.

## Key takeaways

- A deleted referenced resource makes its setting return `nil` — no error, no partial object, no distinct "deleted" state separate from "never selected."
- The empty-state guard a section already needs for the unselected case is the same code that correctly handles the deleted-resource case — no additional logic required.
- The theme editor doesn't reliably flag a since-deleted reference to the merchant, which makes a real, considered storefront empty state (not just an admin-side assumption that someone will notice) the thing actually protecting a shopper from seeing a broken-looking page.

## Further reading

- [40.2. Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/)
- [40.3. Default-Value Requirements & Validation Gotchas](/all-about-input-settings/default-value-requirements-and-validation-gotchas/)
- [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)
