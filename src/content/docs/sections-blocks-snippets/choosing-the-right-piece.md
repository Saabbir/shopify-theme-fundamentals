---
title: "Choosing the Right Piece: A Decision Guide"
description: A straightforward set of questions to answer before creating any new section, block, or snippet.
---

**TL;DR:** A straightforward set of questions to answer before creating any new section, block, or snippet.

By now you've seen all three pieces on their own. The practical skill is choosing correctly between them *before* you start building — getting it wrong early is cheap to fix; getting it wrong after other code depends on it is not.

## The decision, as a flowchart in words

Ask these questions, in order, about whatever you're about to build:

1. **Does a merchant need to add, remove, or reorder it on a page?**
   If yes, and it's a whole, page-level piece of content → it's a **section**.

2. **Is it a smaller, repeatable piece that lives inside a section (or inside another block)?**
   If yes, and a merchant needs to configure it visually → it's a **block**.

3. **Does a merchant need layout control over several blocks together (rows, columns, grouping)?**
   If yes → it's a **nestable "group" block** (see [Nesting Blocks Inside Blocks](/sections-blocks-snippets/nesting-blocks/)), not a plain block.

4. **Is it reusable code with no settings a merchant needs to see or touch at all?**
   If yes → it's a **snippet**.

## The same decision, as a table

| If it's... | And it needs merchant-visible settings... | Then it's a... |
|---|---|---|
| A whole page-level module | Yes | Section |
| A whole page-level module | No (fixed, never configured) | Still a section — give it an empty or minimal schema |
| A smaller, repeatable piece inside a section | Yes | Block |
| A smaller, repeatable piece inside a section | No | Snippet, rendered from the section |
| A layout container for other blocks | Yes (direction, alignment, etc.) | Nestable group block |
| Shared markup/logic across multiple files, no settings | — | Snippet |

## A worked decision

Say you're asked to build "a strip of customer logos" for a homepage. Walking through the questions:

1. Does a merchant add/remove/reorder it on the page? Yes — it's a **section**.
2. Does each individual logo need to be a configurable, repeatable item (different merchants will have different numbers of logos, in different orders)? Yes — each logo is a **block** inside that section.
3. Does the merchant need row/column layout control over the logos beyond a simple list? Probably not, for a first version — skip the nested group block for now; a flat list of logo blocks is enough.
4. Is there any shared rendering logic (say, the same logo markup also appears somewhere else, like a footer)? If so, extract that shared markup into a **snippet**, rendered from both the section's block loop and the footer.

Result: one section (`sections/logo-strip.liquid`), one block type (`logo`), and possibly one snippet if the logo markup is reused elsewhere.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Walk through the questions above every time, even for something that feels obvious. | **Deciding based on what's fastest to write right now**, rather than what's correct for how a merchant will actually need to use it. |
| Default to "snippet" only after confirming a merchant genuinely needs no visible settings for the thing you're building. | **Defaulting to "snippet" first** and only reconsidering if something later clearly needs settings. Decide the settings question up front instead. |

## Key takeaways

- The deciding question is almost always: does a merchant need to see and control this from the theme editor?
- Page-level + merchant-editable → section. Smaller, repeatable, merchant-editable → block. Layout control over several blocks → nestable group block. No merchant-visible settings at all → snippet.
- Getting this decision wrong early is cheap to fix. Fixing it after other code depends on the wrong choice is not.

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
