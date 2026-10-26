import { useQueryClient } from '@tanstack/react-query';

import { useCheckinDuJour } from '@/features/checkin/useCheckinDuJour';

import { useAccueil } from './useAccueil';

/** Données de l'écran Aujourd'hui : accueil du serveur + check-in du jour, et leurs états. */
export function useAujourdhui() {
  const queryClient = useQueryClient();
  const accueil = useAccueil();
  const checkin = useCheckinDuJour();
  const donnees = accueil.data;

  // Aucun programme : pas de séance cette semaine ni demain, pas de bloc en cours.
  const vide =
    !!donnees &&
    !donnees.bloc &&
    donnees.semaine.jours.every((j) => j.seances.length === 0) &&
    donnees.demain.seances.length === 0;

  const rafraichir = async () => {
    await Promise.all([
      accueil.refetch(),
      checkin.refetch(),
      queryClient.invalidateQueries({ queryKey: ['nutrition'] }),
    ]);
  };

  // Hors ligne, une requête sans cache reste en pause (`isPending`) : on ne montre le squelette que pendant un vrai chargement.
  const horsLigneSansDonnees = !donnees && accueil.fetchStatus === 'paused';

  return {
    accueil: donnees,
    checkin: checkin.data ?? null,
    chargement: (accueil.isPending && !horsLigneSansDonnees) || (checkin.isPending && checkin.fetchStatus === 'fetching'),
    horsLigneSansDonnees,
    // L'écran d'erreur ne remplace l'écran que si l'accueil n'a jamais été reçu (sinon on garde les dernières données).
    erreur: !donnees && accueil.isError,
    detailErreur: accueil.error,
    vide,
    rafraichir,
    rafraichissement: accueil.isRefetching,
  };
}
