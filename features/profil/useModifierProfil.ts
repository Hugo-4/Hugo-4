import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import type { Cadre, Niveau } from '@/features/inscription/constantes';
import { VERSION_DOCUMENTS } from '@/features/inscription/constantes';
import { verifier } from '@/features/inscription/enregistrementOutils';
import { supabase } from '@/lib/supabase';

import type { TypeConsentement } from './types';

function useActualiser() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['profil'] }),
      queryClient.invalidateQueries({ queryKey: ['statutCompte'] }),
      queryClient.invalidateQueries({ queryKey: ['consentement'] }),
    ]);
}

/** Identifiant de l'athlète connecté : chaque écriture filtre dessus (en plus de la RLS). */
function useUserId(): string {
  const { session } = useSession();
  return session?.user.id ?? '';
}

type Identite = { prenom: string; dateNaissance: string; pays: string };

export function useModifierIdentite() {
  const userId = useUserId();
  const actualiser = useActualiser();
  return useMutation({
    mutationFn: async ({ prenom, dateNaissance, pays }: Identite) => {
      await verifier(supabase.from('users').update({ prenom: prenom.trim() }).eq('id', userId));
      await verifier(
        supabase.from('user_profiles').update({ date_naissance: dateNaissance, pays }).eq('user_id', userId),
      );
    },
    onSuccess: actualiser,
  });
}

type Sport = { id: string; principal: boolean; niveau: Niveau; cadre: Cadre; objectifId: string | null };

export function useModifierSport() {
  const userId = useUserId();
  const actualiser = useActualiser();
  return useMutation({
    mutationFn: async ({ id, principal, niveau, cadre, objectifId }: Sport) => {
      await verifier(
        supabase
          .from('user_sport_profiles')
          .update({ niveau, cadre_pratique: cadre, ...(principal ? { objectif_id: objectifId } : {}) })
          .eq('id', id)
          .eq('user_id', userId),
      );
      if (principal) {
        await verifier(supabase.from('user_profiles').update({ niveau_general: niveau }).eq('user_id', userId));
      }
    },
    onSuccess: actualiser,
  });
}

/** Accorde ou retire un consentement : ajoute une ligne horodatée au journal (rien n'est écrasé). */
export function useChangerConsentement() {
  const userId = useUserId();
  const actualiser = useActualiser();
  return useMutation({
    mutationFn: ({ type, accorde }: { type: TypeConsentement; accorde: boolean }) =>
      verifier(
        supabase.from('consentements').insert({
          user_id: userId,
          type,
          accorde,
          version_document: VERSION_DOCUMENTS,
          source: 'parametres',
        }),
      ),
    onSuccess: actualiser,
  });
}
