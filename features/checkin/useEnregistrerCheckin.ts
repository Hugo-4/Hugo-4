import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CLE_ACCUEIL } from '@/features/accueil/useAccueil';
import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import { effacerBrouillon } from './brouillonCheckin';
import { SEUIL_ENERGIE_BASSE } from './constantes';
import { dateDuJour } from './dateDuJour';
import type { SaisieCheckin } from './types';

type Parametres = { saisie: SaisieCheckin; consentementSante: boolean };

/**
 * Enregistre le check-in du jour dans `checkins_forme` (une ligne par jour : refaire le check-in la remplace).
 * La base calcule le score de forme et la recommandation. Les douleurs (données de santé)
 * ne sont envoyées qu'avec le consentement « données de santé ».
 */
export function useEnregistrerCheckin() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: async ({ saisie, consentementSante }: Parametres) => {
      if (!session) throw new Error('Session absente');
      const { notes } = saisie;
      const energieBasse = notes.energie !== null && notes.energie <= SEUIL_ENERGIE_BASSE;
      const { error } = await supabase.from('checkins_forme').upsert(
        {
          user_id: session.user.id,
          date_checkin: dateDuJour(),
          energie: notes.energie,
          sommeil_ressenti: notes.sommeil,
          courbatures: notes.courbatures,
          motivation: notes.motivation,
          stress_ressenti: notes.stress,
          douleurs: consentementSante ? saisie.douleurs : [],
          cause_ponctuelle: energieBasse ? saisie.causePonctuelle : null,
          duree_disponible_min: saisie.dureeMin,
          lieu_id: saisie.lieuId,
        },
        { onConflict: 'user_id,date_checkin' },
      );
      if (error) throw error;
    },
    onSuccess: () =>
      Promise.all([
        effacerBrouillon(),
        queryClient.invalidateQueries({ queryKey: ['checkin'] }),
        queryClient.invalidateQueries({ queryKey: CLE_ACCUEIL }),
        queryClient.invalidateQueries({ queryKey: ['nutrition'] }),
      ]),
  });
}
