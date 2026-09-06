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

  const LEAVE_MS = 620;
  let activeSvc = 0;

  const setRanks = (active) => {
    svcItems.forEach((el, n) => el.classList.toggle('is-active', n === active));
    svcSlots.forEach((slot, n) => {
      const rank = (n - active + svcCount) % svcCount;
      slot.style.setProperty('--i', rank);
      svcPanes[n].classList.toggle('is-active', rank === 0);
    });
  };

  const showSvc = (i) => {
    const active = ((i % svcCount) + svcCount) % svcCount;
    if (active === activeSvc) return;

    const leaving = svcSlots[activeSvc];
    activeSvc = active;
    setRanks(active);

    /* Die bisher vordere Karte zieht nach links weg statt quer nach hinten zu
       springen; ihren Stapelplatz nimmt sie danach ohne Animation ein. */
    if (leaving) {
      clearTimeout(leaving._settle);
      leaving.classList.remove('is-settling');
      leaving.classList.add('is-leaving');
      leaving._settle = setTimeout(() => {
        leaving.classList.add('is-settling');
        leaving.classList.remove('is-leaving');
        void leaving.offsetWidth;                 // Layout erzwingen
        leaving.classList.remove('is-settling');
      }, LEAVE_MS);
    }
  };
  setRanks(0);

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
