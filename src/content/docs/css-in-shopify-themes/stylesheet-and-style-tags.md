---
title: "{% stylesheet %} and {% style %}"
description: The real difference between the two — including the fact that explains the CSS-variable pattern from earlier chapters.
---

**TL;DR:** The real difference between the two — including the fact that explains the CSS-variable pattern from earlier chapters.

Both tags get CSS into a theme. They are not interchangeable, and the reason comes down to one fact worth knowing precisely.

## `{% stylesheet %}`: static CSS, bundled and cached

```liquid
{% stylesheet %}
  .hero-banner {
    padding-block: 4rem;
    text-align: center;
  }
{% endstylesheet %}
```

Shopify collects every section and block's `{% stylesheet %}` content and compiles it into the theme's actual CSS asset — cached and served efficiently, the same way a hand-written `.css` file in `assets/` would be.

:::caution[The fact that explains the CSS-custom-property pattern from Design Tokens]
`{% stylesheet %}` does **not** evaluate Liquid. Writing `color: {{ section.settings.accent_color }};` inside a `{% stylesheet %}` block doesn't work — it's treated as literal, static CSS text, not rendered. This is exactly why the technique from [7.4. Turning Settings into CSS Custom Properties](/design-tokens/turning-settings-into-css-variables/) exists in the first place: since `{% stylesheet %}` can't read a setting directly, the setting's value has to arrive some other way — as an inline CSS custom property on the element itself, which `{% stylesheet %}` can then read with `var()`, because `var()` is just ordinary CSS, not Liquid.
:::

## `{% style %}`: Liquid-evaluated, inline, per-render

```liquid
{% style %}
  :root {
    --accent-color: {{ settings.accent_color }};
  }
{% endstyle %}
```

`{% style %}` **does** evaluate Liquid — it renders directly into the page as an inline `<style>` tag, at the exact point it appears, every time the page renders. This is the right tool for CSS that genuinely needs a setting's value computed directly into it, rather than relayed through an inline custom property on one specific element — most commonly, defining global, page-wide custom properties once, near the top of `theme.liquid`.

## Choosing between them

| | `{% stylesheet %}` | `{% style %}` |
|---|---|---|
| Evaluates Liquid | No | Yes |
| Where it ends up | Bundled into the theme's compiled CSS asset | Inline `<style>` tag, exactly where written |
| Typical use | A section or block's own styling (the vast majority of CSS you'll write) | Defining global custom properties from settings, usually once, near the top of the page |

In practice, nearly everything you write is a `{% stylesheet %}` block, following the pattern from every section and block example since [3.1. What Is a Section?](/sections-blocks-snippets/what-is-a-section/). `{% style %}` is reached for far less often — mainly for the kind of root-level, settings-driven custom properties a whole page needs access to.

## Key takeaways

- `{% stylesheet %}` is static CSS, compiled into the theme's CSS asset — it cannot read Liquid variables or settings directly.
- `{% style %}` does evaluate Liquid, rendering inline exactly where it's written — use it specifically when a setting's value needs to be computed directly into CSS, like a global custom property.
- The inline-custom-property technique from [Design Tokens](/design-tokens/turning-settings-into-css-variables/) exists precisely because `{% stylesheet %}` can't read settings on its own.

## Further reading

- [The `stylesheet` tag](https://shopify.dev/docs/api/liquid/tags/stylesheet) (shopify.dev)
- [The `style` tag](https://shopify.dev/docs/api/liquid/tags/style) (shopify.dev)
