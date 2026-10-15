---
title: "From Figma to Code: The Mental Model"
description: How to look at a finished design and translate it into sections, blocks, snippets, and settings — before writing any code.
---

**TL;DR:** How to look at a finished design and translate it into sections, blocks, snippets, and settings — before writing any code.

Every previous chapter taught a piece: theme architecture, sections/blocks/snippets, Liquid, Shopify's objects, schema, design tokens, forms. This chapter is where those pieces come together — not as new mechanics, but as a way of *thinking* through a design before you write a single file.

"Figma" in this chapter's title is really shorthand for "a finished visual design," not a claim that you need that specific tool. Everything here applies equally to a design handed to you as a Figma file, a plain image, a PDF mockup, or even a rough sketch — the thinking process is the same regardless of what the design arrived as. This chapter is also not about Figma's own developer tooling (inspecting exact values, plugins, Dev Mode) — that's a tool-specific skill, not a mental model, and isn't covered here.

## What's in this section

| Page | Answers |
|---|---|
| [9.1. Reading a Design Like a Developer](/figma-to-code/reading-a-design-like-a-developer/) | What to look for before writing any code — repetition, boundaries, what's content vs. pattern |
| [9.2. Content vs. Structure](/figma-to-code/content-vs-structure/) | The single most useful question for not confusing "what this design happens to show" with "what the code needs to support" |
| [9.3. Section, Block, Snippet, or Fixed Markup?](/figma-to-code/section-block-snippet-or-fixed-markup/) | Applying the decision guide from earlier in this site directly to a design, rather than to an abstract feature request |
| [9.4. Planning Responsive Behavior](/figma-to-code/planning-responsive-behavior/) | Translating a separate mobile frame into CSS, and knowing what genuinely needs its own setting versus what's just CSS |
| [9.5. Worked Example: One Figma Frame, Start to Finish](/figma-to-code/worked-example/) | The entire process, start to finish, on one concrete design |

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
