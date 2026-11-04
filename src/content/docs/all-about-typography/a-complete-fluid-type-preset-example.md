---
title: A Complete Fluid Type Preset Example
description: Generating a font-size preset for every heading level from a loop (and the manual alternative), converting a px setting to rem, and deriving a clamp() fluid scale from desktop and mobile font-size settings instead of picking one by hand.
---

**TL;DR:** Generating a font-size preset for every heading level from a loop (and the manual alternative), converting a px setting to rem, and deriving a `clamp()` fluid scale from desktop and mobile font-size settings instead of picking one by hand.

[18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) covers `clamp()`'s mechanics using hand-picked values. [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) covers the real decisions behind a preset system, and notes that Horizon's own sizes are *computed*, not hand-picked. This page is the missing piece between the two: a complete, worked example that starts from two merchant-facing settings — a desktop size and a mobile size, both in `px` — and derives everything else (the `rem` conversion, the `clamp()` formula, and the preset itself) from them, for every heading level plus paragraph text.

:::note[A generic, from-scratch example — not a copy of any real theme]
Everything on this page is an original teaching example, built to show the *mechanism* clearly, the same as [18.17. A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/). It isn't a copy of Horizon's, Dawn's, or any other real theme's actual formula. [18.11's case study](/all-about-typography/type-presets-and-building-a-complete-type-system/#case-study-how-horizon-built-its-type-system) and [27.4. Horizon's Typography System by the Numbers](/horizon-codebase-tour/horizons-typography-system-by-the-numbers/) cover what Horizon's real, shipped computation actually does.
:::

## The settings this example depends on

