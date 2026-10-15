---
title: A Complete Example
description: One icon-rendering snippet combining the dispatcher pattern, custom-property sizing, currentColor, and both accessibility paths at once.
---

**TL;DR:** One icon-rendering snippet combining the dispatcher pattern, custom-property sizing, `currentColor`, and both accessibility paths at once.

```liquid
{% comment %}
  snippets/icon-render.liquid

  Accepts:
  - icon: the icon name, passed straight through to snippets/icon.liquid
  - size: a CSS length (defaults to 1.25rem)
  - label: optional. If present, the icon is treated as meaningful and
    gets a real <title> + role="img". If absent, it's decorative.
{% endcomment %}
{% liquid
  assign size = size | default: '1.25rem'
%}

<svg
  class="icon"
  viewBox="0 0 20 20"
  fill="currentColor"
  style="--icon-size: {{ size }};"
  {% if label %}
    role="img"
  {% else %}
    aria-hidden="true"
    focusable="false"
  {% endif %}
>
  {% if label %}<title>{{ label }}</title>{% endif %}
  {% render 'icon', icon: icon %}
</svg>
```

```css
svg.icon {
  width: var(--icon-size, 1.25rem);
  height: var(--icon-size, 1.25rem);
  flex-shrink: 0;
}
```

## Using it decoratively, next to visible text

```liquid
<button class="button">
  {% render 'icon-render', icon: 'heart' %}
  {{ 'products.add_to_wishlist' | t }}
</button>
```

No `label` is passed — the icon renders `aria-hidden="true"`, correctly silent to a screen reader, since the button's own visible text already says everything a shopper (sighted or not) needs to know.

## Using it as the only label, inside an icon-only button

```liquid
<button class="button button--icon-only" aria-label="{{ 'products.add_to_wishlist' | t }}">
  {% render 'icon-render', icon: 'heart' %}
</button>
```

Still no `label` passed to the snippet — even here, the icon itself stays decorative (`aria-hidden="true"`), because the *button* carries the real `aria-label`, per [37.4. Icon Accessibility: Decorative vs. Meaningful](/all-about-icons/icon-accessibility-decorative-vs-meaningful/)'s guidance to label the containing control rather than the icon, whenever a containing control exists.

## Using it standalone, with no containing control at all

```liquid
<span class="order-status">
  {% render 'icon-render', icon: 'error', label: 'products.status.backordered' | t, size: '1rem' %}
  {{ 'products.status.backordered' | t }}
</span>
```

Here, passing `label` switches the snippet to `role="img"` with a real `<title>` — appropriate specifically because, in this contrived example, imagine the icon appeared with no text at all; passing `label` demonstrates the mechanism even though the visible text alongside it would normally make this decorative instead. A real instance of this pattern is an icon-only status indicator in a dense table or list, where there's genuinely no room for accompanying text.

## Why one snippet, with a `label` parameter, instead of two separate snippets

A single snippet that branches on whether `label` was passed (rather than `icon-decorative.liquid` and `icon-meaningful.liquid` as two separate files) keeps the sizing, `currentColor`, and dispatcher-rendering logic in exactly one place — the accessibility branching is a small, local `{% if %}`, not a reason to duplicate everything else about how an icon renders.

## Key takeaways

- One icon-rendering snippet, parameterized by an optional `label`, correctly covers all three real accessibility situations: decorative next to text, decorative but the only visible content (labeled via the containing control instead), and genuinely standalone with no control to label.
- Passing `label` is the deliberate trigger that switches the icon from `aria-hidden` to `role="img"` plus a real `<title>` — getting this right means knowing, at each call site, whether a containing control already provides the accessible name.
- Keeping sizing, coloring, and the dispatcher call in one shared snippet (rather than duplicating them across separate decorative/meaningful snippets) is what keeps every icon's rendering logic in sync.

## Further reading

- [37.1. Icon Fundamentals: Inline SVG vs. a Sprite System](/all-about-icons/icon-fundamentals-inline-svg-vs-a-sprite-system/)
- [37.2. A Reusable Icon Snippet Pattern](/all-about-icons/a-reusable-icon-snippet-pattern/)
- [37.4. Icon Accessibility: Decorative vs. Meaningful](/all-about-icons/icon-accessibility-decorative-vs-meaningful/)
