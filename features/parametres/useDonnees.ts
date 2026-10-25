import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useDeconnexion } from '@/features/auth/useAuthActions';

import { CLES } from './constantes';
import { demanderExport, lireExport, supprimerCompte } from './source';

/** Dernière demande d'export ; relue toutes les 30 s tant qu'elle est en préparation. */
export function useExport() {
  return useQuery({
    queryKey: CLES.export,
    queryFn: lireExport,
    refetchInterval: (requete) => (requete.state.data?.statut === 'en_preparation' ? 30_000 : false),
  });
}

export function useDemanderExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: demanderExport,
    onSuccess: (demande) => {
      queryClient.setQueryData(CLES.export, demande);
      return queryClient.invalidateQueries({ queryKey: CLES.export });
    },
  });
}

/**
 * Suppression définitive du compte (RGPD), puis déconnexion : la session locale est fermée et le
 * cache vidé (AuthProvider), la navigation renvoie vers la connexion.
 */
export function useSupprimerCompte() {
  const deconnexion = useDeconnexion();
  return useMutation({
    mutationFn: async () => {
      await supprimerCompte();
      await deconnexion.mutateAsync();
    },
  });
}
