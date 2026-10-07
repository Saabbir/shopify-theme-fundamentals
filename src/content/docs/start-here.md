---
title: Start Here
description: What this site is, who it's for, and how to use it.
---

**TL;DR:** What this site is, who it's for, and how to use it.

This site teaches Shopify theme development from a completely blank starting point. It doesn't assume you've ever opened a Shopify admin, written a line of Liquid, or know what a "theme block" is. It does assume you're comfortable with HTML, CSS, and JavaScript — the kind of general web knowledge you'd get from building any website.

:::note[What a "theme" even is, in one sentence]
A Shopify theme is the code that controls how a store's storefront looks and behaves — every page a shopper sees, from the homepage to checkout-adjacent pages like cart and account. Building a theme means writing the templates, logic, and styling that Shopify renders for every visitor.
:::

## What you'll learn, in order

| # | Section | What it answers |
|---|---|---|
| 1 | You're here | What this site covers, what you need before you start. |
| 2 | [Theme Architecture & Files](/theme-architecture/) | What files make up a theme, and in what order Shopify actually renders them. |
| 3 | [Sections, Blocks & Snippets](/sections-blocks-snippets/) | The three reusable building blocks every theme is made of, and how to pick the right one. |

More sections are planned beyond these three — Liquid syntax, Shopify's data objects, settings and schema, design tokens, forms, the Figma-to-code mental model, CSS, JavaScript, and a full reference section. See the [roadmap](https://github.com/Saabbir/shopify-theme-fundamentals/blob/main/ROADMAP.md) in the repo for the complete plan. New sections get added here as they're written.

## How this site is organized

Each top-level section starts with an **Overview** page (you're reading one now), followed by numbered sub-pages that go deeper on one specific topic. Read a section's Overview first — it explains what the sub-pages cover and links to each one — then follow the sub-pages in order the first time through.

Every page follows the same shape:

- A **TL;DR** line near the top, so you can tell at a glance whether the page answers your question.
- The main explanation, with real code examples.
- A **Do / Don't** table, where a common mistake is worth contrasting against the right approach.
- **Key takeaways**, on longer pages, summarizing the one or two things worth remembering.
- **Further reading**, linking to Shopify's own documentation for anything this site doesn't cover in full.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Read sections 1 through 3 in order the first time through. Each one builds on the last — section 3 assumes you already know the folder structure from section 2. | **Jumping straight to a sub-page** that sounds interesting without reading its section's Overview first. You'll miss context the sub-page assumes you already have. |
| Keep this site open in a tab while you build your first theme. It's meant to be a reference you return to, not something you read once. | **Trying to memorize everything before you start building.** You'll retain far more by reading a page, then immediately trying the example yourself. |

## Further reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) (shopify.dev)
- [Shopify Theme Handbook](https://saabbir.github.io/shopify-theme-handbook/) — once you've worked through this site, that's where real-project, Theme-Store-submission-level practices live
