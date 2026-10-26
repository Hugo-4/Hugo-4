import i18n from '@/lib/i18n';

import { PRECISION_PAR_SPORT, type Precision } from './constantes';
import type { DetailSeanceProgramme, Evenement, JourCalendrier, Legende, SeanceCalendrier, SeanceHorsProgramme } from './types';

/** Libellé traduit par l'app si le code est connu, sinon le texte du serveur tel quel. */
function traduire(cle: string, repli: string): string {
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : repli;
}

export const libellePhase = (phase: string) => traduire(`programme.phases.${phase}`, phase);
export const libelleCategorie = (categorie: string) => traduire(`programme.categories.${categorie}`, categorie);
export const libellePortee = (portee: string) => traduire(`programme.adaptations.portees.${portee}`, portee);
export const libelleStatutAdaptation = (statut: string) => traduire(`programme.adaptations.statuts.${statut}`, statut);

/** Causes d'adaptation qui relèvent de la santé : affichées seulement avec le consentement « données de santé ». */
const CAUSES_SANTE = ['douleur', 'blessure', 'maladie'];
export const causeSante = (categorie: string) => CAUSES_SANTE.includes(categorie);

/** Intensité 1-5 : libellé de l'app, sinon celui de la légende du serveur. */
export function libelleIntensite(niveau: number, legende?: Legende): string {
  const serveur = legende?.intensites.find((i) => i.niveau === niveau)?.libelle ?? String(niveau);
  return traduire(`programme.intensite.niveaux.${niveau}`, serveur);
}

/** Type de séance (code `type.code`) : libellé de l'app, sinon celui de la légende du serveur, sinon le code. */
export function libelleTypeSeance(code: string, legende?: Legende): string {
  return traduire(`seance.types.${code}`, legende?.types.find((t) => t.code === code)?.libelle ?? code);
}

/** Badge d'une séance (`cle`, `allegee`, `modifiee`, `deplacee`…) : libellé de l'app, sinon celui de la légende. */
export function libelleBadge(code: string, legende?: Legende): string {
  return traduire(`programme.badges.${code}`, legende?.badges.find((b) => b.code === code)?.libelle ?? code);
}

/** Statut d'une séance (code du serveur) : libellé de l'app, sinon celui du serveur. */
export const libelleStatutSeance = (statut: { code: string; libelle: string }) =>
  traduire(`programme.statutsSeance.${statut.code}`, statut.libelle);

/** Première lettre en majuscule (libellé seul sur sa ligne). */
export const majuscule = (texte: string) => texte.charAt(0).toLocaleUpperCase(i18n.language) + texte.slice(1);

export function estSeanceProgramme(s: SeanceCalendrier | SeanceHorsProgramme): s is SeanceCalendrier {
  return s.hors_programme !== true && s.id !== null;
}

/** État d'une case du calendrier. La couleur n'est jamais seule : chaque état a son icône ou ses traits. */
export type StatutCase = 'fait' | 'prevu' | 'manque' | 'vide';

const A_FAIRE = ['a_venir', 'prete', 'en_cours', 'reportee'];

export function etatJour(jour: JourCalendrier) {
  const codes = jour.seances.map((s) => s.statut.code);
  let statut: StatutCase = 'vide';
  if (codes.length && codes.every((c) => c === 'faite')) statut = 'fait';
  else if (codes.some((c) => A_FAIRE.includes(c))) statut = 'prevu';
  else if (codes.some((c) => c === 'manquee')) statut = 'manque';
  else if (codes.length) statut = 'prevu';
  // Séance la plus intense du jour : son intensité et son type sont dessinés sous le numéro.
  const principale = jour.seances.reduce<(typeof jour.seances)[number] | null>(
    (max, s) => (!max || s.intensite.niveau > max.intensite.niveau ? s : max),
    null,
  );
  return {
    statut,
    intensite: principale?.intensite.niveau ?? null,
    type: principale?.type.code ?? null,
    competition: jour.evenements.length > 0,
    nbSeances: jour.seances.length,
  };
}

export type EtatJour = ReturnType<typeof etatJour>;

/** Prochaine compétition A prévue (toutes disciplines confondues). */
export function objectifA(evenements: Evenement[] | undefined, aujourdhui: string): Evenement | null {
  return competitionsAVenir(evenements, aujourdhui).find((e) => e.priorite === 'A') ?? null;
}

/** Compétitions prévues à partir d'aujourd'hui, de la plus proche à la plus lointaine. */
export function competitionsAVenir(evenements: Evenement[] | undefined, aujourdhui: string): Evenement[] {
  return (evenements ?? [])
    .filter((e) => e.statut === 'prevu' && e.date_evenement >= aujourdhui)
    .sort((a, b) => a.date_evenement.localeCompare(b.date_evenement));
}

/** Une seule compétition A à venir par sport : l'autre A prévue du même sport (aujourd'hui ou après), s'il y en a une. */
export function conflitA(
  evenements: Evenement[] | undefined,
  sportId: string | null,
  aujourdhui: string,
  saufId?: string,
): Evenement | null {
  return (
    (evenements ?? []).find(
      (e) =>
        e.priorite === 'A' &&
        e.statut === 'prevu' &&
        e.date_evenement >= aujourdhui &&
        (e.sport_id ?? null) === sportId &&
        e.id !== saufId,
    ) ?? null
  );
}

const normaliser = (texte: string) => texte.trim().toLocaleLowerCase();

/** Même nom et même date qu'une compétition déjà enregistrée (non annulée) : on la met à jour au lieu d'en créer une autre. */
export function doublon(evenements: Evenement[] | undefined, nom: string, date: string): Evenement | null {
  return (
    (evenements ?? []).find(
      (e) => e.statut !== 'annule' && e.date_evenement === date && normaliser(e.nom) === normaliser(nom),
    ) ?? null
  );
}

export const precisionDuSport = (slug: string | null | undefined): Precision | null =>
  (slug && PRECISION_PAR_SPORT[slug]) || null;

/**
 * Ce que l'athlète peut faire sur une séance prévue, d'après le statut renvoyé par le serveur.
 * Une séance ne peut être déclarée manquée que le jour même ou après (`aujourdhui` : date du jour AAAA-MM-JJ).
 */
export function actionsSeance(detail: DetailSeanceProgramme, aujourdhui: string) {
  const { code, aujourdhui: duJour } = detail.seance.statut;
  const modifiable = code === 'a_venir' || code === 'prete';
  return {
    modifiable,
    manquable: modifiable && detail.seance.date <= aujourdhui,
    demarrable: duJour === true && ['a_venir', 'prete', 'en_cours'].includes(code),
    enCours: code === 'en_cours',
    faite: code === 'faite',
    manquee: code === 'manquee',
  };
}

/** Lieu de la séance, quel que soit son format (texte ou objet). */
export function nomLieu(lieu: DetailSeanceProgramme['lieu']): string | null {
  if (!lieu) return null;
  return typeof lieu === 'string' ? lieu : (lieu.nom ?? null);
}

/** Liste de textes à partir d'une colonne texte, tableau ou JSON (fiche exercice). */
export function enListe(valeur: unknown): string[] {
  if (!valeur) return [];
  if (typeof valeur === 'string') return valeur.split('\n').map((l) => l.trim()).filter(Boolean);
  if (Array.isArray(valeur)) {
    return valeur
      .map((v) => (typeof v === 'string' ? v : v && typeof v === 'object' && 'texte' in v ? String(v.texte) : ''))
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [];
}
