---
title: Liquid Filter Reference
description: A broader, categorized filter list beyond the "common" set from earlier.
---

**TL;DR:** A broader, categorized filter list beyond the "common" set from earlier.

[4.7. Common Filters by Category](/liquid-basics/common-filters-by-category/) covered the filters you'll use constantly. This page is wider, not deeper — more filters, in the same categories, with no re-explanation of syntax covered in [4.6. Filters: An Overview](/liquid-basics/filters-an-overview/). Not exhaustive — see [Shopify's own filter reference](https://shopify.dev/docs/api/liquid/filters) for the complete, current list.

## String

| Filter | Does |
|---|---|
| `upcase` / `downcase` | Converts case |
| `capitalize` | Capitalizes the first character |
| `strip` / `lstrip` / `rstrip` | Removes whitespace from both ends / the start / the end |
| `strip_html` | Removes HTML tags, keeping the text |
| `strip_newlines` | Removes line breaks |
| `newline_to_br` | Converts line breaks into `<br>` tags |
| `append` / `prepend` | Adds a string to the end / start |
| `remove` / `remove_first` | Removes all (or just the first) occurrence of a substring |
| `replace` / `replace_first` | Replaces all (or just the first) occurrence of a substring |
| `split` | Splits a string into an array, on a given separator |
| `truncate` | Shortens a string to a max length, adding `...` |
| `truncatewords` | Shortens a string to a max number of words |
| `escape` | Escapes HTML special characters — use on anything user- or merchant-entered going into an attribute |
| `escape_once` | Like `escape`, but doesn't double-escape a string already partly escaped |
| `url_encode` / `url_decode` | Encodes/decodes a string for safe use in a URL |
| `handle` / `handleize` | Converts a string into a URL-safe "handle" (lowercase, hyphenated) |
| `pluralize` | Picks a singular or plural word based on a count |
| `slice` | Extracts a substring (or array subset) by position |

## Array

| Filter | Does |
|---|---|
| `first` / `last` | The first / last item |
| `size` | The number of items (also works on strings, for character count) |
| `join` | Combines items into one string, with a separator |
| `sort` / `sort_natural` | Sorts an array — `sort_natural` is case-insensitive |
| `reverse` | Reverses the order |
| `uniq` | Removes duplicate items |
| `map` | Extracts one property from every item, returning an array of just that property |
| `where` | Filters an array down to items matching a condition |
| `compact` | Removes `nil` items from an array |
| `concat` | Combines two arrays into one |

## Math

| Filter | Does |
|---|---|
| `plus` / `minus` / `times` / `divided_by` | Basic arithmetic |
| `modulo` | Remainder of a division |
| `round` / `ceil` / `floor` | Rounds to nearest / up / down |
| `abs` | Absolute value |
| `at_most` / `at_least` | Clamps a number to a maximum / minimum |

## Color

| Filter | Does |
|---|---|
| `color_to_rgb` / `color_to_hsl` | Converts a color to a different format |
| `color_lighten` / `color_darken` | Adjusts lightness |
| `color_saturate` / `color_desaturate` | Adjusts saturation |
| `color_mix` | Blends two colors together |
| `color_contrast` | Calculates the contrast ratio between two colors |
| `color_extract` | Pulls one channel (e.g. just the red value) from a color |
| `color_modify` | Changes one specific part of a color (e.g. just its alpha) |

## Money, dates, and formatting

| Filter | Does |
|---|---|
| `money` | Formats a number as a price, using the shop's currency settings |
| `money_with_currency` | Like `money`, but includes the currency code |
| `money_without_trailing_zeros` | Like `money`, but omits `.00` for whole amounts |
| `date` | Formats a date/time string |
| `json` | Converts a value to a JSON string — useful for debugging, covered in [4.8. Debugging Liquid](/liquid-basics/debugging-liquid/) |
| `weight_with_unit` | Formats a weight value with its unit |

## Media, assets, and URLs

| Filter | Does |
|---|---|
| `asset_url` | Builds a URL to a file in `assets/` |
| `image_url` | Builds a resized image URL |
| `video_tag` / `external_video_tag` / `model_viewer_tag` | Render uploaded video, external video, and 3D models — see [12.2. Video & 3D Media](/media-and-assets/video-and-3d-media/) |
| `font_face` / `font_modify` | Loads a font, or returns a modified variant of it — see [7.2. Typography & font_picker](/design-tokens/typography-and-font-picker/) |
| `link_to` | Builds a full `<a>` tag from a URL and label |
| `stylesheet_tag` / `script_tag` | Build a `<link>`/`<script>` tag from a URL |

## Default and translation

| Filter | Does |
|---|---|
| `default` | Supplies a fallback value when the input is `nil`, `false`, or blank |
| `t` | Looks up a storefront translation key — see [6.5. Locale Files & Translation Keys](/schema-and-settings/locale-files-and-translation-keys/) |

## Further reading

- [Full filter reference](https://shopify.dev/docs/api/liquid/filters) (shopify.dev)
