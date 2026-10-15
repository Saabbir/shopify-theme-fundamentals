---
title: Loading a Custom or Licensed Font
description: What to do when a client's exact brand font isn't in Shopify's font library — hosting the files yourself and writing the @font-face rule by hand.
---

**TL;DR:** What to do when a client's exact brand font isn't in Shopify's font library — hosting the files yourself and writing the `@font-face` rule by hand.

[18.2. Reading Typography from a Figma Design](/all-about-typography/reading-typography-from-a-figma-design/) flags this as the exception, not the default: most of the time, `font_picker` (covered in [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/)) is the right tool, because it gives a merchant a real, editable choice and Shopify handles licensing and hosting for you. This page is specifically for the case where that's not an option — the client owns a license for a real font file that genuinely isn't in Shopify's library, and the theme needs to load it directly.

## First: confirm the license actually allows this

A font a client "has" — bought from a foundry, downloaded from their brand guidelines, or licensed through a service like Adobe Fonts or Monotype — is not automatically licensed for **web embedding**. Desktop-use and web-use licenses are commonly sold separately, and a web license is sometimes further restricted by page views or domains. This is a licensing question for the client to confirm with whoever sold them the font, not something a theme developer should assume either way. Shopify's own font library sidesteps this entirely, which is the biggest single reason to prefer it when the exact family happens to be available there.

## Getting the right files

