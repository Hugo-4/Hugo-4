import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { StatutCompte } from '@/features/auth/useStatutCompte';
import i18n, { estLangue, langueDuTelephone } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

const cleInitialisee = (userId: string) => `athlenis.langueInitialisee.${userId}`;

/**
 * La langue de l'app est un réglage du profil (`users.langue`, FRONTEND.md §1).
 * Au premier lancement sur ce téléphone, elle prend la langue du téléphone ; ensuite, la valeur du
 * profil fait foi (le réglage arrivera dans Profil, étape 9). `lib/api.ts` envoie `Accept-Language`.
 */
export function useLangueProfil(userId: string | undefined, statut: StatutCompte | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !statut) return;
    let actif = true;
    (async () => {
      const dejaFait = await AsyncStorage.getItem(cleInitialisee(userId)).catch(() => null);
      if (!dejaFait) {
        const langue = langueDuTelephone();
        const { error } = await supabase.from('users').update({ langue }).eq('id', userId);
        if (error) return;
        await AsyncStorage.setItem(cleInitialisee(userId), '1').catch(() => undefined);
        if (actif) queryClient.invalidateQueries({ queryKey: ['statutCompte', userId] });
        return;
      }
      if (actif && estLangue(statut.langue) && i18n.language !== statut.langue) {
        await i18n.changeLanguage(statut.langue);
        // Les textes du serveur suivent la langue : on recharge ce qui vient de lui.
        queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'statutCompte' });
      }
    })();
    return () => {
      actif = false;
    };
  }, [userId, statut, queryClient]);
}
