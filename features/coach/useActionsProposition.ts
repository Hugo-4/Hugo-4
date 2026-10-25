import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { CLES_MODIFIEES_PAR_PROPOSITION, cleConversation, remplacerProposition } from './cles';
import { vibrerApplication } from './retours';
import { source } from './source';
import type { ConversationCoach, ReponseProposition } from './types';

type Action = 'appliquer' | 'garder' | 'annuler';

/**
 * Réponse à une proposition du coach. Le nouvel état renvoyé par le serveur remplace l'ancien dans la
 * conversation ; « Appliquer » et « Annuler » changent le programme : Aujourd'hui et Programme sont rechargés.
 */
function useActionProposition(action: Action) {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  return useMutation({
    networkMode: 'always',
    mutationFn: (propositionId: string): Promise<ReponseProposition> => source[action](propositionId),
    onSuccess: ({ proposition }) => {
      queryClient.setQueryData<ConversationCoach>(cleConversation(userId), (c) => remplacerProposition(c, proposition));
      if (action === 'appliquer') vibrerApplication();
      if (action !== 'garder') {
        CLES_MODIFIEES_PAR_PROPOSITION.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      }
    },
    // Proposition déjà traitée ailleurs, délai passé… : on relit l'état réel.
    onError: () => queryClient.invalidateQueries({ queryKey: cleConversation(userId) }),
  });
}

export const useAppliquer = () => useActionProposition('appliquer');
export const useGarder = () => useActionProposition('garder');
export const useAnnuler = () => useActionProposition('annuler');
