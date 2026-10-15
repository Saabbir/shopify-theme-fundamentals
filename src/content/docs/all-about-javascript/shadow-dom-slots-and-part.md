---
title: "Shadow DOM, Slots & ::part(): When You'd Actually Reach for Them"
description: The genuine isolation Shadow DOM, <slot>, and ::part() give you — and the narrow set of theme situations where giving up design-token access is worth it.
---

**TL;DR:** The genuine isolation Shadow DOM, `<slot>`, and `::part()` give you — and the narrow set of theme situations where giving up design-token access is worth it.

[30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) covers why most theme components deliberately skip Shadow DOM: it blocks the theme's own CSS classes and component rules from reaching inside, in exchange for style isolation most components don't actually need. This page is for the other side of that trade-off — what Shadow DOM, slots, and `::part()` actually give you, and the real situations in a theme where that trade is worth making after all.

:::note[This is the exception, not a reason to revisit 30.2's default]
Nothing here changes the recommendation that most theme components should stay in light DOM, scoped with BEM. This page exists because "most" isn't "all" — a handful of genuine use cases below are worth recognizing when they come up, rather than forcing every component into the same mold.
:::

## What actually crosses the shadow boundary, precisely

Before deciding whether Shadow DOM is worth it for a given component, it matters to know exactly what isolation really means — it's not all-or-nothing.

```html
<sol-rating-input style="--color-accent: #2c6e5c;">
  #shadow-root
    <style>
      .star { color: var(--color-accent); }
    </style>
    <span class="star">★</span>
</sol-rating-input>
```

**Inherited CSS properties cross the boundary automatically.** `color`, `font-family`, and — critically — custom properties like `--color-accent` are *inherited* properties, and inheritance follows the host element into the shadow tree, same as it follows any other element into its children. The `--color-accent` set on `<sol-rating-input>` in the markup above really is readable as `var(--color-accent)` inside that component's own shadow styles.

**Everything else does not.** A global class selector (`.h1`, `.sol-button`), a global `:root` rule, a theme-wide reset, a cascade layer — none of these reach inside a shadow root, because selector matching happens separately within each shadow tree's own stylesheets. This is the real cost 30.2 weighs against isolation: a component inside Shadow DOM gets the theme's custom-property *values* for free, but needs its own, separately written `<style>` (inside the shadow root) to actually turn those values into the theme's typography presets, button styles, or any other class-based pattern — none of that transfers automatically.

## `<slot>`: letting the outside world provide content, without breaking isolation

A Shadow DOM component can't just read `this.innerHTML` the way a light-DOM component does — its internal markup is in a separate tree. `<slot>` is the mechanism for still accepting content from outside anyway.

```js
// assets/sol-callout.js
class SolCallout extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .callout {
          border-inline-start: 4px solid var(--color-accent, #2c6e5c);
          padding: var(--space-md, 1rem);
        }
      </style>
      <div class="callout">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('sol-callout', SolCallout);
```

```liquid
{% comment %} Anything written here is "light DOM" content, projected into the <slot> above {% endcomment %}
<sol-callout>
  <p>{{ block.settings.text }}</p>
</sol-callout>
```

The `<p>` above never actually moves into the shadow tree — it stays exactly where it was written, in the page's normal light DOM, and the browser visually projects it into wherever `<slot>` appears inside the shadow root. This is why `<slot>`-based content still works with `document.querySelector`, still participates in normal accessibility APIs, and still renders even before `SolCallout`'s JavaScript runs (the same progressive-enhancement requirement 30.2 covers for light-DOM components applies here too).

### Named slots: more than one hole to fill

```js
this.shadowRoot.innerHTML = `
  <div class="card">
    <div class="card__media"><slot name="media"></slot></div>
    <div class="card__body">
      <slot name="heading"></slot>
      <slot></slot>
    </div>
  </div>
`;
```

```liquid
<sol-product-card>
  <img slot="media" src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.featured_image.alt | escape }}">
  <h3 slot="heading">{{ product.title }}</h3>
  <p>{{ product.description | strip_html | truncate: 100 }}</p>
</sol-product-card>
```

A `slot` attribute on the light-DOM child routes it to the matching `name` inside the shadow tree; anything with no `slot` attribute falls through to the one unnamed `<slot>`. This is the Shadow DOM equivalent of the `content_for 'blocks'` pattern covered in [15. All About Blocks](/all-about-blocks/) — a defined set of content holes, filled from outside.

### Styling projected content from inside: `::slotted()`

```css
/* Inside the shadow root's own <style> */
::slotted(h3) {
  font-size: var(--font-size-h3, 1.25rem);
  margin: 0;
}
```

`::slotted()` is the one way a shadow tree's CSS can reach *out* and style the light-DOM content sitting in one of its slots — but only the slotted element itself, not anything nested inside it (`::slotted(h3 span)` doesn't work). It's a narrow, deliberate exception to the isolation boundary, not a general-purpose selector.

