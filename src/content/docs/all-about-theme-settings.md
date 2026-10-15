---
title: All About Theme Settings
description: What's truly global, what's per-instance content, where each one is actually stored, and complete, real-world example files for every piece.
---

**TL;DR:** What's truly global, what's per-instance content, where each one is actually stored, and complete, real-world example files for every piece.

This chapter is a complete, standalone reference on theme settings — it starts from zero and builds all the way up to full, copy-pasteable example files, so it works whether this is the first page you've ever read on this site or the fiftieth. It assumes you know HTML, CSS, and JavaScript, same as the rest of this site, but nothing Shopify-specific beyond that.

## What's in this chapter

| Page | Answers |
|---|---|
| [28.1. Theme Settings Fundamentals](/all-about-theme-settings/theme-settings-fundamentals/) | "Theme settings" vs. a section's or block's own settings — two genuinely different things that use similar-looking schema |
| [28.2. Where Global Settings Data Actually Lives](/all-about-theme-settings/where-global-settings-data-lives/) | `settings_schema.json` vs. `settings_data.json`, the `current`/`presets` keys, and exactly where everything else is stored instead |
| [28.3. A Complete settings_schema.json Example](/all-about-theme-settings/a-complete-settings-schema-example/) | A full, realistic global settings file, every category wired together |
| [28.4. A Complete settings_data.json Example](/all-about-theme-settings/a-complete-settings-data-example/) | The matching data file for the schema above, showing exactly what Shopify writes |
| [28.5. A Complete Template Example](/all-about-theme-settings/a-complete-template-example/) | A full JSON template, showing exactly where section and block settings live instead |
| [28.6. A Complete Locale File Example](/all-about-theme-settings/a-complete-locale-file-example/) | A full `en.default.json` / `en.default.schema.json` pair, both tiers working together |

## Further reading

- [Global theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/global) (shopify.dev)
