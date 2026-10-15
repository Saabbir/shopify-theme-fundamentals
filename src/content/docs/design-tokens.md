---
title: "Design Tokens: Color, Type & Spacing"
description: Turning merchant-facing settings for color, type, and spacing into a consistent design system in code.
---

**TL;DR:** Turning merchant-facing settings for color, type, and spacing into a consistent design system in code.

A **design token** is just a named, reusable value — a specific color, a specific spacing amount, a specific font — used consistently everywhere that value is needed, instead of the same color or pixel value typed out fresh in a dozen different files. This chapter covers the three places tokens show up constantly in a Shopify theme (color, typography, spacing), and the one technique that ties all of them together in code: turning a setting into a CSS custom property.

## What's in this section

| Page | Answers |
|---|---|
| [7.1. Color Settings & Color Schemes](/design-tokens/color-settings-and-color-schemes/) | `color_scheme_group`, and why bundling related colors beats standalone ones |
| [7.2. Typography & font_picker](/design-tokens/typography-and-font-picker/) | Loading a merchant-chosen font correctly, and the idea of a type scale |
| [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) | A consistent spacing scale, and handling mobile separately without breaking live preview |
| [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/) | The inline custom-property pattern, and why it's the only approach that keeps the theme editor's live preview working |

## Further reading

- [Settings reference](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
