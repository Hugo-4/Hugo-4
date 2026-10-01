import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

type EtatAuth = {
  session: Session | null;
  /** `false` tant que la session enregistrée n'a pas été relue au démarrage. */
  pret: boolean;
};

const AuthContext = createContext<EtatAuth>({ session: null, pret: false });

/** Garde la session Supabase à jour (connexion, déconnexion, rafraîchissement du jeton). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<EtatAuth>({ session: null, pret: false });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEtat({ session: data.session, pret: true });
    });

    const { data } = supabase.auth.onAuthStateChange((evenement, session) => {
      if (evenement === 'SIGNED_OUT') {
        queryClient.clear();
      }
      setEtat({ session, pret: true });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={etat}>{children}</AuthContext.Provider>;
}

export function useSession() {
  return useContext(AuthContext);
}
