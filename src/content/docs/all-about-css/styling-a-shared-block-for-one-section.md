---
title: Styling a Shared Block for One Section
description: The decision tree for overriding a reusable block's CSS in just one placement, from a custom property to a block setting.
---

**TL;DR:** The decision tree for overriding a reusable block's CSS in just one placement, from a custom property to a block setting, and the one wrinkle that changes everything once the section is reusable too.

## The problem: one block, several sections, one placement that needs to look different

A global block — a block defined once in `blocks/`, usable inside any section's `blocks` array — is deliberately generic. That's what makes it reusable. But "generic" eventually collides with "this one section needs it to look slightly different," and `{% stylesheet %}` gives no built-in way to say "this rule, but only when this block is inside that section."

The example below uses an `icon-text` block — an icon, a heading, and a line of body text — because it's a block simple enough to show the whole decision tree without the example itself becoming the thing to study.

```liquid
{% comment %} blocks/icon-text.liquid {% endcomment %}
{% doc %}
  Renders an icon above a heading and a short line of body text.
  Used inside any section that accepts blocks — see sections/hero-banner.liquid
  and sections/feature-callouts.liquid for two sections that both use it.
{% enddoc %}

{% liquid
  assign icon = block.settings.icon
  assign heading = block.settings.heading
  assign body = block.settings.body
%}

<div class="icon-text" {{ block.shopify_attributes }}>
  {% if icon != blank %}
    <span class="icon-text__icon">{{ icon }}</span>
  {% endif %}
  {% if heading != blank %}
    <h3 class="icon-text__heading">{{ heading }}</h3>
  {% endif %}
  {% if body != blank %}
    <p class="icon-text__body">{{ body }}</p>
  {% endif %}
</div>

{% stylesheet %}
  .icon-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .icon-text__icon {
    font-size: var(--icon-text-icon-size, 32px);
  }

  .icon-text__heading {
    font-size: 1.125rem;
    margin: 0;
  }

  .icon-text__body {
    margin: 0;
    color: var(--color-text-subdued);
  }
{% endstylesheet %}

{% schema %}
{
  "name": "t:names.icon_text",
  "settings": [
    {
      "type": "text",
      "id": "icon",
      "label": "t:labels.icon"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "t:labels.heading"
    },
    {
      "type": "text",
      "id": "body",
      "label": "t:labels.body"
    }
  ],
  "presets": [
    {
      "name": "t:names.icon_text",
      "settings": {
        "icon": "★",
        "heading": "Fast shipping",
        "body": "Orders ship within 24 hours."
      }
    }
  ]
}
{% endschema %}
```

Two sections use it exactly as shipped: `hero-banner` drops in a single large `icon-text` block beside its headline, and `feature-callouts` repeats it three times in a row to make a benefits strip. Both need it to look slightly different from the default above — for different reasons, which is why they call for different fixes.

![Two section mockups side by side. On the left, hero-banner, with a headline and a single large icon-text block beside it. On the right, feature-callouts, with the same icon-text block repeated three times in a row at a smaller size — same file, same markup, two very different placements.](../../../assets/shared-block-css-mockup.svg)

## Deciding what to expose as a hook, before any of this is possible

Step 1 only works because `icon-text.liquid` already happened to write `font-size: var(--icon-text-icon-size, 32px);` instead of `font-size: 32px;`. That's not automatic — it's a decision the block's author made while writing it, and if they'd hardcoded the value instead, there'd be no hook to redefine from `hero-banner`'s side at all. Worth being deliberate about it, rather than either hardcoding everything (and finding out later there's no hook where one's needed) or turning every declaration into a custom property on the off chance it'll matter somewhere.

Part of this is already decided for you. Any value that comes from a real schema setting is exposed as a custom property automatically — that's the inline-style pattern [29.1. CSS Fundamentals in a Shopify Theme](/all-about-css/css-fundamentals/) covers in its `{% stylesheet %}` does not evaluate Liquid note: a setting's value is written into `style="--x: ...;"`, and the stylesheet reads it back with `var(--x)`. You don't choose whether `block.settings.icon_color` becomes a custom property; the pattern does that for you. The real decision only applies to values *you* chose as the block's author that aren't backed by a setting — plain implementation details, like `icon-text.liquid`'s `32px`.

