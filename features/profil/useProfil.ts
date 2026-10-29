import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { EtatConsentement, Identite, SportAthlete, TypeConsentement } from './types';

/** Identité de l'athlète : `users` (prénom) et `user_profiles` (naissance, pays), filtrés sur lui (RLS). */
export function useIdentite() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['profil', 'identite', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Identite> => {
      const [utilisateur, profil] = await Promise.all([
        supabase.from('users').select('prenom').eq('id', userId as string).maybeSingle(),
        supabase.from('user_profiles').select('date_naissance, pays').eq('user_id', userId as string).maybeSingle(),
      ]);
      if (utilisateur.error) throw utilisateur.error;
      if (profil.error) throw profil.error;
      return {
        prenom: utilisateur.data?.prenom ?? null,
        dateNaissance: profil.data?.date_naissance ?? null,
        pays: profil.data?.pays ?? null,
      };
    },
  });
}

/** Sports actifs de l'athlète, principal en premier. */
export function useSportsAthlete() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['profil', 'sports', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<SportAthlete[]> => {
      const { data, error } = await supabase
        .from('user_sport_profiles')
        .select(
          'id, role, niveau, cadre_pratique, ambition, objectif_sport_id, objectifs_secondaires, sports!user_sport_profiles_sport_id_fkey(id, slug, nom), objectifs_sport(libelle_fr, libelle_en)',
        )
        .eq('user_id', userId as string)
        .eq('actif', true)
        .order('priorite', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as unknown as SportAthlete[];
    },
  });
}

/** Dernier choix pour chaque consentement (le journal `consentements` garde tout l'historique). */
export function useConsentementsAthlete() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['profil', 'consentements', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Partial<Record<TypeConsentement, EtatConsentement>>> => {
      const { data, error } = await supabase
        .from('consentements')
        .select('type, accorde, created_at')
        .eq('user_id', userId as string)
        .in('type', ['cgu', 'donnees_sante'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      const etats: Partial<Record<TypeConsentement, EtatConsentement>> = {};
      for (const ligne of data) {
        const type = ligne.type as TypeConsentement;
        if (!etats[type]) etats[type] = { accorde: ligne.accorde, le: ligne.created_at };
      }
      return etats;
    },
  });
}
