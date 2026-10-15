---
title: Schema & Settings
description: Every setting type, presets and defaults, the two settings files, conditional visibility, and translation keys.
---

**TL;DR:** Every setting type, presets and defaults, the two settings files, conditional visibility, and translation keys.

You've already written a `{% schema %}` block in nearly every example since [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/) — a `settings` array, a `presets` array, a handful of setting types like `text` and `url`. This chapter goes deeper: every setting type actually available, how presets and defaults interact, the two different files involved in global settings, showing or hiding a setting conditionally, and why every piece of schema text should be a translation key rather than a hardcoded string.

## What's in this section

| Page | Answers |
|---|---|
| [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/) | The full catalog of setting types, grouped by what they're for |
| [6.2. Presets & Defaults](/schema-and-settings/presets-and-defaults/) | The difference between a setting's `default` and a schema's `presets`, and how they interact |
| [6.3. settings_schema.json & settings_data.json](/schema-and-settings/settings-schema-and-settings-data/) | The two files behind global theme settings, and a common misconception about what each one stores |
| [6.4. Conditional Settings](/schema-and-settings/conditional-settings/) | Showing or hiding a setting based on another setting's value |
| [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) | The two kinds of locale file, and why schema text should never be hardcoded |

## Further reading

- [Settings reference](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
