---
title: How to Use This Site
description: Reading front to back versus using this site as a reference, and how the examples are written.
---

**TL;DR:** Reading front to back versus using this site as a reference, and how the examples are written.

## Two ways to use this site

**The first time through, read front to back.** Sections 1 through 7 (and everything planned after them) are ordered deliberately — each one assumes you already understand the ones before it. Skipping ahead to "Sections, Blocks & Snippets" before reading "Theme Architecture & Files" means reading about blocks before you know what folder they live in or when Shopify even loads them.

**After that, use it as a reference.** Once you've read through once, you don't need to re-read a whole section to answer one specific question. Jump straight to the sub-page that covers it, or use search (**⌘K** or **Ctrl+K**) to find a term.

## How the examples are written

Every code example on this site is generic and theme-agnostic. You'll see section, block, and setting names like `hero-banner`, `product-card`, or `announcement-bar` — plain, descriptive names with no project-specific prefix or branding. That's intentional: the goal is to teach you the platform, not to walk you through one specific theme's codebase.

:::tip[If you're working on a real theme already]
If you're following along while building an actual theme — maybe one with its own naming conventions, like prefixing every class and setting with a short project code — apply this site's concepts using *that* project's conventions, not the generic names shown here. The underlying mechanics (what a section is, how a block nests, what goes in `config/`) are identical either way.
:::

## What "Liquid" means, before we get further

You'll see the word **Liquid** constantly from here on. It's Shopify's templating language — the syntax that lets a `.liquid` file mix plain HTML with logic and data from the store (a product's price, a merchant's chosen color, a loop over every item in a collection). A dedicated Liquid syntax section (tags, filters, loops) is planned; until then, this site introduces just enough Liquid syntax as needed, in context, to explain theme architecture, sections, blocks, and snippets.

## Further reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) (shopify.dev)
- [Shopify Liquid reference](https://shopify.dev/docs/api/liquid) (shopify.dev)
