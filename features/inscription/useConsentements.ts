import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import { VERSION_DOCUMENTS } from './constantes';

type Choix = { userId: string; donneesSante: boolean };

/** Enregistre les consentements de l'inscription (journal : chaque choix ajoute une ligne). */
export function useConsentements() {
  return useMutation({
    mutationFn: async ({ userId, donneesSante }: Choix) => {
      const ligne = { user_id: userId, version_document: VERSION_DOCUMENTS, source: 'onboarding' };
      const { error } = await supabase.from('consentements').insert([
        { ...ligne, type: 'cgu', accorde: true },
        { ...ligne, type: 'donnees_sante', accorde: donneesSante },
      ]);
      if (error) throw error;
    },
  });
}
