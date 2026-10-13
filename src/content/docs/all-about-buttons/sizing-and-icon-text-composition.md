---
title: Sizing & Icon+Text Composition
description: Button width is a different setting pattern from section padding — plus how an icon and a label actually share one button.
---

**TL;DR:** Button width is a different setting pattern from section padding — plus how an icon and a label actually share one button.

## Button width isn't a spacing setting

[Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/) established `padding_top`/`padding_bottom` as the standard pattern for a section or block's own spacing. A button's **width** is a genuinely different kind of setting, and Horizon's real pattern shows why:

```json
{
  "type": "select",
  "id": "width",
  "options": [
    { "value": "fit-content", "label": "t:options.fit_content" },
    { "value": "custom", "label": "t:options.custom" }
  ],
  "default": "fit-content"
},
{
  "type": "range",
  "id": "custom_width",
  "min": 0, "max": 100, "step": 1, "unit": "%",
  "default": 100,
  "visible_if": "{{ block.settings.width == 'custom' }}"
}
```

A `select` first, not a bare `range` — because "how wide should this button be" has a genuinely different default answer than "how much space should this have." Fit-content (hug the label, the normal default for a button) and a merchant-chosen percentage are different enough concepts that collapsing them into one slider would force an artificial default percentage onto every button, rather than letting most buttons just be exactly as wide as their own label.

```liquid
{%- if settings.width == 'custom' -%}
  --size-style-width: {{ settings.custom_width }}%;
{%- else -%}
  --size-style-width: {{ settings.width }};
{%- endif -%}
```

```css
.button {
  width: var(--size-style-width);
}
```

Worth noticing: when `width` is `fit-content`, that string is passed straight through into the CSS custom property as a literal value — `fit-content` is itself a valid CSS `width` value, so there's no extra branching needed for the default case; only `custom` needs a real calculation.

:::note[Desktop and mobile get entirely separate width settings]
Horizon's real button block repeats this whole pattern twice — `width`/`custom_width` for desktop, `width_mobile`/`custom_width_mobile` for mobile — rather than one setting plus a breakpoint override. A button that should hug its label on desktop but fill the available width on mobile (a common, deliberate choice for a primary call-to-action) needs genuinely independent settings, not a single percentage that happens to look different at different widths.
:::

## Icon + text: a flex row with a gap, not manual spacing

```html
<button type="button" class="button">
  <svg class="button__icon" aria-hidden="true" width="16" height="16"><!-- ... --></svg>
  <span class="button__label">Add to cart</span>
</button>
```

```css
.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}
```

`gap` on a flex container is the right tool here — it spaces the icon and label consistently without needing a margin on one side of the icon that then has to be carefully *not* duplicated if the icon is ever moved to the other side of the label, or removed entirely.

**Size the icon in `em`, not a fixed pixel value**, so it scales with the button's own font size rather than needing a separate override every time a button's text size changes:

```css
.button__icon {
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
}
```

`flex-shrink: 0` keeps the icon from being squeezed smaller than its own size if the label text is long enough to make the button tight for space — a shrunk icon looks like a rendering bug, not a deliberate design choice.

## An icon-only button needs a label a sighted user never sees

```html
<button type="button" class="button button--icon-only" aria-label="Add to wishlist">
  <svg class="button__icon" aria-hidden="true"><!-- ... --></svg>
</button>
```

The moment a button has no visible text at all — a heart icon for "add to wishlist," a cart icon for "view cart" — it needs an `aria-label` carrying the exact words a sighted user would otherwise read. Without it, a screen reader has nothing to announce for the button at all (an `<svg>` marked `aria-hidden="true"`, correctly, contributes no accessible text of its own), and the button is effectively unlabeled and unusable by anyone not looking at its icon and guessing its meaning.

:::caution[`aria-hidden="true"` on the icon is correct — but only because the label moved to `aria-label`]
Hiding a purely decorative icon from assistive technology is the right call generally — a redundant, unlabeled graphic next to text that already says the same thing adds noise, not information. But when the icon is the *only* content, hiding it without adding `aria-label` elsewhere removes the button's only accessible name entirely. The two choices have to be made together, not independently.
:::

## Key takeaways

- Button width is a `select` (fit-content vs. a merchant-chosen percentage), not a `range` — a genuinely different pattern from section/block padding, because "how wide" has a different natural default than "how much space."
- Desktop and mobile button width are commonly two entirely separate setting pairs, not one setting with a breakpoint override.
- Space an icon and label with `gap` on a flex container, not manual margin — and size the icon in `em` so it scales with the button's own font size.
- An icon-only button needs `aria-label` carrying the words a sighted user would otherwise read — `aria-hidden="true"` on the icon is only correct once that label exists somewhere.

## Further reading

- [`snippets/size-style.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/snippets/size-style.liquid)
- [`blocks/button.liquid` (Horizon, GitHub)](https://github.com/Shopify/horizon/blob/main/blocks/button.liquid)
- [Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/)
