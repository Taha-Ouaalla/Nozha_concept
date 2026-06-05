/* ============================================================
   NOZHA CONCEPT â€” Panier (localStorage)
   Gestion des commandes cÃ´tÃ© client
   ============================================================ */

const PANIER_KEY = 'nozha_panier';
const WA_NUMBER  = '212612653622';

/* â”€â”€ Structure d'un article â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
{
  id:       'prod_001',
  nom:      'Caftan Royal BrodÃ©',
  couleur:  'Bordeaux Royal',
  taille:   'M',
  prix:     2800,
  image:    'https://...',
  quantite: 1
}
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* RÃ©cupÃ¨re le panier depuis localStorage */
function getPanier() {
  try {
    return JSON.parse(localStorage.getItem(PANIER_KEY)) || [];
  } catch {
    return [];
  }
}

/* Sauvegarde le panier */
function savePanier(items) {
  localStorage.setItem(PANIER_KEY, JSON.stringify(items));
  dispatchPanierEvent(items);
}

/* Ajoute un article */
function addToPanier(article) {
  const panier = getPanier();
  const idx = panier.findIndex(
    it => it.id === article.id &&
          it.couleur === article.couleur &&
          it.taille === article.taille
  );

  if (idx > -1) {
    panier[idx].quantite += (article.quantite || 1);
  } else {
    panier.push({ ...article, quantite: article.quantite || 1 });
  }

  savePanier(panier);
  showToast(article.nom);
  return panier;
}

/* Supprime un article par index */
function removeFromPanier(index) {
  const panier = getPanier();
  panier.splice(index, 1);
  savePanier(panier);
  return panier;
}

/* Met Ã  jour la quantitÃ© */
function updateQuantite(index, quantite) {
  const panier = getPanier();
  if (quantite <= 0) {
    panier.splice(index, 1);
  } else {
    panier[index].quantite = quantite;
  }
  savePanier(panier);
  return panier;
}

/* Vide le panier */
function clearPanier() {
  savePanier([]);
}

/* Calcule le total */
function getTotal() {
  return getPanier().reduce((sum, it) => sum + (it.prix * it.quantite), 0);
}

/* Compte les articles */
function getCount() {
  return getPanier().reduce((sum, it) => sum + it.quantite, 0);
}

/* â”€â”€ Event custom â”€â”€ */
function dispatchPanierEvent(items) {
  const event = new CustomEvent('panierUpdated', { detail: { items, total: getTotal(), count: getCount() } });
  window.dispatchEvent(event);
}

/* â”€â”€ Mise Ã  jour badge navbar â”€â”€ */
function updateBadge() {
  const count = getCount();
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
    if (count > 0) {
      badge.classList.add('cart-badge-animate');
      setTimeout(() => badge.classList.remove('cart-badge-animate'), 400);
    }
  });
}

/* â”€â”€ Toast notification â”€â”€ */
function showToast(nom) {
  let toast = document.getElementById('panier-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'panier-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 24px;
      background: var(--noir-soft);
      border: 1px solid rgba(201,169,110,0.3);
      color: var(--blanc);
      font-family: var(--font-body);
      font-size: 13px;
      letter-spacing: 0.1em;
      padding: 12px 20px;
      z-index: 9900;
      transform: translateY(20px);
      opacity: 0;
      transition: all 300ms cubic-bezier(0.16,1,0.3,1);
      max-width: 280px;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const lang = window.NozhaI18n ? window.NozhaI18n.currentLang() : 'fr';
  toast.innerHTML = lang === 'ar'
    ? `<span style="color:var(--or)">âœ“</span> Ø£Ø¶ÙŠÙ Ø¥Ù„Ù‰ Ø·Ù„Ø¨ÙŠØªÙƒ`
    : `<span style="color:var(--or)">âœ“</span> AjoutÃ© Ã  votre commande`;

  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2800);
}

/* â”€â”€ GÃ©nÃ©ration message WhatsApp â”€â”€ */
function buildWAMessage(items, total) {
  const lang = window.NozhaI18n ? window.NozhaI18n.currentLang() : 'fr';
  const t = window.NozhaI18n ? window.NozhaI18n.translations[lang] : null;

  /* Utilise wa_inquiry si disponible (nouveau format poli) */
  if (t && typeof t.wa_inquiry === 'function') {
    return t.wa_inquiry(items);
  }
  if (t && typeof t.wa_commande === 'function') {
    return t.wa_commande(items, total);
  }

  const lines = items.map((it, i) =>
    `${i+1}. ${it.nom}${it.couleur ? ` â€” ${it.couleur}` : ''} â€” ${it.taille}`
  ).join('\n');
  return `Bonjour, j'espÃ¨re que tout va bien ðŸŒ¹\nEst-ce que je peux me renseigner sur ces articles svp :\n\n${lines}`;
}

