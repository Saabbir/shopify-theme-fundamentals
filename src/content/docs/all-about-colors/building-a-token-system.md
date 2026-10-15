---
title: "Building a Token System: Primitive, Semantic, Component"
description: The three-tier color architecture larger design systems use, and why one tier isn't enough.
---

**TL;DR:** The three-tier color architecture larger design systems use, and why one tier isn't enough.

## The problem with naming colors by what they look like

A single flat list of colors — `blue`, `dark-blue`, `light-gray` — works fine for a small theme. It breaks down as a theme grows, for a simple reason: `blue` describes what a color looks like, not what it's for. If `blue` is used as both a button color and a link color, and you later need the button to be a different shade without changing links, you're stuck, because nothing in the name `blue` ever said "button" in the first place.

## Tier 1: primitive tokens — the raw palette

Primitive tokens are the raw set of actual color values a theme has, named by what they look like, exactly like a flat palette:

```css
--primitive-blue-500: #2c6e5c;
--primitive-blue-700: #1a4238;
--primitive-gray-100: #f5f5f5;
--primitive-gray-900: #121212;
```

Nothing uses these directly in a component's CSS — they're the raw materials, not the thing you reach for day to day.

Shopify has a schema-level setting that plays almost exactly this role for merchant-facing theme settings: `color_palette`, a small set of named brand colors other settings can point back to. It's a different mechanism — CSS custom properties versus a Liquid settings object — but the motivation is the same, and it's covered in full on [17.2. The Color Palette Setting](/all-about-colors/color-palette-setting/).

## Tier 2: semantic tokens — named by purpose

Semantic tokens point at a primitive token, but are named by what role they play, not what they look like:

```css
--color-accent: var(--primitive-blue-500);
--color-background: var(--primitive-gray-100);
--color-text: var(--primitive-gray-900);
```

This is the same instinct behind naming a color setting by its role rather than its appearance — name roles by what they're for (`accent`), not what they look like (`blue`) — just formalized as its own tier. Changing the brand's accent color later means repointing `--color-accent` at a different primitive, with nothing that uses `--color-accent` needing to change at all.

## Tier 3: component tokens — named by specific use

For a large enough theme, even semantic tokens can be too broad. A component token narrows a semantic token down to one specific component's specific need:

```css
--button-background: var(--color-accent);
--button-background-hover: var(--primitive-blue-700);
--card-border: var(--color-background);
```

Now a design change scoped to just buttons — darkening the hover state, say — touches only `--button-background-hover`, without any risk of accidentally affecting every other place `--color-accent` is used.

## When each tier is actually worth it

:::note[Most themes only need two tiers]
A small-to-medium theme usually does fine with just primitive and semantic tokens — introducing a full third, component-specific tier adds real overhead (more variables to track, more indirection to follow) that only pays off once a theme has enough distinct components with genuinely independent color needs. Add the component tier when you notice yourself wanting to change one component's color without affecting others that share the same semantic token — not preemptively.
:::

## Key takeaways

- Primitive tokens are the raw palette, named by appearance. Semantic tokens point at a primitive, named by purpose. Component tokens narrow a semantic token to one specific component's need.
- The payoff compounds as a theme grows: changing a primitive or semantic token's underlying value cascades everywhere it's used, without touching the things that reference it.
- A third, component-specific tier is worth adding once you need independent control per component — not as a default starting point for every theme.

## Further reading

- [17.2. The Color Palette Setting](/all-about-colors/color-palette-setting/) — Shopify's own schema-level take on a primitive tier
- [Input settings: `color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_scheme_group) (shopify.dev)
