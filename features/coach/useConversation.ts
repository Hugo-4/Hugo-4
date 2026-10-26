import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { cleConversation } from './cles';
import { source } from './source';

/** Conversation courante avec le coach (historique en cache : reste affiché hors ligne). */
export function useConversation() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: cleConversation(userId),
    enabled: Boolean(userId),
    queryFn: () => source.lireConversation(userId as string),
  });
}
