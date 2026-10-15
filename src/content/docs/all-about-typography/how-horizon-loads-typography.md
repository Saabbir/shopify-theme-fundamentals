---
title: How Shopify's Horizon Theme Loads Typography
description: A real, current theme's typography system, read directly from its source.
---

**TL;DR:** A real, current theme's typography system, read directly from its source.

Everything so far has been the general mechanism. This page looks at one real, current example of that mechanism in production: **Horizon**, the theme Shopify ships as its current flagship reference theme. Reading a real theme's actual approach is worth doing once you understand the pieces individually — it shows how they fit together in practice, under real constraints.

:::note[Source code, not a tutorial]
Everything on this page is drawn directly from Horizon's public source code and Shopify's own documentation. Themes get updated; treat the specific variable names below as accurate as of when this was written, and check [Horizon's repository](https://github.com/Shopify/horizon) directly if something looks different in a theme you're working with.
:::

:::note[Updated with the real preloading and loading source]
This page originally covered the token-resolution step only. It now also covers the two files that come before it: how Horizon preloads its four fonts (`snippets/fonts.liquid`), and the full, real loading block inside `snippets/theme-styles-variables.liquid` — fetched directly from Horizon's current source for this update.
:::

## Four font roles, not one

Horizon doesn't offer a single "theme font" setting. Its theme settings define four separate `font_picker` settings, each covering a different typographic role: **Body** (`type_body_font`), **Subheading** (`type_subheading_font`), **Heading** (`type_heading_font`), and **Accent** (`type_accent_font`). A merchant picks a font for each role independently — the same four-role split this chapter's [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) page generalizes into a reusable pattern for any theme.

## Step 1: preloading, before anything else loads

Before any font is actually loaded as CSS, Horizon hints to the browser to start downloading it early. `layout/theme.liquid`'s `<head>` renders a dedicated snippet for exactly this, before the snippet that does the real loading:

```liquid
{%- render 'fonts' -%}
{%- render 'theme-styles-variables' -%}
```

`snippets/fonts.liquid`, in full:

```liquid
{%- unless settings.type_body_font.system? -%}
  {{ settings.type_body_font | font_url | preload_tag: as: 'font', type: 'font/woff2', fetchpriority: 'low' }}
{%- endunless -%}

{%- unless settings.type_subheading_font.system? -%}
  {{ settings.type_subheading_font | font_url | preload_tag: as: 'font', type: 'font/woff2', fetchpriority: 'low' }}
{%- endunless -%}

{%- unless settings.type_heading_font.system? -%}
  {{ settings.type_heading_font | font_url | preload_tag: as: 'font', type: 'font/woff2', fetchpriority: 'low' }}
{%- endunless -%}

{%- unless settings.type_accent_font.system? -%}
  {{ settings.type_accent_font | font_url | preload_tag: as: 'font', type: 'font/woff2', fetchpriority: 'low' }}
{%- endunless -%}
```

Three details worth noticing, each a real answer to a question this chapter raises generically elsewhere:

- **`.system?` skips the preload entirely for a system font** — exactly the property covered in [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/). There's no file to preload for a font the browser already has, so Horizon checks first rather than emitting a pointless (or broken) preload tag.
- **`preload_tag` generates the `<link rel="preload">` tag**, given a URL from `font_url` plus `as`/`type` — rather than Horizon hand-writing the `<link>` tag itself. This is the filter to reach for any time a theme needs to preload a resource Liquid already has a URL for.
- **`fetchpriority: 'low'`, on every single one.** [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/) advises preloading only the one or two fonts visible immediately — Horizon takes a different, equally defensible approach: it preloads all four roles unconditionally, but marks every one of them low-priority, so they compete for bandwidth behind whatever the browser considers more urgent (the page's own HTML, critical CSS) rather than against each other at full priority. Preloading four fonts at `fetchpriority: 'low'` and preloading one or two at the default priority are two different, reasonable answers to the same underlying problem — pick the one that matches how certain you are, ahead of time, about which fonts a given page actually needs.

## Step 2: loading every variant Horizon might need — for real

Preloading only hints; it doesn't load a usable font. The actual `@font-face` declarations happen in `snippets/theme-styles-variables.liquid`, and this is where [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/)'s body/heading, normal/bold example scales up to Horizon's real four roles. Each role needs up to **four** variants — normal, bold, italic, and bold-italic — derived with `font_modify` exactly like that page's example. Shown here for Body and Heading (Subheading and Accent follow the identical pattern):

```liquid
{% liquid
  assign primary_font = settings.type_body_font
  assign primary_font_bold = primary_font | font_modify: 'weight', 'bold'
  assign primary_font_italic = primary_font | font_modify: 'style', 'italic'
  assign primary_font_bold_italic = primary_font_bold | font_modify: 'style', 'italic'

  assign tertiary_font = settings.type_heading_font
  assign tertiary_font_bold = tertiary_font | font_modify: 'weight', 'bold'
  assign tertiary_font_italic = tertiary_font | font_modify: 'style', 'italic'
  assign tertiary_font_bold_italic = tertiary_font_bold | font_modify: 'style', 'italic'
%}

{{ primary_font | font_face: font_display: 'swap' }}
{{ primary_font_bold | font_face: font_display: 'swap' }}
{{ primary_font_italic | font_face: font_display: 'swap' }}
{{ primary_font_bold_italic | font_face: font_display: 'swap' }}

{{ tertiary_font | font_face: font_display: 'swap' }}
{{ tertiary_font_bold | font_face: font_display: 'swap' }}
{{ tertiary_font_italic | font_face: font_display: 'swap' }}
{{ tertiary_font_bold_italic | font_face: font_display: 'swap' }}
```

(Horizon's internal variable names here — `primary_font` for Body, `tertiary_font` for Heading — are the same internal-vs-setting-vs-output naming mismatch covered on [18.14. Naming Conventions for Font Settings & Type Tokens](/all-about-typography/naming-conventions-for-settings-and-tokens/).)

### Avoiding a duplicate download when two roles share a font

If a merchant picks the same font for two different roles — Subheading and Accent both set to the same family, say — the straightforward version above would load that family's variants twice. Horizon's real source guards against this with a dedup pattern: build a unique ID string from each variant's family, weight, and style, and skip emitting `font_face` again for an ID already seen:

```liquid
{% liquid
  assign rendered_fonts = ''

  assign primary_font_face_id = primary_font.family | append: '-' | append: primary_font.weight | append: '-' | append: primary_font.style

  unless rendered_fonts contains primary_font_face_id
    echo primary_font | font_face: font_display: 'swap'
    assign rendered_fonts = rendered_fonts | append: primary_font_face_id | append: '|'
  endunless
%}
```

(Simplified slightly from Horizon's actual `replace`-based ID construction, for readability — the mechanism is identical: build an ID, check `contains`, skip if already rendered, append if not.) Every one of the sixteen possible variants (four roles × four variants each) goes through this same check before being loaded, which is exactly what makes it safe for Horizon to unconditionally attempt all sixteen regardless of how many fonts a merchant actually picked distinctly.

:::note[`font_display: 'swap'`, passed explicitly]
Every single `font_face` call above passes `font_display: 'swap'` explicitly — the same default [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/) recommends for most storefronts, confirmed here as Horizon's actual, real choice rather than just this site's own general advice.
:::

## Step 3: turning the same four settings into CSS custom properties

Loading the font files (Step 2) is necessary but not sufficient — a component still needs a convenient way to actually reference "the Heading font" in its own CSS. Rather than referencing `settings.type_heading_font.family` repeatedly throughout dozens of section and block files, the same `theme-styles-variables.liquid` file also resolves each font setting into a small set of CSS custom properties, right alongside the loading logic from Step 2. The relevant lines look like this:

```liquid
--font-body--family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
--font-body--style: {{ settings.type_body_font.style }};
--font-body--weight: {{ settings.type_body_font.weight }};

--font-subheading--family: {{ settings.type_subheading_font.family }}, {{ settings.type_subheading_font.fallback_families }};
--font-subheading--style: {{ settings.type_subheading_font.style }};
--font-subheading--weight: {{ settings.type_subheading_font.weight }};

--font-heading--family: {{ settings.type_heading_font.family }}, {{ settings.type_heading_font.fallback_families }};
--font-heading--style: {{ settings.type_heading_font.style }};
--font-heading--weight: {{ settings.type_heading_font.weight }};

--font-accent--family: {{ settings.type_accent_font.family }}, {{ settings.type_accent_font.fallback_families }};
--font-accent--style: {{ settings.type_accent_font.style }};
--font-accent--weight: {{ settings.type_accent_font.weight }};
```

This single snippet is rendered once, early, and every one of Horizon's hundreds of section and block files then reads from these twelve variables instead of touching `settings.type_*_font` directly. This is precisely the "resolve once, consume everywhere" token pattern from [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — Horizon is a real, shipping example of that exact idea, not a theoretical one.

## Consuming the tokens in a component

A component that wants heading typography just reads the token — it never re-derives anything from the original settings:

```css
.product-title {
  font-family: var(--font-heading--family);
  font-style: var(--font-heading--style);
  font-weight: var(--font-heading--weight);
}
```

Any component in the theme that wants "heading" typography uses the same three variables, which is what keeps every heading-styled element in the theme consistent automatically — a merchant changing the Heading font setting once, in the theme editor, updates every single one of them, with nothing further to touch.

:::note[These three role variables carry no size — real Horizon headings get that from a preset instead]
`--font-heading--family`, `--font-heading--style`, and `--font-heading--weight` are the complete role token — there's no `--font-heading--size` to go with them, by design. A real product title in Horizon isn't actually styled by these three alone; it also carries (or inherits, via its tag) one of the `.h1`–`.h6` preset classes covered in [27.3. How Horizon Sets Up Typography & Design Tokens](/horizon-codebase-tour/how-horizon-sets-up-typography-and-design-tokens/), which is what supplies `font-size` and `line-height`. The `.product-title` example above isolates the role-token layer specifically to show how it resolves — [18.13. Typography in Components: A Day-to-Day Cheat Sheet](/all-about-typography/typography-in-components-a-day-to-day-cheat-sheet/) covers exactly when a component should stop at the role token versus reach for a full preset.
:::

## The practical upshot for overriding or debugging

A real, commonly-reported question from people customizing Horizon is "why isn't my custom font showing up everywhere?" The answer, consistently, traces back to this same token system: Horizon's component CSS is scoped fairly specifically (many elements carry their own block-specific classes), so overriding a font by targeting individual selectors one at a time is a losing battle — there are simply too many of them, and new ones appear as the theme is updated.

The reliable fix is to override at the token level, not the component level:

```css
body {
  --font-heading--family: 'Custom Font', sans-serif;
}
```

Because every heading-styled component already reads from `--font-heading--family` rather than hardcoding a font, redefining that one custom property cascades to every one of them automatically — which is the entire point of resolving settings into tokens in the first place, and the same lesson [17.5. Building a Token System](/all-about-colors/building-a-token-system/) teaches for color: change the token, not every place that reads it.

## Key takeaways

- Horizon defines four independent font roles (Body, Subheading, Heading, Accent) rather than one single theme font.
- `snippets/fonts.liquid` preloads all four with `preload_tag`, skipping any role set to a system font (via `.system?`) and marking every preload `fetchpriority: 'low'`, rather than preloading only one or two at full priority.
- `snippets/theme-styles-variables.liquid` then does the real loading: up to four variants per role (normal, bold, italic, bold-italic) via `font_modify`, each with `font_display: 'swap'`, deduplicated so a font picked for two roles isn't downloaded twice.
- The same file resolves all four roles into CSS custom properties exactly once, rather than reading `settings.*` repeatedly throughout the theme.
- Every component that needs typography reads from those tokens, not from the original settings directly — which is what makes a single settings change (or a single CSS override, like a custom font app) cascade reliably everywhere, instead of requiring dozens of individual selector overrides.

## Further reading

- [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) — the same normal/bold `font_modify` pattern, generalized for any theme
- [Horizon theme source (GitHub)](https://github.com/Shopify/horizon)
- [`snippets/fonts.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/fonts.liquid)
- [`snippets/theme-styles-variables.liquid` (GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/theme-styles-variables.liquid)
- [The `preload_tag` filter](https://shopify.dev/docs/api/liquid/filters/preload_tag) (shopify.dev)
