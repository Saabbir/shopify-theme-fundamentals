---
title: Critical CSS & Loading Performance
description: Shopify's real CSS subsetting behavior, read directly from its own docs, and what's actually left for you to optimize.
---

**TL;DR:** Shopify's real CSS subsetting behavior, read directly from its own docs, and what's actually left for you to optimize.

## The behavior worth knowing precisely: Shopify already subsets your CSS

It's easy to assume every `{% stylesheet %}` block in a theme ships on every page, all the time, since they all compile into one generated `styles.css`. That used to be closer to the whole story — it isn't anymore. Shopify's own documentation describes **stylesheet content subsetting**: for a given page, Shopify determines the *render tree* — the exact set of Liquid files (sections, blocks, snippets) actually rendered on that page — and includes only those files' `{% stylesheet %}` CSS in the `styles.css` sent to the browser.

> "Shopify automatically subsets CSS from `{% stylesheet %}` tags so that each storefront page only loads the styles it needs. Instead of bundling all `{% stylesheet %}` CSS from every theme file into a single payload, Shopify identifies which files are part of the page's render tree... and includes only their CSS."

Concretely: a product page doesn't ship the CSS for a "featured collection" section that only exists on the homepage, even though both sections' `{% stylesheet %}` blocks live in the same theme and compile toward the same `styles.css` filename. This already does most of what a manual "critical CSS extraction" step would otherwise be trying to achieve by hand in a different templating system.

## What subsetting depends on, and what breaks it

Subsetting works by tracing the render tree, which means it only works correctly if a file's CSS is actually used by files that are *really* in that tree:

- **Self-contained styles** (a class defined and used in the same file) are always safe.
- **Parent-to-rendered-child styles** (a section defines a class a snippet it `{% render %}`s uses) are safe — the parent is always in the tree whenever the child is.
- **Cross-file dependencies between unrelated files** (one section's CSS, used by a completely different section that doesn't render it) are unsafe — on a page that doesn't happen to render the defining file, the class silently loses its styling.

[29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) covers this exact failure mode and the `shopify theme check` rule (`ValidScopedCSSClass`) that catches it — worth reading alongside this page, since the two are really the same concern from two different angles: one is about avoiding a collision, the other is about not silently relying on CSS that subsetting might not include.

## What subsetting doesn't touch

A few kinds of CSS are explicitly excluded from subsetting, per Shopify's own documentation, and behave the same as always:

- **Asset stylesheets** (`.css` files in `assets/`, loaded via `stylesheet_tag`) — always included wherever referenced, regardless of render tree.
- **Inline `style` attributes** on elements.
- **Plain HTML `<style>` tags** (as opposed to `{% stylesheet %}`) — rendered as-is with the surrounding HTML.
- **`{% style %}` tag content** — also unaffected by subsetting.

## Subsetting and dynamically-fetched sections

[The Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering) — used to fetch a section's markup via JavaScript without a full page reload — also benefits from subsetting. The response includes a `<style data-section-stylesheet>` tag holding that section's own subsetted CSS:

```html
<section id="shopify-section-sections--...__featured_collection" class="shopify-section">
  <style data-section-stylesheet>
    .collection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  </style>
  <!-- section content -->
</section>
```

If your JavaScript inserts the full section response into the DOM, these styles arrive automatically. If it extracts and inserts only part of the response, it also needs to pull out this `<style data-section-stylesheet>` element and insert it alongside the content, or the dynamically-loaded section renders unstyled.

## What's actually left for you to optimize, given subsetting already exists

Since page-level CSS bundling is already handled, the performance work that's actually yours to do is narrower than it would be without subsetting:

- **Don't defeat subsetting yourself** — a cross-file dependency (covered above) doesn't just risk a visual bug, it specifically works against the mechanism that's supposed to be keeping your CSS payload small.
- **Keep genuinely global CSS in an asset stylesheet, deliberately** — a reset or shared utility classes, loaded once via `stylesheet_tag`, is the right call precisely because subsetting doesn't (and shouldn't) try to subset something meant to apply everywhere.
- **Watch selector and rule complexity**, independent of file size — a browser still has to parse and match every rule that does ship; deeply nested, over-specific selectors cost more to match than simple, flat, BEM-scoped ones, on top of the readability cost covered in [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/).
- **Respect `prefers-reduced-motion`** for any animation or transition — a performance and an accessibility consideration at once, since an unnecessary animation costs a frame budget a user who's opted out never wanted spent in the first place.

:::note[Third-party "critical CSS" advice assumes a different starting point]
Plenty of general web-performance advice talks about manually extracting and inlining "critical," above-the-fold CSS, deferring the rest. Some of that instinct is sound, but it was written for platforms without Shopify's own automatic, render-tree-aware subsetting already doing a large part of that job. Treat generic critical-CSS guidance as a starting point to verify against your own theme's actual measured performance (via Lighthouse or Shopify's theme-inspector tooling), not as a checklist to apply blindly on top of what Shopify already handles.
:::

## Key takeaways

- Shopify already subsets `{% stylesheet %}` CSS per page, based on the render tree — a page only ships the CSS for files actually rendered on it, not every section's CSS in the whole theme.
- A cross-file CSS dependency between unrelated files is the main way to accidentally defeat subsetting — catch it with `shopify theme check`'s `ValidScopedCSSClass` rule.
- Asset stylesheets, inline `style` attributes, plain `<style>` tags, and `{% style %}` content are all unaffected by subsetting — each behaves the same regardless of render tree.

## Further reading

- [Stylesheet content subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting) (shopify.dev)
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
- [Performance best practices for Shopify themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
