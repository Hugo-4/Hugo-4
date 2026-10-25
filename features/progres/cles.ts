/** Clés TanStack Query de l'onglet Progrès (toutes sous « progres » : tirer pour rafraîchir les invalide d'un coup). */
export const CLES_PROGRES = {
  racine: ['progres'],
  tests: ['progres', 'tests'],
  typesTests: ['progres', 'typesTests'],
  progressions: ['progres', 'progressions'],
  chargeActuelle: ['progres', 'chargeActuelle'],
  assiduite: ['progres', 'assiduite'],
  records: ['progres', 'records'],
  niveaux: ['progres', 'niveaux'],
  chargeSemaines: ['progres', 'chargeSemaines'],
  regularite: ['progres', 'regularite'],
  ligues: ['progres', 'ligues'],
} as const;
