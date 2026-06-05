/* ============================================================
   NOZHA CONCEPT â€” Calculateur de tailles + Guide mesures
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMesureAccordion();
  initSizeCalculator();
  initBodyDiagram();
  initMesureWA();
});

/* â”€â”€ Tableau des tailles (cm) â”€â”€ */
const SIZE_TABLE = [
  { taille: 'XS',  poitrine: [80, 84],  tour_taille: [60, 64],  hanches: [84, 88],  longueur: 135 },
  { taille: 'S',   poitrine: [84, 88],  tour_taille: [64, 68],  hanches: [88, 92],  longueur: 137 },
  { taille: 'M',   poitrine: [88, 92],  tour_taille: [68, 72],  hanches: [92, 96],  longueur: 140 },
  { taille: 'L',   poitrine: [92, 96],  tour_taille: [72, 76],  hanches: [96, 100], longueur: 142 },
  { taille: 'XL',  poitrine: [96, 100], tour_taille: [76, 80],  hanches: [100, 104],longueur: 144 },
  { taille: 'XXL', poitrine: [100, 106],tour_taille: [80, 86],  hanches: [104, 110],longueur: 146 },
];

/* ============================================================
   ACCORDION GUIDE MESURES
   ============================================================ */
function initMesureAccordion() {
  document.querySelectorAll('.mesure-step-header').forEach(header => {
    header.addEventListener('click', () => {
      const step   = header.parentElement;
      const isOpen = step.classList.contains('open');

      document.querySelectorAll('.mesure-step').forEach(s => s.classList.remove('open'));
      if (!isOpen) {
        step.classList.add('open');
        highlightBodyPoint(step.dataset.point);
      }
    });
  });

  /* Ouvre le premier */
  const first = document.querySelector('.mesure-step');
  if (first) {
    first.classList.add('open');
    highlightBodyPoint(first.dataset.point);
  }
}

/* ============================================================
   CALCULATEUR DE TAILLE EN TEMPS RÃ‰EL
   ============================================================ */
function initSizeCalculator() {
  const inputs = {
    poitrine: document.getElementById('calc-poitrine'),
    taille:   document.getElementById('calc-taille'),
    hanches:  document.getElementById('calc-hanches'),
  };

  const resultEl  = document.getElementById('calc-result-size');
  const resultBox = document.querySelector('.calc-result');

  if (!inputs.poitrine || !inputs.taille || !inputs.hanches) return;

  const calculate = () => {
    const p = parseInt(inputs.poitrine.value, 10);
    const t = parseInt(inputs.taille.value,   10);
    const h = parseInt(inputs.hanches.value,  10);

    if (!p && !t && !h) {
      if (resultBox) resultBox.style.display = 'none';
      return;
    }

    const size = findSize(p, t, h);

    if (resultEl) {
      resultEl.textContent = size || 'â€”';
      if (size === 'Sur mesure') {
        resultEl.style.color = 'var(--bordeaux-light)';
      } else {
        resultEl.style.color = 'var(--or)';
      }
    }

    if (resultBox) resultBox.style.display = 'flex';

    /* Met Ã  jour le lien WhatsApp */
    updateWAMesures(p, t, h, size);
  };

  Object.values(inputs).forEach(inp => inp.addEventListener('input', calculate));
}

function findSize(p, t, h) {
  /* Cherche la taille qui correspond Ã  au moins 2 des 3 mesures */
  for (const row of SIZE_TABLE) {
    const matchP = !p || (p >= row.poitrine[0]    && p <= row.poitrine[1]);
    const matchT = !t || (t >= row.tour_taille[0] && t <= row.tour_taille[1]);
    const matchH = !h || (h >= row.hanches[0]     && h <= row.hanches[1]);

    const matches = [matchP, matchT, matchH].filter(Boolean).length;
    const provided = [p, t, h].filter(Boolean).length;

    if (provided >= 2 && matches >= Math.ceil(provided * 0.6)) {
      return row.taille;
    }
  }

  /* Si toutes les mesures dÃ©passent XL â†’ sur mesure */
  const maxP = SIZE_TABLE[SIZE_TABLE.length - 1].poitrine[1];
  const maxH = SIZE_TABLE[SIZE_TABLE.length - 1].hanches[1];
  if ((p && p > maxP) || (h && h > maxH)) {
    return 'Sur mesure';
  }

  return 'Sur mesure';
}

function updateWAMesures(p, t, h, size) {
  const btn = document.querySelector('[data-action="wa-mesures"]');
  if (!btn || !window.NozhaCart) return;

  const lang = window.NozhaI18n ? window.NozhaI18n.currentLang() : 'fr';
  const tr   = window.NozhaI18n?.translations[lang];

  let msg;
  if (tr && typeof tr.wa_mesures === 'function') {
    msg = tr.wa_mesures(p || 'â€”', t || 'â€”', h || 'â€”');
  } else {
    msg = `Bonjour ! Voici mes mesures :\n- Poitrine: ${p||'â€”'} cm\n- Taille: ${t||'â€”'} cm\n- Hanches: ${h||'â€”'} cm\nTaille recommandÃ©e : ${size}\nJe souhaite commander sur mesure. Merci ! ðŸŒ¹`;
  }

  btn.onclick = () => {
    window.open(window.NozhaCart.buildWAUrl(msg), '_blank');
  };
}

/* ============================================================
   DIAGRAMME CORPS â€” Points de mesure animÃ©s
   ============================================================ */
function initBodyDiagram() {
  const points = document.querySelectorAll('.measure-point');
  if (!points.length) return;

  /* Hover: affiche description au survol */
  points.forEach(point => {
    point.addEventListener('mouseenter', () => {
      const id = point.dataset.step;
      highlightStep(id);
    });
    point.addEventListener('mouseleave', () => {
      /* Rien, laisse la step highlight jusqu'au prochain click */
    });
  });
}

function highlightBodyPoint(pointId) {
  if (!pointId) return;
  document.querySelectorAll('.measure-point').forEach(p => {
    const isActive = p.dataset.step === pointId;
    p.querySelector('circle')?.setAttribute('fill', isActive ? 'var(--or)' : 'rgba(201,169,110,0.4)');
    p.querySelector('circle')?.setAttribute('r', isActive ? '8' : '6');
  });
}

function highlightStep(stepId) {
  const header = document.querySelector(`.mesure-step[data-point="${stepId}"] .mesure-step-header`);
  if (header) header.click();
}

/* ============================================================
   LIEN WHATSAPP MESURES
   ============================================================ */
function initMesureWA() {
  const btn = document.querySelector('[data-action="wa-mesures"]');
  if (!btn) return;

  /* Message par dÃ©faut si calculateur pas encore rempli */
  btn.addEventListener('click', () => {
    const p = document.getElementById('calc-poitrine')?.value || '';
    const t = document.getElementById('calc-taille')?.value   || '';
    const h = document.getElementById('calc-hanches')?.value  || '';

    const msg = `Bonjour ! Je souhaite commander sur mesure Nozha Concept.\nMes mesures :\n- Poitrine: ${p||'?'} cm\n- Taille: ${t||'?'} cm\n- Hanches: ${h||'?'} cm\nMerci ! ðŸŒ¹`;
    const url = `https://wa.me/212612653622?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}


