---
title: Content vs. Structure
description: The single most useful question for not confusing what a design happens to show with what the code needs to support.
---

**TL;DR:** The single most useful question for not confusing what a design happens to show with what the code needs to support.

**Structure** is the shape that stays constant — a heading above a row of three cards, a grid with a fixed number of columns. **Content** is whatever specific thing fills that shape — this particular heading text, this particular photo, these particular three cards' worth of text. A design shows you both mixed together, as one finished picture. Separating them cleanly is most of what "turning a design into code" actually means.

## The test: swap every word and photo

Here's the concrete version of the question from the previous page: **if a merchant replaced every single word and image in this design with completely different ones, would the code still work correctly?**

- If yes — the code was built around *structure*, and the specific words/images were always meant to be *content*. This is correct.
- If no — something in the code assumes a detail the design happened to show, rather than the general shape behind it. That's a sign structure and content got mixed up somewhere.

## A concrete example of getting this wrong

Imagine the design shows exactly three feature callouts, each with a short, one-line description. It's tempting to write:

```liquid
<div class="callout">{{ section.settings.callout_1_text }}</div>
<div class="callout">{{ section.settings.callout_2_text }}</div>
<div class="callout">{{ section.settings.callout_3_text }}</div>
```

This technically reproduces the design exactly — but only the design's one specific example. The moment a merchant wants a fourth callout, or just two, or a description three lines long instead of one, the structure (three fixed, numbered settings) actively fights against it. The number "3" was content — a detail of this one design — mistakenly baked into the structure.

The corrected version treats "a callout" as a block type a merchant can add as many of as they want (covered mechanically in [What Is a Block?](/sections-blocks-snippets/what-is-a-block/)), with no assumption at all about how many there will be:

```liquid
{% for block in section.blocks %}
  <div class="callout">{{ block.settings.text }}</div>
{% endfor %}
```

## Why this connects to stress-testing from earlier chapters

This is the same instinct behind handling an empty or unconfigured state, from the [Sections, Blocks & Snippets worked example](/sections-blocks-snippets/worked-example/) — in both cases, the fix is building for content you haven't seen yet, not just the specific example in front of you. A design with a very long headline, zero callouts, or a missing image is exactly the kind of case the design itself will never show you, but the finished code still has to handle.

## Key takeaways

- Structure is the shape that stays fixed; content is whatever fills it. A design always shows you one specific example of both, mixed together.
- The test: if every word and image changed, would the code still work? If not, a detail of the specific design got baked into the structure by mistake.
- A design's exact item count, word count, or specific example almost never belongs in the structure itself — it belongs in settings, blocks, or plain content a merchant controls.

## Further reading

- [Theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) (shopify.dev)
