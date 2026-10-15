---
title: Reading Typography from a Figma Design
description: How to turn a client's Figma file into font roles, settings, and tokens — before writing a single line of code.
---

**TL;DR:** How to turn a client's Figma file into font roles, settings, and tokens — before writing a single line of code.

Every page before this one assumed the typography decisions (which roles exist, which fonts, which sizes) had already been made. In practice, those decisions usually arrive as a Figma file from a client or designer, and translating it correctly — rather than guessing from how it looks on screen — is the actual first step of building a theme's typography. Get this step wrong and every token, setting, and `font_face` call built on top of it inherits the mistake.

## Don't eyeball it — read the real values

A text layer in Figma can *look* like a certain size or weight without actually being that size or weight — screen zoom, browser rendering, and simple guessing are all unreliable. Figma's **Inspect panel** (in Dev Mode, or the right-hand panel when a layer is selected) reports the exact authored values for any text layer: font family, weight, size, line-height, and letter-spacing, in the same units the designer actually set them to. Every value in this page's workflow comes from that panel, never from looking at the canvas and estimating.

:::tip[Ask for Dev Mode access if you don't have it]
Dev Mode shows precise values and lets you inspect without accidentally moving or editing anything in the file. If a client's Figma file hasn't been shared with Dev Mode enabled, it's worth asking for it specifically — the alternative (reading values off the regular design panel, or worse, guessing) is slower and more error-prone.
:::

## Step 1: inventory every distinct text treatment, not just the named styles

If the file has a published **text styles** library (a list like "Heading 1," "Heading 2," "Body," "Caption"), start there — it's the designer's own attempt at exactly the role system this chapter's [18.8. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) page describes. But don't stop at the named list: scan the actual screens for text that doesn't use any of the published styles. A hero headline that was sized by eye for one specific layout, a pull quote with hand-picked letter-spacing, a badge label — these exist in nearly every real handoff, and if you only implement the named styles, they'll quietly go unstyled or get approximated wrong later.

Build a plain table before writing anything else, one row per distinct treatment actually found, however small:

| Found where | Font family | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Hero headline | Canela | 600 | 64px | 68px | 0 |
| Section heading ("Heading 2" style) | Canela | 600 | 32px | 38px | 0 |
| Body text ("Body" style) | Inter | 400 | 16px | 24px | 0 |
| Eyebrow / category label | Inter | 600 | 12px | 16px | 1.2px |
| Pull quote | Canela | 400 italic | 28px | 36px | 0 |

This inventory is the actual spec. Everything else on this page is about reducing it down to something a theme can reasonably implement.

## Step 2: count how many font families and weights are genuinely in use

Every distinct family-weight-style combination in the inventory is a separate file the browser has to download — [18.6. Font-Loading Performance](/all-about-typography/font-loading-performance/) covers why that cost adds up fast. Before mapping anything to settings, total up the real distinct combinations. The table above uses two families (Canela, Inter) and, counting carefully, four combinations: Canela 600, Canela 400 italic, Inter 400, Inter 600. That's a reasonable number for a theme. A file with six different accidental weights of the same family, each used in exactly one place because of how the designer happened to draw it, is a sign worth raising with the designer before building anything — not something to silently implement as six separate `font_modify` variants.

:::note[A slightly-off size usually isn't intentional]
If two rows in the inventory are nearly identical — a heading at `32px` in one place and `31px` in another, say — that's much more likely an accident of how the layer was drawn than a deliberate third size the theme needs to support. Worth a quick question to the designer rather than baking every pixel-level variation into its own preset.
:::

## Step 3: collapse the inventory into font roles

With the real inventory and its real distinct combinations in hand, assign each one to a role — the same Body/Heading/Subheading/Accent idea from [18.8. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/), or whatever smaller or larger set of roles this specific design actually needs:

| Role | Family | Normal weight | Bold/alt weight |
|---|---|---|---|
| Body | Inter | 400 | 600 (eyebrow) |
| Heading | Canela | 600 | — |
| Accent | Canela | 400 italic | — (pull quote only) |

Three roles, not five, because the eyebrow and the body text share a family and only differ by weight — exactly the normal/bold pattern [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/)'s complete example covers with `font_modify`, rather than a fourth independent role. Collapsing the inventory this way, deliberately, is what keeps the eventual settings schema and token system small and maintainable instead of growing one role per screen the designer happened to draw.

Here's that same collapsing applied to an actual mockup, rather than just a table — five visually distinct pieces of text, annotated back to just three underlying roles:

![An annotated hero mockup with five numbered callouts: an eyebrow label and a CTA button both mapped to the Body role in bold, a headline mapped to the Heading role, a body paragraph mapped to the Body role in its normal weight, and a pull quote mapped to a separate Accent role. Each callout lists the exact font, size, line-height, and letter-spacing values read from Figma.](../../../assets/figma-typography-annotation.svg)

Notice ① and ⑤ — the eyebrow label and the CTA button — look nothing alike on the page, but both resolve to the exact same loaded variant (Inter, bold): no fifth role, and no extra font file downloaded for the button. That's the actual payoff of Step 2 and Step 3 together, made visible: a handful of genuinely distinct roles, reused everywhere a treatment repeats, however different those treatments look at a glance.

## Step 4: check whether each family is available through `font_picker`

For each role's family, check it against Shopify's font library — the same lookup [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) describes (pick a placeholder, save, read the real ID back out of `config/settings_data.json`), or search the [Available fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts) table directly by name. Three outcomes are all common:

- **The exact family is available** (Inter is, for instance) — use it directly as the role's `font_picker` default.
- **The exact family isn't available, but a close match is.** Licensed, curated font libraries never cover every typeface a designer might choose — a Canela-style serif might not exist by that name. Flag this to the client rather than silently substituting; a reasonable fallback is a design decision, not a developer one.
- **The client needs the exact brand font and it's genuinely not in the library.** That's a real font file the client owns a license for, loaded with a hand-written `@font-face` instead of `font_picker` — a different, less flexible path than everything else in this chapter, since a merchant can no longer change it from the theme editor. [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) covers this exact scenario end to end. Worth treating as the exception, not the default.

## Step 5: convert Figma's line-height and letter-spacing into CSS correctly

Figma reports line-height and letter-spacing in whichever unit the designer set them in — often not the unit CSS prefers. Converting correctly matters: [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/) already covered why `line-height` should be unitless and `letter-spacing` should be `em`, and a Figma handoff is exactly where those raw numbers come from.

**Line-height.** Figma shows line-height as either a fixed pixel value or "Auto." A fixed pixel value divided by the font size gives the unitless CSS number:

```
line-height (px) ÷ font-size (px) = unitless line-height

38px ÷ 32px = 1.1875  →  round sensibly to 1.19 or 1.2
```

"Auto" means the designer didn't set a deliberate value — it's using the font's own built-in default metrics, which varies per typeface. Don't carry "Auto" into CSS as a magic number; either ask what line-height was intended, or pick a reasonable unitless default (1.1–1.3 for headings, 1.4–1.6 for body text) and confirm it looks right against the design.

**Letter-spacing.** Figma shows letter-spacing as either a percentage or a fixed pixel value, depending on how the designer set it. A percentage converts directly to `em` (they're the same relative-to-font-size idea):

```
1.2px at 12px font size:  1.2 ÷ 12 = 0.1em

2% in Figma:  2% = 0.02em directly
```

## Step 6: capture responsive sizes as fluid-scale inputs, not a hard breakpoint

Check whether the Figma file includes separate desktop and mobile frames for the same screen. If a heading is `64px` on the desktop frame and `40px` on the mobile frame, that's not an instruction to hard-switch the size at one breakpoint — it's the two endpoints [18.9. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) needs to build a `clamp()` that scales smoothly between them:

```css
--font-size-h1: clamp(2.5rem, 2rem + 2.5vw, 4rem);
/* 40px min (mobile frame) → 64px max (desktop frame) */
```

Treating the two frames as `clamp()` endpoints, rather than two fixed sizes separated by a `@media` jump, is usually closer to what the designer actually wants: text that grows in proportion to the viewport, not text that's one of exactly two sizes with nothing in between.

## A checklist before writing any settings schema

1. Inventory every distinct text treatment actually found in the file — not just the published text styles, and not from memory.
2. Flag any near-duplicate sizes or weights with the designer before treating them as intentional.
3. Collapse the inventory into the smallest reasonable set of roles, using `font_modify`-derived variants (bold, italic) instead of a new role wherever a treatment only differs by weight or style.
4. Check every role's family against Shopify's font library; flag any that need a close match or a custom-hosted font.
5. Convert every line-height to unitless (`px ÷ font-size`) and every letter-spacing to `em` (`px ÷ font-size`, or percentage directly).
6. If desktop and mobile frames give two different sizes for the same role, treat them as `clamp()` min/max, not a hard breakpoint switch.

## Key takeaways

- Always read exact values from Figma's Inspect panel or Dev Mode — never estimate size, weight, or spacing by eye from the canvas.
- Build a full inventory of every distinct text treatment in the file first, including anything that doesn't use a published text style, before deciding on roles or settings.
- Count the real number of distinct family-weight-style combinations before implementing them — a long tail of near-duplicate sizes is usually an accident worth questioning, not a deliberate spec.
- Check every family against Shopify's font library before assuming `font_picker` can offer it directly; a missing brand font is a decision for the client, not a silent substitution.
- Convert Figma's line-height and letter-spacing into CSS's preferred units (unitless and `em`, respectively) using the font size, rather than copying the raw Figma number as-is.
- Two sizes for the same role across desktop and mobile frames are `clamp()` endpoints, not an instruction to hard-switch at one breakpoint.

## Further reading

- [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/) — why line-height is unitless and letter-spacing is `em`
- [18.8. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) — turning roles into a token system
- [18.3. Font Settings & Loading a Font Correctly](/all-about-typography/font-settings-and-loading-a-font-correctly/) — discovering a real font ID, and the normal/bold `font_modify` pattern
- [18.9. Fluid Type Scales in Depth](/all-about-typography/fluid-type-scales-in-depth/) — building a `clamp()` scale from two real endpoints
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode) (Figma)
