---
title: Sections, Blocks & Snippets
description: The three reusable building blocks every Shopify theme is made of, and how to choose between them.
---

**TL;DR:** The three reusable building blocks every Shopify theme is made of, and how to choose between them.

If [Theme Architecture & Files](/theme-architecture/) was the map, this section is the three pieces you'll actually spend most of your time building: **sections**, **blocks**, and **snippets**. Nearly everything you build on a Shopify theme is one of these three things. Learning what each one is for, and — more importantly — when to reach for which one, is the single most practical skill this site teaches.

## What's in this section

| Page | Answers |
|---|---|
| [What Is a Section?](/sections-blocks-snippets/what-is-a-section/) | The page-level, merchant-addable module — what it is, and a basic schema |
| [What Is a Block?](/sections-blocks-snippets/what-is-a-block/) | The configurable piece inside a section, and the difference between theme blocks and app blocks |
| [Nesting Blocks Inside Blocks](/sections-blocks-snippets/nesting-blocks/) | How blocks can contain other blocks, several levels deep |
| [What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) | The small, reusable Liquid partial with no settings UI of its own |
| [Section Groups (Header & Footer)](/sections-blocks-snippets/section-groups/) | How a header or footer stays merchant-editable across every page |
| [Choosing the Right Piece: A Decision Guide](/sections-blocks-snippets/choosing-the-right-piece/) | A straightforward set of questions to answer before creating any new file |
| [Worked Example: Building a Simple Section](/sections-blocks-snippets/worked-example/) | A complete section, block, and snippet, built from nothing, explained line by line |

## The one-paragraph version

A **section** is a page-level module a merchant can add, remove, and reorder from the theme editor — a hero banner, a product grid, a newsletter signup. A **block** is a smaller, configurable piece *inside* a section that a merchant can also add, remove, and reorder — a single testimonial inside a "testimonials" section, say. A **snippet** is reusable Liquid code with no settings UI at all — a merchant never sees it directly; it exists purely so you, the developer, don't repeat the same markup in multiple places.

:::note[The newest architectural change worth knowing up front]
Blocks can now contain other blocks, nested several levels deep. This is a relatively recent, significant shift from how sections and blocks used to work (where a block could never hold another block). If you've read older tutorials or blog posts about Shopify themes, this is the single biggest thing likely to be out of date. See [Nesting Blocks Inside Blocks](/sections-blocks-snippets/nesting-blocks/) for the full explanation.
:::

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Walk through the [decision guide](/sections-blocks-snippets/choosing-the-right-piece/) before creating a new file, instead of guessing which of the three you need. | **Defaulting to "snippet" for everything reusable**, without asking whether a merchant actually needs to configure it visually — if so, it should be a block, not a snippet. |
| Read this section's pages in order — blocks assume you understand sections, and nesting assumes you understand blocks. | **Jumping straight to nesting** without first understanding plain, non-nested blocks and sections. |

## Further reading

- [Theme architecture: sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) (shopify.dev)
- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