A real web font license typically includes the file formats browsers need directly — `.woff2` (serves nearly every current browser on its own) and `.woff` (a reasonable fallback for anything older). If a client instead hands over a desktop format (`.otf`, `.ttf`), it needs converting to `.woff2`/`.woff` with a tool like [Google's Webfonts Helper](https://gwfh.mranftl.com/fonts) or `fonttools`'s `fonttobdf`-adjacent conversion utilities before it's usable here — ask whoever licensed the font whether conversion is permitted under the license, since not all are.

Get a separate file for every weight and style the design actually needs (Regular, Bold, Italic), rather than one file and a hope that `font-weight: 700` alone will make a non-bold file look bold — browsers only synthesize a passable fake bold/italic when no real matching file exists, and the result is visibly worse than a real bold-cut file.

:::tip[Check whether the license is actually for a variable font first]
Everything from here assumes separate static files per weight. If the foundry's license page says the release is "Variable," one file can cover a whole weight range instead — [18.4. Variable Fonts](/all-about-typography/variable-fonts/) covers how to tell (and how the `@font-face` rule changes) for exactly this self-hosted case, where there's no `font` object or `font_modify` to probe with.
:::

## Two places to host the files: theme asset vs. Shopify Files

```liquid
{{ 'canela-regular.woff2' | asset_url }}
{{ 'canela-regular.woff2' | file_url }}
```

| | Theme asset (`asset_url`) | Shopify Files (`file_url`) |
|---|---|---|
| Lives | In the theme's own `assets/` folder | At the store level, outside any one theme |
| Versioned with the theme's code | Yes — ships with every push and pull | No |
| Uploaded via | The theme's own file structure | Admin → Content → Files |
| Best for | The right default for most projects | Sharing the same licensed font across multiple themes on one store (a seasonal theme and the main theme, say) — upload once instead of copying into each theme's `assets/` folder |

:::note[A font file is a binary asset, not source code]
A `.woff2` file committed into a theme's Git repository is a real, unreadable binary blob sitting in version control forever, unlike every other asset this site usually discusses. This is normal and fine for a reasonably sized font file, but it's worth being deliberate about committing only the actual files needed (the specific weights/styles in use), not every file a client happened to hand over.
:::

## Writing the @font-face rule by hand

Unlike a `font_picker`-based font, there's no font object here, and no `font_face` filter to build the rule for you — it has to be written directly, once per weight/style, in a `{% style %}` block in `theme.liquid`:

```liquid
{% comment %} snippets/custom-font-loading.liquid — rendered once, near the top of layout/theme.liquid {% endcomment %}
{% style %}
  @font-face {
    font-family: 'Canela';
    src:
      url({{ 'canela-regular.woff2' | asset_url }}) format('woff2'),
      url({{ 'canela-regular.woff' | asset_url }}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Canela';
    src:
      url({{ 'canela-bold.woff2' | asset_url }}) format('woff2'),
      url({{ 'canela-bold.woff' | asset_url }}) format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
{% endstyle %}
```

Two real `@font-face` rules, both named `'Canela'`, distinguished only by `font-weight` — this is exactly how the browser knows which file to actually download when CSS asks for `font-weight: 700` on text set in `font-family: 'Canela', ...`. Getting `font-weight`/`font-style` wrong on one of these rules (writing `400` on the bold file, say) doesn't error; it just makes the browser apply the wrong file to the wrong weight, silently.

`font-display: swap` here means the same thing it does for a `font_picker`-based font — see [18.6. Font-Loading Performance](/all-about-typography/font-loading-performance/) for the full reasoning behind that choice, and for layout-shift and preloading guidance that applies here too.

## There's no fallback_families — write the stack yourself

```liquid
<h1 style="font-family: 'Canela', Georgia, 'Times New Roman', serif;">
  {{ page_title }}
</h1>
```

A `font_picker`-based font comes with a ready-made `fallback_families` string. A hand-loaded font doesn't — the fallback stack has to be chosen and written manually, same as plain CSS anywhere else. Pick a fallback with a similar overall character (a serif-for-serif, geometric-sans-for-geometric-sans) rather than a generic default, for the same layout-shift reasons [18.6. Font-Loading Performance](/all-about-typography/font-loading-performance/) covers.

## Still wiring it into the same token system

The rest of the theme doesn't need to know this font was loaded differently — it can still be exposed as a normal design token, following [18.8. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)'s pattern, just with a hardcoded value instead of one read from `settings`:

```liquid
{% style %}
  :root {
    --font-heading-family: 'Canela', Georgia, 'Times New Roman', serif;
    --font-heading-weight: 400;
    --font-heading-bold-weight: 700;
  }
{% endstyle %}
```

```css
h1,
h2,
h3 {
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
}
```

:::note[This CSS deliberately stops at family and weight]
Same as elsewhere in this chapter: a role token carries `family`/`weight`/`style` only, never a size — `h1, h2, h3` here would also want a `font-size` and `line-height` in a real theme, supplied by a type preset layered on top. See [18.10. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) and [18.12. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/).
:::

The CSS consuming `--font-heading-family` looks identical either way — it has no way to tell, and doesn't need to, whether the value behind it came from a merchant's `font_picker` choice or a hardcoded brand font. This is the real payoff of keeping settings and tokens as separate layers in the first place.

:::caution[A merchant can no longer change this font from the theme editor]
This is the real, permanent trade-off of this whole approach. A `font_picker`-based heading font can be swapped by a merchant in a few clicks; a hardcoded `'Canela'` cannot — changing it means a developer editing code and pushing a new theme version. Confirm with the client that locking the brand font in this way, with no editor-level escape hatch, is actually what they want before building it this way. A middle ground some projects use: still expose a `font_picker` setting, but default it to the closest library match, and only hardcode the true brand font in a specific high-visibility spot (a homepage hero's `<h1>`, say) rather than theme-wide.
:::

## Preloading a hand-loaded font needs `crossorigin`

```html
<link
  rel="preload"
  href="{{ 'canela-bold.woff2' | asset_url }}"
  as="font"
  type="font/woff2"
  crossorigin
>
```

Font preloading is already covered generally in [18.6. Font-Loading Performance](/all-about-typography/font-loading-performance/), but there's one detail that matters specifically here: a browser always fetches a preloaded font in anonymous CORS mode, by spec, even when the file is served from what looks like the same origin — omitting `crossorigin` means the preload fires, downloads the file, and the browser **discards it and downloads it again** when the actual `@font-face` rule needs it, silently wasting the entire preload. Since a theme asset is actually served from Shopify's CDN domain rather than the storefront's own domain, this isn't just a spec technicality here — it's a real cross-origin request, and `crossorigin` (empty value defaults to `anonymous`) is required for the preload to do anything useful at all.

## Key takeaways

- Confirm a web-embedding license actually covers the font before building anything — Shopify's own font library sidesteps this question entirely, which is the main reason to prefer it when the exact family is available there.
- Get real `.woff2`/`.woff` files for every weight and style actually needed; don't rely on the browser's synthesized fake bold/italic.
- A theme asset (`asset_url`) is the right default for most projects; Shopify Files (`file_url`) is for sharing the same font across multiple themes on one store.
- Write one `@font-face` rule per weight/style by hand, with correct `font-weight`/`font-style` on each — there's no `font_face` filter or font object to do this for you.
- The fallback stack has to be written manually too, since there's no `fallback_families` for a font outside Shopify's library.
- The resulting font can still plug into the same CSS custom property/token pattern as any other font — just with a hardcoded value in place of a `settings.*` read.
- A preloaded custom font needs `crossorigin` or the preload is silently wasted, since theme assets are served cross-origin from Shopify's CDN.
- This locks the font out of theme-editor control entirely — confirm that trade-off with the client before building it this way.

## Further reading

- [The `asset_url` filter](https://shopify.dev/docs/api/liquid/filters/asset_url) (shopify.dev)
- [The `file_url` filter](https://shopify.dev/docs/api/liquid/filters/file_url) (shopify.dev)
- [Theme architecture: assets](https://shopify.dev/docs/storefronts/themes/architecture#assets) (shopify.dev)
- [`@font-face` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [18.6. Font-Loading Performance](/all-about-typography/font-loading-performance/)
- [18.8. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)
