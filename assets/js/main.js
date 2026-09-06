/* Fußpflege & Wellness Leonberg – Interaktionen */
(() => {
  'use strict';

  /* ---- Ruhiger Seitenwechsel ----
     Das native smooth-scroll rauscht ueber lange Strecken viel zu schnell
     durch. Hier laeuft die Bewegung ueber eine feste, distanzabhaengige Dauer
     mit weichem An- und Auslauf. */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let scrollAnim = 0;

  const scrollToY = (to) => {
    const from = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.max(0, Math.min(to, max));
    const dist = Math.abs(target - from);
    if (reduceMotion || dist < 4) { window.scrollTo(0, target); return; }

    /* rund 0,9 s fuer kurze Wege, hoechstens 2,4 s fuer die ganze Seite */
    const duration = Math.min(2400, 900 + dist * 0.55);
    const start = performance.now();
    cancelAnimationFrame(scrollAnim);
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      window.scrollTo(0, from + (target - from) * easeInOut(t));
      if (t < 1) scrollAnim = requestAnimationFrame(step);
    };
    scrollAnim = requestAnimationFrame(step);
  };

  const scrollToEl = (el) => {
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + window.scrollY - 84);
  };

  /* Jeder Sprungmarken-Link nutzt denselben ruhigen Lauf. */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
  });

  /* ---- Scroll-Reveal: Kacheln fliegen ein ---- */
  const revealables = document.querySelectorAll('[data-reveal],[data-tile]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -14% 0px' });
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
    /* Spaeter Ausloeser: die Gruppe soll erst loslaufen, wenn sie wirklich im
       Blick ist - sonst ist das Zusammenlaufen schon vorbei, bevor man sie
       sieht. */
  }, { threshold: 0.34, rootMargin: '0px 0px -16% 0px' });
  document.querySelectorAll('.flow-rail, .svc-stack, .hero-cards').forEach((r) => railIo.observe(r));

  /* Sicherheitsnetz: wer sehr schnell scrollt oder per Sprungmarke landet,
     kann die Schwelle ueberspringen - was dann schon oberhalb der Fenstermitte
     liegt, wird ungefragt eingeblendet, damit nichts unsichtbar bleibt. */
  const catchUp = () => {
    document.querySelectorAll('[data-tile]:not(.in-view),[data-reveal]:not(.in-view)')
      .forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.45) {
          el.classList.add('in-view');
          io.unobserve(el);
        }
      });
  };

  /* ---- Header: verstecken beim Runterscrollen, Farbe wechseln ---- */
  const progress = document.getElementById('progress');
  const hero = document.querySelector('.hero');

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    document.body.classList.toggle('scrolled', y > (hero ? hero.offsetHeight - 120 : 400));

    catchUp();

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
        void leaving.offsetWidth;
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
      scrollToEl(document.getElementById('leistungen'));
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

  /* ---- Wohlfuehl-Momente: Pfeile blaettern durch die Reihe ---- */
  const flowRail = document.querySelector('.flow-rail');
  const flowStep = (dir) => {
    if (!flowRail) return;
    const card = flowRail.querySelector('.flow-card');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 14;
    flowRail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  document.getElementById('flowNext')?.addEventListener('click', () => flowStep(1));
  document.getElementById('flowPrev')?.addEventListener('click', () => flowStep(-1));

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
