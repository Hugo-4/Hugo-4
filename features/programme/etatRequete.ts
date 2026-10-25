import type { UseQueryResult } from '@tanstack/react-query';

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