## `::part()` and `exportparts`: letting the outside world style specific internals anyway

Isolation normally runs in both directions: light-DOM CSS can't reach into a shadow tree, same as a shadow tree's CSS can't leak out. `part` is the deliberate, opt-in exception, for when a component's author wants to let outside CSS target one specific internal element without exposing everything.

```js
this.shadowRoot.innerHTML = `
  <button part="increment-button">+</button>
  <span part="count">1</span>
  <button part="decrement-button">−</button>
`;
```

```css
/* Written OUTSIDE the component, in a normal {% stylesheet %} tag —
   this works precisely because "increment-button" was marked as a part */
sol-quantity-stepper::part(increment-button) {
  background: var(--color-accent);
}
```

Only elements explicitly marked `part="..."` inside the shadow root become targetable this way — everything else inside stays fully sealed off, exactly as intended. `exportparts` extends the same mechanism one level further, letting a part defined on a *nested* shadow-DOM component be re-exposed through an outer one, for a component built by composing several shadow-DOM pieces together.

:::note[Browser support: safe to use without a fallback]
Shadow DOM, `<slot>`, `::part()`, and `exportparts` have all been supported in every major browser since 2020 — there's no compatibility concern with any of this.
:::

## Declarative Shadow DOM: a shadow tree that doesn't need JavaScript to exist

Every example above calls `attachShadow()` from JavaScript — which means, same as any other script-driven behavior, the shadow content doesn't exist until that script runs. **Declarative Shadow DOM** removes that requirement, which matters specifically for a theme where markup is already server-rendered by Liquid before any JavaScript loads at all.

```liquid
{% comment %} Liquid renders this template tag directly — no JavaScript required for the shadow tree to exist {% endcomment %}
<sol-rating-display>
  <template shadowrootmode="open">
    <style>
      .stars { color: var(--color-accent); }
    </style>
    <span class="stars">{{ product.metafields.reviews.rating | default: '★★★★★' }}</span>
  </template>
</sol-rating-display>
```

The browser parses `<template shadowrootmode="open">` and attaches it as a real shadow root immediately, during HTML parsing — before `sol-rating-display.js` has even been requested, let alone executed. A custom element's own JavaScript can still run afterward to add interactivity, but the actual content and its isolated styling are present from the first paint, same as any other server-rendered Liquid markup.

:::note[Browser support: safe to use without a fallback]
Declarative Shadow DOM reached cross-browser Baseline in August 2024 — Chrome/Edge 111+, Safari 16.4+, Firefox 125+.
:::

## When this is actually the right call in a theme

Genuine Shadow DOM isolation is worth its cost specifically when a component's styling must survive contexts the theme itself doesn't control — situations where light DOM's "scoping by naming discipline" promise has nothing to protect against:

- **A component meant to be dropped into more than one theme or store**, where there's no guarantee the surrounding CSS follows this theme's own BEM-plus-prefix convention at all, let alone avoids colliding with this component's specific class names.
- **A component that must render correctly even next to an app's injected CSS**, when that app's own styles are an unknown, unreviewed quantity — a support-chat widget or a review-collection widget that can't risk a merchant's theme, or an installed app, accidentally overriding its internal layout.
- **A component wrapping genuinely complex third-party markup** — an embedded map, a payment element, a rich configurator — where the third party's own internal class names are also an unknown quantity, and a collision in either direction (the theme breaking the embed, or the embed breaking the theme) is a real risk worth engineering against.

