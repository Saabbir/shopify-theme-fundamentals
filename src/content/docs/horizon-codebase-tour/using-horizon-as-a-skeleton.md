---
title: Using Horizon as a Skeleton for a New Theme
description: A practical, step-by-step plan for what to keep, strip, and rebuild.
---

**TL;DR:** A practical, step-by-step plan for what to keep, strip, and rebuild.

:::caution[Re-read the Theme Store caveat first]
Everything on this page assumes a custom theme for a specific merchant, not a theme bound for the Shopify Theme Store. If the Theme Store is the goal, start from the [Skeleton Theme](https://github.com/Shopify/skeleton-theme) instead — see [Horizon's Folder Structure & the Theme Store Caveat](/horizon-codebase-tour/folder-structure-and-theme-store-caveat/) for why.
:::

## Step 1: get the code

```
git clone https://github.com/Shopify/horizon.git my-new-theme
```

Horizon's own README documents this exact workflow, including adding Horizon as an `upstream` remote so you can continue pulling in Shopify's own updates later if you want to. Whether that's worth doing depends on how heavily you end up modifying the theme — the more you rewrite, the more a future `git pull upstream main` will conflict.

## Step 2: keep the token system, almost unmodified

The single highest-value thing to reuse is `snippets/theme-styles-variables.liquid` and its companions (`color-palette.liquid`, `contrast-override.liquid`, `util-palette-hover-shift.liquid`), covered in full on the previous two pages. This is a tested, production-grade design-token system — the font-loading deduplication, the fluid type-preset algorithm, the automatic contrast and hover-color logic. Rebuilding this from scratch for a new theme would be real, non-trivial work; starting from a working version and adjusting the specific *values* (settings, defaults, specific token names your new sections will reference) is usually the better trade.

## Step 3: decide how much of the animation layer you actually need

Horizon is known for scroll-triggered animations, parallax effects, and transition-heavy section JavaScript — real differentiators for a visually expressive, storytelling-driven storefront, and real complexity for a simpler one. Before keeping any of it:

- If the new theme genuinely wants that kind of visual richness, keep it — it's a meaningful amount of engineering effort already done.
- If the new theme is meant to be simpler, leaner, or faster, strip animation-heavy sections and their supporting JavaScript aggressively rather than leaving them in unused. Dead JavaScript (and the CSS that styles animation states) still has to be maintained and can still cause bugs even if nothing currently triggers it.

This is a real, deliberate decision to make early — not something to defer, since animation logic tends to be woven into section markup and CSS in ways that are harder to cleanly remove later than to simply not carry over now.

## Step 4: strip or rebuild sections and blocks you don't need

Horizon ships a large library of sections and blocks (see [Sections, Blocks, Snippets & Assets at a Glance](/horizon-codebase-tour/sections-blocks-snippets-and-assets/)) — most new themes won't need all of them. Go through `sections/` and `blocks/` deliberately:

- Delete section/block files the new theme has no plausible use for, rather than leaving them present but unused — an unused file is a maintenance cost and a source of confusion for whoever edits the theme next.
- Keep and adapt the sections close to what the new design needs — adjusting an existing, working section is usually faster and safer than writing an equivalent one from scratch.
- Build genuinely new sections for anything the design calls for that Horizon has no equivalent of, following this site's own [Worked Example: Building a Simple Section](/sections-blocks-snippets/worked-example/) and the patterns in [All About Sections](/all-about-sections/).

## Step 5: review every setting in `config/settings_schema.json`

A new theme almost never needs every setting Horizon ships — some will be specific to animation features you stripped in Step 3, some to sections you deleted in Step 4. Audit the settings schema against what's actually still referenced in your remaining `sections/`/`blocks/`/`snippets/` files, and remove settings with no remaining consumer. An orphaned setting a merchant can still change, that nothing in the theme actually reads, is confusing and worth cleaning up rather than leaving in place.

## Step 6: re-skin, don't rebuild, the color and typography defaults

Once the token *system* from Step 2 is in place, getting a new brand's look right is mostly a matter of changing values, not structure: the default font picks in `settings_data.json`, the default palette colors, the specific `type_size_*` numbers driving the fluid scale. This is a deliberately different kind of work from Step 2 — Step 2 keeps the engineering, this step replaces the specific design decisions built on top of it.

## Step 7: run `theme check` early and often

Per this project's own QA conventions, validate every file you touch as you go rather than waiting until the end. A large, inherited codebase like Horizon is exactly the situation where an issue introduced by a deletion or a settings change in one file (a schema reference to a setting removed in Step 5, say) is easy to miss without checking immediately.

## Key takeaways

- The token system (Step 2) is the highest-value, lowest-risk thing to reuse wholesale — it's tested, production code solving a genuinely hard problem.
- The animation layer is a real, deliberate decision, not a default to inherit passively — decide early whether the new theme wants that complexity.
- Deleting unused sections, blocks, and settings as you go keeps the result a clean, understandable theme rather than Horizon with extra, unexplained cruft.

## Further reading

- [How Horizon Sets Up Colors](/horizon-codebase-tour/how-horizon-sets-up-colors/)
- [How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/)
- [Skeleton Theme (GitHub)](https://github.com/Shopify/skeleton-theme)