Two `range` settings per level — a desktop size and a mobile size, both in `px`, following the same property-first naming and desktop/mobile-suffix pattern [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) uses for padding, and [18.14. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/#naming-a-per-role-size-weight-or-spacing-setting) establishes for `type_size_h1`:

```json
{
  "name": "t:settings.typography",
  "settings": [
    { "type": "range", "id": "type_size_h1", "label": "t:labels.h1_size", "min": 28, "max": 96, "step": 2, "unit": "px", "default": 56 },
    { "type": "range", "id": "type_size_h1_mobile", "label": "t:labels.h1_size_mobile", "min": 20, "max": 56, "step": 2, "unit": "px", "default": 32 },

    { "type": "range", "id": "type_size_paragraph", "label": "t:labels.paragraph_size", "min": 14, "max": 20, "step": 1, "unit": "px", "default": 16 },
    { "type": "range", "id": "type_size_paragraph_mobile", "label": "t:labels.paragraph_size_mobile", "min": 14, "max": 18, "step": 1, "unit": "px", "default": 16 }
  ]
}
```

The same pattern repeats for `h2` through `h6` — fourteen settings in total (a desktop and a mobile size for each of seven levels), each pair following the exact shape shown above for `h1`. These are all **theme-wide** settings, read back as `settings.type_size_h1`, `settings.type_size_h1_mobile`, and so on.

## Converting a px setting to rem

A `range` setting with `unit: "px"` always hands back a plain number — `56`, not `"56px"` — so converting it to `rem` is ordinary division, not string manipulation:

```liquid
{% liquid
  assign root_font_size = 16.0
  assign desktop_rem = settings.type_size_h1 | divided_by: root_font_size
%}
{{ desktop_rem }}
{% # => 3.5 %}
```

:::caution[The divisor has to be a float, or Liquid does integer division]
Shopify's own [`divided_by` filter reference](https://shopify.dev/docs/api/liquid/filters/divided_by) is explicit about this: "the `divided_by` filter produces a result of the same type as the divisor" — divide by a plain integer and you get an integer result back, silently truncated, not the decimal value you actually wanted. `{{ 56 | divided_by: 16 }}` returns `3`, not `3.5`. Writing the divisor as `16.0` instead of `16` (as above) is what forces a float result. This is the single most common mistake in a px-to-rem conversion — it doesn't error, it just quietly produces a slightly wrong, truncated size.
:::

`16.0` assumes the default, unmodified browser root font-size. If a theme's own CSS sets `html { font-size: 62.5%; }` — a common trick some themes use specifically to make `rem` math easier, since it makes `1rem` equal `10px` instead of `16px` — divide by `10.0` instead, matching whatever that theme's own root actually resolves to. [29.2. Modern CSS Units](/all-about-css/modern-css-units/#rem-vs-em-vs-px-what-each-is-actually-relative-to) covers what `rem` is relative to in full; this page assumes that explanation and just needs the right divisor for the theme it's running in.

## Deriving a `clamp()` fluid scale from two settings, instead of picking one by hand

[18.10](/all-about-typography/fluid-type-scales-in-depth/) picks a `clamp()`'s three values by eye, checking how a size looks at a 375px and a 1920px viewport. This section does the same thing programmatically: given a mobile size and a desktop size (both already converted to `rem`), compute the exact `clamp()` that passes through both of them, at those same two viewport widths.

```liquid
{% liquid
  assign root_font_size = 16.0
  assign min_viewport = 375
  assign max_viewport = 1920

  assign mobile_rem = settings.type_size_h1_mobile | divided_by: root_font_size | round: 4
  assign desktop_rem = settings.type_size_h1 | divided_by: root_font_size | round: 4

  assign rem_difference = desktop_rem | minus: mobile_rem
  assign viewport_difference = max_viewport | minus: min_viewport
  assign slope = rem_difference | divided_by: viewport_difference

  assign vw_coefficient = slope | times: 100 | round: 4
  assign intercept_px = slope | times: min_viewport
  assign intercept_rem = mobile_rem | minus: intercept_px | round: 4
%}
--type-preset-h1-font-size: clamp({{ mobile_rem }}rem, {{ intercept_rem }}rem + {{ vw_coefficient }}vw, {{ desktop_rem }}rem);
{% # With the defaults above (56px desktop, 32px mobile), this renders:
   # --type-preset-h1-font-size: clamp(2rem, 1.6359rem + 0.0971vw, 3.5rem); %}
```

The math behind it, in plain terms: `slope` is how many `rem` the size should grow for every one pixel the viewport widens — the straight line connecting "`mobile_rem` at `min_viewport`" to "`desktop_rem` at `max_viewport`." `vw_coefficient` turns that per-pixel slope into a `vw`-based CSS value (multiplying by 100, since `1vw` is 1% of the viewport width). `intercept_rem` is where that same line would sit at a viewport width of zero — it's frequently a smaller number than `mobile_rem`, or even negative, and that's expected: it's a mathematical anchor point for the formula, not a size anything actually renders at, because `clamp()`'s own `min` argument (`mobile_rem`) stops the value from ever going below the real minimum. Plug in `min_viewport` or `max_viewport` for the viewport width and the formula lands exactly on `mobile_rem` or `desktop_rem` — that's what "passes through both settings exactly" means concretely.

:::tip[Skip clamp() entirely when the two sizes are equal]
Per [18.10's own advice](/all-about-typography/fluid-type-scales-in-depth/#a-full-scale-across-every-heading-level) — reserve `clamp()` for sizes that actually benefit from scaling — a level where a merchant set the same desktop and mobile size doesn't need a fluid formula at all. Check for that case before computing the clamp, and fall back to a plain value:

```liquid
{% if desktop_rem == mobile_rem %}
  --type-preset-paragraph-font-size: {{ desktop_rem }}rem;
{% else %}
  {% # ...the slope/intercept math above, for this level %}
{% endif %}
```

This mirrors what [18.11's case study](/all-about-typography/type-presets-and-building-a-complete-type-system/#case-study-how-horizon-built-its-type-system) says Horizon's own real system does — skip `clamp()` below a size cutoff — just driven by a settings comparison instead of a fixed cutoff value.
:::

## Generating every preset by hand, one block at a time

The most direct way to produce all seven presets is to simply repeat the block above, once per level, each one referencing its own pair of settings explicitly:

```liquid
{% liquid
  assign root_font_size = 16.0
  assign min_viewport = 375
  assign max_viewport = 1920
  assign viewport_difference = max_viewport | minus: min_viewport
%}
{% style %}
  :root {
    {% liquid
      assign h1_mobile_rem = settings.type_size_h1_mobile | divided_by: root_font_size | round: 4
      assign h1_desktop_rem = settings.type_size_h1 | divided_by: root_font_size | round: 4
      assign h1_slope = h1_desktop_rem | minus: h1_mobile_rem | divided_by: viewport_difference
      assign h1_vw = h1_slope | times: 100 | round: 4
      assign h1_slope_at_min_viewport = h1_slope | times: min_viewport
      assign h1_intercept = h1_mobile_rem | minus: h1_slope_at_min_viewport | round: 4
    %}
    --type-preset-h1-font-size: clamp({{ h1_mobile_rem }}rem, {{ h1_intercept }}rem + {{ h1_vw }}vw, {{ h1_desktop_rem }}rem);

    {% liquid
      assign h2_mobile_rem = settings.type_size_h2_mobile | divided_by: root_font_size | round: 4
      assign h2_desktop_rem = settings.type_size_h2 | divided_by: root_font_size | round: 4
      assign h2_slope = h2_desktop_rem | minus: h2_mobile_rem | divided_by: viewport_difference
      assign h2_vw = h2_slope | times: 100 | round: 4
      assign h2_slope_at_min_viewport = h2_slope | times: min_viewport
      assign h2_intercept = h2_mobile_rem | minus: h2_slope_at_min_viewport | round: 4
    %}
    --type-preset-h2-font-size: clamp({{ h2_mobile_rem }}rem, {{ h2_intercept }}rem + {{ h2_vw }}vw, {{ h2_desktop_rem }}rem);

    {% # ...and the same five-line block again for h3, h4, h5, h6, and paragraph %}
  }
{% endstyle %}
```

This is verbose — seven nearly-identical blocks, each one only differing by which level's settings it reads — but every line is a literal reference to a literal setting. Searching the file for `type_size_h3` finds exactly the block that uses it, with nothing to trace through. For a theme with a small, fixed number of levels that rarely changes, this directness is a real, legitimate reason to prefer it over the loop below — some teams deliberately favor this kind of readable duplication over a cleverer abstraction, and seven repeated blocks is a reasonable amount of duplication to accept for the clarity it buys.

## Generating every preset with a loop over an array, instead

The alternative is to list every level once, as a comma-separated string split into an array, and loop over it — building each setting's `id` as a string, then looking it up dynamically with square-bracket notation instead of writing `settings.type_size_h1` literally:

```liquid
{% liquid
  assign levels = "paragraph, h1, h2, h3, h4, h5, h6" | split: ", "
  assign root_font_size = 16.0
  assign min_viewport = 375
  assign max_viewport = 1920
  assign viewport_difference = max_viewport | minus: min_viewport
%}
{% style %}
  :root {
    {% for level in levels %}
      {% liquid
        capture desktop_setting_id
          echo 'type_size_'
          echo level
        endcapture
        capture mobile_setting_id
          echo desktop_setting_id
          echo '_mobile'
        endcapture

        assign desktop_rem = settings[desktop_setting_id] | divided_by: root_font_size | round: 4
        assign mobile_rem = settings[mobile_setting_id] | divided_by: root_font_size | round: 4
      %}
      --type-preset-{{ level }}-font-size:
      {%- if desktop_rem == mobile_rem %}
        {{ mobile_rem }}rem;
      {%- else %}
        {% liquid
          assign slope = desktop_rem | minus: mobile_rem | divided_by: viewport_difference
          assign vw_coefficient = slope | times: 100 | round: 4
          assign slope_at_min_viewport = slope | times: min_viewport
          assign intercept_rem = mobile_rem | minus: slope_at_min_viewport | round: 4
        %}
        clamp({{ mobile_rem }}rem, {{ intercept_rem }}rem + {{ vw_coefficient }}vw, {{ desktop_rem }}rem);
      {%- endif %}
    {% endfor %}
  }
{% endstyle %}
```

`settings[desktop_setting_id]` is the one piece worth slowing down on: `desktop_setting_id` is a plain Liquid string (`"type_size_h1"`, built by the `capture` block above from `level`), and square-bracket notation on `settings` accepts a variable holding a handle, not just a literal string in quotes — [Shopify's own Liquid basics reference](https://shopify.dev/docs/api/liquid/basics#referencing-handles) confirms this directly, and that a setting's handle always comes from its own `id`. That's what makes `settings[desktop_setting_id]` equivalent to writing `settings.type_size_h1` by hand, just computed instead of typed.

This version is roughly a quarter the length of the manual one above, and adding an eighth level later means adding one word to the `levels` string, not a new five-line block. The trade-off runs the other way from the manual version: nothing in the file literally says `type_size_h1` anywhere, so finding exactly where that setting is read means mentally tracing the loop and the `capture` logic, rather than finding it with a plain text search.

:::note[Neither version is "more correct" — same trade-off as 18.11's Decision 3]
This is the same kind of fork [18.11's Decision 3](/all-about-typography/type-presets-and-building-a-complete-type-system/#decision-3-fixed-values-or-merchant-configurable-per-level-settings) describes for presets generally: more directness and less to trace through, versus less repetition and more to hold in your head at once. A theme with a fixed, small set of levels that rarely changes reads more clearly written out by hand; a theme where the set of levels might grow, or where seven near-identical blocks have already started drifting out of sync with each other, is exactly when the loop earns its keep. Pick based on which failure mode — "this file is long and repetitive" or "I can't grep for this setting" — is the one that actually bothers the next person touching the file.
:::

## Key takeaways

- A `range` setting with `unit: "px"` returns a plain number. Converting it to `rem` is `divided_by` the root font-size as a **float** (`16.0`, not `16`) — dividing by an integer silently truncates the result instead of erroring.
- A `clamp()` that passes exactly through a mobile size and a desktop size at two specific viewport widths can be derived with a slope/intercept calculation, instead of picked by eye — the same idea [18.11's case study](/all-about-typography/type-presets-and-building-a-complete-type-system/#case-study-how-horizon-built-its-type-system) says Horizon's real system does.
- Skip `clamp()` and output a plain `rem` value when a level's desktop and mobile settings are equal — there's nothing to scale, and a fixed value is simpler and exactly as correct.
- Writing one explicit block per level is more verbose but directly greppable; looping over a split array and looking up each setting dynamically with `settings[string_variable]` is far shorter but requires tracing the loop to find where one specific setting is used. Neither is the default-correct choice — it depends on how many levels a theme has and how often that set changes.
- `settings[a_string_variable]` is standard, documented Liquid square-bracket notation — not a trick specific to this pattern — confirmed directly against Shopify's own Liquid basics reference.

## Built-in reference

**Filters used on this page**

| Filter | Purpose |
|---|---|
| `divided_by` | Converts a `px` setting value to `rem`; must divide by a float to avoid integer truncation |
| `minus` / `times` | The slope/intercept arithmetic behind a derived `clamp()` |
| `round` | Keeps the computed `rem` and `vw` values to a sane number of decimal places |
| `split` | Turns `"paragraph, h1, h2, h3, h4, h5, h6"` into an array to loop over |

**Liquid tags used on this page**

| Tag | Purpose |
|---|---|
| `{% liquid %}...{% endliquid %}` (implicit, via line-by-line tags) | Multiple `assign` statements without repeating `{% %}` on every line |
| `{% for %}...{% endfor %}` | Loops over the `levels` array |
| `{% capture %}...{% endcapture %}` | Builds a setting's `id` as a string, for the dynamic-lookup version |
| `{% style %}...{% endstyle %}` | Outputs the generated custom properties as a `<style>` block |

**Liquid syntax referenced**

| Syntax | Returns | Notes |
|---|---|---|
| `settings[a_string_variable]` | Whatever that setting's handle resolves to | Square-bracket notation; the string variable must match a real setting `id` exactly |

## Naming conventions

| What you're naming | Convention | Example |
|---|---|---|
| Desktop per-level size setting | `type_size_{level}` | `type_size_h1` |
| Mobile per-level size setting | `type_size_{level}_mobile` | `type_size_h1_mobile` |
| Array variable driving the loop | Plural, descriptive | `levels` |
| Captured dynamic setting-id variable | `{property}_setting_id` | `desktop_setting_id` |

## Further reading

- [18.10. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) — `clamp()` mechanics, and choosing min/max values by eye
- [18.11. Type Presets & Building a Complete Type System](/all-about-typography/type-presets-and-building-a-complete-type-system/) — the full preset-design decisions this page's `font-size` example fits into
- [29.2. Modern CSS Units: rem, em, px & Viewport Units](/all-about-css/modern-css-units/) — what `rem` is relative to, and when `clamp()` is the right call at all
- [18.14. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/) — the `type_size_{level}` pattern this page's settings follow
- [18.17. A Complete Design Tokens Example](/all-about-typography/a-complete-design-tokens-example/) — the same from-scratch, non-real-theme teaching approach, for a full token system
- [The `divided_by` filter](https://shopify.dev/docs/api/liquid/filters/divided_by) (shopify.dev)
- [Liquid basics: referencing handles](https://shopify.dev/docs/api/liquid/basics#referencing-handles) (shopify.dev) — the square-bracket notation behind `settings[a_string_variable]`
- [`clamp()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
