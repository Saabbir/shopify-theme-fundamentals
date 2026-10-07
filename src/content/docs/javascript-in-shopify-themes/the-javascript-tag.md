---
title: "The {% javascript %} Tag"
description: A smaller, file-scoped counterpart to {% stylesheet %} — and the same Liquid limitation.
---

**TL;DR:** A smaller, file-scoped counterpart to `{% stylesheet %}` — and the same Liquid limitation.

## The basic pattern

```liquid
{% comment %} sections/announcement-bar.liquid {% endcomment %}
<div class="announcement-bar" data-announcement-bar>
  <button data-dismiss>Dismiss</button>
  <p>{{ section.settings.message }}</p>
</div>

{% javascript %}
  document.querySelectorAll('[data-dismiss]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('[data-announcement-bar]').remove();
    });
  });
{% endjavascript %}
```

Like [`{% stylesheet %}`](/css-in-shopify-themes/stylesheet-and-style-tags/), the content of `{% javascript %}` gets compiled into the theme's bundled JavaScript asset rather than running inline exactly where it's written — cached and loaded efficiently, the same way a hand-written `.js` file in `assets/` would be.

## The same limitation as `{% stylesheet %}`, for the same reason

`{% javascript %}` doesn't evaluate Liquid either — you can't write `{{ section.settings.x }}` directly inside one and have it resolve to a real value. If a script genuinely needs a setting's value, pass it through the HTML itself, as a `data-*` attribute, and read it from there in JavaScript:

```liquid
<div data-max-items="{{ section.settings.max_items }}">
```

```js
const container = document.querySelector('[data-max-items]');
const maxItems = Number(container.dataset.maxItems);
```

This is the exact same idea as the CSS custom property technique from [Turning Settings into CSS Variables](/design-tokens/turning-settings-into-css-variables/) — a Liquid-rendered value lives in the markup itself, and the non-Liquid-aware code (CSS there, JavaScript here) reads it from the markup instead of trying to access the setting directly.

## When `{% javascript %}` is the right size, and when it isn't

Reach for `{% javascript %}` only for something small and genuinely specific to the one file it's written in — a dismiss button, a simple class toggle. The moment the behavior needs to be reused across multiple sections, needs its own internal state, or grows past a handful of lines, it's a sign you want a proper [Web Component](/javascript-in-shopify-themes/web-components-for-theme-behavior/) in its own file instead — covered next.

## Key takeaways

- `{% javascript %}` compiles into the theme's bundled JS, the same way `{% stylesheet %}` compiles into bundled CSS — and it has the same restriction: no direct access to Liquid variables or settings.
- Pass a setting's value into JavaScript through a `data-*` attribute on the markup, the same pattern used for CSS custom properties.
- Reserve `{% javascript %}` for something small and file-specific; reach for a Web Component once behavior needs to be reused, hold state, or grows beyond a few lines.

## Further reading

- [The `javascript` tag](https://shopify.dev/docs/api/liquid/tags/javascript) (shopify.dev)
