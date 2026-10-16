---
title: A Real Contrast-Testing Workflow
description: Checking every color pairing a merchant can produce, not just the ones you tested by eye.
---

**TL;DR:** Checking every color pairing a merchant can produce, not just the ones you tested by eye.

## Why "it looked fine in the editor" isn't enough

If a merchant can freely pick any color for a text setting and any color for a background setting, the number of combinations they could produce is enormous — far more than anyone could manually check by eye while building the theme. A contrast problem introduced this way often isn't caught until a real merchant stumbles into it, by which point it's a support ticket, not a code review comment.

## Step 1: know the WCAG thresholds you're checking against

- **4.5:1** for normal body text.
- **3:1** for large text (roughly 24px and up, or bold text around 19px and up) and for meaningful UI elements like icon buttons.

This page is about actually checking against these two numbers systematically, not just knowing what they are.

## Step 2: check every default pairing with `color_contrast`

The example below checks the two raw colors in a theme's [17.3. `color_palette` setting](/all-about-colors/color-palette-setting/) against each other — a reasonable first pairing to verify, since so many other settings end up defaulting from those same two colors:

```liquid
{% liquid
  assign contrast_ratio = settings.color_palette.foreground | color_contrast: settings.color_palette.background
%}
{% if contrast_ratio < 4.5 %}
  {% # This pairing fails WCAG AA for normal text. %}
{% endif %}
```

Run this check, or its equivalent, against every default color pairing a theme ships with — not just `color_palette`, but every preset and every default `color_scheme_group` entry too. This is cheap to do once, directly in Liquid, and catches a shipped default that's already broken before any merchant even touches it.

## Step 3: decide what happens when a merchant picks a bad pairing

Shipped defaults are one thing — a merchant freely picking their own colors later is a separate, harder problem, since you can't stop them from choosing anything the color picker allows. Three realistic responses, roughly in order of how much engineering effort they take:

1. **Do nothing extra**, beyond checking your own defaults. Reasonable for most themes — merchants are ultimately responsible for their own brand choices, and over-engineering guardrails around every setting adds real complexity for a problem most merchants won't actually hit.
2. **Warn in the theme editor**, using a `color_contrast` check inside the section's own Liquid to conditionally show a visible warning message when the live-selected pairing fails, without blocking the merchant from using it anyway.
3. **Constrain the choices**, by offering `color_scheme_group` (see [17.2. Color Schemes](/all-about-colors/color-schemes/)) instead of independent color settings in the first place, so a merchant picks between pre-checked combinations rather than assembling their own from scratch. This is the strongest guarantee, and the reason `color_scheme_group` exists.

:::tip[Prevention beats detection]
Option 3 — constraining choices via `color_scheme_group` — prevents the problem from being possible at all, rather than detecting it after the fact. Where a design can reasonably offer a fixed set of schemes instead of fully independent color pickers, that's usually the better trade, for the exact same reason `enabled_on`/`disabled_on` prevents a section-placement mistake earlier than a Liquid conditional could.
:::

## Step 4: make this part of your actual QA checklist

Per the QA checklist referenced throughout this project's own conventions, color contrast belongs alongside keyboard navigation and screen-reader checks as a standard pre-ship step — not a one-time audit done only when something looks visibly wrong.

## Built-in reference

**Filter used on this page**

| Filter | Arguments | Returns |
|---|---|---|
| `color_contrast` | A second color | WCAG contrast ratio, as a number |

**Fixed thresholds referenced** (WCAG standard, not Shopify-specific)

| Threshold | Applies to |
|---|---|
| 4.5:1 | Normal body text |
| 3:1 | Large text (roughly 24px+, or bold ~19px+) and meaningful UI elements |

**Shopify setting types referenced**

| Type | Used for |
|---|---|
| `color_scheme_group` | Constraining a merchant to pre-checked combinations — see [17.2. Color Schemes](/all-about-colors/color-schemes/) |
| `color_palette` | The example's subject — see [17.3. The Color Palette Setting](/all-about-colors/color-palette-setting/) |

## Key takeaways

- Check every default color pairing a theme ships — presets and `color_scheme_group` defaults included — with `color_contrast`, not just a visual once-over.
- Decide deliberately how much to guard against a merchant choosing a bad pairing themselves: doing nothing extra, warning in the editor, or constraining choices via `color_scheme_group` are all legitimate, increasingly strict options.
- Constraining choices prevents the problem outright; checking and warning only catches it after the fact — prefer prevention where the design allows it.

## Further reading

- [The `color_contrast` filter](https://shopify.dev/docs/api/liquid/filters/color_contrast) (shopify.dev)
- [WCAG 2 contrast minimum (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
