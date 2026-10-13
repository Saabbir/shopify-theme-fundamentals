---
title: The Media Gallery
description: product.media, the one array that actually covers every media type a product can carry — not just images.
---

**TL;DR:** `product.media`, the one array that actually covers every media type a product can carry — not just images.

## images vs. media: two arrays, one of them incomplete

```liquid
{{ product.images }}
{{ product.media }}
```

`product.images` only ever contains images — a product with a 3D model or a video attached has that media sitting outside this array entirely, with no indication it even exists. `product.media` is the complete picture: every image, video, 3D model, and externally-hosted video (a YouTube or Vimeo embed), sorted by the order they were added. Reach for `product.media` by default; `product.images` is only worth using when a theme genuinely, deliberately wants images only and nothing else.

## Telling media types apart: media_type

Every item in `product.media` is a `media` object with a shared set of properties (`id`, `alt`, `position`, `preview_image`) plus a `media_type` that tells you which of four real types you're actually holding:

```liquid
{% for item in product.media %}
  {% case item.media_type %}
    {% when 'image' %}
      {{ item | image_url: width: 800 | image_tag }}
    {% when 'video' %}
      {{ item | media_tag }}
    {% when 'external_video' %}
      {{ item | external_video_tag }}
    {% when 'model' %}
      {{ item | model_viewer_tag }}
  {% endcase %}
{% endfor %}
```

Each media type carries its own additional properties beyond the shared ones — a `video` has `sources` and `duration`, a `model` has its own 3D-specific properties — covered in full on [Media Fundamentals](/media-deep-dive/media-fundamentals/) and the rest of that chapter, which this page deliberately doesn't repeat.

## Filtering the gallery down to one type

```liquid
{% assign product_images = product.media | where: 'media_type', 'image' %}
{% assign product_videos = product.media | where: 'media_type', 'video' %}
```

The [`where` filter](https://shopify.dev/docs/api/liquid/filters/where) against `media_type` is the standard way to build, say, an image-only thumbnail strip while still supporting a video or model as the main gallery's featured item — without maintaining two entirely separate data sources.

## The featured item isn't always the first array entry

```liquid
{{ product.featured_image }}
{{ product.featured_media }}
```

`product.featured_image` is always an `image` specifically — the first image, even if a video or model technically comes first in `product.media`'s actual order. `product.featured_media` is the true first item in the gallery, whatever type it happens to be. Use `featured_media` for an actual "first thing to show" gallery; use `featured_image` specifically when a theme needs a guaranteed image (an Open Graph/social-share meta tag, say, which can't use a video or 3D model).

:::note[A product recommendation or filtered search result can return a different featured_media]
`product.featured_media`'s own documentation notes a real exception: in search results or a filtered collection, the *variant's* most relevant media is returned instead of the product's own first item — relevance here is based on the active search terms or filters. Worth knowing if a featured image seems to "change" between viewing a product directly and finding it through a filtered search.
:::

## A variant can override the gallery too

```liquid
{{ variant.featured_image }}
{{ variant.image }}
{{ variant.featured_media }}
```

A specific variant can have its own image assigned (the photo of the actual blue mug, distinct from the product's general gallery) — `nil` when it doesn't. The common pattern is to swap the displayed gallery image when a shopper picks a variant that has one, falling back to the product's own `featured_media` otherwise:

```liquid
{% assign gallery_image = variant.featured_image | default: product.featured_image %}
```

## Key takeaways

- `product.media` is the complete gallery across every media type; `product.images` silently omits anything that isn't an image.
- `media_type` (`image`, `video`, `external_video`, `model`) is how a gallery loop decides which tag/filter to render each item with.
- `product.featured_image` is always an image specifically; `product.featured_media` is the true first item regardless of type — pick the one that matches what the context actually needs.
- A variant's own `featured_image`, when present, is the standard way to swap gallery media as a shopper changes their selection.

## Further reading

- [Liquid objects: media](https://shopify.dev/docs/api/liquid/objects/media) (shopify.dev)
- [Media Fundamentals](/media-deep-dive/media-fundamentals/) — every media type's own additional properties and the filters/tags each one needs
- [Art Direction with picture](/media-deep-dive/art-direction-with-picture/)
