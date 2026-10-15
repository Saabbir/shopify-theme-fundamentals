---
title: Naming & Scoping
description: "Why {% stylesheet %} doesn't actually isolate your CSS, and what to do about it."
---

**TL;DR:** Why `{% stylesheet %}` doesn't actually isolate your CSS, and what to do about it.

## A common misconception worth correcting directly

It's easy to assume that because `{% stylesheet %}` lives inside one specific section file, its CSS is somehow scoped to just that section — the way a component-scoped stylesheet works in some JavaScript frameworks, or the way Shadow DOM isolates styles. **It isn't.** Every `{% stylesheet %}` block across the entire theme gets bundled into one combined CSS file, applied globally to the whole page. A class named `.title` in one section's `{% stylesheet %}` and a different, unrelated `.title` in another section's `{% stylesheet %}` will collide — whichever one loads later in the bundle wins, silently overriding the other wherever both happen to appear.

## The fix: a consistent naming convention, not a technical feature

Since nothing enforces isolation automatically, avoiding collisions is entirely about discipline in how you name things.

**Use BEM** (Block, Element, Modifier) for class names: `block`, `block__element`, `block--modifier`. A section or block's own name becomes the "block" part, scoping every class underneath it to that specific component by naming convention alone.

```css
.hero-banner { }
.hero-banner__heading { }
.hero-banner__button { }
.hero-banner--centered { }
```

**Pick one short prefix for your whole theme**, and apply it to every class you write — not just to avoid colliding with your own other sections, but to avoid colliding with a class name an installed app's own CSS might inject onto the page, or one that happens to match a name a different theme framework uses.

```css
.my-theme-hero-banner { }
.my-theme-hero-banner__heading { }
```

This is the same instinct as the CSS custom property naming convention from [7.4. Turning Settings into CSS Variables](/design-tokens/turning-settings-into-css-variables/) — one consistent prefix, applied everywhere, specifically because nothing else is protecting you from a collision.

## Keep selectors simple

A few related habits make collisions less likely and the CSS itself easier to maintain:

- **One class per selector** — `.hero-banner__heading` rather than a long descendant chain like `.hero-banner .content .heading`. A long chain is both more fragile (any change to the markup's nesting breaks it) and more likely to accidentally match something in a different section.
- **No ID selectors for styling** — IDs must be unique per page, which a reusable section (added more than once) can't guarantee; a class has no such restriction.
- **No `!important`** — it's a sign a collision has already happened and is being patched over, rather than prevented by naming in the first place.

## Key takeaways

- `{% stylesheet %}` compiles into one shared, global CSS file — it provides no automatic scoping or isolation between sections.
- A consistent BEM naming pattern, plus one theme-wide prefix on every class, is what actually prevents collisions, since nothing does it for you.
- Simple selectors (one class, no IDs, no `!important`) make the discipline easier to maintain and collisions easier to spot when they do happen.

## Further reading

- [BEM methodology](https://getbem.com/)
