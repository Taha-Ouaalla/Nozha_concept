/* ============================================================
   NOZHA CONCEPT � Main JS
   Navigation � Curseur � GSAP ScrollTrigger � Interactions
   ============================================================ */

/* Attend GSAP et DOM */
document.addEventListener('DOMContentLoaded', () => {

  /* -- GSAP plugins -- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLoader();
  initCursor();
  initNavbar();
  initTubelight();
  initBurgerMenu();
  initLangToggle();
  initScrollAnimations();
  initParallax();
  initCounters();
  initTestimonials();
  initFloatWhatsApp();
  initCategoryCards();
  initPageTransition();
  splitHeroText();
  initTheme();
});

/* ============================================================
   LOADER � Animation fil de broderie
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const percentEl = loader.querySelector('.loader-percent');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      if (percentEl) percentEl.textContent = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startPageAnimations();
      }, 350);
      return;
    }
    if (percentEl) percentEl.textContent = `${Math.floor(progress)}%`;
  }, 120);

  /* Bloque le scroll pendant le chargement */
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   CURSEUR PERSONNALIS�
   ============================================================ */
function initCursor() {
  /* D�sactiv� sur touch/mobile */
  if ('ontouchstart' in window || navigator.maxTouchPoints > 1) return;
  if (window.innerWidth <= 768) return;

  const cursor = document.querySelector('.cursor');
  const trail  = document.querySelector('.cursor-trail');
  const label  = document.querySelector('.cursor-label');
  if (!cursor || !trail) return;

  /* Coordonn�es courantes */
  let mx = -500, my = -500;   /* position souris */
  let tx = -500, ty = -500;   /* position trail (lag) */

  /* -- Positionnement via transform pur (GPU, sans left/top) -- */
  function setCursor(x, y) {
    cursor.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
  }
  function setTrail(x, y) {
    trail.style.transform = `translate(${x - 19}px, ${y - 19}px)`;
  }
  function setLabel(x, y) {
    if (label) label.style.transform = `translate(${x + 14}px, ${y - 24}px)`;
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    setCursor(mx, my);
    setLabel(mx, my);
  }, { passive: true });

  /* Trail : loop rAF avec lerp */
  (function loop() {
    tx += (mx - tx) * 0.11;
    ty += (my - ty) * 0.11;
    setTrail(tx, ty);
    requestAnimationFrame(loop);
  })();

  /* -- Hover : zones visuelles ? VOIR -- */
  const visualZones = '.product-card-image, .category-card, .atelier-photo, .insta-item, .gallery-main, .lookbook-image, .page-hero-bg';
  document.querySelectorAll(visualZones).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      trail.classList.add('hover');
      if (label) {
        label.textContent = window.NozhaI18n?.currentLang() === 'ar' ? '???' : 'VOIR';
        label.classList.add('visible');
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      trail.classList.remove('hover');
      if (label) label.classList.remove('visible');
    });
  });

  /* -- Hover : liens et boutons ? point comprim� -- */
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); if (label) label.classList.remove('visible'); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ============================================================
   NAVBAR � Shrink au scroll, highlight actif
   ============================================================ */
function initNavbar() {
  const navTop = document.querySelector('.navbar-top');
  if (!navTop) return;

  window.addEventListener('scroll', () => {
    navTop.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* Lien actif sur barre 1 */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-top-links a, .nav-drawer-links a').forEach(link => {
    const href = link.getAttribute('href')?.split('#')[0];
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   TUBELIGHT � Indicateur cat�gorie anim�
   ============================================================ */
function initTubelight() {
  const pill  = document.querySelector('.tubelight-pill');
  const inner = document.querySelector('.navbar-cats-inner');
  if (!pill || !inner) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  /* Trouver le lien actif par URL */
  let activeLink = null;
  document.querySelectorAll('.cat-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
      activeLink = link;
    }
  });

  function positionPill(el) {
    const linkRect  = el.getBoundingClientRect();
    const parentRect = inner.getBoundingClientRect();
    const left   = linkRect.left - parentRect.left;
    const width  = linkRect.width;

    if (typeof gsap !== 'undefined') {
      gsap.to(pill, { x: left, width, duration: 0.45, ease: 'back.out(1.4)' });
    } else {
      pill.style.transform = `translateX(${left}px) translateY(-50%)`;
      pill.style.width     = `${width}px`;
    }
    pill.classList.add('ready');
  }

  /* Position initiale */
  if (activeLink) {
    /* Attendre la fin du layout pour avoir les bonnes dimensions */
    requestAnimationFrame(() => positionPill(activeLink));
  }

  /* Hover */
  document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('mouseenter', () => positionPill(link));
    link.addEventListener('mouseleave', () => {
      if (activeLink) positionPill(activeLink);
    });
  });
}

