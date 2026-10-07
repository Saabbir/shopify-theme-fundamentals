---
title: "Horizon's Folder Structure & the Theme Store Caveat"
description: The top-level map of the repo, and a rule Shopify states explicitly that changes how you should use this theme.
---

**TL;DR:** The top-level map of the repo, and a rule Shopify states explicitly that changes how you should use this theme.

## What Horizon is

Horizon is Shopify's current first-party flagship theme — the reference implementation Shopify's own themes team builds to showcase the latest Liquid Storefronts features, including theme blocks. It's a real, production-quality, actively-maintained theme (the current release at the time of writing is version 4.1.3), not a tutorial or a simplified teaching example — everything in it is the kind of code that ships to real stores.

## The top-level folder structure

Horizon follows the same structure described in [Theme Architecture & Files](/theme-architecture/), confirmed directly against the repository root:

```
horizon/
  assets/        CSS, JavaScript, and other static files
  blocks/        Standalone block files
  config/        settings_schema.json and settings_data.json
  layout/        theme.liquid and any alternate layouts
  locales/       Translation files
  sections/      Section files
  snippets/      Reusable Liquid partials
  templates/     JSON templates for each page type
  LICENSE.md
  README.md
  release-notes.md
```

Nothing exotic here — this is the exact same structure every theme in [Theme Architecture & Files](/theme-architecture/) describes, just populated with a large, real, mature codebase instead of the small examples used to teach the concept.

## The caveat Shopify states directly

Horizon's own README contains a rule worth repeating exactly, because it changes how you should actually use this theme:

:::caution[Horizon is explicitly not eligible for Theme Store submission]
Quoting Horizon's README directly: *"If you're building a theme for the Shopify Theme Store, then do not use Horizon as a starting point. Themes based on, derived from, or incorporating Horizon are not eligible for submission to the Shopify Theme Store. Use the [Skeleton Theme](https://github.com/Shopify/skeleton-theme) instead."*
:::

This matters for how you treat everything else in this chapter. Horizon is an excellent, real-world reference for **learning patterns** and for **building a custom theme for a specific merchant** (an agency build, an in-house theme for one store) — in both of those cases, nothing stops you from reading Horizon's code, learning from it, or even copying specific snippets and patterns into your own theme. What you cannot do is fork or derive a theme from Horizon and submit *that* to the Theme Store for public distribution. If a Theme Store listing is the actual goal, start from the [Skeleton Theme](https://github.com/Shopify/skeleton-theme) instead, and treat Horizon purely as a reference to learn from while building on that different foundation.

## Why read Horizon at all, then

Three honest reasons, matching what this chapter is actually useful for:

- **Learning real patterns.** Every pattern covered abstractly elsewhere on this site — design tokens, scope isolation, contrast checking — has a working, production example in Horizon's source. Seeing the idea applied for real, at scale, with all its edge cases handled, teaches things a small example can't.
- **Building a custom (non-Theme-Store) theme.** If you're building for one specific merchant, not for public distribution, Horizon's code is genuinely reusable — the color and typography systems covered in the next two pages are strong, tested starting points.
- **Understanding what a modern Shopify theme actually looks like.** Horizon reflects Shopify's own current opinions about theme architecture — reading it is a fast way to see where the platform's conventions are heading.

## Key takeaways

- Horizon's folder structure is the same structure every theme uses — this chapter's value is in what's inside those folders, not the folder names themselves.
- Shopify's own README explicitly rules out using Horizon as a base for anything submitted to the Theme Store — use the Skeleton Theme for that, and treat Horizon as a reference to learn from instead.
- Horizon is genuinely valuable for learning patterns and for building a custom, non-Theme-Store theme — that's the lens the rest of this chapter is written through.

## Further reading

- [Horizon theme source (GitHub)](https://github.com/Shopify/horizon)
- [Skeleton Theme (GitHub)](https://github.com/Shopify/skeleton-theme)
