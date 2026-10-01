import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import { CompteExistantError } from './erreurs';

type Identifiants = { email: string; motDePasse: string };

export function useConnexion() {
  return useMutation({
    mutationFn: async ({ email, motDePasse }: Identifiants) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: motDePasse });
      if (error) throw error;
    },
  });
}

/** Résultat : `true` si le compte est actif tout de suite, `false` si l'email doit d'abord être confirmé. */
export function useCreationCompte() {
  return useMutation({
    mutationFn: async ({ email, motDePasse }: Identifiants): Promise<boolean> => {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: motDePasse });
      if (error) throw error;
      // Quand la confirmation par email est activée, Supabase ne signale pas un email déjà utilisé :
      // il renvoie un utilisateur sans identité.
      if (data.user && data.user.identities?.length === 0) throw new CompteExistantError();
      return data.session !== null;
    },
  });
}

export function useDeconnexion() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
    },
  });
}
