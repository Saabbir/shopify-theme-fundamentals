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
| 4 | [Liquid Language Basics](/liquid-basics/) | The actual syntax rules behind every example you've read so far: tags, output, variables, conditionals, loops, and filters. |
| 5 | [Shopify's Global Objects](/global-objects/) | What's actually inside `product`, `cart`, `customer`, `settings`, and the rest — and which ones are available on which pages. |
| 6 | [Schema & Settings](/schema-and-settings/) | Every setting type, presets vs. defaults, the two settings files, conditional settings, and locale/translation keys. |

More sections are planned beyond these six — design tokens, forms, the Figma-to-code mental model, CSS, JavaScript, and a full reference section. See the [roadmap](https://github.com/Saabbir/shopify-theme-fundamentals/blob/main/ROADMAP.md) in the repo for the complete plan. New sections get added here as they're written.

## How this site is organized

Each top-level section starts with an **Overview** page (you're reading one now), followed by numbered sub-pages that go deeper on one specific topic. Read a section's Overview first — it explains what the sub-pages cover and links to each one — then follow the sub-pages in order the first time through.

Every page follows roughly the same shape:

- A **TL;DR** line near the top, so you can tell at a glance whether the page answers your question.
- The main explanation, with real code examples.
- An occasional **note, tip, or caution callout**, when one specific point is worth flagging separately from the main flow.
- **Key takeaways**, on longer pages, summarizing the one or two things worth remembering.
- **Further reading**, linking to Shopify's own documentation for anything this site doesn't cover in full.

A page occasionally adds a **Do / Don't** table, but only when a common mistake genuinely needs a side-by-side contrast that the prose above it hasn't already made — most pages won't have one.

## Further reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) (shopify.dev)
- [Shopify Theme Handbook](https://saabbir.github.io/shopify-theme-handbook/) — once you've worked through this site, that's where real-project, Theme-Store-submission-level practices live
