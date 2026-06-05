/* ============================================================
   NOZHA CONCEPT — Logique page produit
   Couleur · Taille · Personnalisation · Galerie · Commande
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initColorSelector();
  initSizeSelector();
  initPersonalisation();
  initGallery();
  initAccordion();
  initProductWA();
  initAddToCart();
  initMesuresModal();
});

/* ── État courant du produit ── */
const state = {
  couleur:  '',
  taille:   '',
  perso:    '',
  image:    '',
};

/* ============================================================
   SÉLECTEUR COULEUR
   ============================================================ */
function initColorSelector() {
  const dots = document.querySelectorAll('.product-color');
  if (!dots.length) return;

  /* Sélection initiale */
  const first = dots[0];
  selectColor(first);

  dots.forEach(dot => {
    dot.addEventListener('click', () => selectColor(dot));
  });
}

function selectColor(dot) {
  document.querySelectorAll('.product-color').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');

  state.couleur = dot.dataset.color || dot.getAttribute('title') || '';

  /* Mise à jour label */
  const valueEl = document.querySelector('.selector-block[data-type="color"] .selector-value');
  if (valueEl) valueEl.textContent = state.couleur;

  /* Change l'image principale si data-image fourni */
  const img = dot.dataset.image;
  if (img) switchMainImage(img);
}

/* ============================================================
   SÉLECTEUR TAILLE
   ============================================================ */
function initSizeSelector() {
  const sizes = document.querySelectorAll('.product-size');
  if (!sizes.length) return;

  sizes.forEach(size => {
    size.addEventListener('click', () => {
      if (size.classList.contains('mesure')) {
        openMesuresModal();
        return;
      }
      selectSize(size);
    });
  });
}

function selectSize(sizeEl) {
  document.querySelectorAll('.product-size').forEach(s => s.classList.remove('active'));
  sizeEl.classList.add('active');
  state.taille = sizeEl.dataset.size || sizeEl.textContent.trim();

  const valueEl = document.querySelector('.selector-block[data-type="size"] .selector-value');
  if (valueEl) valueEl.textContent = state.taille;
}

/* ============================================================
   PERSONNALISATION TOGGLE
   ============================================================ */
function initPersonalisation() {
  const toggle = document.querySelector('.personalisation-toggle');
  const sw     = document.querySelector('.toggle-switch');
  const panel  = document.querySelector('.personalisation-panel');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    if (sw) sw.classList.toggle('on', !isOpen);
  });

  /* Met à jour l'état de personnalisation */
  panel.querySelectorAll('select, input').forEach(input => {
    input.addEventListener('change', updatePersoState);
  });
}

function updatePersoState() {
  const panel = document.querySelector('.personalisation-panel-inner');
  if (!panel) return;

  const parts = [];
  panel.querySelectorAll('select, input[type="text"]').forEach(el => {
    if (el.value) {
      const label = el.previousElementSibling?.textContent || el.placeholder || '';
      parts.push(`${label}: ${el.value}`);
    }
  });
  state.perso = parts.join(', ');
}

/* ============================================================
   GALERIE — Thumbnails + Zoom hover
   ============================================================ */
function initGallery() {
  const thumbs  = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.querySelector('.gallery-main img');

  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.querySelector('img')?.src;
      if (!src) return;
      switchMainImage(src, thumb);
    });
  });

  /* Zoom loupe au hover sur desktop */
  const zoomZone = document.querySelector('.gallery-zoom');
  if (!zoomZone || window.matchMedia('(max-width: 768px)').matches) return;

  zoomZone.addEventListener('mousemove', e => {
    const rect = zoomZone.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width)  * 100;
    const yPct = ((e.clientY - rect.top)  / rect.height) * 100;
    mainImg.style.transformOrigin = `${xPct}% ${yPct}%`;
    mainImg.style.transform = 'scale(1.5)';
    mainImg.style.transition = 'none';
  });

  zoomZone.addEventListener('mouseleave', () => {
    mainImg.style.transform = '';
    mainImg.style.transition = '';
    mainImg.style.transformOrigin = '';
  });
}

