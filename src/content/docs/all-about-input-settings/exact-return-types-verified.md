---
title: "Exact Return Types, Verified"
description: select and radio return a value, never a label — and a handful of other exact-type gotchas worth confirming once and remembering.
---

**TL;DR:** `select` and `radio` return a `value`, never a `label` — and a handful of other exact-type gotchas worth confirming once and remembering.

[Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/) introduces the full catalog; this page is specifically about the exact Liquid return type for each one, including the mistakes that come from assuming rather than checking.

## `select`/`radio`: the `value`, never the `label`

```json
{
  "type": "select",
  "id": "layout",
  "options": [
    { "value": "two_col", "label": "t:options.two_column" },
    { "value": "three_col", "label": "t:options.three_column" }
  ],
  "default": "two_col"
}
```

```liquid
{{ section.settings.layout }}
{% comment %} → "two_col" — the value, never "Two Column" or its translated label {% endcomment %}
```

This is the single most common mistake with `select`/`radio`: `section.settings.layout` is always the `value` string a developer chose when writing the schema — it has no connection to whatever `label` (which may be a translated `t:` key) a merchant actually sees on screen. Comparing against the `label` text, or against a translated string, in an `{% if %}` always fails silently for any locale other than the one the developer happened to test in.

## `checkbox`: a real boolean, not a string

```liquid
{% if section.settings.show_vendor %}
```

`checkbox` returns an actual Liquid boolean (`true`/`false`), which is why checking it with a plain `{% if %}` works directly — there's no need to compare against the string `"true"`, and doing so would actually evaluate as truthy regardless of the checkbox's real state, since any non-empty string is truthy in Liquid.

## `range`/`number`: both numbers, but `range` is clamped, `number` isn't

```liquid
{{ section.settings.columns }}
{% comment %} Always within min/max for a range setting — Shopify enforces the clamp in the editor's own UI {% endcomment %}
```

Both return a plain number, but only `range` is actually constrained to stay within its declared `min`/`max` — the editor's own slider UI makes a value outside that range impossible to enter in the first place. A `number` setting has no such constraint; a merchant can type literally anything, including a negative number or an absurdly large one, which is the real reason [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/) recommends `range` whenever a sensible bound exists.

## `richtext`/`inline_richtext`: real HTML, never escape it

```liquid
{{ section.settings.body }}
{% comment %} Correct — renders the actual formatting {% endcomment %}

{{ section.settings.body | escape }}
{% comment %} Wrong — a merchant's bold text and links show up as literal <strong> and <a> tags on the page {% endcomment %}
```

`richtext`/`inline_richtext` already return safe, Shopify-sanitized HTML — the one real mistake is running it through `escape`, which turns real formatting into visible markup tags rather than rendered bold text or links. This is the inverse of the usual security instinct (escape everything from an uncontrolled source) — these are specifically exceptions, since Shopify itself already sanitizes what the rich text editor can produce.

## `color`: a string, but not guaranteed to be a hex code

```liquid
{{ section.settings.accent_color }}
{% comment %} Could be "#2c6e5c", "rgba(44, 110, 94, 0.5)", or empty if a merchant cleared the picker {% endcomment %}
```

A `color` setting with no `default` and no value chosen returns an empty string, not a sensible fallback color — always provide a real `default`, or guard with `| default:` in Liquid, rather than assuming a color setting always has a usable value.

## Key takeaways

- `select`/`radio` always return the `value`, never the `label` — comparing against translated label text in an `{% if %}` is a real, common bug.
- `checkbox` returns a genuine Liquid boolean, safe to check directly with `{% if %}`; a `range`/`number` both return plain numbers, but only `range` is actually bounded by the editor's own UI.
- `richtext`/`inline_richtext` are the exception to "always escape external content" — they return pre-sanitized HTML that should be output directly.
- `color` can return an empty string if no default was set and a merchant cleared the picker — always give it a real default.

## Further reading

- [Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)
- [Resource Pickers: Full Objects, Not IDs](/all-about-input-settings/resource-pickers-full-objects-not-ids/)
- [Input settings (shopify.dev)](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
