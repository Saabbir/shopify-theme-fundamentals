---
title: All About Global Objects
description: Every major Liquid global object in depth — what each one actually contains, and exactly where each one is and isn't populated.
---

**TL;DR:** Every major Liquid global object in depth — what each one actually contains, and exactly where each one is and isn't populated.

This chapter is a complete, standalone reference on Shopify's Liquid global objects — it starts from what a global object even is and builds all the way up to the objects most themes barely touch (`predictive_search`, `metaobjects`, `localization`). It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## What's in this chapter

| Page | Answers |
|---|---|
| [31.1. Global Object Fundamentals](/all-about-global-objects/global-object-fundamentals/) | What makes an object "global," why every one of them is read-only, and the one habit that prevents most real bugs involving them |
| [31.2. product, variant & collection in Full](/all-about-global-objects/product-variant-and-collection-in-full/) | Every property worth knowing on the three objects nearly every storefront page touches |
| [31.3. cart, customer & shop in Full](/all-about-global-objects/cart-customer-and-shop-in-full/) | The one object guaranteed to exist everywhere, the one that's `nil` for every logged-out shopper, and the one describing the store itself |
| [31.4. settings, section & block in Full](/all-about-global-objects/settings-section-and-block-in-full/) | The three objects connecting a merchant's schema choices back to the Liquid that renders them |
| [31.5. request, routes, localization & Metafield Access Patterns](/all-about-global-objects/request-routes-localization-and-metafields/) | The current request, generating correct URLs, and connecting custom data back into Liquid |
| [31.6. search, predictive_search & recommendations](/all-about-global-objects/search-predictive-search-and-recommendations/) | The three objects that only return real data under specific rendering conditions |
| [31.7. Which Objects Exist on Which Template](/all-about-global-objects/which-objects-exist-on-which-template/) | A practical reference table for the single most common source of a silent, unexplained `nil` |
| [31.8. A Complete Example](/all-about-global-objects/a-complete-example/) | A header utility bar combining several objects, rendered safely from every template at once |

## Further reading

- [Liquid objects overview](https://shopify.dev/docs/api/liquid/objects) (shopify.dev)
- [5. Shopify's Global Objects](/global-objects/) — this chapter's Part 1 introduction, covering the same ground at a first-time-reader's pace
