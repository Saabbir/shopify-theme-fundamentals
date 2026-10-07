---
title: Real-World Section Patterns
description: Carousels, tabs, and split layouts — common, slightly harder patterns worked through.
---

**TL;DR:** Carousels, tabs, and split layouts — common, slightly harder patterns worked through.

These three patterns show up constantly in real themes. Each one combines two ideas: blocks as repeated content items (see [Section Fundamentals](/all-about-sections/section-fundamentals/)), and a native Web Component — a custom HTML element registered with `customElements.define`, written in its own `assets/*.js` file — managing the interactive behavior on top of that markup.

## Pattern 1: a carousel, where blocks are slides

A carousel section's schema looks almost identical to any other section that repeats content — the carousel-specific part is entirely in the CSS and JavaScript, not the schema:

```json
{
  "name": "Carousel",
  "blocks": [
    {
      "type": "slide",
      "name": "Slide",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "heading", "label": "Heading" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Carousel",
      "blocks": [{ "type": "slide" }, { "type": "slide" }, { "type": "slide" }]
    }
  ]
}
```

Each block renders as one slide, through the same `{% content_for 'blocks' %}` mechanism covered in [Section Fundamentals](/all-about-sections/section-fundamentals/). A Web Component wraps the whole thing and handles moving between slides:

```js
class CarouselElement extends HTMLElement {
  connectedCallback() {
    this.slides = this.querySelectorAll('[data-sol-carousel-slide]');
    this.currentIndex = 0;

    const nextButton = this.querySelector('[data-sol-carousel-next]');
    nextButton.addEventListener('click', () => this.showNextSlide());
  }

  showNextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.slides.forEach((slide, index) => {
      slide.hidden = index !== this.currentIndex;
    });
  }
}

customElements.define('sol-carousel', CarouselElement);
```

:::note[The markup must work before JavaScript loads]
A Web Component should always enhance markup that already works without it — all slides should be visible (or stacked in a scrollable row) by default in plain HTML/CSS, with JavaScript only adding the "show one at a time with next/previous controls" behavior on top. A shopper with JavaScript disabled, or a slow connection where the script hasn't loaded yet, should still be able to see every slide's content.
:::

## Pattern 2: tabs, where blocks are panels

A tabs section follows the same block-per-item idea, but needs the Web Component to manage which panel is currently visible and keep a row of tab buttons in sync with it:

```json
{
  "name": "Tabs",
  "blocks": [
    {
      "type": "tab",
      "name": "Tab",
      "settings": [
        { "type": "text", "id": "label", "label": "Tab label" },
        { "type": "richtext", "id": "content", "label": "Content" }
      ]
    }
  ]
}
```

```js
class TabsElement extends HTMLElement {
  connectedCallback() {
    this.tabButtons = this.querySelectorAll('[data-sol-tab-button]');
    this.tabPanels = this.querySelectorAll('[data-sol-tab-panel]');

    this.tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => this.showTab(index));
    });
  }

  showTab(index) {
    this.tabButtons.forEach((button, buttonIndex) => {
      button.setAttribute('aria-selected', buttonIndex === index);
    });

    this.tabPanels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });
  }
}

customElements.define('sol-tabs', TabsElement);
```

:::caution[This is simplified — real accessible tabs need more]
A fully accessible tabs pattern also needs arrow-key navigation between tabs, careful `role="tablist"`/`role="tab"`/`role="tabpanel"` usage, and managing focus correctly when a tab is selected — more than this example shows. Treat this as the structural idea (blocks as panels, one Web Component coordinating buttons and panels), not a drop-in accessible implementation. The planned Accessibility Deep Dive chapter covers the full ARIA tab pattern properly.
:::

## Pattern 3: a split layout, with a side toggle

A simpler pattern: an image on one side and text on the other, where a single setting controls which side the image is on. This needs no blocks and no JavaScript at all — just a `select` setting and a modifier class:

```json
{
  "name": "Image with text",
  "settings": [
    {
      "type": "select",
      "id": "image_position",
      "label": "t:labels.image_position",
      "options": [
        { "value": "left", "label": "t:options.left" },
        { "value": "right", "label": "t:options.right" }
      ],
      "default": "left"
    }
  ]
}
```

```liquid
{% liquid
  assign image_position = section.settings.image_position
%}
<div class="split-layout split-layout--image-{{ image_position }}">
  ...
</div>
```

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.split-layout--image-right {
  direction: rtl;
}
```

This is the same settings-driven-modifier-class idea from [Turning Settings into CSS Variables](/design-tokens/turning-settings-into-css-variables/) — no new concept, just a common real-world use of it.

## Key takeaways

- A carousel and a tabs section both use blocks as the repeated item (slide, panel) and a Web Component to manage which one is currently shown — the schema is ordinary; the behavior lives entirely in JavaScript.
- Always make sure the non-JavaScript version of a pattern like this is still usable — every slide or panel visible by default, enhanced rather than hidden by JavaScript that hasn't run yet.
- Not every pattern needs blocks or JavaScript — a simple layout toggle is often just one `select` setting and a modifier class.
- Full accessible tabs need more than the simplified example above — arrow-key navigation, ARIA roles, and focus management, covered properly in the planned Accessibility Deep Dive.

## Further reading

- [ARIA Authoring Practices Guide: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) (w3.org)
