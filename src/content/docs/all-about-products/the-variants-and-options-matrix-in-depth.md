---
title: The Variants & Options Matrix in Depth
description: Building a real option picker that correctly matches a shopper's choices back to one specific variant.
---

**TL;DR:** Building a real option picker that correctly matches a shopper's choices back to one specific variant.

## Two different views of the same options

A product exposes its options two ways, and they answer two different questions:

```liquid
{{ product.options }}
{{ # => ["Size", "Strength"] }}

{{ product.options_with_values }}
{{ # => an array of product_option objects, each with .name and .values }}
```

`product.options` is just the option *names* — useful for a quick count or a simple list, but not enough to build a picker, since it doesn't include the actual choices (Small/Medium/Large) available for each one. `product.options_with_values` is the one an option picker actually loops over:

```liquid
{% for option in product.options_with_values %}
  <fieldset>
    <legend>{{ option.name }}</legend>
    {% for value in option.values %}
      <label>
        <input type="radio" name="option-{{ option.position }}" value="{{ value }}">
        {{ value }}
      </label>
    {% endfor %}
  </fieldset>
{% endfor %}
```

`option.position` is the option's 1-based index (Size is usually 1, Strength 2) — useful as a stable identifier for the input's `name` attribute, since option names themselves could theoretically repeat in unusual data.

## Reading a variant's own options back out

Each variant carries the specific value it has for every option, in two matching forms:

```liquid
{{ variant.options }}
{{ # => ["S", "Low"] — positional array, lines up with product.options }}

{{ variant.options_with_values }}
{{ # => [{ name: "Size", value: "S" }, { name: "Strength", value: "Low" }] }}
```

:::caution[variant.option1/option2/option3 are deprecated]
Older code (and some tutorials) reads a variant's option values off `variant.option1`, `variant.option2`, `variant.option3` directly. Shopify's own documentation now marks these deprecated in favor of `variant.options` and `variant.options_with_values` — the newer pair works identically regardless of how many options a product actually has (one, two, or three), while the positional properties assume exactly three slots whether a product uses them or not. Write new code against `options`/`options_with_values`.
:::

## The real problem a picker has to solve: matching a combination to a variant

Selecting "Medium" and "Low" doesn't directly give you a variant — it gives you two separate choices that have to be matched against every variant's own option values to find the one specific variant that corresponds to that exact combination. This matching has to happen in JavaScript, since it responds to a shopper's live clicks, not a fresh page load:

```js
// assets/variant-picker.js
class VariantPicker extends HTMLElement {
  constructor() {
    super();
    this.variants = JSON.parse(this.querySelector('[data-variants-json]').textContent);
  }

  connectedCallback() {
    this.addEventListener('change', () => this.updateSelectedVariant());
  }

  getSelectedOptions() {
    const inputs = this.querySelectorAll('input:checked');
    return Array.from(inputs).map((input) => input.value);
  }

  findMatchingVariant(selectedOptions) {
    return this.variants.find((variant) => {
      return variant.options.every((value, index) => value === selectedOptions[index]);
    });
  }

  updateSelectedVariant() {
    const selectedOptions = this.getSelectedOptions();
    const matchedVariant = this.findMatchingVariant(selectedOptions);

    if (matchedVariant) {
      this.dispatchEvent(
        new CustomEvent('variant:changed', { detail: { variant: matchedVariant }, bubbles: true })
      );
    }
  }
}

customElements.define('variant-picker', VariantPicker);
```

The Liquid side just needs to hand the full variant list to JavaScript as data, once, which [30.4. Talking to Liquid: Data Attributes & JSON Islands](/all-about-javascript/talking-to-liquid-data-attributes-and-json-islands/) covers in general — here, specifically:

```liquid
<variant-picker>
  {% # the option picker markup from above goes here %}
  <script type="application/json" data-variants-json>
    {{ product.variants | json }}
  </script>
</variant-picker>
```

## Not every combination is purchasable

A real product frequently has gaps — a "Small / Red" combination that was never created because that color never shipped in that size. `findMatchingVariant` returning `undefined` for a selected combination is exactly this case, not a bug: the UI's job is to disable that specific combination before a shopper can select it, typically by pre-computing which option values are still reachable given what's already selected, and disabling the rest.

:::tip[Sold out is not the same as unavailable]
A matched variant that exists but has no stock (`variant.available` is `false`) is a different UI state from a combination that was never created at all (no matching variant found). The first is "sold out, but a real, specific thing" — commonly still shown, just disabled or labeled. The second shouldn't be selectable in the first place.
:::

## Key takeaways

- `product.options` is names only; `product.options_with_values` is what an option picker actually renders from.
- `variant.options`/`variant.options_with_values` are the current, correct way to read a variant's own option values — not the deprecated `option1`/`option2`/`option3`.
- Matching a shopper's selected combination to a specific variant has to happen in JavaScript, comparing each variant's `options` array against the currently selected values in order.
- A missing match (no variant for a given combination) and a matched-but-sold-out variant are two different states, and a real option picker needs to handle both distinctly.

## Further reading

- [Liquid objects: product_option](https://shopify.dev/docs/api/liquid/objects/product_option) (shopify.dev)
- [Liquid objects: variant](https://shopify.dev/docs/api/liquid/objects/variant) (shopify.dev)
- [30.4. Talking to Liquid: Data Attributes & JSON Islands](/all-about-javascript/talking-to-liquid-data-attributes-and-json-islands/)
- [8.1. The Product Form](/forms/the-product-form/) — wiring a matched variant's ID into the actual add-to-cart submission
