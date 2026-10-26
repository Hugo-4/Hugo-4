import type { UseQueryResult } from '@tanstack/react-query';

import { ApiError, messageServeur } from '@/lib/api';

/** Messages de `GET /programme/seances/:id` (routes/athlete.js) quand la séance n'existe pas chez cet athlète. */
const SEANCE_INCONNUE = ['séance inconnue', 'id invalide'];

/** La séance demandée n'existe pas (404, ou 400 « séance inconnue » / « id invalide ») : inutile de réessayer. */
export function estSeanceIntrouvable(erreur: unknown): boolean {
  if (!(erreur instanceof ApiError)) return false;
  if (erreur.status === 404) return true;
  const message = messageServeur(erreur);
  return erreur.status === 400 && message !== null && SEANCE_INCONNUE.includes(message);
}

/** Hors ligne avant d'avoir reçu la moindre donnée : affiché comme une erreur (« Vérifie ta connexion »), avec Réessayer. */
export class HorsLigneSansDonnees extends Error {
  constructor() {
    super('hors ligne, aucune donnée en cache');
    this.name = 'HorsLigneSansDonnees';
  }
}

/** États attendus par `components/EtatsEcran` pour une requête TanStack Query. */
export function etatsRequete<T>(requete: UseQueryResult<T>) {
  const enPause = requete.isPending && requete.fetchStatus === 'paused';
  return {
    chargement: requete.isPending && !enPause,
    erreur: requete.error ?? (enPause ? new HorsLigneSansDonnees() : null),
    aDesDonnees: requete.data !== undefined,
  };
}
