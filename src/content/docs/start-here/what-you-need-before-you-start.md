---
title: What You Need Before You Start
description: The knowledge, accounts, and tools this site assumes you have — and the ones you don't need yet.
---

**TL;DR:** The knowledge, accounts, and tools this site assumes you have — and the ones you don't need yet.

## Knowledge this site assumes

- **HTML** — tags, attributes, nesting, forms.
- **CSS** — selectors, the box model, basic responsive design (media queries).
- **JavaScript** — variables, functions, DOM manipulation (`querySelector`, event listeners).

If those three are solid, you have everything you need. This site does not assume you've used Shopify before, written Liquid before, or know what a "theme" is beyond the general idea of "a website's design."

## Knowledge this site does not assume

- Any prior Shopify admin experience (as a merchant, developer, or support agent).
- Any Liquid syntax.
- Any specific design tool (Figma is used in later, planned sections purely as an example of "a design," not as a requirement).
- Any build tooling, bundlers, or frameworks. Shopify themes don't require any of that to get started.

## Accounts and tools you'll want

You don't need any of these to read sections 2 and 3 of this site — they're conceptual and can be followed from the explanations and code samples alone. You'll want them once you start building a real theme:

| Tool | What it's for | Required to start? |
|---|---|---|
| A [Shopify Partner account](https://www.shopify.com/partners) | Free. Lets you create development stores to build and test themes on, without paying for a Shopify plan. | Only once you start building for real |
| A development store | A free, sandboxed store created through your Partner account. This is where your theme actually runs while you build it. | Only once you start building for real |
| [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) | A command-line tool that previews your theme live against a development store as you edit files, without manually uploading anything. | Only once you start building for real |
| A code editor (VS Code or similar) | Any general-purpose code editor works. A Liquid syntax-highlighting extension makes `.liquid` files much easier to read. | Only once you start building for real |

:::note[Why this section doesn't walk through setting these up yet]
Installing the CLI and creating a development store only make sense once you understand what you're about to build — otherwise you're clicking through setup screens for concepts you haven't met yet. A full setup walkthrough is a natural fit for a later, planned section once you've read [Theme Architecture & Files](/theme-architecture/) and [Sections, Blocks & Snippets](/sections-blocks-snippets/). Until then, [Shopify's own CLI quickstart](https://shopify.dev/docs/themes/tools/cli) covers the setup steps directly.
:::

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Read sections 2 and 3 first, even without a development store set up yet. They're entirely conceptual — folders, rendering order, and the building blocks of a theme — and don't require running anything. | **Stalling on setup before reading anything.** Creating a Partner account and development store takes a few minutes whenever you're ready for it; it's not a blocker for understanding the concepts first. |
| Make sure your HTML/CSS/JS fundamentals are solid before diving in. Shopify-specific concepts build on top of them, not instead of them. | **Starting here if you've never written HTML/CSS/JS.** Learn general web development fundamentals first — this site teaches Shopify's platform, not web development from zero. |

## Further reading

- [Shopify Partners](https://www.shopify.com/partners) — free account, required eventually to create development stores
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) (shopify.dev)
