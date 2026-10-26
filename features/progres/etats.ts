import type { FetchStatus } from '@tanstack/react-query';

type Requete = { data: unknown; isError: boolean; isPending: boolean; error: unknown; fetchStatus: FetchStatus };

/** État d'une partie d'écran alimentée par une requête. */
export type EtatSection = 'chargement' | 'erreur' | 'horsLigne' | 'pret';

export function etatSection(requete: Requete): EtatSection {
  if (requete.data !== undefined) return 'pret';
  if (requete.isError) return 'erreur';
  if (requete.fetchStatus === 'paused') return 'horsLigne';
  return 'chargement';
}

/**
 * Propriétés de `EtatsEcran` pour un écran qui dépend d'une requête principale.
 * Hors ligne sans rien en cache : l'écran affiche un état « pas de réseau » au lieu d'un squelette sans fin.
 */
export function etatsEcran(requete: Requete) {
  const horsLigneSansDonnees = requete.data === undefined && requete.fetchStatus === 'paused';
  return {
    chargement: requete.isPending && !horsLigneSansDonnees,
    erreur: requete.error,
    aDesDonnees: requete.data !== undefined || horsLigneSansDonnees,
    horsLigneSansDonnees,
  };
}

/** Vue d'ensemble : plusieurs requêtes indépendantes ; chaque carte gère ensuite son propre état. */
export function etatsEnsemble(requetes: Requete[]) {
  const aDesDonnees = requetes.some((r) => r.data !== undefined);
  const chargement = !aDesDonnees && requetes.some((r) => r.fetchStatus === 'fetching');
  const erreur = !aDesDonnees && !chargement && requetes.every((r) => r.isError) ? requetes[0].error : null;
  // Tout est en pause hors ligne sans cache : on affiche les cartes (avec leur état « hors ligne ») et le bandeau.
  return { chargement, erreur, aDesDonnees: aDesDonnees || (!chargement && !erreur) };
}
