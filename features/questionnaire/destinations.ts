import type { Destination, ValeurReponse } from './types';

/** Réponse « oui / non » enregistrée en booléen. */
export const OUI_NON = ['oui', 'non'] as const;

const versBooleen = (v: ValeurReponse) => v === 'oui';
const depuisBooleen = (v: unknown) => (v === true ? 'oui' : v === false ? 'non' : undefined);

/** Correspondance code de réponse ↔ valeur en base (contraintes CHECK, nombres). */
function correspondance(table: Record<string, unknown>) {
  return {
    versBase: (v: ValeurReponse) => (typeof v === 'string' ? table[v] : null),
    depuisBase: (v: unknown) => Object.entries(table).find(([, base]) => base === v)?.[0],
  };
}

export const profil = (colonne: string): Destination => ({ kind: 'profil', colonne });
export const profilOuiNon = (colonne: string): Destination => ({
  kind: 'profil',
  colonne,
  versBase: versBooleen,
  depuisBase: depuisBooleen,
});
export const profilCorrespondance = (colonne: string, table: Record<string, unknown>): Destination => ({
  kind: 'profil',
  colonne,
  ...correspondance(table),
});
export const contexteVie = (cle: string): Destination => ({ kind: 'profilJson', colonne: 'contexte_vie', cle });
export const styleCoaching = (cle: string): Destination => ({ kind: 'profilJson', colonne: 'style_coaching', cle });

type TableAthlete = 'preferences_athlete' | 'preferences_nutrition' | 'sante_athlete';
export const table = (nom: TableAthlete, colonne: string): Destination => ({ kind: 'table', table: nom, colonne });
export const tableOuiNon = (nom: TableAthlete, colonne: string): Destination => ({
  kind: 'table',
  table: nom,
  colonne,
  versBase: versBooleen,
  depuisBase: depuisBooleen,
});
export const tableCorrespondance = (nom: TableAthlete, colonne: string, valeurs: Record<string, unknown>): Destination => ({
  kind: 'table',
  table: nom,
  colonne,
  ...correspondance(valeurs),
});
/** Choix multiple dont « aucun » vaut une liste vide en base. */
export const tableListe = (nom: TableAthlete, colonne: string): Destination => ({
  kind: 'table',
  table: nom,
  colonne,
  versBase: (v) => (Array.isArray(v) ? v.filter((x) => x !== 'aucun') : []),
  depuisBase: (v) => (Array.isArray(v) ? (v.length ? (v as string[]) : ['aucun']) : undefined),
});
export const sport = (cle: string): Destination => ({ kind: 'sport', cle });
export const test = (type: string, exercice?: string): Destination => ({ kind: 'test', type, exercice });

/** Jours de la semaine (`j1` = lundi) enregistrés en nombres 1 à 7. */
export const JOURS_SEMAINE = ['j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7'] as const;
export const tableJours = (nom: TableAthlete, colonne: string): Destination => ({
  kind: 'table',
  table: nom,
  colonne,
  versBase: (v) => (Array.isArray(v) ? v.map((j) => Number(j.slice(1))) : []),
  depuisBase: (v) => (Array.isArray(v) && v.length ? (v as number[]).map((n) => `j${n}`) : undefined),
});
/** Signal de sécurité avant l'effort (TC80, TC81), daté par l'écriture. */
export const signalEffort = (cle: string): Destination => ({
  kind: 'tableJson',
  table: 'sante_athlete',
  colonne: 'signaux_effort',
  cle,
});
