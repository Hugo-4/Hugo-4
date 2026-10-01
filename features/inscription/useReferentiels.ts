import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import { SLUG_SPORT_EXCLU } from './constantes';

export type Referentiel = { id: string; slug: string; nom: string };

/** Sports proposés (table `sports`, actifs, sans « général »). */
export function useSports() {
  return useQuery({
    queryKey: ['referentiels', 'sports'],
    staleTime: Infinity,
    queryFn: async (): Promise<Referentiel[]> => {
      const { data, error } = await supabase
        .from('sports')
        .select('id, slug, nom')
        .eq('actif', true)
        .neq('slug', SLUG_SPORT_EXCLU)
        .order('nom');
      if (error) throw error;
      return data;
    },
  });
}

/** Objectifs d'entraînement (table `objectifs_entrainement`). */
export function useObjectifs() {
  return useQuery({
    queryKey: ['referentiels', 'objectifs'],
    staleTime: Infinity,
    queryFn: async (): Promise<Referentiel[]> => {
      const { data, error } = await supabase
        .from('objectifs_entrainement')
        .select('id, slug, nom')
        .order('ordre');
      if (error) throw error;
      return data;
    },
  });
}
