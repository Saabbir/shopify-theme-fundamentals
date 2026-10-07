---
title: Web Components for Theme Behavior
description: The standard pattern for anything more substantial than a one-off toggle — and the rule that makes it safe.
---

**TL;DR:** The standard pattern for anything more substantial than a one-off toggle — and the rule that makes it safe.

A **Web Component** is a native browser feature — a custom HTML tag you define yourself, with its own JavaScript behavior, using nothing but the browser's built-in APIs. No framework, no build step required, which lines up directly with the point made all the way back in [What Is a Shopify Theme?](/theme-architecture/what-is-a-shopify-theme/): a theme can run with zero build tooling at all.

## The basic shape

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

```liquid
{% comment %} sections/announcement-bar.liquid {% endcomment %}
<my-announcement-bar>
  <p>{{ section.settings.message }}</p>
  <button data-dismiss>Dismiss</button>
</my-announcement-bar>

<script type="module" src="{{ 'announcement-bar.js' | asset_url }}"></script>
```

Three pieces, each with its own clear job: the JavaScript class lives in its own file in `assets/`, as an ES module (`type="module"`); `customElements.define` registers it under a custom tag name; and the section renders that tag directly in its markup, loading the script alongside it.

## Why a custom tag name needs its own prefix

`customElements.define` registers a global tag name, shared across the entire page — including anything an installed app might also define. Prefixing your own custom elements (`my-announcement-bar` here; pick one consistent prefix for your own theme) avoids colliding with a tag name an app happens to choose too. This is the same instinct as the CSS class prefix from [Naming & Scoping](/css-in-shopify-themes/naming-and-scoping/), just applied to a different global namespace.

## The one rule that matters more than any specific syntax

:::caution[Progressive enhancement: markup must work before the script loads]
Never hide content or controls behind JavaScript that hasn't run yet. The `<my-announcement-bar>` example above renders its message and dismiss button correctly in the HTML from the start — the script only adds the dismiss *behavior*; it was never required for the content to be visible or readable. If a component's markup looks broken or empty until its script finishes loading, that's a sign the component was built backwards: enhance working markup with JavaScript, don't use JavaScript to create markup that didn't already work.
:::

This also directly protects accessibility: a screen reader or a slow connection shouldn't produce a broken experience just because a script hasn't executed yet.

## Managing ARIA state in JavaScript, not just markup

An interactive component's accessibility isn't finished once the markup has the right ARIA attributes — a component that *changes state* needs to update those attributes in JavaScript too.

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

`aria-expanded` here starts correct in the markup (covered by the component's initial HTML) and stays correct because the component's own JavaScript updates it every time the state actually changes — not just once, at load.

## Key takeaways

- A Web Component's JavaScript lives in its own `assets/*.js` file as an ES module, registered with `customElements.define`, and loaded from whichever section or snippet uses it.
- Prefix your custom tag names consistently, for the same collision-avoidance reason as the CSS class prefix from the previous chapter.
- Markup must work before the script loads — JavaScript should enhance already-functional HTML, never be a requirement for basic content to appear. Update ARIA attributes in JavaScript whenever a component's state actually changes, not just once in the initial markup.

## Further reading

- [Using custom elements (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
