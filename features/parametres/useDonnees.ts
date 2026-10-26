import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useDeconnexion } from '@/features/auth/useAuthActions';
import { viderStockageLocal } from '@/features/seance/viderStockageLocal';
import { ApiError } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { CLES } from './constantes';
import { demanderExport, lireExport, PARAMETRES_FICTIF, supprimerCompte } from './source';

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

/** Le serveur a supprimé le compte, mais la session n'a pas pu être fermée sur le téléphone. */
export class CompteSupprimeError extends Error {}

/**
 * Issue d'un échec de suppression, pour ne jamais dire « Ton compte est intact » à tort :
 * - `supprime` : le compte est supprimé, seule la déconnexion a échoué ;
 * - `refusee` : le serveur a refusé (erreur 4xx), rien n'a été supprimé ;
 * - `incertaine` : pas de réponse ou erreur 5xx (réseau, délai, proxy), le serveur a peut-être supprimé le compte.
 */
export function issueEchecSuppression(erreur: unknown): 'supprime' | 'refusee' | 'incertaine' {
  if (erreur instanceof CompteSupprimeError) return 'supprime';
  if (erreur instanceof ApiError && erreur.status >= 400 && erreur.status < 500) return 'refusee';
  return 'incertaine';
}

/** Ferme la session sur le téléphone, sans appel réseau (le compte n'existe plus côté serveur). */
async function forcerDeconnexionLocale(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw new CompteSupprimeError(error.message);
}

/**
 * Suppression définitive du compte (RGPD), puis :
 * 1) effacement de ce que l'app garde sur le téléphone (file d'envoi, séance en cours, marqueurs de langue,
 *    notification de repos). En démonstration (`PARAMETRES_FICTIF`), le compte n'est pas supprimé : on ne
 *    touche pas au stockage local, pour ne pas perdre des séries pas encore envoyées d'un compte qui existe ;
 * 2) déconnexion : la session locale est fermée et le cache vidé (AuthProvider), la navigation renvoie
 *    vers la connexion. Si elle échoue, elle est forcée en local ; si cela échoue encore : `CompteSupprimeError`.
 */
export function useSupprimerCompte() {
  const deconnexion = useDeconnexion();
  return useMutation({
    mutationFn: async () => {
      await supprimerCompte();
      // Le compte n'existe plus : un échec d'effacement local ne doit pas empêcher la déconnexion.
      if (!PARAMETRES_FICTIF) await viderStockageLocal().catch(() => undefined);
      try {
        await deconnexion.mutateAsync();
      } catch {
        await forcerDeconnexionLocale();
      }
    },
  });
}

/** Nouvel essai de déconnexion locale après une suppression réussie (`CompteSupprimeError`). */
export function useTerminerDeconnexion() {
  return useMutation({ mutationFn: forcerDeconnexionLocale });
}
