/** Seul code de `GET /profil` → `charge.zone` affiché comme « zone optimale » ; tout autre code inconnu : rien. */
export const ZONE_OPTIMALE = 'optimale';

/**
 * Mots interdits dans le critère d'une ligue (FRONTEND.md §2.6, docs/MANQUES-SERVEUR.md §5) : aucun classement sur
 * le poids ni sur le volume d'entraînement. Comparaison sur le contenu du code (« poids_corps », « volume_hebdo »…).
 */
export const MOTS_CRITERES_INTERDITS = [
  'poids',
  'masse',
  'imc',
  'volume',
  'tonnage',
  'minute',
  'seance',
  'duree',
  'distance',
  'charge',
];
