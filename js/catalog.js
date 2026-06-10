/* ============================================================
   Nozha Concept — Moteur catalogue dynamique
   Lit data/catalog.json et rend les pages produits
   ============================================================ */

let _catalog = null;

async function getCatalog() {
  if (_catalog) return _catalog;
  const base = document.querySelector('base')?.href || '';
  const url  = new URL('data/catalog.json', base || window.location.href);
  const resp = await fetch(url);
  _catalog = await resp.json();
  return _catalog;
}

/* ── Carte produit ─────────────────────────────────────────── */

function productCard(p, section, category) {
  const href   = `product.html?id=${encodeURIComponent(p.id)}`;
  const photo  = p.photos[0] || '';
  const disc   = p.prix_original
    ? Math.round((1 - p.prix / p.prix_original) * 100)
    : 0;
  const badge  = disc > 0
    ? `<span class="product-badge-flash">−${disc}%</span>` : '';
  const prixHTML = p.prix_original
    ? `<span class="price-original">${p.prix_original.toLocaleString('fr-MA')} MAD</span>
       <span class="price-flash">${p.prix.toLocaleString('fr-MA')} MAD</span>`
    : `<span>${p.prix.toLocaleString('fr-MA')} MAD</span>`;

  return `
  <a class="product-card" href="${href}" data-id="${p.id}"
     data-section="${section}" data-cat="${category || ''}">
    <div class="product-card-image">
      <img src="${photo}" alt="${p.nom}" loading="lazy" width="400" height="533">
      ${badge}
    </div>
    <div class="product-card-info">
      <h3 class="product-card-name">${p.nom}</h3>
      <p class="product-card-sub">${toLabel(category || section)}</p>
      <p class="product-card-price">${prixHTML}</p>
    </div>
  </a>`;
}

function toLabel(slug) {
  const labels = {
    'caftan': 'Caftan', 'guendoura': 'Guendoura',
    'pret-a-porter': 'Prêt-à-Porter', 'robe-caftan': 'Robe-Caftan',
    'selham': 'Selham', 'djellaba': 'Djellaba',
    'femme': 'Femme', 'homme': 'Homme', 'enfants': 'Enfants',
    'nouveautes': 'Nouveauté', 'flash-sales': 'Flash Sale'
  };
  return labels[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Injecter une grille ───────────────────────────────────── */

function injectGrid(containerId, products, section, category) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products || !products.length) {
    el.innerHTML = '<p class="catalog-empty">Aucun article pour le moment.</p>';
    return;
  }
  el.innerHTML = products.map(p => productCard(p, section, category)).join('');
}

/* ── Page FEMME ────────────────────────────────────────────── */

async function initFemmePage() {
  const cat = await getCatalog();
  const femme = cat.femme || {};

  injectGrid('grid-caftan',       femme['caftan'],          'femme', 'caftan');
  injectGrid('grid-guendoura',    femme['guendoura'],       'femme', 'guendoura');
  injectGrid('grid-pret',         femme['pret-a-porter'],   'femme', 'pret-a-porter');
  injectGrid('grid-robe-caftan',  femme['robe-caftan'],     'femme', 'robe-caftan');
  initCategoryFilter();
}

/* ── Page HOMME ────────────────────────────────────────────── */

async function initHommePage() {
  const cat = await getCatalog();
  const homme = cat.homme || {};

  injectGrid('grid-selham',   homme['selham'],   'homme', 'selham');
  injectGrid('grid-djellaba', homme['djellaba'], 'homme', 'djellaba');
  initCategoryFilter();
}

/* ── Page ENFANTS ──────────────────────────────────────────── */

async function initEnfantsPage() {
  const cat = await getCatalog();
  const enfants = cat.enfants || {};

  injectGrid('grid-caftan-e',   enfants['caftan'],   'enfants', 'caftan');
  injectGrid('grid-djellaba-e', enfants['djellaba'], 'enfants', 'djellaba');
  initCategoryFilter();
}

/* ── Page NOUVEAUTÉS ───────────────────────────────────────── */

async function initNouveautesPage() {
  const cat = await getCatalog();
  const list = cat.nouveautes || [];

  // Fusionner aussi les 6 derniers ajouts des sections principales
  const recent = [];
  ['femme','homme','enfants'].forEach(sec => {
    Object.entries(cat[sec] || {}).forEach(([catKey, arr]) => {
      arr.forEach(p => recent.push({ ...p, _section: sec, _cat: catKey }));
    });
  });
  // Trier par ID (lexicographique) — les derniers ajoutés apparaissent en tête
  const allNew = [...list.map(p => ({ ...p, _section: 'nouveautes', _cat: '' })), ...recent]
    .slice(0, 12);

  injectGrid('grid-nouveautes', allNew.map(p => {
    const card = productCard(p, p._section, p._cat);
    return card;
  }).join('') && allNew, 'nouveautes', '');

  // Rendu direct (injectGrid attend un tableau)
  const el = document.getElementById('grid-nouveautes');
  if (el) el.innerHTML = allNew.map(p => productCard(p, p._section || 'nouveautes', p._cat || '')).join('');
}

/* ── Page FLASH SALES ──────────────────────────────────────── */

