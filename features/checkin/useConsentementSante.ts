import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

/** Consentement « données de santé » (fonction `a_consentement` de la base). */
export function useConsentementSante() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['consentement', 'donnees_sante', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase.rpc('a_consentement', { p_user: userId, p_type: 'donnees_sante' });
      if (error) throw error;
      return data === true;
    },
  });
}
