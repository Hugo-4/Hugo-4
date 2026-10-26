import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { cleConversation } from './cles';
import { source } from './source';
import type { Avis, ConversationCoach } from './types';

type Vote = { messageId: string; avis: Avis };

const avecAvis = (conversation: ConversationCoach | undefined, { messageId, avis }: Vote) =>
  conversation && {
    ...conversation,
    messages: conversation.messages.map((m) => (m.id === messageId ? { ...m, avis } : m)),
  };

/** 👍 / 👎 sous une réponse du coach (`messages_coach.avis`) : affiché tout de suite, remis en cas d'échec. */
export function useAvis() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const cle = cleConversation(userId);
  return useMutation({
    networkMode: 'always',
    mutationFn: ({ messageId, avis }: Vote) => source.donnerAvis(userId as string, messageId, avis),
    onMutate: async (vote) => {
      await queryClient.cancelQueries({ queryKey: cle });
      const avant = queryClient.getQueryData<ConversationCoach>(cle);
      queryClient.setQueryData<ConversationCoach>(cle, (c) => avecAvis(c, vote));
      return { avant };
    },
    onError: (_erreur, _vote, memo) => {
      if (memo?.avant) queryClient.setQueryData(cle, memo.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cle }),
  });
}
