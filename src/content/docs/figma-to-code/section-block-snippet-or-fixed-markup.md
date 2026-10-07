---
title: "Section, Block, Snippet, or Fixed Markup?"
description: Applying the decision guide from earlier in this site directly to a design, instead of to an abstract feature request.
---

**TL;DR:** Applying the decision guide from earlier in this site directly to a design, instead of to an abstract feature request.

[Choosing the Right Piece: A Decision Guide](/sections-blocks-snippets/choosing-the-right-piece/) already covered this decision mechanically — the questions to ask about any feature. This page is shorter on purpose: it's the same questions, answered by looking at a design rather than reading a written feature request.

## Translating each question into something you can see

| That page's question | What to look for in the design |
|---|---|
| Does a merchant need to add, remove, or reorder it on a page? | A visually distinct, self-contained region (a boundary from [Reading a Design Like a Developer](/figma-to-code/reading-a-design-like-a-developer/)) → likely a **section** |
| Is it a smaller, repeatable piece inside a section? | Repetition *within* one of those regions (three callouts inside one bounded area) → likely a **block** |
| Does a merchant need layout control over several blocks together? | The repeated items are arranged in a way a merchant would plausibly want to rearrange into rows/columns themselves → a nestable **group block** |
| Is it reusable code with no settings a merchant needs to see? | The same exact visual piece (a product card's layout, say) reappears in more than one place in the overall design → a **snippet** |

## A new fourth option, specific to reading a design: fixed markup

A design will also contain things that are neither sections, blocks, nor snippets — pieces so structurally fixed that giving them settings at all would be pointless. A decorative divider that's always the exact same shape, a fixed "Scroll down" indicator baked into a hero's own layout — these are just markup, written directly, with no schema at all. The signal: nothing about it would plausibly ever need to change per instance, and a merchant configuring it would have nothing meaningful to decide.

:::tip[When in doubt, under-build rather than over-build]
It's tempting to add a setting for everything that's technically possible to make configurable — a color here, a toggle there — "just in case." Resist this with anything that reads as fixed markup in the design. Every setting you add is something a merchant can misconfigure, and something you have to maintain. Add a setting when the design (or a reasonable guess about how the section will be reused) actually calls for one, not preemptively for everything that could theoretically vary.
:::

## Key takeaways

- The decision questions don't change for a design — only how you answer them does: by looking for visual boundaries (sections), repetition inside a boundary (blocks), the same exact piece reused elsewhere (snippets), and genuinely fixed elements (plain markup, no schema).
- A design-specific fourth category exists: fixed markup, for anything structurally constant enough that a setting would add no real value.
- When uncertain, add fewer settings rather than more — an unnecessary setting is a real, ongoing cost, not a free safety net.

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
