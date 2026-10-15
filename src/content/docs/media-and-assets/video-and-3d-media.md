---
title: Video & 3D Media
description: "Rendering uploaded video, external video, and 3D models correctly, without hand-building a <video> tag yourself."
---

**TL;DR:** Rendering uploaded video, external video, and 3D models correctly, without hand-building a `<video>` tag yourself.

Shopify provides dedicated filters for each media type beyond a plain image, each one generating the correct, complete markup for that specific kind of media — rather than you assembling a `<video>` or `<model-viewer>` tag by hand.

## Video uploaded directly to Shopify

A `video`-type setting (from [6.1. Section & Block Settings: Every Type](/schema-and-settings/section-and-block-settings-every-type/)) returns a video object, rendered with a dedicated filter that builds a complete, working `<video>` element:

```liquid
{{ section.settings.video | video_tag: controls: true }}
```

This generates the right `<source>` elements for the formats Shopify has transcoded the upload into, so the browser can pick whichever one it supports — you never need to know or list those formats yourself.

## External video (YouTube, Vimeo)

A `video_url`-type setting returns a reference to an external video, rendered with its own matching filter:

```liquid
{{ section.settings.external_video | external_video_tag }}
```

This embeds the correct player for whichever platform the merchant linked to, without you writing separate markup for each platform you want to support.

## 3D and AR models

A product can have 3D model files among its media. Finding one, and rendering it, both go through dedicated mechanisms too:

```liquid
{% assign model = product.media | where: 'media_type', 'model' | first %}
{% if model %}
  {{ model | model_viewer_tag }}
{% endif %}
```

`model_viewer_tag` generates a `<model-viewer>` element — a Web Component, in the same sense covered in [11.2. Web Components for Theme Behavior](/javascript-in-shopify-themes/web-components-for-theme-behavior/), just one Shopify provides for you rather than one you write yourself — letting a shopper rotate and (on a supporting device) view the model in AR.

:::note[Check exact filter options against current docs]
Each of these filters accepts its own set of options (autoplay, loop, specific player controls, and similar) beyond what's shown here. The pattern — a dedicated filter per media type, rather than hand-building the tag — is the main thing worth internalizing; check [Shopify's filter reference](https://shopify.dev/docs/api/liquid/filters) for the full, current set of options each one accepts.
:::

## Key takeaways

- Each media type beyond a plain image has its own dedicated rendering filter (`video_tag`, `external_video_tag`, `model_viewer_tag`) that generates complete, correct markup — avoid hand-assembling a `<video>` or `<model-viewer>` tag yourself.
- `product.media` can hold more than one media type; filter it (`where: 'media_type', 'model'`) to find the specific kind you need.
- Check a filter's current full set of options against Shopify's own docs rather than assuming the minimal examples here cover everything it supports.

## Further reading

- [The `video_tag` filter](https://shopify.dev/docs/api/liquid/filters/video_tag) (shopify.dev)
- [The `model_viewer_tag` filter](https://shopify.dev/docs/api/liquid/filters/model_viewer_tag) (shopify.dev)
