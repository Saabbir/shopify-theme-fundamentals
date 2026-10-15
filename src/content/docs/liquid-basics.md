---
title: Liquid Language Basics
description: The syntax at the core of every theme file — tags, output, variables, conditionals, loops, and filters.
---

**TL;DR:** The syntax at the core of every theme file — tags, output, variables, conditionals, loops, and filters.

You've already seen Liquid throughout [2. Theme Architecture & Files](/theme-architecture/) and [3. Sections, Blocks & Snippets](/sections-blocks-snippets/) — `{% if %}`, `{% for %}`, `{{ product.title }}` — without a full explanation of the syntax itself. This section is that explanation: the actual rules behind everything you've been reading by example so far.

## What's in this section

| Page | Answers |
|---|---|
| [4.1. Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) | The two kinds of Liquid markup, and how to write comments |
| [4.2. Variables, Types & Truthiness](/liquid-basics/variables-types-and-truthiness/) | `assign`, `capture`, Liquid's data types, and what counts as "true" |
| [4.3. Operators & Conditionals](/liquid-basics/operators-and-conditionals/) | `if`/`unless`/`case`, comparison and logical operators |
| [4.4. Loops](/liquid-basics/loops/) | `for`, `forloop`, `break`/`continue`, and looping over a range |
| [4.5. Whitespace Control](/liquid-basics/whitespace-control/) | Trimming the blank lines Liquid tags leave behind |
| [4.6. Filters: An Overview](/liquid-basics/filters-an-overview/) | The pipe syntax, chaining filters, and passing arguments |
| [4.7. Common Filters by Category](/liquid-basics/common-filters-by-category/) | The filters you'll reach for constantly, grouped by what they do |
| [4.8. Debugging Liquid](/liquid-basics/debugging-liquid/) | Inspecting a value, reading errors, and Liquid's most common silent failure |

## Liquid in one sentence

Liquid is a templating language: it mixes plain text (usually HTML) with tags and output that pull in data and logic, and the result — after Shopify evaluates every tag — is the HTML sent to the browser. Every `.liquid` file you've seen so far is just HTML with Liquid markup woven through it.

:::note[You've been reading Liquid examples since Theme Architecture & Files]
If the syntax below feels familiar, that's because it is — every section, block, and snippet example in the previous two chapters already used it. This chapter formalizes the rules those examples were quietly following, rather than introducing something new.
:::

## Further reading

- [Liquid reference](https://shopify.dev/docs/api/liquid) (shopify.dev)
- [Basic Liquid](https://shopify.dev/docs/api/liquid/basics) (shopify.dev)
