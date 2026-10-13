// Scrolls the left sidebar so the active page's link is visible on load.
//
// Starlight already does two things correctly on its own: it server-renders
// the <details> group containing the active page already open, and it
// restores a *previously saved* scroll position when you navigate back to a
// page you were already browsing in the same tab session. What it doesn't do
// is scroll to the active link on a fresh visit — a direct link, a new tab,
// or a hard refresh — when there's no saved scroll position yet. With 30+
// top-level groups in this sidebar, that means landing on a deep page with
// the sidebar still scrolled to the very top, nowhere near where you are.
//
// This fills that one gap, without fighting Starlight's own restore: it only
// acts when the active link isn't already visible inside the sidebar.
(function () {
  function init() {
    // Matches the breakpoint Starlight's own sidebar-scroll-restore script
    // uses (see @astrojs/starlight's SidebarPersister.astro) — below it, the
    // sidebar is a hidden mobile menu rather than an always-visible pane, and
    // its dimensions aren't meaningful while closed.
    if (!window.matchMedia('(min-width: 50em)').matches) return;

    var scroller = document.getElementById('starlight__sidebar');
    if (!scroller) return;

    var active = scroller.querySelector('a[aria-current="page"]');
    if (!active) return;

    var scrollerRect = scroller.getBoundingClientRect();
    var activeRect = active.getBoundingClientRect();

    var alreadyVisible = activeRect.top >= scrollerRect.top && activeRect.bottom <= scrollerRect.bottom;
    if (alreadyVisible) return;

    // Center the active link within the sidebar's own scroll area — adjusts
    // scroller.scrollTop directly, the same property Starlight's own restore
    // script uses, so this never touches the main page's scroll position.
    var offsetWithinScroller = activeRect.top - scrollerRect.top;
    var centeringAdjustment = scrollerRect.height / 2 - activeRect.height / 2;
    scroller.scrollTop = Math.max(0, scroller.scrollTop + offsetWithinScroller - centeringAdjustment);
  }

  // Covers both a plain full page load and an Astro view-transition navigation,
  // whichever this site ends up using.
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:page-load', init);
})();