/* ============================================================
   BURGER MENU � Drawer mobile
   ============================================================ */
function initBurgerMenu() {
  const burger  = document.querySelector('.burger');
  const drawer  = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');

  if (!burger || !drawer) return;

  function openMenu() {
    burger.classList.add('open');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  /* Ferme sur ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Ferme au clic sur un lien */
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ============================================================
   LANGUE FR / AR
   ============================================================ */
function initLangToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (window.NozhaI18n) {
        window.NozhaI18n.applyTranslations(lang);
        reinitCursorHovers();
      }
    });
  });
}

function reinitCursorHovers() {
  /* R�-attache les listeners cursor apr�s changement de langue */
  initCursor();
}

/* ============================================================
   ANIMATIONS GSAP ScrollTrigger
   ============================================================ */
function startPageAnimations() {
  if (typeof gsap === 'undefined') {
    /* Fallback CSS si GSAP absent */
    document.querySelectorAll('.hero-eyebrow, .hero-arabic, .hero-cta, .hero-scroll').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  /* -- H�ro : reveal s�quentiel -- */
  const heroTl = gsap.timeline({ delay: 0.1 });

  heroTl
    .to('.hero-eyebrow', {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to('.hero-title .char', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power4.out'
    }, '-=0.3')
    .to('.hero-arabic', {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.2')
    .to('.hero-cta', {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .to('.hero-scroll', {
      opacity: 1,
      duration: 0.5
    }, '-=0.2');
}

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    /* Fallback : rend tout visible */
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s, .stagger-item').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  /* �l�ments .reveal g�n�riques */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.reveal-l').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  gsap.utils.toArray('.reveal-r').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  gsap.utils.toArray('.reveal-s').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* Stagger items */
  const staggerGroups = {};
  document.querySelectorAll('.stagger-item').forEach(el => {
    const parent = el.parentElement;
    const key = parent ? parent.dataset.staggerGroup || parent.className : 'default';
    if (!staggerGroups[key]) staggerGroups[key] = [];
    staggerGroups[key].push(el);
  });

  Object.values(staggerGroups).forEach(group => {
    gsap.to(group, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group[0],
        start: 'top 85%'
      }
    });
  });

  /* Clip-path reveal sur images */
  gsap.utils.toArray('.clip-reveal').forEach(el => {
    const inner = el.querySelector('.clip-reveal-inner');
    if (!inner) return;
    gsap.to(inner, {
      y: '0%',
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });

  /* Section titles split text */
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });

  /* Piliers vision � stagger */
  gsap.utils.toArray('.pillar').forEach((pillar, i) => {
    gsap.from(pillar, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: pillar, start: 'top 85%' }
    });
  });

  /* Timeline items */
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      x: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.timeline', start: 'top 80%' }
    });
  });

  /* Cards cat�gorie */
  gsap.utils.toArray('.category-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.categories-grid', start: 'top 80%' }
    });
  });

  /* Products grid � entr�e cin�matique avec clip-path */
  gsap.utils.toArray('.product-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
        duration: 0.85,
        delay: (i % 4) * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });

  /* Zoom progressif sur les images en scroll */
  gsap.utils.toArray('.product-card-image img').forEach(img => {
    gsap.fromTo(img,
      { scale: 1.08 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'center center', scrub: 1.5 }
      }
    );
  });

  /* Atelier photos */
  gsap.utils.toArray('.atelier-photo').forEach((photo, i) => {
    gsap.from(photo, {
      opacity: 0,
      scale: 0.95,
      duration: 0.9,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.atelier-mosaic', start: 'top 80%' }
    });
  });

  /* Instagram grid */
  gsap.utils.toArray('.insta-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      delay: i * 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.insta-grid', start: 'top 85%' }
    });
  });
}

/* ============================================================
   PARALLAX � Hero image
   ============================================================ */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg || typeof gsap === 'undefined') return;

  gsap.to(heroBg, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ============================================================
   COMPTEURS ANIM�S
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target  = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 2000;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
}

/* ============================================================
   SLIDER T�MOIGNAGES
   ============================================================ */
function initTestimonials() {
  const items = document.querySelectorAll('.temoignage-item');
  const dots  = document.querySelectorAll('.slider-dots .dot');
  if (items.length < 2) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    items[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + items.length) % items.length;
    items[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const auto = () => {
    timer = setTimeout(() => {
      goTo(current + 1);
      auto();
    }, 5000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearTimeout(timer);
      goTo(i);
      auto();
    });
  });

  goTo(0);
  auto();
}

