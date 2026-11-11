/* Belentani — comportamiento del escaparate.
   Regla: sin JS la pagina sigue siendo legible y filtrable por anclas. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.toggle('no-motion', reduced);

  // filtros del catalogo
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-cat]'));
  var count = document.querySelector('[data-count]');
  function apply(cat) {
    var shown = 0;
    items.forEach(function (el) {
      var ok = cat === 'all' || el.getAttribute('data-cat') === cat;
      el.hidden = !ok;
      if (ok) shown++;
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === cat));
    });
    if (count) count.textContent = shown;
  }
  if (buttons.length) {
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    apply('all');
  }

  // revelado progresivo con GSAP si esta disponible; si no, CSS.
  var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!targets.length || reduced) {
    targets.forEach(function (t) { t.style.opacity = 1; t.style.transform = 'none'; });
    return;
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    targets.forEach(function (t) {
      gsap.to(t, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: t, start: 'top 88%', once: true }
      });
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
          e.target.style.opacity = 1;
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
