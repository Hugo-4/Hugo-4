import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import type { StatutCompte } from '@/features/auth/useStatutCompte';
import { verifier } from '@/features/inscription/enregistrementOutils';
import { marquerLangueReglee } from '@/features/langue/useLangueProfil';
import i18n, { type Langue } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

/**
 * Langue de l'app = réglage du profil (`users.langue`, FRONTEND.md §1) : on l'enregistre d'abord,
 * puis l'app change de langue et recharge tout ce qui vient du serveur (textes rédigés dans la langue,
 * `Accept-Language` de lib/api.ts). `useLangueProfil` (navigation racine) retrouve la même valeur.
 * Le marqueur local est posé : ce choix ne sera jamais remplacé par la langue du téléphone.
 */
export function useChangerLangue() {
  const { session } = useSession();
  const userId = session?.user.id ?? '';
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (langue: Langue) => {
      await verifier(supabase.from('users').update({ langue }).eq('id', userId));
      await marquerLangueReglee(userId);
      await i18n.changeLanguage(langue);
      queryClient.setQueryData<StatutCompte>(['statutCompte', userId], (statut) => (statut ? { ...statut, langue } : statut));
      // Rechargement en arrière-plan : l'écran change de langue sans attendre le serveur.
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'statutCompte' });
    },
  });
}
