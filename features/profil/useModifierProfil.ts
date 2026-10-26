import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import type { Ambition, Cadre, Niveau } from '@/features/inscription/constantes';
import { VERSION_DOCUMENTS } from '@/features/inscription/constantes';
import { objectifEntrainementId, verifier } from '@/features/inscription/enregistrementOutils';
import type { ObjectifSport } from '@/features/inscription/useReferentiels';
import { CLES } from '@/features/parametres/constantes';
import { supabase } from '@/lib/supabase';

import { appliquerRetraitSante, restaurerAvantRetrait, supprimerDonneesSante } from './retraitSante';
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

export type ModificationSport =
  | { id: string; principal: true; niveau: Niveau; ambition: Ambition; objectif: ObjectifSport; secondaires: string[] }
  | { id: string; principal: false; niveau: Niveau; cadre: Cadre };

/**
 * Sport principal : niveau, ambition (la base en déduit le cadre), objectif précis, objectifs secondaires.
 * Autre sport : niveau et cadre de pratique.
 */
export function useModifierSport() {
  const userId = useUserId();
  const actualiser = useActualiser();
  return useMutation({
    mutationFn: async (m: ModificationSport) => {
      const valeurs = m.principal
        ? {
            niveau: m.niveau,
            ambition: m.ambition,
            objectif_sport_id: m.objectif.id,
            objectif_id: await objectifEntrainementId(m.objectif.qualitePrincipale),
            objectifs_secondaires: m.secondaires,
          }
        : { niveau: m.niveau, cadre_pratique: m.cadre };
      await verifier(supabase.from('user_sport_profiles').update(valeurs).eq('id', m.id).eq('user_id', userId));
      if (m.principal) {
        await verifier(supabase.from('user_profiles').update({ niveau_general: m.niveau }).eq('user_id', userId));
      }
    },
    onSuccess: actualiser,
  });
}

/**
 * Accorde ou retire un consentement : ajoute une ligne horodatée au journal (rien n'est écrasé).
 * Retrait du consentement santé : appliqué avant même la réponse (consentement à faux, données de santé
 * effacées du cache, souvenirs de santé retirés), avec retour en arrière si l'enregistrement échoue.
 * Accord : appliqué quand la base l'a enregistré.
 */
export function useChangerConsentement() {
  const userId = useUserId();
  const actualiser = useActualiser();
  const queryClient = useQueryClient();
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
    onMutate: ({ type, accorde }) =>
      type === 'donnees_sante' && !accorde ? appliquerRetraitSante(queryClient, userId) : undefined,
    onError: (_erreur, _variables, avant) => {
      if (avant) restaurerAvantRetrait(queryClient, avant);
    },
    onSuccess: (_resultat, { type, accorde }) => {
      if (type === 'donnees_sante') {
        queryClient.setQueryData(['consentement', 'donnees_sante', userId], accorde);
        if (!accorde) supprimerDonneesSante(queryClient);
        queryClient.invalidateQueries({ queryKey: CLES.memoire });
        queryClient.invalidateQueries({ queryKey: CLES.nutrition });
      }
      return actualiser();
    },
  });
}