function buildWAProductMessage(nom, couleur, taille, perso) {
  const lang = window.NozhaI18n ? window.NozhaI18n.currentLang() : 'fr';
  const t = window.NozhaI18n ? window.NozhaI18n.translations[lang] : null;

  if (t && typeof t.wa_product === 'function') {
    return t.wa_product(nom, couleur, taille, perso);
  }

  return `Bonjour ! Je souhaite commander :\n*${nom}*\n- Couleur : ${couleur}\n- Taille : ${taille}${perso ? `\n- Personnalisation : ${perso}` : ''}\n\nMerci de confirmer la disponibilitÃ©. ðŸŒ¹`;
}

/* Construit l'URL WhatsApp */
function buildWAUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* â”€â”€ Rendu de la page Ma Commande â”€â”€ */
function renderCommande() {
  const container = document.getElementById('commande-items');
  const emptyState = document.getElementById('commande-empty');
  const recap = document.getElementById('commande-recap');

  if (!container) return;

  const panier = getPanier();

  if (panier.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (recap) recap.classList.add('hidden');
    updateRecapTotal(0);
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (recap) recap.classList.remove('hidden');

  container.innerHTML = panier.map((it, idx) => `
    <article class="commande-item" data-index="${idx}">
      <div class="commande-item-img">
        <img src="${it.image}" alt="${it.nom}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/fallback/200/267'">
      </div>
      <div class="commande-item-info">
        <div class="commande-item-name">${it.nom}</div>
        <div class="commande-item-details">
          <span class="commande-item-detail">${it.couleur}</span>
          <span class="commande-item-detail">${it.taille}</span>
          ${it.perso ? `<span class="commande-item-detail">${it.perso}</span>` : ''}
        </div>
        <div class="commande-item-price">${it.prix.toLocaleString('fr-MA')} MAD</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)"
            style="width:28px;height:28px;border:1px solid rgba(201,169,110,0.2);color:var(--blanc);font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;">âˆ’</button>
          <span style="font-size:14px;min-width:20px;text-align:center">${it.quantite}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)"
            style="width:28px;height:28px;border:1px solid rgba(201,169,110,0.2);color:var(--blanc);font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;">+</button>
        </div>
      </div>
      <button class="commande-item-remove" onclick="supprimerArticle(${idx})" aria-label="Supprimer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </article>
  `).join('');

  /* RÃ©cap lignes */
  const recapLines = document.getElementById('recap-lines');
  if (recapLines) {
    recapLines.innerHTML = panier.map(it => `
      <div class="recap-line">
        <span>${it.nom} Ã—${it.quantite}</span>
        <span>${(it.prix * it.quantite).toLocaleString('fr-MA')} MAD</span>
      </div>
    `).join('');
  }

  updateRecapTotal(getTotal());
}

function updateRecapTotal(total) {
  const el = document.getElementById('recap-total-amount');
  if (el) el.textContent = `${total.toLocaleString('fr-MA')} MAD`;
}

/* Fonctions globales appelÃ©es depuis le HTML inline */
window.supprimerArticle = function(idx) {
  removeFromPanier(idx);
  renderCommande();
  updateBadge();
};

window.changeQty = function(idx, delta) {
  const panier = getPanier();
  const newQty = (panier[idx]?.quantite || 1) + delta;
  updateQuantite(idx, newQty);
  renderCommande();
  updateBadge();
};

window.envoyerCommandeWA = function() {
  const panier = getPanier();
  if (panier.length === 0) return;
  const msg = buildWAMessage(panier, getTotal());
  window.open(buildWAUrl(msg), '_blank');
};

/* â”€â”€ Init â”€â”€ */
window.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  renderCommande();
});

window.addEventListener('panierUpdated', () => {
  updateBadge();
});

/* â”€â”€ Export global â”€â”€ */
window.NozhaCart = {
  addToPanier,
  removeFromPanier,
  getPanier,
  getTotal,
  getCount,
  clearPanier,
  buildWAUrl,
  buildWAProductMessage,
  buildWAMessage,
};

