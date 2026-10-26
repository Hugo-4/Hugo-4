import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import type { Aliment } from './types';

/** Caractères qui ont un sens dans un filtre PostgREST : retirés de la recherche. */
const nettoyer = (texte: string) => texte.replace(/[%,()*\\]/g, ' ').trim();

/** Au plus quelques remplacements successifs (un aliment remplacé par un autre lui-même remplacé). */
const REMPLACEMENTS_MAX = 3;

/**
 * Un aliment qui a `remplace_par` cède la place à son remplaçant (actif lui aussi) ; les doublons sont retirés et
 * l'ordre de la recherche est gardé.
 */
async function remplacer(aliments: Aliment[]): Promise<Aliment[]> {
  let liste = aliments;
  for (let tour = 0; tour < REMPLACEMENTS_MAX; tour += 1) {
    const ids = [...new Set(liste.map((a) => a.remplace_par).filter((id): id is string => Boolean(id)))];
    if (!ids.length) break;
    const { data, error } = await supabase.from('aliments').select('*').in('id', ids).eq('actif', true);
    if (error) throw error;
    const parId = new Map(((data ?? []) as unknown as Aliment[]).map((a) => [a.id, a]));
    // Remplaçant introuvable ou inactif : l'aliment remplacé n'est pas proposé.
    liste = liste.flatMap((a) => (a.remplace_par ? (parId.has(a.remplace_par) ? [parId.get(a.remplace_par) as Aliment] : []) : [a]));
  }
  const vus = new Set<string>();
  return liste.filter((a) => !a.remplace_par && !vus.has(a.id) && Boolean(vus.add(a.id)));
}

/**
 * Base d'aliments (lecture publique), aliments actifs seulement : recherche par nom, ou les premiers par ordre
 * alphabétique sans texte. Toutes les colonnes sont lues (`*`) : certains noms de colonnes contiennent « µ ».
 */
export function useRechercheAliments(texte: string) {
  const recherche = nettoyer(texte);
  return useQuery({
    queryKey: ['nutrition', 'aliments', recherche.toLowerCase()],
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<Aliment[]> => {
      let requete = supabase.from('aliments').select('*').eq('actif', true).order('nom', { ascending: true }).limit(recherche ? 25 : 40);
      if (recherche) requete = requete.ilike('nom', `%${recherche}%`);
      const { data, error } = await requete;
      if (error) throw error;
      return remplacer((data ?? []) as unknown as Aliment[]);
    },
  });
}
