---
title: Static Blocks
description: A block that's always present and can't be removed — what it's for and how it differs from an ordinary block.
---

**TL;DR:** A block that's always present and can't be removed — what it's for and how it differs from an ordinary block.

## The problem static blocks solve

Every ordinary block works the same way: a merchant adds it, removes it, and reorders it freely from the theme editor. Most of the time that's exactly right — but sometimes a section genuinely needs one specific piece to always be there. A header section might always need its logo block present, in a fixed spot, with no way for a merchant to accidentally delete the one thing that makes the header a header.

A **static block** is a block that's always rendered in a specific position in a section's markup and never shows up in the theme editor's "add block" list — because it's never optional in the first place.

## How a static block is declared

```json
{
  "blocks": [
    {
      "type": "logo",
      "name": "Logo",
      "static": true,
      "settings": [
        { "type": "image_picker", "id": "logo_image", "label": "Logo" }
      ]
    }
  ]
}
```

The `"static": true` key is what makes the difference. The block type still has settings like any other block, and a merchant can still edit those settings — what they can't do is remove the block entirely or move it to a different position.

## Rendering a static block at a fixed position

An ordinary block renders wherever `{% content_for 'blocks' %}` happens to loop over it. A static block instead renders at a specific, fixed spot in the markup, using its type and a matching `id`:

```liquid
<header>
  {% content_for 'block', type: 'logo', id: 'static-logo' %}
  <nav>
    {% content_for 'blocks' %}
  </nav>
</header>
```

The `id` here (`static-logo`) ties the markup position back to a specific static block entry in the schema — it's how Shopify knows which static block definition belongs in that exact spot, separate from whatever ordinary, merchant-addable blocks render through the regular `{% content_for 'blocks' %}` loop elsewhere in the same section.

:::note[Check current syntax against Shopify's own docs]
Static blocks are a newer part of theme architecture, and the exact rendering syntax is the kind of detail worth double-checking against [Shopify's current documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks) before shipping — treat the shape above as the concept, and verify the precise tag signature against what's current when you use it.
:::

## When to reach for this

Use a static block when a section would genuinely break, or stop making sense, without a specific piece present — a header's logo, a product page's always-present "Add to cart" block, a footer's copyright line. Don't reach for it just to discourage a merchant from removing something that's merely usually present; if removing it wouldn't actually break anything, leave it as an ordinary, removable block and let the merchant decide.

## Key takeaways

- `"static": true` on a block schema entry makes it always present, not addable or removable from the theme editor.
- A static block renders at a fixed position via its type and `id`, separately from the ordinary `{% content_for 'blocks' %}` loop.
- Reserve static blocks for pieces a section would genuinely break without — not as a general way to lock down merchant flexibility.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
