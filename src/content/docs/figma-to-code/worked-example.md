---
title: "Worked Example: One Figma Frame, Start to Finish"
description: The entire process from this chapter, start to finish, applied to one concrete design.
---

**TL;DR:** The entire process from this chapter, start to finish, applied to one concrete design.

## The design

Picture a design with two frames for the same section — a desktop version and a mobile version — showing a simple "Why Shop With Us" section:

```
Desktop frame:
┌─────────────────────────────────────────────────────┐
│                 Why Shop With Us                     │
│         We stand behind every order we ship.         │
│                                                       │
│   [icon]          [icon]            [icon]           │
│   Fast Shipping    Easy Returns     24/7 Support      │
│   Orders ship      30 days to      Real humans,       │
│   within 24 hours. send it back.   day or night.      │
└─────────────────────────────────────────────────────┘

Mobile frame:
┌───────────────────┐
│  Why Shop With Us  │
│  We stand behind…  │
│                     │
│      [icon]        │
│   Fast Shipping     │
│   Orders ship...    │
│                     │
│      [icon]        │
│   Easy Returns      │
│   30 days to...     │
│                     │
│      [icon]        │
│   24/7 Support      │
│   Real humans...    │
└───────────────────┘
```

## Step 1: Read the design

Following [9.1. Reading a Design Like a Developer](/figma-to-code/reading-a-design-like-a-developer/): there's one visually distinct, self-contained region — a clear candidate for a single **section**. Inside it, three near-identical items repeat (icon, short heading, short description) — a clear candidate for a **block**, looped, rather than three hand-copied pieces of markup.

## Step 2: Separate content from structure

Following [9.2. Content vs. Structure](/figma-to-code/content-vs-structure/): applying the swap test, "Fast Shipping" / "Easy Returns" / "24/7 Support" and their descriptions are content — a merchant should be free to change this text, add a fourth callout, or remove one, without the code caring. The number 3 shown in the design is not a structural requirement; it's just how many examples this design happened to include.

## Step 3: Decide the pieces

Following [9.3. Section, Block, Snippet, or Fixed Markup?](/figma-to-code/section-block-snippet-or-fixed-markup/): one section (the whole region), one block type (one callout: icon, heading, text). No snippet is needed — this exact markup doesn't appear to repeat anywhere else in the broader design. No nested group block either — a merchant rearranging items into a flat row is enough; there's no indication they'd need rows-within-rows.

## Step 4: Plan the responsive behavior

Following [9.4. Planning Responsive Behavior](/figma-to-code/planning-responsive-behavior/): "three columns become one column" is the whole difference between the frames — a CSS grid that switches column count at a breakpoint, no setting and no Liquid logic involved. The section's own top/bottom spacing is the one value worth an actual desktop/mobile setting pair, following [7.3. Spacing & Layout Tokens](/design-tokens/spacing-and-layout-tokens/).

## Step 5: Write the code

```liquid
{% comment %} sections/why-shop-with-us.liquid {% endcomment %}
{% liquid
  assign heading = section.settings.heading
  assign subheading = section.settings.subheading
  assign padding_top = section.settings.padding_top | default: 60
  assign padding_bottom = section.settings.padding_bottom | default: 60
  assign padding_top_mobile = section.settings.padding_top_mobile | default: 32
  assign padding_bottom_mobile = section.settings.padding_bottom_mobile | default: 32
%}

<div
  class="why-shop-with-us"
  style="
    --padding-top: {{ padding_top }}px;
    --padding-bottom: {{ padding_bottom }}px;
    --padding-top-mobile: {{ padding_top_mobile }}px;
    --padding-bottom-mobile: {{ padding_bottom_mobile }}px;
  "
>
  <h2>{{ heading }}</h2>
  {% if subheading != blank %}
    <p>{{ subheading }}</p>
  {% endif %}

  <div class="why-shop-with-us__grid">
    {% for block in section.blocks %}
      {% if block.type == 'callout' %}
        <div class="why-shop-with-us__callout" {{ block.shopify_attributes }}>
          {% if block.settings.icon != blank %}
            <img src="{{ block.settings.icon | image_url: width: 80 }}" alt="" width="40" height="40">
          {% endif %}
          <h3>{{ block.settings.heading }}</h3>
          <p>{{ block.settings.text }}</p>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

{% stylesheet %}
  .why-shop-with-us {
    padding-top: var(--padding-top);
    padding-bottom: var(--padding-bottom);
    text-align: center;
  }

  .why-shop-with-us__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }

  @media screen and (max-width: 749px) {
    .why-shop-with-us {
      padding-top: var(--padding-top-mobile);
      padding-bottom: var(--padding-bottom-mobile);
    }

    .why-shop-with-us__grid {
      grid-template-columns: 1fr;
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Why shop with us",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:labels.heading", "default": "Why Shop With Us" },
    { "type": "text", "id": "subheading", "label": "t:labels.subheading" },
    { "type": "range", "id": "padding_top", "label": "t:labels.padding_top", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 60 },
    { "type": "range", "id": "padding_bottom", "label": "t:labels.padding_bottom", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 60 },
    { "type": "range", "id": "padding_top_mobile", "label": "t:labels.padding_top_mobile", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 32 },
    { "type": "range", "id": "padding_bottom_mobile", "label": "t:labels.padding_bottom_mobile", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 32 }
  ],
  "blocks": [
    {
      "type": "callout",
      "name": "Callout",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "t:labels.icon" },
        { "type": "text", "id": "heading", "label": "t:labels.heading" },
        { "type": "textarea", "id": "text", "label": "t:labels.text" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Why shop with us",
      "blocks": [
        { "type": "callout", "settings": { "heading": "Fast Shipping", "text": "Orders ship within 24 hours." } },
        { "type": "callout", "settings": { "heading": "Easy Returns", "text": "30 days to send it back." } },
        { "type": "callout", "settings": { "heading": "24/7 Support", "text": "Real humans, day or night." } }
      ]
    }
  ]
}
{% endschema %}
```

## Why it matches the design without copying it literally

Notice what did and didn't make it into the code. The three specific callouts from the design became the **preset's** three starting blocks — not three hardcoded settings — so a merchant genuinely can add a fourth, remove one, or reword any of them, exactly the flexibility the content/structure separation in step 2 called for. The column-to-single-column shift lives entirely in the stylesheet's `@media` block, with no Liquid or settings involved. The one thing that *did* become real settings — top/bottom spacing — is the one value from this whole design actually worth giving a merchant direct control over.

## Key takeaways

- The design's specific example content becomes a preset's starting values, not hardcoded settings — preserving the flexibility the content/structure separation calls for.
- Responsive layout changes (columns to one column) are CSS's job alone; only genuinely merchant-adjustable values (like spacing) become real settings.
- This same five-step process — read, separate, decide, plan responsiveness, build — applies to any design, not just this specific example.

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
