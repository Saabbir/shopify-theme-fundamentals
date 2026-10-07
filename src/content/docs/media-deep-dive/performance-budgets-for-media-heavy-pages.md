---
title: Performance Budgets for Media-Heavy Pages
description: Setting and enforcing a real limit on how much a page is allowed to weigh.
---

**TL;DR:** Setting and enforcing a real limit on how much a page is allowed to weigh.

## The problem: media grows without anyone deciding it should

Nobody sets out to build a slow, heavy page. It happens gradually — a hero image here, an autoplaying background video there, a product gallery with eight full-size photos — each individual addition seeming reasonable on its own, with nobody looking at the total. A **performance budget** is a way of making that total a deliberate decision instead of an accident.

## What a budget actually looks like

A performance budget is a concrete, numeric limit agreed on ahead of time — most commonly, a maximum total page weight, or a maximum weight specifically for images and video combined:

- Total page weight under roughly 2–3 MB for a typical page.
- Images and video combined under roughly half of that total.
- No single image over a set file size (several hundred KB, for instance), after the responsive `srcset` sizing from [Media Fundamentals](/media-deep-dive/media-fundamentals/) has already done its job.

The exact numbers matter less than having any agreed number at all — a budget with specific thresholds gives everyone building the theme a shared, checkable target, instead of a vague sense that "the page shouldn't be too heavy."

## Checking against the budget

Browser developer tools (the Network tab, filtered by total transferred size) give a direct, real reading of what a page actually weighs once built — this is the simplest way to check a page against a budget without any special tooling. Lighthouse (covered in the planned Performance Deep Dive chapter) goes further, flagging specific oversized images and giving an overall performance score, but the Network tab's plain transferred-size total is often enough to catch a page that's clearly over budget.

## What to do when a page is over budget

Once a page measurably exceeds its budget, the fix is rarely "compress everything a little more" — it's usually one specific decision:

- **Cut something.** Does this page actually need six hero-sized images, or would three make the same point? The cheapest performance win is often content that shouldn't have been added in the first place.
- **Downgrade something from video to image, or from autoplay to a static poster.** A looping background video rarely needs to be video at all if a well-chosen still image would read the same way to a shopper scrolling past it.
- **Defer something.** An image gallery's later images, or a video further down the page, can load lazily (see [Media Fundamentals](/media-deep-dive/media-fundamentals/) and [Video Loading & Autoplay Strategy](/media-deep-dive/video-loading-and-autoplay-strategy/)) rather than all at once on first load.

## Key takeaways

- A performance budget is a concrete, agreed-on numeric limit (total page weight, or media weight specifically) — having any number at all is more valuable than the exact figure chosen.
- The Network tab's transferred-size total is enough to check a page against a budget without specialized tooling.
- Going over budget is usually best solved by cutting, downgrading, or deferring something specific — not by uniformly compressing everything a little more.

## Further reading

- [Theme performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
- [Section Performance Considerations](/all-about-sections/section-performance-considerations/)
