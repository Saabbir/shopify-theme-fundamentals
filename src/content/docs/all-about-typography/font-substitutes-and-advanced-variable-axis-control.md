---
title: Font Substitutes & Advanced Variable Axis Control
description: What it means when a client's font files are tuned (or even spliced-together) open-source substitutes rather than the real licensed typeface, and the font-variation-settings / font-feature-settings properties that kind of handoff usually leans on.
---

**TL;DR:** What it means when a client's font files are tuned — or even spliced together from several open-source fonts — rather than the real licensed typeface, and the `font-variation-settings` / `font-feature-settings` properties that kind of handoff usually leans on.

Sometimes a client sends over font files and a CSS file that, on first read, looks like a normal [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) situation — `@font-face` rules, some classes, done. Look closer and the file tells a different story. Here's a real shape of one, worth reading line by line before touching any code:

```css
/* Open-source replacements, tuned against the originals (see README.md) */

@font-face {
  font-family: "Outer Mix";
  src: url("OuterMix-Black.ttf") format("truetype");
  font-weight: 900;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("Inter-Variable.ttf") format("truetype");
  font-weight: 100 900;
  font-display: swap;
}

/* Replaces MADE Outer Sans Black */
.outer-sans-black {
  font-family: "Outer Mix", sans-serif;
  font-weight: 900;
  letter-spacing: 0; /* spacing is built into the font */
}

/* Replaces PP Neue Montreal Regular */
.neue-montreal-regular {
  font-family: "Inter", sans-serif;
  font-weight: 419;
  font-variation-settings: "opsz" 32, "wght" 418.75;
  font-feature-settings: "cv01" 1, "cv10" 1;
  letter-spacing: 0.0025em;
}

/* Replaces PP Neue Montreal Semibold */
.neue-montreal-semibold {
  font-family: "Inter", sans-serif;
  font-weight: 675;
  font-variation-settings: "opsz" 30.5, "wght" 675;
  font-feature-settings: "cv01" 1, "cv10" 1;
  letter-spacing: -0.0075em;
}
```

## Recognizing what this actually is

Three details give it away, and they're worth training your eye to catch before writing any theme code against a file like this:

- **The top comment.** "Open-source replacements, tuned against the originals (see README.md)" is the whole story in one line — these aren't the brand's real typefaces, they're free fonts someone deliberately adjusted to look as close as possible to fonts the project doesn't have a web license for.
- **The class names don't match the font names.** `.outer-sans-black` and `.neue-montreal-regular`/`.neue-montreal-semibold` are named after the *original* licensed fonts (MADE Outer Sans, PP Neue Montreal — real, commercial typefaces), while the `font-family` they actually declare is "Outer Mix" and "Inter." The `/* Replaces ... */` comments confirm it directly.
- **A README that didn't ship with the CSS.** The comment references one. Ask for it. It almost certainly documents which original each class is standing in for, and the reasoning behind the specific numbers below — exactly the kind of project context that's easy to lose if only the CSS file gets passed along.

:::note[Why a client ends up with substitutes instead of the real fonts]
The usual reason is licensing: a desktop or app license for a premium typeface doesn't automatically include web embedding rights, and a proper web license can be expensive or simply wasn't bought for this project. [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) covers confirming what a license actually allows — the same question applies here, just aimed at the *substitute* fonts instead of the originals. Open-source doesn't mean license-free; a font like Inter still ships under a real license (commonly SIL OFL), and it's worth confirming the specific terms allow embedding it in a theme repo the same way any other self-hosted font would need.
:::

## Sometimes the "substitute" isn't one font — it's several, spliced together

A README accompanying a file like this can go further than a weight and an optical size. A real one, for the same handoff, described `.outer-sans-black`'s font like this:

> Archivo variable font at width 122.5, weight 900, with: a, 1 and g from Hubot Sans; 4 from Unbounded 900; & from Anybody, the best & with a closed top loop like Outer Sans's; round i/j dots sized and placed like Outer Sans's dot. Borrowed glyphs are scaled to Archivo's cap height. Every character is then respaced so its sidebearings match Outer Sans Black's.

That's not "pick a similar free font." It's a composite: one font (Archivo) as the base, with individual *letters* swapped in from three other open-source fonts, each one rescaled to match the base's cap height, because no single open-source font was a close enough match for the brand's licensed original on its own. A few things worth knowing before this kind of file crosses your desk:

- **Width is a real variable axis too.** "Width 122.5" is the `wdth` axis — a third registered axis, alongside the `wght` and `opsz` axes covered below. Archivo ships `wdth` as a real, continuous axis; 122.5 is simply a value inside its range, matched the same way the `opsz`/`wght` values on Inter were — the same rule applies: confirm an axis actually exists in a given font before relying on it (more on that shortly).
- **A single static file doesn't mean the source wasn't variable.** `OuterMix-Black.ttf` is loaded with a plain `font-weight: 900` and no `font-variation-settings` at all — unlike `Inter-Variable.ttf`, which keeps its full `100 900` range and needs `font-variation-settings` to pick a point inside it. That's a legitimate, different choice: when a project only ever needs *one* width/weight combination out of a variable font, it's reasonable to export (or "instance") just that one design as a static file, rather than ship the full variable font and pin it with CSS every time it's used. Both are correct; they're answering different questions — "do I need more than one point on this axis in the browser?"
- **This is why combined fonts get renamed.** The SIL Open Font License — what Archivo, Hubot Sans, Unbounded, and Anybody all ship under — permits merging multiple OFL fonts into one derivative work, but its **Reserved Font Name** clause forbids a modified version from keeping a source's name without written permission. That's the real reason the font-family in the CSS is `"Outer Mix"` and not `"Hubot Sans"`: it's not a stylistic choice, it's a license requirement, and it's worth recognizing the same constraint if your own project ever combines or modifies an OFL font.

:::caution[Check for documented coverage gaps before shipping]
The same README noted: "Accented letters (à, â, ğ, í…) are still Archivo's own, so they don't match the swapped a, g, i and j yet." A composite like this is matched glyph by glyph, not swapped wholesale — so coverage can be incomplete in ways that only show up once real content (a French or Turkish product title, say) hits the page. [18.15. Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/) covers the broader version of this problem; here, the fix is simpler — read the README's own caveats before launch, and flag any gap it already documents rather than discovering it in production.
:::

## Two font-weight numbers on the same property, and both are legitimate

`font-weight: 419` and `font-weight: 675` aren't typos. The CSS spec allows any integer from 1 to 1000, not just the familiar named hundreds (400, 700, and so on) — those are just conventions, not a hard limit. A value like `419` is almost always the result of deliberate, careful tuning: someone compared the substitute against the original side by side and landed on the exact weight that visually matched, rather than picking the nearest round number.

:::caution[Don't "clean up" these numbers]
It's tempting to round `419` to `420` or `400` the first time you see it in a code review. Don't — a non-round weight on a variable font is usually a signal that real visual-matching work happened, not a mistake. If a value here genuinely looks wrong, ask whoever tuned it (or check the README) before changing it.
:::

## `font-variation-settings`: the axis `font-weight` can't reach

A variable font can expose more than just weight. `@font-face`'s `font-weight: 100 900` here (note the two numbers — a *range*, the same self-hosted variable-font pattern [18.4. Variable Fonts](/all-about-typography/variable-fonts/) covers) tells the browser this one file covers the full weight range. But Inter, specifically, also ships a second real axis: **optical size** (`opsz`, running roughly 14–32 in Inter's case), deliberately scoped to interface-sized text rather than the wider range a print typeface would need. There's no standalone CSS property that lets you pin an arbitrary optical-size value the way `font-weight` does for weight — `font-optical-sizing` exists, but it's only `auto` (let the browser tie `opsz` to the element's actual rendered font size) or `none` (don't). Setting a *specific* `opsz` value, decoupled from whatever size the text happens to render at, requires `font-variation-settings` directly:

```css
font-variation-settings: "opsz" 32, "wght" 418.75;
```

Two things worth understanding precisely here, both easy to get wrong:

**`font-variation-settings` always wins.** When both `font-weight` and `font-variation-settings`'s `"wght"` target the same axis, the browser uses the `font-variation-settings` value, regardless of which one appears later in the CSS or how specific the selector is. So in the example, the text actually renders at weight `418.75`, not `419` — the `font-weight: 419` declaration is a fallback value (used by anything that reads computed weight without resolving variation settings, and a reasonable value to have on record regardless), not what's really being drawn on screen.

**Every axis you care about has to be listed together, every time.** `font-variation-settings` doesn't merge with a previous declaration — any axis you don't mention in a given declaration resets to that font's own default for the axis, even if an earlier rule set it. That's exactly why `"wght"` appears a second time *inside* `font-variation-settings`, right alongside `"opsz"`: once optical size needs explicit control, weight has to ride along in the same declaration, or Inter would quietly snap back to its default weight the moment `opsz` was set.

