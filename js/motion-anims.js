/* ============================================================
   NOZHA CONCEPT — Motion animations (motion@11 ESM)
   Scroll reveals · Spring hover · Parallax · Page entrance
   ============================================================ */

import { animate, scroll, inView, spring } from
  'https://cdn.jsdelivr.net/npm/motion@11/+esm';

/* ── Scroll reveal ──────────────────────────────────────────── */
inView('.reveal', ({ target }) => {
  animate(target,
    { opacity: [0, 1], y: [40, 0] },
    { duration: 0.75, easing: [0.16, 1, 0.3, 1] }
  );
}, { margin: '0px 0px -60px 0px' });

inView('.stagger-item', ({ target }) => {
  const idx = [...document.querySelectorAll('.stagger-item')].indexOf(target);
  animate(target,
    { opacity: [0, 1], y: [28, 0] },
    { delay: idx * 0.1, duration: 0.6, easing: [0.16, 1, 0.3, 1] }
  );
}, { margin: '0px 0px -40px 0px' });

/* ── Product cards entrance ─────────────────────────────────── */
inView('.product-card', ({ target }) => {
  animate(target,
    { opacity: [0, 1], y: [24, 0] },
    { duration: 0.55, easing: [0.22, 1, 0.36, 1] }
  );
}, { margin: '0px 0px -30px 0px' });

/* ── Catalog section titles ─────────────────────────────────── */
inView('.catalog-section-title', ({ target }) => {
  animate(target,
    { opacity: [0, 1], x: [-20, 0] },
    { duration: 0.5, easing: 'ease-out' }
  );
});

/* ── Pillar cards ───────────────────────────────────────────── */
inView('.pillar-card', ({ target }) => {
  const idx = [...document.querySelectorAll('.pillar-card')].indexOf(target);
  animate(target,
    { opacity: [0, 1], y: [50, 0], scale: [0.97, 1] },
    { delay: idx * 0.18, duration: 0.7, easing: [0.22, 1, 0.36, 1] }
  );
});

/* ── Section labels ─────────────────────────────────────────── */
inView('.section-label', ({ target }) => {
  animate(target,
    { opacity: [0, 1], x: [-15, 0] },
    { duration: 0.4, easing: 'ease-out' }
  );
});

/* ── Spring hover on product card images ────────────────────── */
document.querySelectorAll('.product-card-image').forEach(card => {
  const img     = card.querySelector('img');
  const overlay = card.querySelector('.product-card-overlay');
  if (!img) return;

  card.addEventListener('mouseenter', () => {
    animate(img, { scale: 1.06 },
      { duration: 0.6, easing: spring({ stiffness: 100, damping: 18 }) });
    if (overlay)
      animate(overlay, { opacity: 1 }, { duration: 0.25, easing: 'ease-out' });
  });
  card.addEventListener('mouseleave', () => {
    animate(img, { scale: 1 },
      { duration: 0.5, easing: spring({ stiffness: 80, damping: 22 }) });
    if (overlay)
      animate(overlay, { opacity: 0 }, { duration: 0.2, easing: 'ease-in' });
  });
});

/* ── Spring hover on category cards ────────────────────────── */
document.querySelectorAll('.category-card').forEach(card => {
  const img = card.querySelector('img');
  if (!img) return;
  card.addEventListener('mouseenter', () =>
    animate(img, { scale: 1.07 },
      { duration: 0.65, easing: spring({ stiffness: 90, damping: 16 }) }));
  card.addEventListener('mouseleave', () =>
    animate(img, { scale: 1 },
      { duration: 0.5, easing: spring({ stiffness: 80, damping: 24 }) }));
});

/* ── Page hero parallax ─────────────────────────────────────── */
const heroBg = document.querySelector('.hero-visual, .page-hero-bg img');
if (heroBg) {
  scroll(({ y }) => {
    const offset = y.current * 0.28;
    heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
  });
}

/* ── Navbar entrance ────────────────────────────────────────── */
animate('.navbar-top',
  { opacity: [0, 1], y: [-16, 0] },
  { duration: 0.5, delay: 0.2, easing: 'ease-out' }
);

/* ── Footer reveal ──────────────────────────────────────────── */
inView('.footer', ({ target }) => {
  animate(target, { opacity: [0, 1] }, { duration: 0.6, easing: 'ease-out' });
});

/* ── Accordion smooth open (Motion) ───────────────────────────*/
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    if (!body) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (!isOpen) {
      body.style.display = 'block';
      animate(body, { height: ['0px', body.scrollHeight + 'px'], opacity: [0, 1] },
        { duration: 0.35, easing: [0.22, 1, 0.36, 1] });
    }
  });
});

/* ── Float WA button entrance ────────────────────────────────── */
const waBtn = document.querySelector('.whatsapp-float');
if (waBtn) {
  animate(waBtn,
    { scale: [0, 1], opacity: [0, 1] },
    { delay: 1.2, duration: 0.5, easing: spring({ stiffness: 200, damping: 18 }) }
  );
}
