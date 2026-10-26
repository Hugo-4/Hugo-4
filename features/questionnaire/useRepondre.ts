import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { ecrireReponse, marquerQuestion } from './ecriture';
import type { Question, ValeurReponse } from './types';
import { CLE_QUESTIONNAIRE } from './useQuestionnaire';

type Parametres = { question: Question; valeur: ValeurReponse | null };

/**
 * Enregistre une réponse dès qu'elle est validée (`valeur`), ou la question comme passée (`null`).
 * Quitter le questionnaire ne perd donc rien : tout ce qui a été validé est déjà en base.
 */
export function useRepondre(sportProfilId: string | null) {
  const queryClient = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: async ({ question, valeur }: Parametres) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Session absente');
      if (valeur !== null) await ecrireReponse(question, valeur, userId, sportProfilId);
      await marquerQuestion(userId, question.id, valeur === null ? 'passee' : 'repondue');
    },
    onSuccess: (_r, { question }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CLE_QUESTIONNAIRE }),
        // Les écrans qui affichent ces informations se rafraîchissent aussi.
        queryClient.invalidateQueries({ queryKey: ['profil'] }),
        queryClient.invalidateQueries({ queryKey: ['parametres'] }),
        question.destination.kind === 'test' ? queryClient.invalidateQueries({ queryKey: ['progres'] }) : null,
        question.destination.kind === 'poids'
          ? Promise.all([
              queryClient.invalidateQueries({ queryKey: ['corps'] }),
              queryClient.invalidateQueries({ queryKey: ['nutrition'] }),
            ])
          : null,
      ]),
  });
}