function switchMainImage(src, thumbEl) {
  const mainImg = document.querySelector('.gallery-main img');
  if (!mainImg) return;

  if (typeof gsap !== 'undefined') {
    gsap.to(mainImg, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        mainImg.src = src;
        state.image = src;
        gsap.to(mainImg, { opacity: 1, duration: 0.4 });
      }
    });
  } else {
    mainImg.src = src;
    state.image = src;
  }

  /* Active le thumbnail */
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

/* ============================================================
   ACCORDION DESCRIPTION
   ============================================================ */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      /* Ferme tous */
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

      /* Ouvre celui-ci si pas déjà ouvert */
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Ouvre le premier par défaut */
  const first = document.querySelector('.accordion-item');
  if (first) first.classList.add('open');
}

/* ============================================================
   BOUTON "Commander via WhatsApp"
   ============================================================ */
function initProductWA() {
  const btn = document.querySelector('[data-action="wa-product"]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nom     = document.querySelector('[data-product-name]')?.textContent || 'Pièce Nozha Concept';
    const couleur = state.couleur || 'Non sélectionnée';
    const taille  = state.taille  || 'Non sélectionnée';
    const perso   = state.perso   || '';

    const msg = window.NozhaCart
      ? window.NozhaCart.buildWAProductMessage(nom, couleur, taille, perso)
      : `Bonjour ! Je souhaite commander : ${nom} — Couleur: ${couleur} — Taille: ${taille}`;

    const url = window.NozhaCart ? window.NozhaCart.buildWAUrl(msg) : `https://wa.me/212612653622?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

/* ============================================================
   BOUTON "Ajouter à ma commande"
   ============================================================ */
function initAddToCart() {
  const btn = document.querySelector('[data-action="add-to-cart"]');
  if (!btn || !window.NozhaCart) return;

  btn.addEventListener('click', () => {
    const nom   = document.querySelector('[data-product-name]')?.textContent  || 'Pièce Nozha Concept';
    const prix  = parseInt(document.querySelector('[data-product-price]')?.dataset.price || '0', 10);
    const img   = document.querySelector('.gallery-main img')?.src || '';
    const id    = document.querySelector('[data-product-id]')?.dataset.productId || `prod_${Date.now()}`;

    if (!state.taille) {
      showSizeWarning();
      return;
    }

    window.NozhaCart.addToPanier({
      id,
      nom,
      couleur: state.couleur || 'Standard',
      taille:  state.taille,
      prix,
      image:   img,
      perso:   state.perso || '',
    });

    /* Feedback visuel */
    btn.textContent = '✓ Ajouté !';
    btn.style.background = 'rgba(201,169,110,0.2)';
    setTimeout(() => {
      btn.textContent = btn.dataset.originalText || 'Ajouter à ma commande';
      btn.style.background = '';
    }, 2000);
  });

  /* Sauvegarde le texte original */
  btn.dataset.originalText = btn.textContent;
}

function showSizeWarning() {
  const block = document.querySelector('.selector-block[data-type="size"]');
  if (!block) return;

  block.style.border = '1px solid var(--bordeaux)';
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const warn = document.createElement('p');
  warn.textContent = 'Veuillez choisir une taille';
  warn.style.cssText = 'color:var(--bordeaux-light);font-size:12px;margin-top:6px;letter-spacing:0.1em;';
  block.appendChild(warn);

  setTimeout(() => {
    block.style.border = '';
    warn.remove();
  }, 3000);
}

/* ============================================================
   MODAL MESURES
   ============================================================ */
function initMesuresModal() {
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('.modal-close');

  if (!overlay) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMesuresModal);
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeMesuresModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMesuresModal();
  });
}

function openMesuresModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMesuresModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* Export global */
window.NozhaProduct = { openMesuresModal, closeMesuresModal, state };


