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
  document.querySelectorAll('.flow-rail, .svc-stack, .hero-cards').forEach((r) => railIo.observe(r));

  /* ---- Header: verstecken beim Runterscrollen, Farbe wechseln ---- */
  const progress = document.getElementById('progress');
  const hero = document.querySelector('.hero');

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    document.body.classList.toggle('scrolled', y > (hero ? hero.offsetHeight - 120 : 400));

    /* Parallax im Hero */
    const media = document.querySelector('[data-parallax]');
    if (media && y < window.innerHeight * 1.2) {
      media.style.transform = `translate3d(0, ${y * 0.16}px, 0) scale(1.08)`;
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

  /* ---- Leistungen: Liste und Kartenstapel ----
     Die Karten liegen uebereinander; --i ist der Abstand zur aktiven Karte und
     steuert Versatz, Groesse und Stapelreihenfolge im CSS. */
  const svcItems = [...document.querySelectorAll('.svc')];
  const svcSlots = [...document.querySelectorAll('.svc-slot')];
  const svcPanes = [...document.querySelectorAll('.svc-card')];
  const svcCount = svcPanes.length;

  let activeSvc = 0;

  /* Die Karten behalten ihren Platz im Stapel. Alles vor der aktiven Karte ist
     nach links abgeraeumt, ab der aktiven bleibt alles stehen. */
  svcSlots.forEach((slot, n) => slot.style.setProperty('--n', n));

  const showSvc = (i) => {
    const active = Math.min(Math.max(i, 0), svcCount - 1);
    activeSvc = active;
    svcItems.forEach((el, n) => el.classList.toggle('is-active', n === active));
    svcSlots.forEach((slot, n) => slot.classList.toggle('is-gone', n < active));
    svcPanes.forEach((el, n) => el.classList.toggle('is-active', n === active));
  };
  showSvc(0);

  svcItems.forEach((el, i) => {
    el.addEventListener('mouseenter', () => showSvc(i));
    el.addEventListener('click', () => showSvc(i));
  });
  svcPanes.forEach((el, i) => el.addEventListener('click', () => showSvc(i)));

  /* ---- Hero-Kacheln: Klick oeffnet die Leistung und scrollt hin ---- */
  document.querySelectorAll('[data-svc-link]').forEach((card) => {
    card.addEventListener('click', () => {
      const i = Number(card.dataset.svcLink);
      showSvc(i);
      document.getElementById('leistungen')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

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

  /* ---- Fotos sanft einblenden, sobald geladen ---- */
  document.querySelectorAll('.shot > img').forEach((im) => {
    if (im.complete && im.naturalWidth) im.classList.add('loaded');
    else im.addEventListener('load', () => im.classList.add('loaded'), { once: true });
    im.addEventListener('error', () => im.classList.add('loaded'), { once: true });
  });

  /* ---- Jahr im Footer ---- */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
