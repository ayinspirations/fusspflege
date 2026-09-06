/* Fußpflege & Wellness Leonberg – Interaktionen */
(() => {
  'use strict';

  /* ---- Scroll-Reveal: Kacheln fliegen ein ---- */
  const revealables = document.querySelectorAll('[data-reveal],[data-tile]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  revealables.forEach((el) => io.observe(el));

  /* Kacheln in horizontal scrollbaren Reihen liegen oft ausserhalb des
     Viewports – sie werden gemeinsam mit ihrer Reihe eingeblendet. */
  const railIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-tile],[data-reveal]').forEach((el) => {
        el.classList.add('in-view');
        io.unobserve(el);
      });
      railIo.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.flow-rail, .svc-rail, .hero-cards, .hero-tags').forEach((r) => railIo.observe(r));

  /* ---- Header: verstecken beim Runterscrollen, Farbe wechseln ---- */
  const header = document.getElementById('header');
  const progress = document.getElementById('progress');
  const hero = document.querySelector('.hero');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    header.classList.toggle('hide', y > lastY && y > 420);
    document.body.classList.toggle('scrolled', y > (hero ? hero.offsetHeight - 120 : 400));
    lastY = y;

    /* Parallax im Hero */
    const media = document.querySelector('[data-parallax]');
    if (media && y < window.innerHeight * 1.2) {
      media.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.04)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Aktiver Nav-Punkt ---- */
  const pills = [...document.querySelectorAll('.pill')];
  const sections = pills
    .map((p) => document.querySelector(p.getAttribute('href')))
    .filter(Boolean);
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      pills.forEach((p) =>
        p.classList.toggle('is-active', p.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => navIo.observe(s));

  /* ---- Mobile-Menü ---- */
  const burger = document.getElementById('burger');
  const navPills = document.getElementById('navPills');
  burger?.addEventListener('click', () => {
    const open = navPills.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  navPills?.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      navPills.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Leistungen: Liste steuert das Bilder-Rail ---- */
  const svcItems = [...document.querySelectorAll('.svc')];
  const svcPanes = [...document.querySelectorAll('.svc-card')];
  const svcRail = document.getElementById('svcRail');
  const showSvc = (i, scroll) => {
    svcItems.forEach((el, n) => el.classList.toggle('is-active', n === i));
    svcPanes.forEach((el, n) => el.classList.toggle('is-active', n === i));
    if (scroll && svcRail && svcPanes[i]) {
      svcRail.scrollTo({ left: svcPanes[i].offsetLeft - svcRail.offsetLeft, behavior: 'smooth' });
    }
  };
  svcItems.forEach((el, i) => {
    el.addEventListener('mouseenter', () => showSvc(i, true));
    el.addEventListener('click', () => showSvc(i, true));
  });
  svcPanes.forEach((el, i) => el.addEventListener('mouseenter', () => showSvc(i, false)));

  /* ---- Hero-Slider: wechselt durch die Behandlungen ---- */
  const hsFill = document.getElementById('hsFill');
  const hsNums = document.querySelectorAll('.hs-num');
  const heroCards = [...document.querySelectorAll('.hcard')];
  const heroTexts = [
    ['Wellness-Fußpflege', 'Kräuter-Fußbad, Peeling und entspannende Fußmassage'],
    ['Sportlerfüße', 'Regeneration für stark beanspruchte Füße'],
    ['Diabetische Fußpflege', 'Behutsame Fachfußpflege zur Vorbeugung'],
    ['Nagelkorrektur', 'Spangensysteme bei eingewachsenen Nägeln'],
  ];
  let slide = 0;
  const setSlide = (n) => {
    slide = (n + heroTexts.length) % heroTexts.length;
    if (hsFill) hsFill.style.width = ((slide + 1) / heroTexts.length) * 100 + '%';
    if (hsNums[0]) hsNums[0].textContent = String(slide + 1).padStart(2, '0');
    document.querySelectorAll('.hcard-text').forEach((card, i) => {
      const t = heroTexts[(slide + i) % heroTexts.length];
      card.style.opacity = '0';
      setTimeout(() => {
        card.querySelector('h3').textContent = t[0];
        card.querySelector('p').textContent = t[1];
        card.style.opacity = '';
      }, 220);
    });
    heroCards.forEach((c) => { c.style.transition = 'opacity .45s var(--ease), transform .5s var(--ease)'; });
  };
  document.getElementById('hsNext')?.addEventListener('click', () => setSlide(slide + 1));
  document.getElementById('hsPrev')?.addEventListener('click', () => setSlide(slide - 1));

  /* ---- Zähler in den Stat-Kacheln ---- */
  const counters = document.querySelectorAll('[data-count]');
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const started = performance.now();
      const tick = (now) => {
        const p = Math.min((now - started) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('de-DE');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countIo.observe(c));

  /* ---- Merken-Herz ---- */
  document.querySelectorAll('.fav').forEach((b) =>
    b.addEventListener('click', () => b.classList.toggle('on')));

  /* ---- Jahr im Footer ---- */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
