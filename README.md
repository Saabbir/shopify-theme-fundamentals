# Shopify Theme Fundamentals

A from-scratch course on Shopify theme development: Liquid, theme architecture, blocks, sections, snippets, schema, design tokens, and the mental model for turning a Figma design into theme code.

**Live site:** [https://saabbir.github.io/shopify-theme-fundamentals/](https://saabbir.github.io/shopify-theme-fundamentals/)

Unlike the [Shopify Theme Handbook](https://github.com/Saabbir/shopify-theme-handbook) (written for developers who already know Shopify and Liquid, and tied to the Solis project specifically), this site assumes **no prior Shopify or Liquid knowledge**. Every example is generic and theme-agnostic — it teaches the platform itself, not one specific theme's codebase. Think of it as the course you'd take before opening the handbook.

See [`ROADMAP.md`](./ROADMAP.md) for the full long-term content plan — which sections exist today versus which are still planned.

## Stack

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) — the same stack and visual design as the Shopify Theme Handbook. Content lives as Markdown in `src/content/docs/`.

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:4321/shopify-theme-fundamentals/`.

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploying

GitHub Pages is configured via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Pushes to `main` build with Astro and publish to `https://saabbir.github.io/shopify-theme-fundamentals/`.

## Structure

```
src/content/docs/    → all course content (Markdown)
src/styles/          → Starlight UI overrides (shared design with the handbook)
astro.config.mjs     → site config + sidebar navigation structure
ROADMAP.md           → the full long-term content plan, built vs. planned
```
