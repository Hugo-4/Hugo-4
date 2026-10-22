import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

import { useLiensAuth } from './useLiensAuth';

type EtatAuth = {
  session: Session | null;
  /** `false` tant que la session enregistrée n'a pas été relue au démarrage. */
  pret: boolean;
  /** Vrai après un lien « mot de passe oublié » : seul l'écran « nouveau mot de passe » est accessible. */
  recuperation: boolean;
  terminerRecuperation: () => void;
  /** Erreur renvoyée par un lien (Google, Apple, réinitialisation). */
  erreurLien: string | null;
};

const AuthContext = createContext<EtatAuth>({
  session: null,
  pret: false,
  recuperation: false,
  terminerRecuperation: () => {},
  erreurLien: null,
});

/** Garde la session Supabase à jour (connexion, déconnexion, rafraîchissement du jeton, liens). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [pret, setPret] = useState(false);
  const [recuperation, setRecuperation] = useState(false);
  const [erreurLien, setErreurLien] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setPret(true);
    });
    const { data } = supabase.auth.onAuthStateChange((evenement, nouvelle) => {
      if (evenement === 'SIGNED_OUT') queryClient.clear();
      setSession(nouvelle);
      setPret(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const onRecuperation = useCallback((active: boolean) => setRecuperation(active), []);
  const onErreur = useCallback((message: string | null) => setErreurLien(message), []);
  useLiensAuth({ onRecuperation, onErreur });

  const terminerRecuperation = useCallback(() => setRecuperation(false), []);

  return (
    <AuthContext.Provider value={{ session, pret, recuperation, terminerRecuperation, erreurLien }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}
