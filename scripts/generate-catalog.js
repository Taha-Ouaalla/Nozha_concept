#!/usr/bin/env node
/**
 * Nozha Concept — Génération automatique du catalogue
 * Usage : node scripts/generate-catalog.js
 *
 * Lit l'arborescence produits/ et génère data/catalog.json
 *
 * Structure attendue :
 *   produits/femme/<categorie>/<modele>/{photos, info.txt}
 *   produits/homme/<categorie>/<modele>/{photos, info.txt}
 *   produits/enfants/<categorie>/<modele>/{photos, info.txt}
 *   produits/nouveautes/<modele>/{photos, info.txt}
 *   produits/flash-sales/<section>/<categorie>/<modele>/{photos, info.txt}
 *
 * Format info.txt :
 *   description: Texte libre
 *   prix: 2500
 *   prix_original: 3200   (optionnel, flash-sales uniquement)
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, '..');
const PRODUIT = path.join(ROOT, 'produits');
const OUT     = path.join(ROOT, 'data', 'catalog.json');
const IMG_EXT = /\.(jpg|jpeg|png|webp|avif)$/i;

/* ── Utilitaires ───────────────────────────────────────────── */

function parseInfo(infoPath) {
  if (!fs.existsSync(infoPath)) return { description: '', prix: 0 };
  const lines = fs.readFileSync(infoPath, 'utf-8').split('\n');
  const obj = {};
  lines.forEach(line => {
    const colon = line.indexOf(':');
    if (colon < 1) return;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    obj[key] = isNaN(val) ? val : Number(val);
  });
  return obj;
}

function getPhotos(dir, relBase) {
  return fs.readdirSync(dir)
    .filter(f => IMG_EXT.test(f))
    .sort()
    .map(f => (relBase + '/' + f).replace(/\\/g, '/'));
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ── Lecture d'un dossier modèle ───────────────────────────── */

function readModel(modelDir, relDir, idPrefix) {
  const name    = path.basename(modelDir);
  const info    = parseInfo(path.join(modelDir, 'info.txt'));
  const photos  = getPhotos(modelDir, relDir);
  if (!photos.length) return null;

  return {
    id:          slug(idPrefix + '-' + name),
    nom:         toTitle(name),
    photos,
    description: info.description || '',
    prix:        info.prix        || 0,
    ...(info.prix_original ? { prix_original: info.prix_original } : {})
  };
}

function toTitle(slug) {
  return slug.replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Sections standard (femme / homme / enfants) ───────────── */

function readSection(sectionDir, sectionName) {
  const result = {};
  if (!fs.existsSync(sectionDir)) return result;

  fs.readdirSync(sectionDir).forEach(catName => {
    const catDir = path.join(sectionDir, catName);
    if (!fs.statSync(catDir).isDirectory()) return;

    result[catName] = [];
    fs.readdirSync(catDir).forEach(modelName => {
      const modelDir = path.join(catDir, modelName);
      if (!fs.statSync(modelDir).isDirectory()) return;
      const relDir = `produits/${sectionName}/${catName}/${modelName}`;
      const prod = readModel(modelDir, relDir, `${sectionName}-${catName}`);
      if (prod) result[catName].push(prod);
    });
  });
  return result;
}

/* ── Nouveautés ────────────────────────────────────────────── */

function readNouveautes() {
  const dir = path.join(PRODUIT, 'nouveautes');
  const list = [];
  if (!fs.existsSync(dir)) return list;

  fs.readdirSync(dir).forEach(modelName => {
    const modelDir = path.join(dir, modelName);
    if (!fs.statSync(modelDir).isDirectory()) return;
    const relDir = `produits/nouveautes/${modelName}`;
    const prod = readModel(modelDir, relDir, 'nouveautes');
    if (prod) list.push(prod);
  });
  return list;
}

/* ── Flash Sales ───────────────────────────────────────────── */

function readFlashSales() {
  const baseDir = path.join(PRODUIT, 'flash-sales');
  const result = {};
  if (!fs.existsSync(baseDir)) return result;

  fs.readdirSync(baseDir).forEach(sectionName => {
    const sectionDir = path.join(baseDir, sectionName);
    if (!fs.statSync(sectionDir).isDirectory()) return;
    result[sectionName] = {};

    fs.readdirSync(sectionDir).forEach(catName => {
      const catDir = path.join(sectionDir, catName);
      if (!fs.statSync(catDir).isDirectory()) return;
      result[sectionName][catName] = [];

      fs.readdirSync(catDir).forEach(modelName => {
        const modelDir = path.join(catDir, modelName);
        if (!fs.statSync(modelDir).isDirectory()) return;
        const relDir = `produits/flash-sales/${sectionName}/${catName}/${modelName}`;
        const prod = readModel(modelDir, relDir, `flash-${sectionName}-${catName}`);
        if (prod) result[sectionName][catName].push(prod);
      });
    });
  });
  return result;
}

/* ── Construction du catalogue ─────────────────────────────── */

const catalog = {
  femme:       readSection(path.join(PRODUIT, 'femme'),    'femme'),
  homme:       readSection(path.join(PRODUIT, 'homme'),    'homme'),
  enfants:     readSection(path.join(PRODUIT, 'enfants'),  'enfants'),
  nouveautes:  readNouveautes(),
  'flash-sales': readFlashSales(),
  generated_at: new Date().toISOString()
};

/* ── Stats ─────────────────────────────────────────────────── */

let total = 0;
['femme','homme','enfants'].forEach(s => {
  Object.values(catalog[s]).forEach(arr => total += arr.length);
});
total += catalog.nouveautes.length;
Object.values(catalog['flash-sales']).forEach(sec =>
  Object.values(sec).forEach(arr => total += arr.length)
);

/* ── Écriture ───────────────────────────────────────────────── */

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2), 'utf-8');

console.log(`✓ catalog.json généré — ${total} produits`);
console.log(`  Femme    : ${Object.values(catalog.femme).flat().length}`);
console.log(`  Homme    : ${Object.values(catalog.homme).flat().length}`);
console.log(`  Enfants  : ${Object.values(catalog.enfants).flat().length}`);
console.log(`  Nouveautés: ${catalog.nouveautes.length}`);
console.log(`  Flash    : ${Object.values(catalog['flash-sales']).flatMap(s=>Object.values(s)).flat().length}`);
