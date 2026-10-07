---
title: All About Snippets
description: Everything about snippets, from what one is to recursion, organization at scale, and render performance.
---

**TL;DR:** Everything about snippets, from what one is to recursion, organization at scale, and render performance.

This chapter is a complete, standalone reference on snippets — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## What's in this chapter

| Page | Answers |
|---|---|
| [Snippet Fundamentals](/all-about-snippets/snippet-fundamentals/) | What a snippet is, `{% render %}` and scope isolation, and why a snippet isn't a block |
| [Recursive Snippets](/all-about-snippets/recursive-snippets/) | A snippet that renders itself, for genuinely recursive data like nested menus |
| [Organizing a Large Snippet Library](/all-about-snippets/organizing-a-large-snippet-library/) | Keeping `snippets/` navigable once a theme has grown to dozens of them |
| [Render Performance at Scale](/all-about-snippets/render-performance-at-scale/) | What actually costs performance when `render` is called a large number of times |
| [A Complete Snippet Example](/all-about-snippets/a-complete-snippet-example/) | A full, documented snippet with defensive checks, called from two different places |

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture#snippets) (shopify.dev)
