---
title: Shopify Theme Fundamentals
description: Learn Shopify theme development from scratch — Liquid, theme architecture, blocks, sections, design tokens, and the mental model for turning a design into working theme code.
template: splash
hero:
  tagline: Shopify theme development, taught from a blank folder. No prior Shopify or Liquid experience assumed — just HTML, CSS, and JavaScript.
  actions:
    - text: Start Here
      link: /shopify-theme-fundamentals/start-here/
      icon: right-arrow
      variant: primary
    - text: Theme Architecture & Files
      link: /shopify-theme-fundamentals/theme-architecture/
      icon: external
      variant: minimal
---

## What this site teaches

| Section | Covers |
|---|---|
| [1. Start Here](/start-here/) | How to use this site, what you need before you start |
| [2. Theme Architecture & Files](/theme-architecture/) | What a theme is, the 8 required folders, how a page actually renders |
| [3. Sections, Blocks & Snippets](/sections-blocks-snippets/) | The three building blocks of every theme, nesting, and how to choose between them |
| [4. Liquid Language Basics](/liquid-basics/) | Tags, output, variables, conditionals, loops, filters |
| [5. Shopify's Global Objects](/global-objects/) | `product`, `cart`, `customer`, `settings`, and the rest |
| [6. Schema & Settings](/schema-and-settings/) | Every setting type, presets, `settings_schema.json` |
| [7. Design Tokens: Color, Type & Spacing](/design-tokens/) | Turning merchant settings into a consistent design system |
| [8. Forms](/forms/) | Product, cart, customer, and contact forms |
| [9. From Figma to Code: The Mental Model](/figma-to-code/) | Looking at a design and deciding what's a section, block, or snippet |
| [10. CSS in Shopify Themes](/css-in-shopify-themes/) | `{% stylesheet %}`, scoping, responsive patterns |
| [11. JavaScript in Shopify Themes](/javascript-in-shopify-themes/) | `{% javascript %}`, Web Components, theme editor events |
| [12. Media & Assets](/media-and-assets/) | Images, video, 3D, icons |
| [13. Reference](/reference/) | Tag reference, filter reference, glossary, cheatsheet |

All 13 sections are live — see [`ROADMAP.md`](https://github.com/Saabbir/shopify-theme-fundamentals/blob/main/ROADMAP.md) in the repo for why they're ordered this way, and for where any future sections get scoped out before they're written.

## Where to start

Read sections 1 through 13, in order — each one assumes you've read the last. After that, this site works as a reference: jump to whatever section answers your current question, or use search (**⌘K**).

## Is this the right place to start?

If you've never built a Shopify theme before, yes — start here. If you already know Shopify and Liquid and want to see how one specific real theme is actually built and shipped to the Theme Store, you want the [Shopify Theme Handbook](https://saabbir.github.io/shopify-theme-handbook/) instead. This site teaches the platform; that one documents a project.
