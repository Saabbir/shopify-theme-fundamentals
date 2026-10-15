---
title: Button Fundamentals
description: Which HTML element a button actually is underneath, and why that choice matters more than how it's styled.
---

**TL;DR:** Which HTML element a button actually is underneath, and why that choice matters more than how it's styled.

Visually, "a button" is just a styled rectangle with a label. Underneath, a theme has three real choices for what that rectangle actually *is* — and picking the wrong one is one of the most common accessibility bugs in a storefront, because it's invisible until someone navigates without a mouse.

## Three things that can look like a button

```html
<button type="submit">Add to cart</button>
<a href="/collections/sale" class="button">Shop sale</a>
<div class="button" role="button" tabindex="0">Quick add</div>
```

**A real `<button>`** is for an action that happens on the current page — submitting a form, opening a drawer, toggling a filter. It's keyboard-operable (Tab to focus, Enter or Space to activate), announces as "button" to a screen reader, and participates in form submission automatically, all without a single line of JavaScript or ARIA.

**An `<a>` styled to look like a button** is for navigation — going to a different page or a different section of this one. It's still keyboard-operable and still announces correctly (as a link, not a button, which is accurate), but only because it's a real anchor with a real `href`. Styling an anchor with a `.button` class doesn't change what it *is* to assistive technology or the keyboard — only how it looks.

**A plain element with `role="button"`** is the one to avoid by default. It exists for the rare case where neither a native `<button>` nor a native `<a>` can do the job, and it means taking on everything the browser normally provides for free: keyboard focus (`tabindex="0"`), handling both Enter *and* Space (they're not interchangeable — native buttons respond to both, and a hand-rolled one needs its own key handler to match), and the `role` attribute itself. Every one of these is a place to get it subtly wrong.

:::caution[The most common version of this bug: a `<div>` or `<span>` with just an onclick]
A clickable element with only a mouse-click handler and no `role`, no `tabindex`, and no keyboard handler works perfectly for a mouse user and is completely invisible and unreachable for a keyboard or screen-reader user. This isn't a rare edge case — it's one of the most frequently cited issues in real storefront accessibility audits, and it's entirely avoidable by reaching for a real `<button>` or `<a>` in the first place.
:::

## The rule: does it navigate, or does it act?

This is the one question that resolves nearly every case:

- **Does activating it change the URL or take the shopper to a different page/section?** Use `<a href="...">`.
- **Does it do something on the current page** — submit a form, add to cart, open a modal, toggle a quantity? Use `<button>` (with `type="submit"` inside a form, `type="button"` otherwise — leaving `type` off defaults to `submit`, which silently submits the nearest form if the button happens to be inside one).

Horizon's own button block, read directly from its source, follows this exactly — it's built as an `<a>`, because a "Button" content block's entire job is linking somewhere:

```liquid
{%- doc -%}
  Intended for use in a block similar to the button block.
  @param {string} link - link to render
{%- enddoc -%}

<a
  {% if link == blank %}
    role="link"
    aria-disabled="true"
  {% else %}
    href="{{ link }}"
  {% endif %}
  class="{{ block_settings.style_class }}"
  {{ block.shopify_attributes }}
>
  {{ block_settings.label }}
</a>
```

:::note[What Horizon does when there's no link yet]
Worth noticing: when a merchant hasn't filled in the block's link setting, Horizon doesn't just drop the `href` and leave the element looking clickable but silently doing nothing. It renders `role="link"` (keeping the correct semantic role even without an `href`) plus `aria-disabled="true"` — so a screen reader announces it as a disabled link, not a working one that mysteriously does nothing when activated. This is the same instinct [36.3. Interactive States](/all-about-buttons/interactive-states/) covers in full for buttons generally: a disabled-looking control should also *announce* as disabled.
:::

## The anatomy of a button's markup

Whichever element it's built from, a button's markup is usually just three things: the clickable element itself, the label, and — optionally — an icon:

```html
<button type="button" class="button">
  <svg class="button__icon" aria-hidden="true"><!-- ... --></svg>
  <span class="button__label">Add to cart</span>
</button>
```

[36.5. Sizing & Icon+Text Composition](/all-about-buttons/sizing-and-icon-text-composition/) covers the icon-plus-label pairing, including the icon-only case, in full.

## Key takeaways

- A button is for an action on the current page; a link is for navigation — this single question resolves almost every "button or link" decision.
- A native `<button>` gets keyboard operability, correct screen-reader announcement, and form participation for free. A plain element with `role="button"` gets none of that for free — every bit has to be added back by hand.
- Styling an `<a>` to look like a button doesn't change what it is — it's still a link, and should still navigate, not act.
- Horizon's own button block renders `role="link"` plus `aria-disabled="true"` when there's no destination yet, rather than silently leaving a non-functional element with no explanation.

## Further reading

- [Button accessibility (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [WAI-ARIA Authoring Practices: Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [`blocks/button.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/blocks/button.liquid)
- [36.3. Interactive States](/all-about-buttons/interactive-states/)
