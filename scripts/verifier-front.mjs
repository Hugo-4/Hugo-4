#!/usr/bin/env node
/**
 * Contrôles du front Athlenis (sans dépendance). Usage : node scripts/verifier-front.mjs
 *  1. mêmes clés de traduction en français et en anglais ; aucune clé utilisée dans le code qui manque ;
 *  2. aucune couleur hexadécimale ni `fontFamily` en dur hors de `theme/` ;
 *  3. aucun texte affiché en dur dans les écrans (texte entre balises, props de libellé en chaîne) ;
 *  4. aucun `userId` / `user_id` dans un corps de requête au serveur ; aucune chaîne qui ressemble à une clé.
 * Code de sortie 1 s'il y a au moins un problème.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = fileURLToPath(new URL('..', import.meta.url));
const DOSSIERS_CODE = ['app', 'components', 'features', 'lib'];
const problemes = [];
const signaler = (categorie, fichier, ligne, detail) => problemes.push({ categorie, fichier, ligne, detail });

function fichiers(dossier, extensions) {
  const chemin = join(racine, dossier);
  let entrees = [];
  try {
    entrees = readdirSync(chemin);
  } catch {
    return [];
  }
  return entrees.flatMap((nom) => {
    const complet = join(chemin, nom);
    if (statSync(complet).isDirectory()) return fichiers(join(dossier, nom), extensions);
    return extensions.some((e) => nom.endsWith(e)) ? [join(dossier, nom)] : [];
  });
}

const lire = (f) => readFileSync(join(racine, f), 'utf8');
const numeroLigne = (texte, index) => texte.slice(0, index).split('\n').length;

// ─── 1. Traductions ─────────────────────────────────────────────────────────
function aplatir(objet, prefixe = '') {
  return Object.entries(objet).flatMap(([cle, valeur]) =>
    valeur && typeof valeur === 'object' ? aplatir(valeur, `${prefixe}${cle}.`) : [`${prefixe}${cle}`],
  );
}

function traductions(langue) {
  const base = JSON.parse(lire(`locales/${langue}.json`));
  for (const f of fichiers(`locales/${langue}`, ['.json'])) {
    const domaine = f.split('/').pop().replace('.json', '');
    if (base[domaine]) signaler('traductions', f, 0, `la clé « ${domaine} » existe déjà dans ${langue}.json`);
    base[domaine] = JSON.parse(lire(f));
  }
  return new Set(aplatir(base));
}

const fr = traductions('fr');
const en = traductions('en');
for (const cle of fr) if (!en.has(cle)) signaler('traductions', 'locales/en', 0, `clé absente en anglais : ${cle}`);
for (const cle of en) if (!fr.has(cle)) signaler('traductions', 'locales/fr', 0, `clé absente en français : ${cle}`);

const SUFFIXES_PLURIEL = ['_zero', '_one', '_two', '_few', '_many', '_other'];
const existe = (cle) => fr.has(cle) || SUFFIXES_PLURIEL.some((s) => fr.has(cle + s));

const codeTs = DOSSIERS_CODE.flatMap((d) => fichiers(d, ['.ts', '.tsx']));
for (const f of codeTs) {
  const texte = lire(f);
  for (const m of texte.matchAll(/\b(?:t|i18n\.t)\(\s*'([a-zA-Z0-9_.]+)'/g)) {
    if (!existe(m[1])) signaler('traductions', f, numeroLigne(texte, m.index), `clé inconnue : ${m[1]}`);
  }
}

// ─── 2. Couleurs et polices en dur ──────────────────────────────────────────
for (const f of codeTs) {
  const texte = lire(f);
  for (const m of texte.matchAll(/['"`]#[0-9a-fA-F]{3,8}['"`]/g)) {
    signaler('design', f, numeroLigne(texte, m.index), `couleur en dur ${m[0]}`);
  }
  for (const m of texte.matchAll(/fontFamily\s*:\s*['"`]/g)) {
    signaler('design', f, numeroLigne(texte, m.index), 'fontFamily en dur');
  }
  for (const m of texte.matchAll(/\b(?:rgba?|hsla?)\(/g)) {
    signaler('design', f, numeroLigne(texte, m.index), `couleur en dur ${m[0]}`);
  }
}

// ─── 3. Textes affichés en dur ──────────────────────────────────────────────
const PROPS_TEXTE = ['accessibilityLabel', 'accessibilityHint', 'label', 'titre', 'texte', 'placeholder', 'libelle', 'sousTitre', 'aide'];
for (const f of codeTs.filter((x) => x.endsWith('.tsx'))) {
  const texte = lire(f);
  // Texte brut entre deux balises : >Bonjour< (les expressions {…} sont autorisées).
  for (const m of texte.matchAll(/>([^<>{}\n]*[A-Za-zÀ-ÿ]{2,}[^<>{}\n]*)</g)) {
    if (/=>|&&|\|\||\?\s|^\s*[()]|[=;]|\bnew\s/.test(m[1])) continue; // code TypeScript (génériques…), pas du JSX
    signaler('textes', f, numeroLigne(texte, m.index), `texte en dur : « ${m[1].trim()} »`);
  }
  for (const m of texte.matchAll(new RegExp(`\\b(${PROPS_TEXTE.join('|')})="([^"]*[A-Za-zÀ-ÿ]{2,}[^"]*)"`, 'g'))) {
    signaler('textes', f, numeroLigne(texte, m.index), `${m[1]} en dur : « ${m[2]} »`);
  }
}

// ─── 4. Sécurité ────────────────────────────────────────────────────────────
function argumentsDe(texte, debut) {
  let profondeur = 0;
  for (let i = debut; i < texte.length; i++) {
    if (texte[i] === '(') profondeur++;
    else if (texte[i] === ')' && --profondeur === 0) return texte.slice(debut, i + 1);
  }
  return texte.slice(debut);
}

for (const f of codeTs) {
  const texte = lire(f);
  for (const m of texte.matchAll(/\bapi\.(post|put|patch)\s*(?:<[^>]*>)?\s*\(/g)) {
    const args = argumentsDe(texte, m.index + m[0].length - 1);
    if (/\buser_?[iI]d\b/.test(args)) signaler('sécurité', f, numeroLigne(texte, m.index), `userId dans un corps de requête (${m[0]}…)`);
  }
}

const SECRETS = [/\bsk-[A-Za-z0-9_-]{16,}/, /\bservice_role\b/, /\beyJ[A-Za-z0-9_-]{16,}/, /\bsb_secret_[A-Za-z0-9_-]{8,}/];
const fichiersSecrets = [
  ...DOSSIERS_CODE.flatMap((d) => fichiers(d, ['.ts', '.tsx', '.js', '.json'])),
  ...fichiers('theme', ['.ts']),
  ...fichiers('locales', ['.json', '.ts']),
  'app.json',
  'package.json',
].filter((f) => !f.endsWith('verifier-front.mjs'));
for (const f of fichiersSecrets) {
  let texte = '';
  try {
    texte = lire(f);
  } catch {
    continue;
  }
  for (const motif of SECRETS) {
    const m = texte.match(motif);
    if (m) signaler('sécurité', f, numeroLigne(texte, m.index), `ressemble à une clé : ${m[0].slice(0, 12)}…`);
  }
}

// ─── Rapport ────────────────────────────────────────────────────────────────
const categories = ['traductions', 'design', 'textes', 'sécurité'];
for (const c of categories) {
  const liste = problemes.filter((p) => p.categorie === c);
  console.log(`${liste.length ? '✗' : '✓'} ${c} : ${liste.length} problème(s)`);
  for (const p of liste.slice(0, 50)) console.log(`   ${relative(racine, join(racine, p.fichier))}${p.ligne ? `:${p.ligne}` : ''}  ${p.detail}`);
  if (liste.length > 50) console.log(`   … et ${liste.length - 50} de plus`);
}
console.log(`\n${codeTs.length} fichiers analysés, ${fr.size} clés de traduction.`);
process.exit(problemes.length ? 1 : 0);
