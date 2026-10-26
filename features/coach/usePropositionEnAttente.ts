import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { cleConversation } from './cles';
import { source } from './source';
import type { ConversationCoach } from './types';

const attendReponse = (conversation: ConversationCoach) =>
  conversation.messages.some((m) => m.role === 'coach' && m.proposition?.statut === 'proposee');

/**
 * Vrai si une proposition du coach attend une réponse dans la conversation EN CACHE (pastille orange de
 * l'onglet Coach, FRONTEND.md §3.1). Ne déclenche aucun chargement : lit ce que l'écran Coach a déjà reçu.
 */
export function usePropositionEnAttente(): boolean {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data } = useQuery({
    queryKey: cleConversation(userId),
    queryFn: () => source.lireConversation(userId as string),
    enabled: false,
    select: attendReponse,
  });
  return data === true;
}