A typical product card, announcement bar, or quantity selector — anything built once, for this one theme, consuming this theme's own design tokens — doesn't face any of these pressures, which is exactly why 30.2 recommends light DOM as the default.

## A worked example: a self-contained rating widget

```js
// assets/sol-rating-stepper.js
class SolRatingStepper extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .stepper {
          display: flex;
          align-items: center;
          gap: var(--space-sm, 0.5rem);
          font-family: var(--font-body-family, sans-serif);
        }
        button {
          font: inherit;
          cursor: pointer;
        }
      </style>
      <div class="stepper">
        <button part="decrement-button" type="button">−</button>
        <span part="count">1</span>
        <button part="increment-button" type="button">+</button>
        <slot name="label"></slot>
      </div>
    `;

    this.countElement = this.shadowRoot.querySelector('[part="count"]');

    this.shadowRoot.querySelector('[part="increment-button"]').addEventListener('click', () => {
      this.countElement.textContent = Number(this.countElement.textContent) + 1;
    });

    this.shadowRoot.querySelector('[part="decrement-button"]').addEventListener('click', () => {
      this.countElement.textContent = Math.max(1, Number(this.countElement.textContent) - 1);
    });
  }
}

customElements.define('sol-rating-stepper', SolRatingStepper);
```

```liquid
<sol-rating-stepper style="--color-accent: var(--color-accent);">
  <span slot="label">reviews found helpful</span>
</sol-rating-stepper>
```

```css
/* In a normal {% stylesheet %} tag, outside the component entirely */
sol-rating-stepper::part(increment-button),
sol-rating-stepper::part(decrement-button) {
  background: var(--color-accent);
  border-radius: 999px;
}
```

This single component demonstrates all three mechanisms at once: the `label` slot accepts ordinary light-DOM text from the section that uses it, `--color-accent` reaches in through natural custom-property inheritance with no extra work, and the two buttons are deliberately marked as `part`s specifically so an outer stylesheet can theme them — while the internal `.stepper` layout, the click handlers, and everything else about the component's internals stay fully sealed off.

## Key takeaways

- Shadow DOM's isolation isn't absolute: inherited CSS properties (including custom properties / design tokens) cross the boundary automatically; class selectors, resets, and component stylesheets do not.
- `<slot>` lets a Shadow DOM component still accept light-DOM content from outside, without that content ever leaving the normal document tree — named slots route more than one piece of content to more than one place.
- `::part()` and `exportparts` are the deliberate, opt-in exception to style isolation, letting outside CSS target specifically marked internal elements without exposing everything else.
- Declarative Shadow DOM (`<template shadowrootmode="open">`) lets a server-rendered Liquid template produce a real shadow root with no JavaScript required for the initial render — consistent with this site's progressive-enhancement rule everywhere else.
- Reach for actual Shadow DOM isolation specifically when a component needs to survive a CSS environment the theme doesn't control — a cross-theme/cross-store component, or one wrapping untrusted third-party markup — not as a default replacement for the light-DOM-plus-BEM pattern the rest of this chapter uses.

## Further reading

- [30.2. Web Components for Theme Behavior in Depth](/all-about-javascript/web-components-for-theme-behavior-in-depth/) — the light-DOM default, and the full reasoning for why most components skip Shadow DOM
- [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) — the BEM-based scoping this page's approach is an exception to
- [30.8. A Complete Web Component Example](/all-about-javascript/a-complete-web-component-example/) — a complete light-DOM component, for contrast
- [`<slot>` (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
- [Using shadow DOM (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [`::part()` (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [`exportparts` (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts)
- [Declarative Shadow DOM (web.dev)](https://web.dev/articles/declarative-shadow-dom)
