---
title: CSS in Shopify Themes
description: The two ways CSS gets into a theme, keeping styles from colliding, and writing CSS that holds up across screen sizes and languages.
---

**TL;DR:** The two ways CSS gets into a theme, keeping styles from colliding, and writing CSS that holds up across screen sizes and languages.

You've written `{% stylesheet %}` blocks since [What Is a Section?](/sections-blocks-snippets/what-is-a-section/), and used `@media` queries since [Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) — this chapter explains the mechanics underneath both, and introduces the handful of CSS-specific concerns that matter more in a theme than in a typical standalone website.

## What's in this section

| Page | Answers |
|---|---|
| [`{% stylesheet %}` and `{% style %}`](/css-in-shopify-themes/stylesheet-and-style-tags/) | The real difference between the two — including the fact that explains the CSS-variable pattern from earlier chapters |
| [Naming & Scoping](/css-in-shopify-themes/naming-and-scoping/) | Why `{% stylesheet %}` doesn't actually isolate your CSS, and what to do about it |
| [Responsive & Logical Properties](/css-in-shopify-themes/responsive-and-logical-properties/) | The breakpoint convention used throughout this site, and writing CSS that still works in a right-to-left language |

## Further reading

- [CSS in themes](https://shopify.dev/docs/storefronts/themes/architecture/css) (shopify.dev)