For those, ask whether the value is about *where the block sits* or *what the block is*. Sizing, spacing, and a block's one signature color tend to genuinely vary by placement — a hero needs a bigger icon than a dense row of three, and that's a fact about context, not a flaw in the block. Those are worth a hook. Structural choices — flex vs. grid, the DOM shape, anything load-bearing for accessibility like a focus outline — define what the component *is*; turning those into overridable knobs risks two placements of "the same block" quietly becoming different components, or a stray override breaking something nobody meant to touch.

In practice, the cheapest way to apply this isn't predicting every future need up front — it's writing the block with ordinary hardcoded values first, and converting exactly one declaration to a custom property the moment a second real section actually needs a different value for it, using the original hardcoded value as the fallback:

```diff
- font-size: 32px;
+ font-size: var(--icon-text-icon-size, 32px);
```

The default appearance doesn't change — the fallback is the value that was already there — so there's nothing to regress. This is the same "wait for a second real case before promoting" instinct step 3 below uses for turning a selector override into a block setting; it just applies one step earlier, to deciding whether a value gets a custom-property hook at all.

Name the hook using this site's established component-tier token pattern — `--{component}-{property}[-{state}]`, covered in full in [17.7. Building a Token System](/all-about-colors/building-a-token-system/) — so `--icon-text-icon-size`, not `--size` or `--icon-size`. The same collision risk that applies to class names applies here: a generic `--size` custom property is exactly the kind of name two unrelated blocks could each define without meaning to, and the one that loads last would silently win.

## Four ways to scope an override, from lightest to heaviest

### 1. It already reads a custom property — redefine the property, not the rule

`hero-banner` wants its one `icon-text` block's icon noticeably larger than the compact size `feature-callouts` uses for its row of three. `icon-text__icon`'s font size already reads `var(--icon-text-icon-size, 32px)`, so nothing about the rule itself needs to change — only the value reaching it does:

```liquid
{% comment %} sections/hero-banner.liquid {% endcomment %}
<div class="hero-banner" style="--icon-text-icon-size: 56px;">
  <h1 class="hero-banner__heading">{{ section.settings.heading }}</h1>
  {% content_for 'blocks' %}
</div>
```

Custom properties inherit down the DOM (covered in full in [29.4. CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/)), so every `icon-text` block rendered inside `.hero-banner` picks up `56px` without `icon-text.liquid` ever needing to know `hero-banner` exists. `feature-callouts` never sets this property at all, so its `icon-text` blocks keep the block's own `32px` fallback. This is the cheapest fix available, and it's only available because the block already exposed the one value that needed to change as a custom property.

### 2. The change is structural — add a one-level override in the section's own stylesheet

`feature-callouts` has a different problem: it wants its three headings centered, but `icon-text__heading` is left-aligned by default and there's no custom property for text alignment to redefine. This isn't a value swap — it's a different rule entirely, and it only applies inside this one section.

```liquid
{% comment %} sections/feature-callouts.liquid {% endcomment %}
<div class="feature-callouts">
  {% content_for 'blocks' %}
</div>

{% stylesheet %}
  .feature-callouts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .feature-callouts .icon-text__heading {
    text-align: center;
  }
{% endstylesheet %}
```

`feature-callouts.liquid` is reaching into a class it doesn't define — normally the exact mistake [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) warns about. It's safe here specifically because `feature-callouts` renders `icon-text` directly, one level deep, through `{% content_for 'blocks' %}`. Shopify's CSS subsetting always loads a parent's stylesheet whenever a child it renders is on the page, so `.feature-callouts`'s rule and `icon-text`'s own markup are guaranteed to arrive together. `shopify theme check`'s `ValidScopedCSSClass` rule only flags a dependency between two *unrelated* files — a parent styling a class belonging to a block it actually renders is exactly the case it allows.

### 3. More than one or two sections need it — promote it to a real setting on the block

Say a third section, then a fourth, also wants `icon-text`'s heading centered. Copy-pasting `.that-section .icon-text__heading { text-align: center; }` into every new section's stylesheet works, but now the same visual choice is implemented N times, in N different files, with no single place that owns it. Once it's not just this one section's quirk, it's a real option the block itself should offer:

