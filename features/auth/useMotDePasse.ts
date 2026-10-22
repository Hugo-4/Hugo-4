import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';

import { useSession } from './AuthProvider';

/** Envoie l'email « mot de passe oublié » ; le lien reçu rouvre l'app sur « nouveau mot de passe ». */
export function useMotDePasseOublie() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: Linking.createURL('nouveau-mot-de-passe'),
      });
      if (error) throw error;
    },
  });
}

/** Enregistre le nouveau mot de passe (session ouverte par le lien de réinitialisation). */
export function useNouveauMotDePasse() {
  const { terminerRecuperation } = useSession();
  return useMutation({
    mutationFn: async (motDePasse: string) => {
      const { error } = await supabase.auth.updateUser({ password: motDePasse });
      if (error) throw error;
    },
    onSuccess: terminerRecuperation,
  });
}
