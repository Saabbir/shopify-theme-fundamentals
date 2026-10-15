---
title: All About Input Settings
description: A deep-dive companion to Section & Block Settings' intro-level enumeration — exact return types, resource pickers, default-value requirements, and deleted-resource behavior.
---

**TL;DR:** A deep-dive companion to Section & Block Settings' intro-level enumeration — exact return types, resource pickers, default-value requirements, and deleted-resource behavior.

This chapter is a complete, standalone reference on input settings in a Shopify theme — it starts from zero and builds all the way up to advanced territory, so it works whether this is the first page you've ever read on this site or the fiftieth. [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/) in Part 1 catalogs every type by purpose; this chapter goes deeper into the exact Liquid return value for each, the real validation gotchas Theme Check actually catches, and what happens once a referenced resource stops existing.

## What's in this chapter

| Page | Answers |
|---|---|
| [40.1. Exact Return Types, Verified](/all-about-input-settings/exact-return-types-verified/) | `select`/`radio` return a `value`, never a `label`; `checkbox` is a real boolean; `richtext` is the exception to always-escape |
| [40.2. Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/) | Every picker returns the real object directly — and none of them support a schema-level `default` |
| [40.3. Default-Value Requirements & Validation Gotchas](/all-about-input-settings/default-value-requirements-and-validation-gotchas/) | A `range` default outside its own bounds, missing locale keys, and what a real `presets` entry still needs |
| [40.4. What Happens When a Referenced Resource Is Deleted](/all-about-input-settings/what-happens-when-a-referenced-resource-is-deleted/) | The setting silently returns to `nil` — no error, no editor warning, no distinct "deleted" state |
| [40.5. A Complete Example](/all-about-input-settings/a-complete-example/) | One section's schema and Liquid exercising every gotcha above at once |

## Further reading

- [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)
- [Input settings (shopify.dev)](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
- [Theme Check (shopify.dev)](https://shopify.dev/docs/storefronts/themes/tools/theme-check)
