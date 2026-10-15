---
title: All About Buttons
description: Everything a button needs beyond its visual style — the right element, every interactive state, an accessible loading state, and settings-driven variants.
---

**TL;DR:** Everything a button needs beyond its visual style — the right element, every interactive state, an accessible loading state, and settings-driven variants.

This chapter is a complete, standalone reference on buttons in Shopify themes — it starts from which HTML element a button actually should be, and builds up to a real, working add-to-cart button combining every concept along the way. Several pages quote Horizon's real, current source directly, verified fresh rather than reconstructed from memory.

## What's in this chapter

| Page | Answers |
|---|---|
| [36.1. Button Fundamentals](/all-about-buttons/button-fundamentals/) | Which HTML element a button actually is underneath, and why that choice matters more than how it's styled |
| [36.2. Button Variants](/all-about-buttons/button-variants/) | Primary, secondary, text, and custom — a small, named set of button styles, not an unbounded one |
| [36.3. Interactive States](/all-about-buttons/interactive-states/) | Hover, focus, active, and disabled — including a real, automatic way to compute a readable hover color |
| [36.4. Accessible Loading & Busy States](/all-about-buttons/accessible-loading-and-busy-states/) | What has to happen, beyond just showing a spinner, while a button's action is still in flight |
| [36.5. Sizing & Icon+Text Composition](/all-about-buttons/sizing-and-icon-text-composition/) | Why button width is a different setting pattern from section padding, plus how an icon and label actually share one button |
| [36.6. Settings-Driven Styling in Depth](/all-about-buttons/settings-driven-styling-in-depth/) | Two real layers — theme-wide base styles and a per-block override — and the tokens that connect them |
| [36.7. A Complete Example](/all-about-buttons/a-complete-example/) | A real add-to-cart button combining a variant, every state, a loading state, and an icon into one working whole |

## Further reading

- [`blocks/button.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/blocks/button.liquid)
- [WAI-ARIA Authoring Practices: Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [8.1. The Product Form](/forms/the-product-form/)
