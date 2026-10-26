import type { ValeurDate } from '@/components/DateField';

import { POIDS_MAX_KG, POIDS_MIN_KG, type Precision, TYPE_PAR_PRECISION } from './constantes';
import { DATE_VIDE, dateDuJour, dateIso, saisieDepuisIso } from './dates';
import { conflitA, precisionDuSport } from './presentation';
import type { CorpsEvenement, Evenement, Priorite, TypeEvenement } from './types';

export type SportOption = { id: string; slug: string; nom: string };

export type SaisieEvenement = {
  nom: string;
  date: ValeurDate;
  sportId: string | null;
  type: TypeEvenement;
  /** Distance, catégorie de poids ou poste, selon le sport. */
  precision: string;
  priorite: Priorite;
  lieu: string;
  notes: string;
};

export type ErreursSaisie = Partial<Record<'nom' | 'date' | 'precision', 'nomVide' | 'dateInvalide' | 'datePassee' | 'poids'>>;

const typeParDefaut = (slug: string | undefined): TypeEvenement => {
  const precision = precisionDuSport(slug);
  return precision ? TYPE_PAR_PRECISION[precision] : 'competition';
};

/** Priorité proposée à la création : A, sauf si une A est déjà prévue dans ce sport (alors B). */
export function prioriteParDefaut(evenements: Evenement[], sportId: string | null): Priorite {
  return conflitA(evenements, sportId, dateDuJour()) ? 'B' : 'A';
}

/** Saisie de départ : la compétition à modifier, sinon une compétition dans le sport principal (A, ou B si une A existe). */
export function saisieInitiale(evenement: Evenement | null, sports: SportOption[], evenements: Evenement[]): SaisieEvenement {
  if (!evenement) {
    const sportId = sports[0]?.id ?? null;
    return {
      nom: '',
      date: DATE_VIDE,
      sportId,
      type: typeParDefaut(sports[0]?.slug),
      precision: '',
      priorite: prioriteParDefaut(evenements, sportId),
      lieu: '',
      notes: '',
    };
  }
  const precision = precisionDuSport(evenement.sports?.slug);
  return {
    nom: evenement.nom,
    date: saisieDepuisIso(evenement.date_evenement),
    sportId: evenement.sport_id,
    type: evenement.type_evenement ?? typeParDefaut(evenement.sports?.slug),
    precision:
      precision === 'categorie_poids'
        ? evenement.categorie_poids_kg != null
          ? String(evenement.categorie_poids_kg)
          : ''
        : precision
          ? (evenement.discipline ?? '')
          : '',
    priorite: evenement.priorite,
    lieu: evenement.lieu ?? '',
    notes: evenement.notes ?? '',
  };
}

export function nombreSaisi(texte: string): number | null {
  const valeur = Number(texte.replace(',', '.').trim());
  return texte.trim() !== '' && Number.isFinite(valeur) ? valeur : null;
}

/** Erreurs à afficher sous les champs. Une date passée n'est refusée qu'à la création. */
export function erreursSaisie(s: SaisieEvenement, precision: Precision | null, creation: boolean): ErreursSaisie {
  const erreurs: ErreursSaisie = {};
  if (!s.nom.trim()) erreurs.nom = 'nomVide';
  const date = dateIso(s.date);
  if (!date) erreurs.date = 'dateInvalide';
  else if (creation && date < dateDuJour()) erreurs.date = 'datePassee';
  if (precision === 'categorie_poids' && s.precision.trim()) {
    const poids = nombreSaisi(s.precision);
    if (poids === null || poids < POIDS_MIN_KG || poids > POIDS_MAX_KG) erreurs.precision = 'poids';
  }
  return erreurs;
}

/**
 * Corps envoyé au serveur (sans identifiant d'athlète) et catégorie de poids à écrire en direct.
 * Distance et poste vont dans `discipline` (accepté par le serveur).
 */
export function corpsDepuisSaisie(s: SaisieEvenement, sport: SportOption | null, precision: Precision | null) {
  const texte = s.precision.trim();
  const corps: CorpsEvenement = {
    nom: s.nom.trim(),
    date_evenement: dateIso(s.date) ?? '',
    priorite: s.priorite,
    type_evenement: s.type,
    lieu: s.lieu.trim() || null,
    notes: s.notes.trim() || null,
    ...(sport ? { sport_slug: sport.slug } : {}),
    ...(precision === 'distance' || precision === 'poste' ? { discipline: texte || null } : {}),
  };
  const poidsKg = precision === 'categorie_poids' ? (texte ? nombreSaisi(texte) : null) : undefined;
  return { corps, poidsKg };
}
