import { visit } from 'unist-util-visit';

/**
 * Builds a Map of page slug -> page number ("17.1") by walking the sidebar
 * config. Only items whose label already starts with a "<chapter>.<page>. "
 * prefix (e.g. "17.1. Color Fundamentals") get an entry -- group labels
 * ("17. All About Colors") and unnumbered items ("Overview") are skipped,
 * since a page needs its own two-level number before its sections can be
 * numbered one level deeper.
 *
 * Reads straight from the same sidebar array passed to `starlight()`, so
 * there's a single source of truth for page numbers: renumber a page in
 * the sidebar and its section numbers move with it automatically.
 */
export function buildPageNumberMap(sidebarItems) {
  const pageNumbers = new Map();

  const PAGE_NUMBER_PATTERN = /^(\d+\.\d+)\.\s/;

  function walk(items) {
    for (const item of items) {
      if (item.items) {
        walk(item.items);
        continue;
      }
      if (!item.slug) continue;
      const match = PAGE_NUMBER_PATTERN.exec(item.label);
      if (match) {
        pageNumbers.set(item.slug, match[1]);
      }
    }
  }

  walk(sidebarItems);
  return pageNumbers;
}

/** Derives a page's content-collection slug ("all-about-colors/color-fundamentals")
 * from the absolute file path Astro's markdown pipeline hands the plugin. */
function slugFromFilePath(filePath) {
  if (!filePath) return null;
  const normalized = filePath.replace(/\\/g, '/');
  const marker = 'src/content/docs/';
  const markerIndex = normalized.lastIndexOf(marker);
  if (markerIndex === -1) return null;

  let slug = normalized.slice(markerIndex + marker.length);
  slug = slug.replace(/\.(md|mdx)$/, '');
  slug = slug.replace(/\/index$/, '');
  if (slug === 'index') slug = '';
  return slug;
}

/**
 * Adds a `data-section-number` attribute (e.g. "17.1.5") to every H2 on a
 * page that has a page number in `pageNumbers`. This is deliberately a
 * data attribute, not `title` -- a `title` becomes the browser's native
 * tooltip, which is slow to appear, can't be styled, and (per direct
 * feedback) wasn't showing up at all in practice. A data attribute instead
 * gives `custom.css` a hook to render the number as a small, styled badge
 * that fades in on hover, matching how Starlight already reveals its own
 * anchor-link icon on hover -- see the `h2[data-section-number]` rules in
 * custom.css. Deliberately does not touch the heading's visible text or its
 * auto-generated anchor id -- the number is a cross-reference aid, not part
 * of the heading itself, and showing it as permanent on-page text would be
 * one more thing to keep in sync by hand.
 */
export function rehypeSectionNumbers(pageNumbers) {
  return (tree, file) => {
    const filePath = file.path ?? file.history?.[0];
    const slug = slugFromFilePath(filePath);
    if (slug === null) return;

    const pageNumber = pageNumbers.get(slug);
    if (!pageNumber) return;

    let sectionCount = 0;
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2') return;
      sectionCount += 1;
      node.properties = node.properties ?? {};
      node.properties['data-section-number'] = `${pageNumber}.${sectionCount}`;
    });
  };
}
