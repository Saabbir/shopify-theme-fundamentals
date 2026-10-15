---
title: Dark Mode
description: Supporting prefers-color-scheme alongside (or instead of) a merchant-controlled scheme setting.
---

**TL;DR:** Supporting `prefers-color-scheme` alongside (or instead of) a merchant-controlled scheme setting.

`color_scheme_group` (see [17.1. Color Fundamentals](/all-about-colors/color-fundamentals/)) lets a merchant deliberately switch a section to a different scheme — a light one, a dark one, a bold one. That's a merchant choosing a look. **Dark mode**, as the term is normally used, is different: it's the shopper's own operating system or browser preference, and a theme that respects it does so automatically, without the merchant doing anything.

## Reading the shopper's system preference in CSS

```css
.sol-card {
  background: var(--sol-color-background);
  color: var(--sol-color-text);
}

@media (prefers-color-scheme: dark) {
  .sol-card {
    --sol-color-background: #121212;
    --sol-color-text: #ffffff;
  }
}
```

This is plain CSS, not Liquid — `prefers-color-scheme` is a media query the browser evaluates based on the shopper's own system or browser setting, with no server-side involvement at all. This is why [Spacing Settings](/css-in-shopify-themes/responsive-and-logical-properties/)'s guidance to never check device conditions in Liquid applies here too, for the same reason: a shopper's dark-mode preference can't be known at render time, only in the browser.

## Should dark mode override the merchant's scheme choice, or work alongside it?

This is a real design decision, not just a technical one, and themes differ on the answer:

- **Dark mode always wins.** Whatever scheme a merchant picked, a shopper with dark mode enabled sees a dark version regardless. Simpler to reason about, but takes away some of the merchant's control over brand presentation.
- **The merchant's scheme choice always wins.** A merchant who deliberately picked a bold, bright scheme for a section probably wants shoppers to see that scheme, dark-mode preference or not. Respects merchant intent, but means some shoppers see a bright white section even with dark mode enabled everywhere else.
- **Dark mode only fills in a gap.** A theme defines a dark variant only for scheme roles the merchant hasn't explicitly set, falling back to it for anything left at its default. The most flexible option, but noticeably more setup.

There's no universally correct choice here — it depends on how much the theme is meant to prioritize brand consistency versus shopper preference. Whichever you choose, document the decision in the theme's own README or style guide, since it's exactly the kind of behavior a merchant will ask about once they notice it.

:::caution[Don't let dark mode break a merchant's intentionally chosen contrast]
If you implement the "dark mode always wins" approach, make sure the dark variant you ship still passes contrast for whatever text/background pairings appear in it — a merchant never tested your dark override against their content, so it's on the theme to have verified it, using the same workflow in [17.6. A Real Contrast-Testing Workflow](/all-about-colors/a-real-contrast-testing-workflow/).
:::

## Key takeaways

- Dark mode (`prefers-color-scheme`) is the shopper's own system preference, read purely in CSS — not something Liquid or a merchant setting can detect at render time.
- It's a genuinely different concept from a merchant-controlled `color_scheme` — one is automatic and shopper-driven, the other is a deliberate merchant choice.
- Decide explicitly whether dark mode overrides, is overridden by, or fills gaps in a merchant's scheme choice, and verify contrast on whatever dark variant you ship.

## Further reading

- [`prefers-color-scheme` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
