import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import type { Aliment } from './types';

/** Caractères qui ont un sens dans un filtre PostgREST : retirés de la recherche. */
const nettoyer = (texte: string) => texte.replace(/[%,()*\\]/g, ' ').trim();

/**
 * Base d'aliments (lecture publique) : recherche par nom, ou les premiers par ordre alphabétique sans texte.
 * Toutes les colonnes sont lues (`*`) : les noms des micronutriments contiennent « µ », délicat dans un `select`.
 */
export function useRechercheAliments(texte: string) {
  const recherche = nettoyer(texte);
  return useQuery({
    queryKey: ['nutrition', 'aliments', recherche.toLowerCase()],
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<Aliment[]> => {
      let requete = supabase.from('aliments').select('*').order('nom', { ascending: true }).limit(recherche ? 25 : 40);
      if (recherche) requete = requete.ilike('nom', `%${recherche}%`);
      const { data, error } = await requete;
      if (error) throw error;
      return (data ?? []) as unknown as Aliment[];
    },
  });
}
