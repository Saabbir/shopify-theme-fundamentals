---
title: Block Limits
description: How many blocks and how much nesting a section can realistically hold.
---

**TL;DR:** How many blocks and how much nesting a section can realistically hold.

This is the block-focused counterpart to [14.3. Limits: max_blocks and Schema Size](/all-about-sections/limits-max-blocks-and-schema-size/) — that page covered `max_blocks` at the section level; this one covers the limits specific to nested blocks.

## `max_blocks` works on a container block too

The same `max_blocks` key from a section's schema works identically on a block that accepts other blocks:

```json
{
  "name": "Group",
  "max_blocks": 4,
  "blocks": [{ "type": "@theme" }]
}
```

This caps how many children any one instance of this group block can hold — the same design and performance reasoning from the section-level page applies: an unbounded group can degrade visually past a certain count, and costs more to render the more children it holds.

## Nesting depth has a practical ceiling

Beyond how many blocks fit in any one container, there's a separate question of how many levels deep nesting can go at all. Shopify enforces a real maximum nesting depth, beyond which the theme editor won't allow another level — independent of any `max_blocks` value you set yourself.

:::note[Check the current depth limit against Shopify's own docs]
Like other platform-level numeric limits, the exact maximum nesting depth is a detail Shopify can adjust over time. If you're designing a block structure that nests several layers deep, check [Shopify's current documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks) for today's actual limit rather than assuming a specific number holds indefinitely.
:::

## Total blocks per section also has a ceiling

Separate from any one container's `max_blocks`, there's an overall cap on the total number of blocks (counting every nested block at every level) a single section instance can contain. A deeply nested structure can hit this total before any individual container's own `max_blocks` would have stopped it — worth keeping in mind for a design that nests heavily, rather than assuming each container's own limit is the only constraint in play.

## Designing within the limits

In practice, these limits rarely matter for a reasonably designed layout — they start to matter once a design asks for deep, repeated nesting (a grid of cards, each containing a nested row of icons, say) at a scale that starts multiplying quickly. When a design calls for something at that scale, it's worth sketching out the actual block count before building, the same way [9.4. Planning Responsive Behavior](/figma-to-code/planning-responsive-behavior/) recommends planning ahead of time rather than discovering a constraint mid-build.

## Key takeaways

- `max_blocks` works the same way on a container block as it does on a section — capping how many direct children that specific instance can hold.
- Shopify also enforces a maximum nesting depth and a maximum total block count per section, independent of any `max_blocks` you set yourself.
- Treat exact numeric limits as something to verify against current docs, not something to memorize — and sketch out the expected block count ahead of time for any design that nests heavily.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
- [14.3. Limits: max_blocks and Schema Size](/all-about-sections/limits-max-blocks-and-schema-size/)