:::tip[Check that the axis actually exists in the font before relying on it]
A variable font silently ignores a `font-variation-settings` axis it doesn't define — no error, no fallback, nothing in the console. Before copying a pattern like this into a theme, confirm the font's real axis list (a font-inspection tool like [Wakamai Fondue](https://wakamaifondue.com/), the same one [18.4. Variable Fonts](/all-about-typography/variable-fonts/) recommends for detecting a variable font in the first place, will show it) rather than assuming `opsz` exists just because it's a registered OpenType axis name. The five registered axes are `wght` (weight), `wdth` (width), `slnt` (slant), `ital` (italic), and `opsz` (optical size) — a font can implement any subset of them, or none.
:::

## `font-feature-settings`: picking one specific glyph shape

```css
font-feature-settings: "cv01" 1, "cv10" 1;
```

`cv01` and `cv10` are OpenType **character variant** feature tags — Inter's font file includes alternate shapes for certain characters, and these two turn specific alternates on. This is a real, if blunt, instrument: `font-feature-settings` talks almost directly to the font file's own feature table, which is exactly why it's capable of this kind of precise matching work.

It has a sharp edge worth knowing before you touch it: **`font-feature-settings` doesn't merge with an inherited value — it fully replaces it.** If a more specific rule later in the cascade needs one additional feature turned on, writing just that one feature isn't enough; the entire string (`cv01`, `cv10`, and whatever else needs to stay active) has to be repeated, or the features set by the less-specific rule are lost, not combined.

:::note[A more maintainable alternative exists, where support allows]
`font-variant-alternates` (specifically its `character-variant()` function, paired with a `@font-feature-values` block that maps a feature number to a readable name) does the same job as `cv01`/`cv10` without the raw numeric tags or the all-or-nothing replacement behavior — see [`font-variant-alternates` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates). Worth reaching for in new code. `font-feature-settings` isn't deprecated, though, and remains exactly what a lot of type foundries (including Inter's own documentation) hand out directly — recognizing it, and its replace-not-merge behavior, matters more here than swapping it out.
:::

## The letter-spacing values are matching work too, not decoration

```css
letter-spacing: 0.0025em;   /* Inter, Regular-equivalent */
letter-spacing: -0.0075em;  /* Inter, Semibold-equivalent */
letter-spacing: 0;          /* Outer Mix — "spacing is built into the font" */
```

These are tiny — a few thousandths of an em — which is itself a signal: this is fine correction, not a deliberate design choice of loose or tight tracking. [18.1. Typography Fundamentals](/all-about-typography/typography-fundamentals/#letter-spacing-and-text-transform-smaller-often-forgotten-levers) already covers why `letter-spacing` is conventionally written in `em` rather than a fixed pixel value — the same reasoning applies at this smaller scale.

`letter-spacing: 0` on `.outer-sans-black` isn't a sign spacing was overlooked — it's the result of a specific technique, worth understanding so it isn't "corrected" by accident. Once a composite like Outer Mix has its borrowed glyphs rescaled to match cap height (the previous section), the remaining mismatch is each character's *sidebearing* — the small gap built into a glyph on its left and right edge, which is what actually produces visual letter-spacing, independent of any CSS. A README documenting work like this will typically say every character was individually respaced so its sidebearings match the original font's, scaled to the same cap height — meaning the spacing correction already happened once, inside the font file itself, letter by letter. `letter-spacing: 0` is the correct CSS precisely because the real correction isn't a CSS property's job here.

:::tip[A documented similarity score is worth trusting more than a fresh eyeball check]
Font-matching work like this sometimes comes with a numeric score — something like "0.4 × shared ink + 0.3 × outline closeness + 0.3 × width match, averaged per character, with extra weight on the worst-matching 20%" is a plausible real formula, applied per glyph and then combined into one number per font. Whatever the exact formula, a documented score comparing the chosen substitute against the plainest alternative (an unmodified stock font, say) is evidence that a real comparison happened, not a guess — treat it the same way as the tuned numeric values: worth preserving as documentation, and a reason to re-run the same comparison rather than eyeball a replacement if the substitute ever needs to change.
:::

## What to actually do with a file like this

Once the file is understood correctly, handling it is mostly familiar ground from elsewhere in this chapter, plus a few things specific to a substitute:

- **Confirm the substitute fonts' own license allows this**, the same check [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/) already walks through for any self-hosted font — "open-source" and "web-embeddable, redistributable in this repo" aren't automatically the same thing, even for a well-known font like Inter. If a font is a composite built from several OFL sources, keep every source's copyright notice, don't sell the font file on its own, and don't use any source's Reserved Font Name for the result — which is almost certainly why the file is already named something generic ("Outer Mix") instead of one of its ingredients.
- **Get real `.woff2` files.** The client's CSS only references `.ttf` — a much larger format with no legacy-browser fallback. Convert, following the same guidance as any other hand-loaded font, and confirm conversion is permitted under the substitute's license before doing it.
- **Host and load them the normal way** — an asset via `asset_url` (or Shopify Files if the same substitute set needs sharing across themes), a hand-written `@font-face` per weight/style inside a `{% style %}` tag, same as any other self-hosted font.
- **Leave the tuned values alone.** `font-weight: 419`, `"wght" 418.75`, `"opsz" 32`, `cv01`/`cv10`, the fractional `letter-spacing` values, and any axis value tied to a composite font's own construction (a `wdth` of `122.5`, say) are the actual deliverable here — the result of real comparison work against the original fonts. Treat them as a locked spec to carry over exactly, not a style to simplify.
- **Wire the result into the theme's existing token system**, rather than leaving `.outer-sans-black`-style utility classes sitting outside it. [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/) is the pattern to follow: decide which role (or preset) each substitute is actually standing in for, and resolve it into that role's tokens — `--font-heading-family`, `--font-heading-weight`, and so on — so every other component that already reads from the role-token system picks it up automatically, instead of needing to know these specific class names exist.
- **Ask for the README, and read its caveats, not just its values.** It's referenced directly in the CSS and almost certainly documents the mapping, the reasoning, and anything the match doesn't cover yet (unmatched accented characters, for instance) — worth keeping with the project, and worth flagging any documented gap before launch rather than discovering it in production.
- **Performance guidance doesn't change.** `font-display: swap` is already present and correct; preload only if one of these is used above the fold, same as [18.7. Font-Loading Performance](/all-about-typography/font-loading-performance/) covers for any other font.

## Key takeaways

- A comment like "tuned against the originals," class names that don't match their own `font-family`, and a referenced-but-missing README are the tell that font files are a matched substitute, not the client's actual licensed typeface — ask for the README before writing theme code against the file.
- A substitute can be a composite of several open-source fonts, not just one: one font as a base, individual glyphs swapped in from others, each rescaled to the base's cap height and respaced to match the original's sidebearings — which is also why `letter-spacing: 0` can be correct even on a hand-tuned font.
- Combining or modifying OFL-licensed fonts is explicitly permitted, but the license's Reserved Font Name clause forbids keeping a source's name in the result — a likely reason a composite font ends up with a new, generic name.
- `font-weight` accepts any integer 1–1000, not just the named hundreds; a non-round value on a variable font is usually deliberate visual-matching work, not an error to "fix."
- `font-variation-settings` always overrides the equivalent standard property (`font-weight` for `"wght"`, and so on) when both are present, and every axis you want controlled has to be listed together in one declaration — an axis left out resets to the font's default, even if an earlier rule set it.
- `opsz` (optical size) and `wdth` (width) have no standalone CSS property for pinning a specific value the way `font-weight` does for `wght` — precise control requires `font-variation-settings` directly, and only works if the font actually defines that axis.
- `font-feature-settings` fully replaces rather than merges with an inherited value; `font-variant-alternates` with `character-variant()` is the more maintainable modern alternative where it covers what's needed.
- A README worth keeping documents more than values — read its caveats too (an unmatched character set, say) and flag them before launch.
- Once understood, handle these exactly like any other self-hosted font — real `.woff2` files, proper hosting, a `{% style %}`-rendered `@font-face` — and then resolve them into the theme's existing role-token/preset system rather than leaving them as standalone utility classes.

## Further reading

- [18.4. Variable Fonts](/all-about-typography/variable-fonts/)
- [18.5. Loading a Custom or Licensed Font](/all-about-typography/loading-a-custom-or-licensed-font/)
- [18.9. Design Tokens & Type Presets](/all-about-typography/design-tokens-and-type-presets/)
- [18.15. Font Fallback for Multi-Language Stores](/all-about-typography/font-fallback-for-multi-language-stores/)
- [`font-variation-settings` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings)
- [`font-feature-settings` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings)
- [`font-variant-alternates` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates)
- [OpenType Design-Variation Axis Tag Registry (Microsoft)](https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg)
- [SIL Open Font License 1.1 FAQ](https://scripts.sil.org/OFL)
