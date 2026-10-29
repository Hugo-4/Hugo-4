import type { ValeurDate } from '@/components/DateField';
import { TESTS } from '@/features/questionnaire/catalogue/valeurs';
import { lireNombre } from '@/features/questionnaire/saisie';

import type { SaisieEtape, SousObjectif, TypeEtape } from './types';

/** Champs du formulaire d'étape, tels que saisis. */
export type ChampsEtape = {
  titre: string;
  date: ValeurDate;
  type: TypeEtape;
  /** Libellé d'indicateur du catalogue des valeurs (`1rm_squat`, `temps_marathon`…), ou `null`. */
  indicateur: string | null;
  depart: string;
  cible: string;
  progression: string;
  notes: string;
};

export const estDuree = (indicateur: string | null) =>
  indicateur !== null && ['duree', 'allure'].includes(TESTS[indicateur]?.format ?? '');

/** « 3:05:00 », « 45:30 » ou « 90 » (secondes) → secondes. */
export function lireDuree(texte: string): number | null {
  const parties = texte.trim().split(':').map((p) => lireNombre(p));
  if (!parties.length || parties.some((p) => p === null || p < 0)) return null;
  return (parties as number[]).reduce((total, p) => total * 60 + p, 0) || null;
}

export function ecrireDuree(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = Math.round(secondes % 60);
  const deux = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${deux(m)}:${deux(s)}` : `${m}:${deux(s)}`;
}

const lireValeur = (indicateur: string | null, texte: string) => (estDuree(indicateur) ? lireDuree(texte) : lireNombre(texte));
const ecrireValeur = (indicateur: string | null, v: number | null) =>
  v === null ? '' : estDuree(indicateur) ? ecrireDuree(v) : String(v).replace('.', ',');

/** Libellé du catalogue correspondant à un indicateur enregistré (type + exercice). */
export function libelleIndicateur(e: Pick<SousObjectif, 'indicateur' | 'exercice_slug'>): string | null {
  if (!e.indicateur) return null;
  return Object.entries(TESTS).find(([, t]) => t.type === e.indicateur && (t.exercice ?? null) === (e.exercice_slug ?? null))?.[0] ?? null;
}

function dateVersChamps(iso: string): ValeurDate {
  const [annee, mois, jour] = iso.split('-');
  return { jour, mois, annee };
}

export function dateIso(d: ValeurDate): string | null {
  const j = Number(d.jour);
  const m = Number(d.mois);
  const a = Number(d.annee);
  if (!j || !m || d.annee.length !== 4) return null;
  const date = new Date(a, m - 1, j);
  if (date.getMonth() !== m - 1 || date.getDate() !== j) return null;
  return `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
}

export function champsDepuis(e: SousObjectif | null): ChampsEtape {
  const indicateur = e ? libelleIndicateur(e) : null;
  return {
    titre: e?.titre ?? '',
    date: e ? dateVersChamps(e.date_cible) : { jour: '', mois: '', annee: '' },
    type: e?.type ?? 'performance',
    indicateur,
    depart: ecrireValeur(indicateur, e?.valeur_depart ?? null),
    cible: ecrireValeur(indicateur, e?.valeur_cible ?? null),
    progression: e?.progression_hebdo_pct != null ? String(e.progression_hebdo_pct).replace('.', ',') : '',
    notes: e?.notes ?? '',
  };
}

export type ErreursEtape = Partial<Record<'titre' | 'date' | 'cible' | 'progression', true>>;

/** Vérifie la saisie et la convertit au format de la table ; date passée refusée. */
export function verifierEtape(
  c: ChampsEtape,
  aujourdhui: string,
  rattachement: { evenement_id: string | null; sport_id: string | null },
): { erreurs: ErreursEtape; saisie: SaisieEtape | null } {
  const erreurs: ErreursEtape = {};
  const date = dateIso(c.date);
  if (!c.titre.trim()) erreurs.titre = true;
  if (!date || date < aujourdhui) erreurs.date = true;
  const cible = c.cible.trim() ? lireValeur(c.indicateur, c.cible) : null;
  if (c.cible.trim() && cible === null) erreurs.cible = true;
  const progression = c.progression.trim() ? lireNombre(c.progression) : null;
  if (progression !== null && (progression < -50 || progression > 50)) erreurs.progression = true;
  if (c.progression.trim() && progression === null) erreurs.progression = true;
  if (Object.keys(erreurs).length || !date) return { erreurs, saisie: null };
  const test = c.indicateur ? TESTS[c.indicateur] : null;
  return {
    erreurs,
    saisie: {
      ...rattachement,
      titre: c.titre.trim(),
      type: c.type,
      date_cible: date,
      indicateur: test?.type ?? null,
      exercice_slug: test?.exercice ?? null,
      unite: test?.unite ?? null,
      valeur_depart: c.depart.trim() ? lireValeur(c.indicateur, c.depart) : null,
      valeur_cible: cible,
      progression_hebdo_pct: progression,
      notes: c.notes.trim() || null,
    },
  };
}
