---
title: Section Performance Considerations
description: What actually costs performance in a section, and a benefit you get for free.
---

**TL;DR:** What actually costs performance in a section, and a benefit you get for free.

## The real cost: unbounded loops

A section renders on the server, every time its page loads. The most common way a section actually becomes slow is looping over an unexpectedly large array with no limit:

```liquid
{% for product in collection.products %}
  {% render 'product-card', product: product %}
{% endfor %}
```

If that collection holds 2,000 products, this section renders 2,000 product cards every single time the page loads — regardless of how many a shopper could usefully see at once. This is exactly why [Worked Example: Building a Simple Section](/sections-blocks-snippets/worked-example/) used `limit` from the start:

```liquid
{% for product in collection.products limit: 8 %}
```

Always cap a loop over any collection, array, or object list that isn't already a small, merchant-controlled set of blocks — the actual item count in production is rarely the same as whatever test collection you built against.

## Keep anything rendered inside a large loop lightweight

A snippet rendered once is cheap. The same snippet rendered inside an uncapped loop is whatever it costs, multiplied by however many items that loop actually runs over in production. Keep the per-item work inside a loop as simple as possible — avoid an expensive filter chain or a nested loop inside something that itself might run dozens or hundreds of times.

## A performance benefit you get automatically

It's reasonable to worry that every section's `{% stylesheet %}` and `{% javascript %}` bloats every page's bundle, even for sections not used on that specific page. That's not how it works: Shopify only includes the CSS and JavaScript for sections actually present on the page being rendered — a section type used only on your homepage contributes nothing to a product page's bundle, even though both section files live in the same theme. This is one of the real, structural benefits of the `{% stylesheet %}`/`{% javascript %}` pattern from [CSS in Shopify Themes](/css-in-shopify-themes/) and [JavaScript in Shopify Themes](/javascript-in-shopify-themes/) over one giant, hand-maintained global CSS/JS file that ships in full on every page regardless of what's actually used.

## More sections, more render time

Beyond any one section's own cost, a page with many sections simply does more total rendering work and produces more DOM nodes than a page with fewer. This isn't a reason to avoid sections — it's the whole point of the architecture — but it's worth noticing if a page assembled from a large number of sections feels slow: the fix is often removing or consolidating sections that aren't earning their place, not optimizing any individual one further.

## Key takeaways

- The most common real performance problem in a section is an unbounded loop over a collection or array that turns out much larger in production than in testing — always cap it with `limit`.
- CSS and JavaScript bundling is already scoped to the sections actually present on a given page — an unused section elsewhere in the theme doesn't cost anything on pages that don't use it.
- A slow page assembled from many sections is often a sign to reconsider which sections are actually earning their place, not a signal to micro-optimize any one of them.

## Further reading

- [Theme performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
