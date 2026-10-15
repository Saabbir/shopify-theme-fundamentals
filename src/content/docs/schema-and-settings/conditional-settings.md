---
title: Conditional Settings
description: "Showing or hiding a setting based on another setting's value, with visible_if."
---

**TL;DR:** Showing or hiding a setting based on another setting's value, with `visible_if`.

Some settings only make sense in combination with another one. A "custom color" setting is pointless to show if a merchant has chosen a preset color scheme instead of "custom" — `visible_if` lets you hide it until it's actually relevant.

## The basic pattern

```json
{
  "type": "select",
  "id": "background_style",
  "label": "t:labels.background_style",
  "options": [
    { "value": "preset", "label": "t:options.preset" },
    { "value": "custom", "label": "t:options.custom" }
  ],
  "default": "preset"
},
{
  "type": "color",
  "id": "custom_background_color",
  "label": "t:labels.custom_background_color",
  "visible_if": "{{ section.settings.background_style == 'custom' }}"
}
```

`custom_background_color` only appears in the theme editor once a merchant has set `background_style` to `"custom"`. Before that, it's hidden entirely — not just disabled or grayed out.

## The syntax is a Liquid expression, as a string

`visible_if`'s value is a string containing an actual Liquid condition, referencing the current scope — `section.settings.*` inside a section, `block.settings.*` inside a block. It supports the same comparison operators covered in [4.3. Operators & Conditionals](/liquid-basics/operators-and-conditionals/):

```json
"visible_if": "{{ section.settings.layout == 'grid' and section.settings.show_filters }}"
```

## What it can and can't check

`visible_if` can only reference **other settings in the same section or block** — it can't check something unrelated, like how many blocks have been added, or a global theme setting, or anything about the current page. If the condition needs information from outside that one schema's own settings, `visible_if` isn't the right tool for it.

:::tip[Use it to simplify the editor, not to replace a default]
`visible_if` hides a setting from view — it doesn't stop that setting from still having whatever value it last held (or its `default`) even while hidden. Don't rely on a setting being hidden as a substitute for checking its value in your Liquid logic; still guard against it in your markup the normal way, the same as any other setting.
:::

## Key takeaways

- `visible_if` takes a Liquid condition as a string, referencing settings in the same scope (`section.settings.*` or `block.settings.*`).
- It can only reference other settings in that same section/block — not block counts, global settings, or page context.
- Hiding a setting in the editor doesn't clear its stored value — your Liquid logic should still check it normally, not assume "hidden" means "unset."

## Further reading

- [Conditional settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/conditional-settings) (shopify.dev)