async function initFlashPage() {
  const cat = await getCatalog();
  const flash = cat['flash-sales'] || {};
  const all   = [];

  Object.entries(flash).forEach(([sec, cats]) => {
    Object.entries(cats).forEach(([catKey, arr]) => {
      arr.forEach(p => all.push({ ...p, _section: sec, _cat: catKey }));
    });
  });

  const el = document.getElementById('grid-flash');
  if (el) {
    if (!all.length) {
      el.innerHTML = '<p class="catalog-empty">Flash sales bientôt disponibles — restez connectés !</p>';
    } else {
      el.innerHTML = all.map(p => productCard(p, p._section, p._cat)).join('');
    }
  }
}

/* ── Page PRODUIT ──────────────────────────────────────────── */

async function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  if (!id) return;

  const cat  = await getCatalog();
  const prod = findProduct(cat, id);
  if (!prod) {
    document.getElementById('product-container')?.insertAdjacentHTML('beforeend',
      '<p style="padding:4rem;text-align:center">Produit introuvable.</p>');
    return;
  }

  renderProductDetail(prod);
}

function findProduct(cat, id) {
  for (const sec of ['femme','homme','enfants']) {
    for (const arr of Object.values(cat[sec] || {})) {
      const found = arr.find(p => p.id === id);
      if (found) return found;
    }
  }
  for (const p of (cat.nouveautes || [])) {
    if (p.id === id) return p;
  }
  for (const sec of Object.values(cat['flash-sales'] || {})) {
    for (const arr of Object.values(sec)) {
      const found = arr.find(p => p.id === id);
      if (found) return found;
    }
  }
  return null;
}

function renderProductDetail(p) {
  // Photos carousel
  const galleryEl = document.getElementById('product-gallery');
  if (galleryEl) {
    galleryEl.innerHTML = p.photos.map((ph, i) =>
      `<img src="${ph}" alt="${p.nom} ${i+1}" class="${i===0?'active':''}" loading="${i===0?'eager':'lazy'}">`
    ).join('');
    // Thumbnail strip
    const thumbsEl2 = document.getElementById('product-thumbs');
    if (thumbsEl2) thumbsEl2.innerHTML = '';
    if (p.photos.length > 1) {
      const thumbs = p.photos.map((ph, i) =>
        `<button class="thumb ${i===0?'active':''}" data-idx="${i}">
          <img src="${ph}" alt="${i+1}">
        </button>`
      ).join('');
      document.getElementById('product-thumbs')?.insertAdjacentHTML('beforeend', thumbs);
      document.querySelectorAll('.thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = +btn.dataset.idx;
          document.querySelectorAll('.thumb').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('#product-gallery img').forEach(img => img.classList.remove('active'));
          btn.classList.add('active');
          galleryEl.querySelectorAll('img')[idx]?.classList.add('active');
        });
      });
    }
  }

  // Infos
  const nameEl  = document.getElementById('product-name');
  const descEl  = document.getElementById('product-description');
  const priceEl = document.getElementById('product-price');

  if (nameEl)  nameEl.textContent  = p.nom;
  if (descEl)  descEl.textContent  = p.description;
  if (priceEl) {
    priceEl.innerHTML = p.prix_original
      ? `<span class="price-original">${p.prix_original.toLocaleString('fr-MA')} MAD</span>
         <span class="price-flash">${p.prix.toLocaleString('fr-MA')} MAD</span>`
      : `${p.prix.toLocaleString('fr-MA')} MAD`;
  }

  // WhatsApp
  document.querySelectorAll('[data-wa-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      const couleur = document.getElementById('select-couleur')?.value || 'À définir';
      const taille  = document.getElementById('select-taille')?.value  || 'À définir';
      const perso   = document.getElementById('perso-text')?.value     || '';
      const msg     = window.NozhaI18n?.translations?.fr?.wa_product?.(p.nom, couleur, taille, perso)
                   || `Bonjour ! Je suis intéressée par : *${p.nom}*\n- Couleur : ${couleur}\n- Taille : ${taille}`;
      window.open(`https://wa.me/212612653622?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
}

/* ── Filtre catégorie sidebar ──────────────────────────────── */

function initCategoryFilter() {
  document.querySelectorAll('.sidebar-link[data-filter]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const filter = link.dataset.filter;
      document.querySelectorAll('[id^="section-"]').forEach(sec => {
        if (filter === 'all') {
          sec.style.display = '';
        } else {
          sec.style.display = sec.id === `section-${filter}` ? '' : 'none';
        }
      });
    });
  });
}

/* ── Flash badge CSS (injecté une fois) ─────────────────────── */

(function injectFlashStyles() {
  if (document.getElementById('catalog-styles')) return;
  const style = document.createElement('style');
  style.id = 'catalog-styles';
  style.textContent = `
    .product-badge-flash {
      position: absolute; top: var(--space-3); left: var(--space-3);
      background: #C0392B; color: #fff;
      font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
      padding: 3px 8px; z-index: 2;
    }
    .price-original {
      text-decoration: line-through;
      color: var(--gris); font-size: 0.85em;
      margin-right: var(--space-2);
    }
    .price-flash { color: #C0392B; }
    .catalog-empty {
      padding: var(--space-16);
      text-align: center;
      color: var(--gris);
      font-style: italic;
      font-family: var(--font-display);
      font-size: var(--text-lg);
    }
    .product-card { display: block; text-decoration: none; color: inherit; }
  `;
  document.head.appendChild(style);
})();
