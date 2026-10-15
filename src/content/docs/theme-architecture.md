---
title: Theme Architecture & Files
description: What a Shopify theme actually is, the files it's made of, and the order Shopify renders them in.
---

**TL;DR:** What a Shopify theme actually is, the files it's made of, and the order Shopify renders them in.

Before you write a single line of Liquid, you need a mental map of what a theme *is*: what files exist, what each one is responsible for, and what order Shopify puts them together in when a shopper loads a page. Get this map wrong and everything downstream — sections, blocks, settings — feels arbitrary. Get it right, and most of what follows on this site is just filling in detail on a structure you already understand.

## What's in this section

| Page | Answers |
|---|---|
| [2.1. What Is a Shopify Theme?](/theme-architecture/what-is-a-shopify-theme/) | What a theme actually controls, and what it doesn't |
| [2.2. The Theme Folder Structure](/theme-architecture/the-theme-folder-structure/) | The 8 top-level folders every theme has, and what belongs in each |
| [2.3. How a Page Gets Rendered](/theme-architecture/how-a-page-gets-rendered/) | The exact chain Shopify follows, from URL to finished HTML |
| [2.4. theme.liquid Explained](/theme-architecture/theme-liquid-explained/) | The one file every theme must have, and what it's responsible for |
| [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/) | The two ways a template file can be written, and why almost every theme uses JSON today |

## The big picture, before the detail

A Shopify theme is a set of files, organized into a fixed folder structure, that Shopify reads and assembles into a finished page every time a shopper requests one. Nothing about that assembly is unique per theme — every theme, no matter how different it looks, goes through the exact same steps in the exact same order. Learn that order once, here, and it applies to every theme you ever work on.

:::note[Where "blocks" and "sections" fit in]
This section covers the files and folders a theme is made of. The next section, [3. Sections, Blocks & Snippets](/sections-blocks-snippets/), goes deep on the three specific, reusable pieces you'll spend most of your actual time building. Read this section first — it explains where those pieces live and when they get rendered, which the next section assumes you already know.
:::

## Further reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
