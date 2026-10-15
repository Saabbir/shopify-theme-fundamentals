---
title: Planning Responsive Behavior
description: Translating a separate mobile frame into CSS, and knowing what genuinely needs its own setting versus what's just CSS.
---

**TL;DR:** Translating a separate mobile frame into CSS, and knowing what genuinely needs its own setting versus what's just CSS.

A design tool typically shows you two (or more) separate, hand-designed frames for the same section — one for desktop, one for mobile. The job isn't to recreate each frame as its own fixed layout; it's to figure out the one flexible rule that produces both.

## Read what actually changed, not just what looks different

Compare the two frames and describe the change in words, not pixels: "three columns become one column," "the image moves from the side to above the text," "the heading gets smaller." Each of those descriptions maps to a specific, well-known CSS technique — and once you've named the technique, you very rarely need two separate hand-built layouts to produce it.

| What you see in the frames | Usual CSS answer |
|---|---|
| Columns become a single stacked column | A grid or flex container that wraps, or switches `flex-direction` below a breakpoint |
| Text shrinks | `clamp()` for fluid type, covered in [7.2. Typography & font_picker](/design-tokens/typography-and-font-picker/) — often no breakpoint needed at all |
| Spacing shrinks | The desktop/mobile `range` setting pattern from [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) |
| An element is hidden entirely on one size | A plain `@media` rule hiding or showing it — rarely worth a setting |

## Most of this doesn't need a new theme setting at all

This is the point easiest to get wrong in the opposite direction from [the previous page](/figma-to-code/section-block-snippet-or-fixed-markup/)'s "don't over-build" caution: seeing two different frames doesn't mean every value that differs between them needs its own merchant-facing setting. A grid that reflows from three columns to one, or a heading that shrinks fluidly with `clamp()`, is something CSS handles entirely on its own — no setting required, and no Liquid logic deciding anything about screen size. Reserve an actual setting (with its own mobile variant, following the pattern already covered in [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/)) only for the handful of values a merchant would plausibly want to adjust themselves, like a section's own top/bottom padding — not for every single thing that happens to look different between the two frames.

:::caution[The same rule from Spacing & Layout Tokens applies here too]
Never decide which frame's layout to use based on a device check inside Liquid. Liquid renders once; it has no way to react to the browser being resized, and it breaks the theme editor's live, resizable device preview. Every responsive difference between the two frames belongs in CSS (`@media` queries reading CSS custom properties, as covered in [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/)), never in a Liquid-side device check.
:::

## Key takeaways

- Describe what changed between the frames in words first ("columns become one column," "text shrinks") — that description almost always points directly at a specific, well-known CSS technique.
- Most responsive differences are CSS's job alone and need no new setting at all; reserve settings for the few values a merchant would genuinely want to adjust.
- The device-check-in-Liquid trap from earlier chapters applies just as much here — every responsive decision belongs in CSS, never in Liquid.

## Further reading

- [Using CSS media queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
