---
title: "@app and @theme Targeting in Full"
description: Every way to control which block types a section or block accepts, beyond just "allow everything."
---

**TL;DR:** Every way to control which block types a section or block accepts, beyond just "allow everything."

[15.1. Block Fundamentals](/all-about-blocks/block-fundamentals/) introduced `"@theme"` and `"@app"` as the two broad categories a section can allow. In practice, allowing literally everything of a given category is often not what you actually want — this page covers the finer-grained targeting underneath those two entries.

## The broadest form: allow every theme or app block

```json
{
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
```

This is the broadest form — every standalone block defined anywhere in `blocks/` is allowed, plus any block any installed app wants to contribute. It's the right choice for a genuinely general-purpose container, but it means you're giving up control over what actually ends up inside.

## Allowing specific theme block types only

A section (or a container block) can list specific block types instead of the blanket `"@theme"`, restricting it to only those:

```json
{
  "blocks": [
    { "type": "text" },
    { "type": "image" },
    { "type": "button" }
  ]
}
```

Now only these three block types can be added here — no other standalone block in `blocks/`, even though it still exists and works fine elsewhere, is offered as an option in this specific section or container.

## Mixing specific types with the general form

A section can combine named types with `"@theme"` and `"@app"` in the same `blocks` array — for example, explicitly listing one required type while still leaving the door open to everything else:

```json
{
  "blocks": [
    { "type": "testimonial" },
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
```

This mostly matters when a section wants to give one particular block type special prominence (appearing first in the "add block" picker, say) while still allowing the full general set alongside it.

## Why narrowing matters more than it looks

Going back to [15.3. Advanced Nested Block Patterns](/all-about-blocks/advanced-nested-block-patterns/)'s card example: a card block that accepts `"@theme"` wholesale would let a merchant drop an unrelated "newsletter signup" block inside a card, which likely breaks the card's intended design. Naming exactly which block types a container accepts is how you prevent that category of mistake at the schema level, rather than hoping a merchant doesn't try it.

:::caution[Narrowing isn't retroactive]
If you ship a section allowing `"@theme"` broadly and later narrow it to specific types, any block instances a merchant already added that are no longer in the allowed list typically remain in their saved settings but can no longer be added fresh elsewhere in the editor for that section. Narrowing an already-shipped section's accepted types is not something to do casually once merchants have content built on it.
:::

## Key takeaways

- Beyond the blanket `"@theme"`/`"@app"`, a `blocks` array can list specific block types by name to restrict exactly what's allowed.
- Named types and the general `"@theme"`/`"@app"` forms can be combined in the same array.
- Narrowing what a container accepts is a real design decision — it prevents a block that doesn't belong from being dropped somewhere it would break the intended layout.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
