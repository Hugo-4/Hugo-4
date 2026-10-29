import { MAX_BESOINS } from './constantes';
import { dateIso, estDansLeFutur } from './dates';
import type { Parcours, Reponses } from './types';

export type EtapeId =
  | 'identite'
  | 'pays'
  // Parcours Rapide : le poids seul (obligatoire) ; parcours Complet : sexe, taille et poids.
  | 'poids'
  | 'profilPhysique'
  | 'pratique'
  // Parcours A : il a un sport
  | 'sport'
  | 'ambition'
  | 'objectifSport'
  | 'niveau'
  | 'objectifsSecondaires'
  // Parcours B : pas encore de sport
  | 'besoins'
  | 'contraintes'
  | 'recommandation'
  // Suite commune
  | 'sportsSecondaires'
  | 'disponibilites'
  | 'lieu'
  | 'competition'
  | 'douleurs'
  | 'coaching';

/**
 * Ordre des questions (docs/ECRANS.md, fiche Inscription).
 * Date de naissance d'abord, puis « Tu pratiques déjà un sport ? » → parcours A ou B.
 * Les questions de santé (douleurs) ne sont posées qu'avec le consentement « données de santé ».
 */
export function listeEtapes(parcours: Parcours, consentementSante: boolean, r: Reponses): EtapeId[] {
  const complet = parcours === 'complet';
  const sport: EtapeId[] =
    r.pratique === 'non'
      ? ['besoins', 'contraintes', 'recommandation', 'objectifSport']
      : ['sport', 'ambition', 'objectifSport', 'niveau', 'objectifsSecondaires'];
  // Une échéance déjà saisie avec l'objectif remplace la question « compétition » du parcours Complet.
  const competition: EtapeId[] = complet && !r.objectifSport?.echeanceRequise ? ['competition'] : [];
  return [
    'identite',
    'pays',
    // Poids obligatoire dans les deux parcours (décision du 26/10/2026).
    ...(complet ? (['profilPhysique'] as EtapeId[]) : (['poids'] as EtapeId[])),
    'pratique',
    ...sport,
    ...(complet ? (['sportsSecondaires'] as EtapeId[]) : []),
    'disponibilites',
    ...(complet ? (['lieu'] as EtapeId[]) : []),
    ...competition,
    ...(consentementSante ? (['douleurs'] as EtapeId[]) : []),
    ...(complet ? (['coaching'] as EtapeId[]) : []),
  ];
}

/** Nombre décimal saisi avec une virgule ou un point. */
export function nombreSaisi(texte: string): number | null {
  const valeur = Number(texte.replace(',', '.').trim());
  return texte.trim() !== '' && Number.isFinite(valeur) ? valeur : null;
}

/** Poids en kg (questionnaire, TC10). */
export const POIDS_MIN = 30;
export const POIDS_MAX = 250;

function entre(valeur: number | null, min: number, max: number): boolean {
  return valeur !== null && valeur >= min && valeur <= max;
}

/** Objectif précis : l'échéance (date à venir + épreuve) et la précision sont exigées si l'objectif les demande. */
function objectifComplet(r: Reponses): boolean {
  const o = r.objectifSport;
  if (!o) return false;
  if (o.echeanceRequise) {
    const iso = dateIso(r.echeance.date);
    if (!iso || !estDansLeFutur(iso) || r.echeance.epreuve.trim() === '') return false;
  }
  if (o.precisionDemandee === 'categorie_poids') return entre(nombreSaisi(r.echeance.precision), 30, 200);
  if (o.precisionDemandee) return r.echeance.precision.trim() !== '';
  return true;
}

export function etapeValide(etape: EtapeId, r: Reponses): boolean {
  const { contraintes: c, competition } = r;
  switch (etape) {
    case 'identite':
      // Date de naissance obligatoire : sans elle, l'inscription ne peut pas continuer.
      return r.prenom.trim().length > 0 && dateIso(r.naissance) !== null;
    case 'pays':
      return r.pays !== null;
    case 'profilPhysique':
      return r.sexe !== null && entre(nombreSaisi(r.tailleCm), 100, 250) && entre(nombreSaisi(r.poidsKg), POIDS_MIN, POIDS_MAX);
    case 'poids':
      return entre(nombreSaisi(r.poidsKg), POIDS_MIN, POIDS_MAX);
    case 'pratique':
      return r.pratique !== null;
    case 'sport':
    case 'recommandation':
      return r.sportId !== null;
    case 'ambition':
      return r.ambition !== null;
    case 'objectifSport':
      return objectifComplet(r);
    case 'niveau':
      return r.niveau !== null;
    case 'objectifsSecondaires':
    case 'sportsSecondaires':
      return true;
    case 'besoins':
      return r.besoins.length > 0 && r.besoins.length <= MAX_BESOINS;
    case 'contraintes':
      return c.impactMax !== null && c.lieux.length > 0 && c.encadrement !== null && c.minutesSemaine !== null;
    case 'disponibilites':
      return r.jours.length > 0 && r.creneau !== null && r.dureeMin !== null;
    case 'lieu':
      return r.lieu !== null;
    case 'competition': {
      if (competition.prevue === false) return true;
      const iso = dateIso(competition.date);
      return (
        competition.prevue === true &&
        competition.nom.trim().length > 0 &&
        competition.type !== null &&
        iso !== null &&
        estDansLeFutur(iso)
      );
    }
    case 'douleurs':
      return r.aucuneDouleur || r.douleurs.length > 0;
    case 'coaching':
      return r.ton !== null && r.longueur !== null;
  }
}
