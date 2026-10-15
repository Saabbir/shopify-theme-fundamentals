---
title: Sections, Blocks & Snippets
description: The three reusable building blocks every Shopify theme is made of, and how to choose between them.
---

**TL;DR:** The three reusable building blocks every Shopify theme is made of, and how to choose between them.

If [2. Theme Architecture & Files](/theme-architecture/) was the map, this section is the three pieces you'll actually spend most of your time building: **sections**, **blocks**, and **snippets**. Nearly everything you build on a Shopify theme is one of these three things. Learning what each one is for, and — more importantly — when to reach for which one, is the single most practical skill this site teaches.

## What's in this section

| Page | Answers |
|---|---|
| [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/) | The page-level, merchant-addable module — what it is, and a basic schema |
| [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/) | The configurable piece inside a section, and the difference between theme blocks and app blocks |
| [3.3. Nesting Blocks Inside Blocks](/sections-blocks-snippets/nesting-blocks/) | How blocks can contain other blocks, several levels deep |
| [3.4. What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) | The small, reusable Liquid partial with no settings UI of its own |
| [3.5. Section Groups (Header & Footer)](/sections-blocks-snippets/section-groups/) | How a header or footer stays merchant-editable across every page |
| [3.6. Choosing the Right Piece: A Decision Guide](/sections-blocks-snippets/choosing-the-right-piece/) | A straightforward set of questions to answer before creating any new file |
| [3.7. Worked Example: Building a Simple Section](/sections-blocks-snippets/worked-example/) | A complete section, block, and snippet, built from nothing, explained line by line |

## The one-paragraph version

A **section** is a page-level module a merchant can add, remove, and reorder from the theme editor — a hero banner, a product grid, a newsletter signup. A **block** is a smaller, configurable piece *inside* a section that a merchant can also add, remove, and reorder — a single testimonial inside a "testimonials" section, say. A **snippet** is reusable Liquid code with no settings UI at all — a merchant never sees it directly; it exists purely so you, the developer, don't repeat the same markup in multiple places.

:::note[The newest architectural change worth knowing up front]
Blocks can now contain other blocks, nested several levels deep. This is a relatively recent, significant shift from how sections and blocks used to work (where a block could never hold another block). If you've read older tutorials or blog posts about Shopify themes, this is the single biggest thing likely to be out of date. See [3.3. Nesting Blocks Inside Blocks](/sections-blocks-snippets/nesting-blocks/) for the full explanation.
:::

## Further reading

- [Theme architecture: sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) (shopify.dev)
- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
