---
title: Horizon Theme Codebase Tour
description: A practical walkthrough of Shopify's real Horizon theme — what's there, why, and what you can reuse.
---

**TL;DR:** A practical walkthrough of Shopify's real Horizon theme — what's there, why, and what you can reuse.

Every other chapter on this site teaches the general mechanism — how a section works, how a color setting works, in the abstract. This chapter is different: it's a tour of one real, specific, currently-shipping theme — **Horizon**, Shopify's own first-party reference theme — read directly from its source code, to answer a very practical question: *if I'm about to build a new theme, what does Shopify's own flagship theme already give me, and what's actually worth reusing?*

:::note[What's directly verified vs. general knowledge]
The pages on colors and typography in this chapter quote real code fetched directly from Horizon's public repository — every variable name, setting name, and code snippet shown there is real, not reconstructed from memory. The pages on sections, blocks, and assets describe the general shape of those folders using Shopify's documented theme architecture plus specifically-sourced examples (cited inline); they are not a complete, verified file-by-file inventory, because Horizon's file tree changes between versions and a live listing wasn't reliably fetchable while writing this. For the complete, current file list, browse [github.com/Shopify/horizon](https://github.com/Shopify/horizon) directly — everything in this chapter will still make sense once you're looking at the real thing.
:::

## What's in this chapter

| Page | Answers |
|---|---|
| [Horizon's Folder Structure & the Theme Store Caveat](/horizon-codebase-tour/folder-structure-and-theme-store-caveat/) | The top-level map of the repo, and a rule Shopify states explicitly that changes how you should use this theme |
| [How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/) | `color-palette.liquid`, `contrast-override.liquid`, and the automatic hover/contrast system, read from source |
| [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/) | `theme-styles-variables.liquid` in full — font loading, fluid type presets, and the entire token system |
| [Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) | The real settings count, variant count, token count, and preset count — verified against current source |
| [Naming & Code Conventions in Horizon](/horizon-codebase-tour/naming-and-code-conventions/) | The patterns that repeat throughout the real code — worth copying even if nothing else is |
| [Sections, Blocks, Snippets & Assets at a Glance](/horizon-codebase-tour/sections-blocks-snippets-and-assets/) | What kind of content lives in each remaining folder, and how to explore it yourself |
| [Using Horizon as a Skeleton for a New Theme](/horizon-codebase-tour/using-horizon-as-a-skeleton/) | A practical, step-by-step plan for what to keep, strip, and rebuild |

## Further reading

- [Horizon theme source (GitHub)](https://github.com/Shopify/horizon)
- [Horizon README](https://github.com/Shopify/horizon/blob/main/README.md)
