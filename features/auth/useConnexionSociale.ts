import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';

export type Fournisseur = 'google' | 'apple';

/**
 * Connexion Google / Apple par Supabase OAuth : la page du fournisseur s'ouvre dans le navigateur,
 * puis renvoie vers l'app (`/auth-callback`) avec la session, ouverte par useLiensAuth.
 * Le fournisseur doit être activé dans Supabase (Authentication → Providers).
 */
export function useConnexionSociale() {
  return useMutation({
    mutationFn: async (fournisseur: Fournisseur) => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: fournisseur,
        options: { redirectTo: Linking.createURL('auth-callback'), skipBrowserRedirect: true },
      });
      if (error) throw error;
      await Linking.openURL(data.url);
    },
  });
}
