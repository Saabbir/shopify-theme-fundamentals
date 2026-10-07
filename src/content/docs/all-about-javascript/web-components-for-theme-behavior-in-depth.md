---
title: Web Components for Theme Behavior in Depth
description: Every lifecycle callback that matters for a theme, observed attributes, and encapsulation without Shadow DOM.
---

**TL;DR:** Every lifecycle callback that matters for a theme, observed attributes, and encapsulation without Shadow DOM.

## The basic shape, as a reminder

```js
// assets/announcement-bar.js
class AnnouncementBar extends HTMLElement {
  connectedCallback() {
    this.dismissButton = this.querySelector('[data-dismiss]');
    this.dismissButton.addEventListener('click', () => this.dismiss());
  }

  dismiss() {
    this.setAttribute('hidden', '');
  }
}

customElements.define('my-announcement-bar', AnnouncementBar);
```

A **Web Component** is a native browser feature — a custom HTML tag with its own JavaScript behavior, defined with nothing but built-in browser APIs. No framework, no build step, which is exactly why it fits a theme that can run with zero build tooling at all.

## The full lifecycle, not just `connectedCallback`

A custom element has four lifecycle callbacks the browser calls automatically — `connectedCallback` is the one most examples show, but it isn't the only one that matters.

| Callback | Fires when |
|---|---|
| `connectedCallback` | The element is inserted into the document — including every time, not just the first, if it's removed and re-inserted |
| `disconnectedCallback` | The element is removed from the document |
| `attributeChangedCallback` | One of the element's *observed* attributes changes |
| `adoptedCallback` | The element is moved into a new document (rare in a theme — relevant mainly if content is moved into an `<iframe>`) |

```js
class Countdown extends HTMLElement {
  connectedCallback() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  tick() {
    // update displayed time remaining
  }
}
```

`disconnectedCallback` matters specifically because the theme editor can remove a section's markup and re-render it, covered in [Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/) — a component that starts an interval or attaches a global event listener in `connectedCallback` but never cleans it up in `disconnectedCallback` leaks a running timer or listener every time a merchant edits that section, even though the original element is gone.

## Observed attributes: reacting to an attribute changing in place

```js
class QuantitySelector extends HTMLElement {
  static get observedAttributes() {
    return ['max'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'max') {
      this.input.max = newValue;
    }
  }

  connectedCallback() {
    this.input = this.querySelector('input');
  }
}
```

`observedAttributes` is a static getter listing which attributes should trigger `attributeChangedCallback` when they change — any attribute not listed here is silently ignored by this mechanism, even if it does change. This is the right tool when an element's own attribute (set either in the original markup or changed later by other code) needs to drive some internal update, separately from whatever happens in `connectedCallback` at setup time.

## Encapsulation without Shadow DOM

The browser's Web Components spec includes Shadow DOM, which gives an element a genuinely isolated internal DOM tree with its own scoped styles. Most theme components deliberately skip it: Shadow DOM's style isolation cuts both ways — it also blocks a theme's own design tokens (the custom properties from [CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/)) from reaching inside the shadow boundary, unless they're explicitly inherited, which they aren't by default for anything beyond a plain custom property's natural inheritance.

A plain custom element (`class extends HTMLElement`, no `attachShadow` call) renders its children directly into the normal document tree — "light DOM." It gets its scoping instead from the same BEM-plus-prefix naming discipline used everywhere else in a theme's CSS, covered in [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/), rather than from the browser enforcing isolation. That trade — giving up hard style isolation in exchange for every component automatically inheriting the theme's design tokens — is almost always the right one for a storefront theme, where consistent, settings-driven styling across every component matters more than one component being fully sealed off from the rest of the page.

## Why a custom tag name needs its own prefix

`customElements.define` registers a tag name in one global registry shared across the entire page, including anything an installed app also defines. Prefixing every custom element this theme defines (`my-announcement-bar`, `my-quantity-selector`, one consistent prefix) avoids colliding with a tag name an app happens to choose too — the same instinct as the CSS class prefix and the design-token variable prefix covered elsewhere in this site.

## The rule that matters more than any specific syntax: progressive enhancement

:::caution[Markup must work before the script loads]
Never hide content or controls behind JavaScript that hasn't run yet. The announcement bar example at the top of this page renders its message and dismiss button correctly in the HTML from the start — the script only adds the dismiss *behavior*; it was never required for the content to be visible or readable. If a component's markup looks broken or empty until its script finishes loading, the component was built backwards: enhance working markup with JavaScript, don't use JavaScript to create markup that didn't already work.
:::

This also directly protects accessibility — a screen reader or a slow connection shouldn't produce a broken experience just because a script hasn't executed yet.

## Managing ARIA state in JavaScript, not just markup

```js
class Accordion extends HTMLElement {
  connectedCallback() {
    this.trigger = this.querySelector('[data-trigger]');
    this.panel = this.querySelector('[data-panel]');
    this.trigger.addEventListener('click', () => this.toggle());
  }

  toggle() {
    const isOpen = this.trigger.getAttribute('aria-expanded') === 'true';
    this.trigger.setAttribute('aria-expanded', String(!isOpen));
    this.panel.hidden = isOpen;
  }
}
```

A component's accessibility isn't finished once its initial markup has the right ARIA attributes — a component that *changes state* needs to update those attributes in JavaScript too, every time the state actually changes, not just once at load.

## Key takeaways

- A custom element has four lifecycle callbacks, not just `connectedCallback` — `disconnectedCallback` specifically matters in a theme, since the editor can remove and re-render a section's markup live.
- `observedAttributes` plus `attributeChangedCallback` is the mechanism for reacting to one of an element's own attributes changing after it's already connected.
- Most theme components deliberately skip Shadow DOM, trading hard style isolation for automatic access to the theme's own design tokens — scoping comes from naming discipline instead.
- Markup must work before a component's script loads, and ARIA state must be kept current in JavaScript every time it actually changes, not just set once in the initial HTML.

## Further reading

- [Using custom elements (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [Theme Editor Events in Depth](/all-about-javascript/theme-editor-events-in-depth/)
- [Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/)
