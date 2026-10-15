---
title: Reading a Design Like a Developer
description: What to look for before writing any code — repetition, boundaries, and what's content versus pattern.
---

**TL;DR:** What to look for before writing any code — repetition, boundaries, and what's content versus pattern.

The biggest mistake when turning a design into code is starting to write markup before you've actually finished looking at the design. A few minutes of deliberate reading, before any file exists, saves far more time than it costs.

## Look for repetition first

Scan the whole design for anything that visually repeats — three feature callouts side by side, a row of customer logos, a grid of products. Repetition is the single strongest signal you're looking at something that should loop over a list of items, rather than three (or however many) separately hand-written copies of near-identical markup.

```
[ icon ]        [ icon ]        [ icon ]
Fast Shipping   Easy Returns    24/7 Support
Lorem ipsum...  Lorem ipsum...  Lorem ipsum...
```

Three items that share the same shape (icon, heading, short text) but differ in content is exactly the pattern behind a block type, looped by a merchant adding as many as they want — not three separate, individually hand-coded pieces of markup.

## Look for boundaries

Find where one visually distinct region of the page ends and the next begins — usually a change in background color, a clear gap, or a shift in layout. Each of these regions is a strong candidate for its own section. A design that reads, top to bottom, as "hero image, then a row of callouts, then testimonials, then a newsletter signup" is really telling you it wants four separate sections, each independently addable, removable, and reorderable — not one enormous, monolithic template.

## Separate "this specific content" from "this kind of content"

A design always shows you one specific, finished example — this exact headline, this exact photo, these exact three testimonials. Your job isn't to recreate that one example; it's to build something general enough to hold *any* content a merchant puts into it, including headlines, photos, and item counts the original design never showed you at all. Keep asking, the whole time you're reading: "is this specific thing I'm looking at the actual content, or just a convincing example of the kind of content this needs to hold?" The next page, [9.2. Content vs. Structure](/figma-to-code/content-vs-structure/), turns this question into a concrete test.

## A short list of questions worth asking about every region of a design

- Would a merchant plausibly want to add, remove, or reorder this independently of what's around it?
- Does this look like it would vary per product, per page, or per merchant — or does it look identical no matter what?
- Is there an obvious repeating pattern inside this region, and if so, how many repeats does the design happen to show (keeping in mind that number is probably not a hard limit)?
- Is there anything here that's clearly decorative or structural chrome — something that would never plausibly need its own setting?

## Key takeaways

- Repetition in a design (even just two or three similar-looking items) is the strongest signal for a block type, looped rather than hand-copied.
- Visually distinct regions, stacked top to bottom, usually map directly to separate sections.
- A design shows you one example of content — read past the specific words and images to the shape of content they're demonstrating.

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
