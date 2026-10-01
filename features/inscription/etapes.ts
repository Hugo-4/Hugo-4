import { dateIso, estDansLeFutur } from './dates';
import type { Parcours, Reponses } from './types';

export type EtapeId =
  | 'identite'
  | 'profilPhysique'
  | 'sport'
  | 'objectif'
  | 'niveau'
  | 'sportsSecondaires'
  | 'disponibilites'
  | 'lieu'
  | 'competition'
  | 'douleurs'
  | 'coaching';

/**
 * Ordre des questions. Les questions de santé (douleurs) ne sont posées
 * que si l'athlète a donné son consentement « données de santé ».
 */
export function listeEtapes(parcours: Parcours, consentementSante: boolean): EtapeId[] {
  const sante: EtapeId[] = consentementSante ? ['douleurs'] : [];
  if (parcours === 'rapide') {
    return ['identite', 'sport', 'objectif', 'niveau', 'disponibilites', ...sante];
  }
  return [
    'identite',
    'profilPhysique',
    'sport',
    'objectif',
    'niveau',
    'sportsSecondaires',
    'disponibilites',
    'lieu',
    'competition',
    ...sante,
    'coaching',
  ];
}

/** Nombre décimal saisi avec une virgule ou un point. */
export function nombreSaisi(texte: string): number | null {
  const valeur = Number(texte.replace(',', '.').trim());
  return texte.trim() !== '' && Number.isFinite(valeur) ? valeur : null;
}

function entre(valeur: number | null, min: number, max: number): boolean {
  return valeur !== null && valeur >= min && valeur <= max;
}

export function etapeValide(etape: EtapeId, r: Reponses): boolean {
  switch (etape) {
    case 'identite':
      return r.prenom.trim().length > 0 && dateIso(r.naissance) !== null;
    case 'profilPhysique':
      return r.sexe !== null && entre(nombreSaisi(r.tailleCm), 100, 250) && entre(nombreSaisi(r.poidsKg), 25, 250);
    case 'sport':
      return r.sportId !== null;
    case 'objectif':
      return r.objectifId !== null;
    case 'niveau':
      return r.niveau !== null;
    case 'sportsSecondaires':
      return true;
    case 'disponibilites':
      return r.jours.length > 0 && r.creneau !== null && r.dureeMin !== null;
    case 'lieu':
      return r.lieu !== null;
    case 'competition': {
      const { prevue, nom, date, type } = r.competition;
      if (prevue === false) return true;
      const iso = dateIso(date);
      return prevue === true && nom.trim().length > 0 && type !== null && iso !== null && estDansLeFutur(iso);
    }
    case 'douleurs':
      return r.aucuneDouleur || r.douleurs.length > 0;
    case 'coaching':
      return r.ton !== null && r.longueur !== null;
  }
}
