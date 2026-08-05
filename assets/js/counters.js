/* Grading Lab Agency — hero counters.
   Each [data-count] element already contains its final, formatted value so the
   real number is there without JavaScript. This just animates up to it once,
   when the row first scrolls into view. */
(function () {
  'use strict';

  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var format = new Intl.NumberFormat('en-GB');

  function render(el, value) {
    el.textContent = format.format(value) + (el.getAttribute('data-suffix') || '');
  }

  function run(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    var duration = 1500;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);          // ease-out cubic
      render(el, Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(frame);
    }

    // Deliberately no reset to 0 here: if the tab is backgrounded, rAF is
    // throttled, and the markup's real value stays on screen instead of a
    // stalled "0". The first frame to run takes over from there.
    window.requestAnimationFrame(frame);
  }

  if (reduced || !('IntersectionObserver' in window)) return;   // leave the markup value in place

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
})();