/* ============================================================
   WHATSAPP FLOTTANT � Tooltip
   ============================================================ */
function initFloatWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  /* Tooltip simple */
  btn.setAttribute('title', 'Commander sur WhatsApp');
  btn.setAttribute('aria-label', 'Ouvrir WhatsApp pour commander');
}

/* ============================================================
   CATEGORY CARDS � Split reveal sous-cat�gories
   ============================================================ */
function initCategoryCards() {
  /* Le split reveal est g�r� par CSS hover �
     on peut enrichir avec GSAP si besoin */
}

/* ============================================================
   PAGE TRANSITION
   ============================================================ */
function initPageTransition() {
  /* Transition douce entre pages */
  document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([target])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      if (typeof gsap !== 'undefined') {
        gsap.to('body', {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => { window.location.href = href; }
        });
      } else {
        window.location.href = href;
      }
    });
  });

  /* Fade in � l'arriv�e */
  if (typeof gsap !== 'undefined') {
    gsap.from('body', { opacity: 0, duration: 0.4, ease: 'power2.out' });
  }
}

/* ============================================================
   SPLIT TEXT HERO � D�coupe les lettres
   (Appel� depuis HTML inline ou ici)
   ============================================================ */
function splitHeroText() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const text = heroTitle.textContent;
  heroTitle.innerHTML = text.split('').map(char =>
    char === ' '
      ? '<span class="char" style="display:inline-block;width:0.3em">&nbsp;</span>'
      : `<span class="char">${char}</span>`
  ).join('');
}

/* ============================================================
   SCROLL SNAP CAROUSEL � Nouveaut�s
   ============================================================ */
function initCarousel() {
  const scroll = document.querySelector('.nouveautes-scroll');
  if (!scroll) return;

  /* Drag-to-scroll sur desktop */
  let isDown = false;
  let startX, scrollLeft;

  scroll.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - scroll.offsetLeft;
    scrollLeft = scroll.scrollLeft;
    scroll.style.cursor = 'grabbing';
  });

  scroll.addEventListener('mouseleave', () => {
    isDown = false;
    scroll.style.cursor = '';
  });

  scroll.addEventListener('mouseup', () => {
    isDown = false;
    scroll.style.cursor = '';
  });

  scroll.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroll.offsetLeft;
    scroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

/* ============================================================
   FILTRE PRODUITS (cat�gorie)
   ============================================================ */
function initFilters() {
  /* Sidebar subcategory filter */
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const filter = link.dataset.filter;
      filterProducts(filter);
    });
  });

  /* Toggle vue grille / lookbook */
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.dataset.view;
      const grid = document.querySelector('.products-grid');
      const look = document.querySelector('.lookbook-view');

      if (view === 'grid') {
        if (grid) grid.style.display = 'grid';
        if (look) { look.style.display = 'none'; look.classList.remove('active'); }
      } else {
        if (grid) grid.style.display = 'none';
        if (look) { look.style.display = 'block'; look.classList.add('active'); }
      }
    });
  });

  /* Sort select */
  const sortSel = document.querySelector('.sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      sortProducts(sortSel.value);
    });
  }
}

function filterProducts(category) {
  document.querySelectorAll('.product-card').forEach(card => {
    const cat = card.dataset.category || 'all';
    const show = !category || category === 'all' || cat === category;
    card.style.display = show ? '' : 'none';
  });
}

function sortProducts(criterion) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.product-card')];

  cards.sort((a, b) => {
    const pA = parseInt(a.dataset.price || '0', 10);
    const pB = parseInt(b.dataset.price || '0', 10);
    if (criterion === 'price-asc')  return pA - pB;
    if (criterion === 'price-desc') return pB - pA;
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
}

/* -- Init filtres si page cat�gorie -- */
if (document.querySelector('.category-page')) {
  document.addEventListener('DOMContentLoaded', initFilters);
}

/* -- Init carousel si section existe -- */
if (document.querySelector('.nouveautes-scroll')) {
  document.addEventListener('DOMContentLoaded', initCarousel);
}

/* -- Split hero text d�s que DOM pr�t -- */
document.addEventListener('DOMContentLoaded', splitHeroText);

/* ============================================================
   THEME � Mode clair / sombre
   ============================================================ */
function initTheme() {
  /* Anti-flash : applique le theme avant le premier paint */
  const saved = localStorage.getItem('nozha_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nozha_theme', next);
  });
}

