import type { ValeurDate } from '@/components/DateField';
import { dateIso, estDansLeFutur } from '@/features/inscription/dates';
import { nombreSaisi } from '@/features/inscription/etapes';

import type { Echeance } from './types';
import type { ObjectifPrincipal } from './useObjectifPrincipal';

export type SaisieEcheance = { epreuve: string; date: ValeurDate; precision: string };

/** Valeurs de départ du formulaire à partir de `user_sport_profiles.echeance`. */
export function saisieDepuis(objectif: ObjectifPrincipal): SaisieEcheance {
  const e = objectif.echeance ?? {};
  const [annee = '', mois = '', jour = ''] = e.date ? e.date.split('-') : [];
  const precision = objectif.objectifs_sport?.precision_demandee;
  const valeurPrecision =
    precision === 'categorie_poids' ? e.categorie_poids_kg : precision === 'distance' ? e.distance : precision ? e.poste : undefined;
  return { epreuve: e.epreuve ?? '', date: { jour, mois, annee }, precision: valeurPrecision != null ? String(valeurPrecision) : '' };
}

/** Échéance à enregistrer (mêmes clés et mêmes règles que l'inscription), ou `null` si la saisie est invalide. */
export function echeanceDepuis(objectif: ObjectifPrincipal, saisie: SaisieEcheance): Echeance | null {
  const o = objectif.objectifs_sport;
  if (!o) return null;
  const echeance: Echeance = {};
  if (o.echeance_requise) {
    const iso = dateIso(saisie.date);
    if (!iso || !estDansLeFutur(iso) || saisie.epreuve.trim() === '') return null;
    echeance.date = iso;
    echeance.epreuve = saisie.epreuve.trim();
  }
  if (o.precision_demandee === 'categorie_poids') {
    const poids = nombreSaisi(saisie.precision);
    if (poids === null || poids < 30 || poids > 200) return null;
    echeance.categorie_poids_kg = poids;
  } else if (o.precision_demandee) {
    if (saisie.precision.trim() === '') return null;
    echeance[o.precision_demandee] = saisie.precision.trim();
  }
  return echeance;
}

/** Vrai si l'objectif demande une date ou une précision. */
export function aUneEcheance(objectif: ObjectifPrincipal): boolean {
  return Boolean(objectif.objectifs_sport?.echeance_requise || objectif.objectifs_sport?.precision_demandee);
}
