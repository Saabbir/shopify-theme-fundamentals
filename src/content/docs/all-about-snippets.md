---
title: All About Snippets
description: Everything about snippets that the introductory chapter didn't have room for.
---

**TL;DR:** Everything about snippets that the introductory chapter didn't have room for.

:::note[This is a Part 2 deep dive]
This chapter assumes you've already read [What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) — it doesn't repeat what a snippet is, how `{% render %}` scope isolation works, or when to reach for a snippet instead of a block. If you haven't read Part 1 yet, start there; this chapter goes deep on one topic rather than introducing it.
:::

## What's in this chapter

| Page | Answers |
|---|---|
| [Recursive Snippets](/all-about-snippets/recursive-snippets/) | A snippet that renders itself, for genuinely recursive data like nested menus |
| [Organizing a Large Snippet Library](/all-about-snippets/organizing-a-large-snippet-library/) | Keeping `snippets/` navigable once a theme has grown to dozens of them |
| [Render Performance at Scale](/all-about-snippets/render-performance-at-scale/) | What actually costs performance when `render` is called a large number of times |

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture#snippets) (shopify.dev)
