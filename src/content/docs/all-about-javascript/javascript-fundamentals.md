---
title: JavaScript Fundamentals in a Shopify Theme
description: Where theme JavaScript actually lives, what {% javascript %} really does, and the one-tag-per-file rule.
---

**TL;DR:** Where theme JavaScript actually lives, what `{% javascript %}` really does, and the one-tag-per-file rule.

## Two places JavaScript can live in a theme

| Source | Where it's written | How it reaches the page |
|---|---|---|
| `{% javascript %}` | Inside a section, block, or snippet file | Concatenated by file type into a bundled asset, injected via `content_for_header`, loaded with `defer` |
| An asset script | A `.js` file in `assets/` | Loaded explicitly, usually as an ES module: `<script type="module" src="{{ 'file.js' \| asset_url }}">` |

Small, file-specific behavior fits `{% javascript %}`. Anything meant to be reused across files, hold its own state, or grow past a handful of lines belongs in its own `assets/*.js` file instead — almost always as a [Web Component](/all-about-javascript/web-components-for-theme-behavior-in-depth/).

## `{% javascript %}`, precisely

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

Shopify concatenates `{% javascript %}` content across the theme into one bundled file **per file type** — all section-level `{% javascript %}` tags into `scripts.js`, all block-level ones into `block-scripts.js`, all snippet-level ones into `snippet-scripts.js`. Each of these is injected automatically through `content_for_header` and loaded via a `<script>` tag with the `defer` attribute — you never write that `<script>` tag yourself.

Each file's `{% javascript %}` content is also wrapped in its own self-executing anonymous function, so its variables stay inside their own closure, and a runtime error in one section's script doesn't take down another section's script on the same page.

:::caution[`{% javascript %}` does not evaluate Liquid]
Exactly like `{% stylesheet %}`, Liquid tags and output inside `{% javascript %}` aren't rendered — they're left as literal text, which at best does nothing and at worst causes a syntax error. If a script genuinely needs a setting's value, pass it through the markup as a `data-*` attribute instead:

```liquid
<div data-max-items="{{ section.settings.max_items }}">
```

```js
const container = document.querySelector('[data-max-items]');
const maxItems = Number(container.dataset.maxItems);
```

[Talking to Liquid: Data Attributes & JSON Islands](/all-about-javascript/talking-to-liquid-data-attributes-and-json-islands/) covers this in full, including what to do once a single attribute isn't enough.
:::

:::caution[One `{% javascript %}` tag per file]
Exactly like `{% stylesheet %}`, a file can have at most one `{% javascript %}` tag — a second one is a syntax error, not a way to split a file's script into separate chunks.
:::

## Instance-specific behavior: the same gotcha as CSS

`{% javascript %}` content is injected once per **file**, not once per **instance**. If the same section can be added to a page more than once, its script still only runs once overall — which is exactly why the example above queries `document.querySelectorAll('[data-dismiss]')` rather than assuming there's only one announcement bar on the page. Writing a script that assumes "there's only one of these" is the most common bug this causes; always query and loop, or scope behavior to a specific element, rather than assuming a singleton.

## Script loading: `defer`, `async`, and modules

- **`defer`** (what `{% javascript %}`'s bundled output uses automatically) downloads a script in the background without blocking page rendering, then runs it after the HTML has finished parsing, in document order relative to other deferred scripts.
- **`type="module"`** (used for a Web Component's own `assets/*.js` file, loaded explicitly) behaves like `defer` by default, and additionally gives the script its own module scope — no leaking variables onto the global `window` object the way a plain, non-module script would.

```liquid
<script type="module" src="{{ 'announcement-bar.js' | asset_url }}"></script>
```

Loading a Web Component's script this way, rather than inlining it via `{% javascript %}`, is what lets that same file be reused across sections (or across themes) without duplicating its code into every bundle it's referenced from.

## Key takeaways

- `{% javascript %}` bundles per file type (sections, blocks, snippets each get their own combined, deferred script) — reach for it only for something small and genuinely specific to the one file it's written in.
- `{% javascript %}` doesn't evaluate Liquid; pass a setting's value through a `data-*` attribute instead, read back from `dataset` in JavaScript.
- A script runs once per file, not once per instance — write it to handle zero, one, or many instances of its section on the same page, never assuming exactly one.

## Further reading

- [The `javascript` tag](https://shopify.dev/docs/api/liquid/tags/javascript) (shopify.dev)
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
