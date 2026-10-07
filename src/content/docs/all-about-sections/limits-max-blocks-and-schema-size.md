---
title: "Limits: max_blocks and Schema Size"
description: Capping how many blocks a section can hold, and the limits Shopify itself imposes.
---

**TL;DR:** Capping how many blocks a section can hold, and the limits Shopify itself imposes.

## `max_blocks`: capping how many a merchant can add

```json
{
  "max_blocks": 6
}
```

Set at the top level of a section's schema, `max_blocks` caps the total number of blocks a merchant can add to that section instance. Once reached, the theme editor stops offering to add more.

## Why you'd deliberately limit this

It's tempting to think more flexibility (no limit at all) is always better, but two real reasons justify a cap:

- **Design.** A three-column feature grid stops looking intentional the moment a seventh item forces an awkward partial row. A cap keeps the section looking the way it was designed to look, rather than degrading gracefully (or not) at an unplanned count.
- **Performance.** A section that loops over every added block (a testimonials carousel, say) does more rendering work the more blocks it holds. A sensible cap prevents a merchant from unknowingly turning a lightweight section into a heavy one.

## Shopify's own platform limits

Beyond whatever cap you choose to set yourself, Shopify imposes its own limits on schema size and complexity — a maximum number of blocks per section, a maximum settings count, limits on overall schema JSON size, and similar constraints that exist to keep the theme editor responsive and themes within a reasonable complexity budget.

:::note[Check current numbers against Shopify's own docs]
These platform-level limits are the kind of detail Shopify adjusts over time as the platform evolves — stating a specific number here risks it being stale by the time you read this. If you're running into what looks like a limit (the editor silently refusing to add another block, say), check [Shopify's current documentation](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) for the exact figures that apply today, rather than assuming an older number you may have seen elsewhere still holds.
:::

## Key takeaways

- `max_blocks`, set at the top of a section's schema, caps how many blocks a merchant can add — worth setting deliberately for both design and performance reasons, not just left unbounded by default.
- Shopify also enforces its own platform-level limits on schema size and block counts, independent of anything you set yourself.
- Treat any specific numeric limit as something to verify against current docs, not something to memorize as permanent.

## Further reading

- [Section schema limits](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) (shopify.dev)
