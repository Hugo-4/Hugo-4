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

  return {
    accueil: donnees,
    checkin: checkin.data ?? null,
    chargement: accueil.isPending || checkin.isPending,
    erreur: accueil.isError || checkin.isError,
    detailErreur: accueil.error ?? checkin.error,
    vide,
    rafraichir,
    rafraichissement: accueil.isRefetching,
  };
}
