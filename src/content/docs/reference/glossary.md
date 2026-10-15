---
title: Glossary
description: Every term this site uses, defined in one line, linked back to where it was taught.
---

**TL;DR:** Every term this site uses, defined in one line, linked back to where it was taught.

| Term | Means |
|---|---|
| App block | A block contributed by an installed app, rather than defined by the theme — see [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/) |
| ARIA | Attributes (`aria-expanded`, `aria-label`, and others) that describe an interactive element's state to assistive technology, beyond what plain HTML conveys |
| BEM | A CSS class-naming convention — `block`, `block__element`, `block--modifier` — see [10.2. Naming & Scoping](/css-in-shopify-themes/naming-and-scoping/) |
| Block | A smaller, configurable, repeatable piece inside a section — see [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/) |
| Collection | A group of products — see [5.1. product, variant & collection](/global-objects/product-variant-and-collection/) |
| Color scheme | A bundle of several coordinated color roles a merchant picks as one unit — see [7.1. Color Settings & Color Schemes](/design-tokens/color-settings-and-color-schemes/) |
| CSS custom property | A named, reusable CSS value (`--my-variable`), set with `style="--x: ...;"` and read with `var(--x)` — see [7.4. Turning Settings into CSS Variables](/design-tokens/turning-settings-into-css-variables/) |
| Design mode | Shopify's flag (`Shopify.designMode`) indicating code is running inside the theme editor — see [11.3. Theme Editor Events](/javascript-in-shopify-themes/theme-editor-events/) |
| Design token | A named, reusable value (a specific color, spacing amount, or font) used consistently instead of repeating raw values — see [Design Tokens](/design-tokens/) |
| `forloop` | The object available inside a `for` loop, describing the current position (`index`, `first`, `last`, and more) — see [4.4. Loops](/liquid-basics/loops/) |
| Layout | The outermost wrapper around every page (`layout/theme.liquid`) — see [2.4. theme.liquid Explained](/theme-architecture/theme-liquid-explained/) |
| Liquid | Shopify's templating language, mixing plain HTML with logic and data — see [4. Liquid Language Basics](/liquid-basics/) |
| Locale file | A translation file in `locales/` — see [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) |
| Logical property | A CSS property (`margin-inline-start`, `padding-block`) describing spacing relative to text flow rather than a fixed physical direction — see [10.3. Responsive & Logical Properties](/css-in-shopify-themes/responsive-and-logical-properties/) |
| Metafield | Custom structured data attached to an object (a product, say) beyond its standard fields — see [5.4. Other Useful Objects](/global-objects/other-useful-objects/) |
| Output | Liquid markup (`{{ }}`) that prints a value — see [4.1. Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) |
| Preset | A named starting configuration for a section or block, overriding defaults and optionally pre-adding blocks — see [6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/) |
| Progressive enhancement | Building markup that works before JavaScript runs, then enhancing it with behavior — see [11.2. Web Components for Theme Behavior](/javascript-in-shopify-themes/web-components-for-theme-behavior/) |
| Responsive image | An `<img>` using `srcset`/`sizes` so the browser picks the right file size for its own viewport — see [12.1. Images & Responsive Image Tags](/media-and-assets/images-and-responsive-image-tags/) |
| Section | A page-level, merchant-addable module — see [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/) |
| Section group | A JSON file (`header-group.json`, `footer-group.json`) rendering sections from the layout rather than a page template — see [Section Groups](/sections-blocks-snippets/section-groups/) |
| Setting | A merchant-configurable value, defined in a schema — see [6. Schema & Settings](/schema-and-settings/) |
| Snippet | Reusable Liquid code with no settings UI of its own — see [3.4. What Is a Snippet?](/sections-blocks-snippets/what-is-a-snippet/) |
| `srcset` | The `<img>` attribute listing several image sizes for the browser to choose between — see [12.1. Images & Responsive Image Tags](/media-and-assets/images-and-responsive-image-tags/) |
| Tag | Liquid markup (`{% %}`) that performs logic without printing anything by itself — see [4.1. Syntax: Tags, Output & Comments](/liquid-basics/syntax-tags-output-and-comments/) |
| Template | A file in `templates/` deciding which sections appear on one page type — see [2.5. Templates: JSON vs. Liquid](/theme-architecture/templates-json-vs-liquid/) |
| Theme | The code controlling a Shopify store's storefront look and behavior — see [2.1. What Is a Shopify Theme?](/theme-architecture/what-is-a-shopify-theme/) |
| Theme block | A block defined by the theme itself (as opposed to an app block) — see [3.2. What Is a Block?](/sections-blocks-snippets/what-is-a-block/) |
| Theme editor | Shopify admin's visual tool for adding, configuring, and reordering a theme's sections and blocks |
| Theme Store | Shopify's storefront for publicly listed, purchasable themes |
| Translation key (`t:`) | A reference to translated text, resolved from a locale file — see [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) |
| Truthy / Falsy | Whether a value counts as true or false in a condition — in Liquid, only `nil` and `false` are falsy — see [4.2. Variables, Types & Truthiness](/liquid-basics/variables-types-and-truthiness/) |
| Type scale | A small, fixed set of font sizes reused throughout a theme — see [7.2. Typography & font_picker](/design-tokens/typography-and-font-picker/) |
| Variant | One specific, purchasable combination of a product's options — see [5.1. product, variant & collection](/global-objects/product-variant-and-collection/) |
| Web Component | A native, framework-free custom HTML element with its own JavaScript behavior — see [11.2. Web Components for Theme Behavior](/javascript-in-shopify-themes/web-components-for-theme-behavior/) |
| Whitespace control | The `-` syntax (`{%- -%}`) trimming blank space a tag would otherwise leave behind — see [4.5. Whitespace Control](/liquid-basics/whitespace-control/) |

## Further reading

- [Shopify glossary](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