```liquid
{% comment %} blocks/icon-text.liquid — schema addition {% endcomment %}
{
  "type": "select",
  "id": "text_alignment",
  "label": "t:labels.text_alignment",
  "options": [
    { "value": "left", "label": "t:options.left" },
    { "value": "center", "label": "t:options.center" }
  ],
  "default": "left"
}
```

```liquid
<div class="icon-text icon-text--align-{{ block.settings.text_alignment }}" {{ block.shopify_attributes }}>
```

```css
.icon-text--align-center {
  align-items: center;
  text-align: center;
}
```

Now every section gets the choice for free, straight from the block's own settings panel, with no section ever needing to style `icon-text` on its behalf again. This is also the point at which `feature-callouts`'s override from step 2 should be deleted — a block setting replaces it outright rather than sitting alongside it.

### 4. The need is about one specific instance, not a section type — scope to that instance

Occasionally the ask is narrower still: not "every `feature-callouts` section," but "this one block, on this one page." `{% stylesheet %}` can't do this — its content is injected once per *file*, not once per *instance*, so a rule written there applies everywhere that file's markup appears, including every other page that happens to use the same section. An inline `<style>` tag keyed to the block's own `id` is the one tool that reaches a single instance:

```liquid
<div class="icon-text" {{ block.shopify_attributes }}>
  {% if block.settings.custom_icon_color != blank %}
    <style>
      [data-block-id="{{ block.id }}"] .icon-text__icon {
        color: {{ block.settings.custom_icon_color }};
      }
    </style>
  {% endif %}
  <span class="icon-text__icon" data-block-id="{{ block.id }}">{{ icon }}</span>
  ...
</div>
```

Reach for this only once you're sure the need really is per-instance — it's the most expensive option, printing a `<style>` tag into the page for every block that uses it, and it's easy to mistake "no section does this yet" for "no section ever will," when step 3 would have been the better long-term answer.

## The wrinkle: when the *section* is global too

Step 2 quietly assumed `feature-callouts` is a section built for one specific page. If it's instead a general-purpose section a merchant can add anywhere — the normal case for most sections in a theme — its own root class is shared across every page that adds it, exactly like `icon-text`'s class is shared across every section that uses it. A selector override written into `feature-callouts.liquid`'s own stylesheet then doesn't just affect the one page it was written for; it changes *every* instance of `feature-callouts`, site-wide, the moment a merchant adds a second one somewhere else.

Once both the block and the section it lives in are reusable, step 2's file-level override stops being section-specific at all — it's effectively step 3 in disguise, just living in the wrong file. The real fix is usually to skip step 2 and go straight to step 3: push the setting onto the block, since a block's `block.id` already makes it instance-scoped in a way a section's root class generally isn't for CSS purposes. If the choice genuinely belongs to the section rather than the block — spacing between items, say, not anything about `icon-text` itself — give the *section* its own setting and drive it through a custom property on the section's root (back to step 1's technique, just with the section as the one defining the value instead of redefining someone else's).

## Key takeaways

- Work through the options in order of cost: redefine a custom property the block already reads, then a one-level selector override in the section's own stylesheet, then a real setting on the block, then — only for a genuinely one-off placement — an instance-scoped inline `<style>` tag.
- A section styling a class belonging to a block it renders directly is the one cross-file dependency `ValidScopedCSSClass` allows, because CSS subsetting guarantees the parent's stylesheet loads whenever the child does.
- `{% stylesheet %}` is injected once per file, not once per instance — an override that needs to apply to only one placement of a repeatable section or block has to use an instance-scoped inline `<style>` tag instead.
- If the section hosting the override is itself reusable, a selector override in its stylesheet isn't section-specific — it leaks to every instance of that section. Push the setting onto the block instead, since `block.id` already scopes it per-placement.

## Further reading

- [29.3. Naming & Scoping at Scale](/all-about-css/naming-and-scoping-at-scale/) — the `ValidScopedCSSClass` rule this page's step 2 relies on
- [29.4. CSS Custom Properties & Design Tokens in Depth](/all-about-css/css-custom-properties-and-design-tokens-in-depth/) — why inheritance is what makes step 1 work at all
- [29.12. Custom CSS: The Platform-Controlled Setting](/all-about-css/custom-css-the-platform-controlled-setting/) — what to reach for when none of these four steps are the right tool, because the change is a merchant's one-off preference rather than a developer-authored option
