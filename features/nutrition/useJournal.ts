import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { LigneRepas, NouvelleLigne, ObjectifsNutritionnels } from './types';

export const CLE_NUTRITION = ['nutrition'] as const;

const COLONNES =
  'id, date_repas, moment, heure, aliment_id, nom, quantite_g, calories, proteines_g, glucides_g, lipides_g, fibres_g, sucres_g, micros, source';
const NUMERIQUES = ['quantite_g', 'calories', 'proteines_g', 'glucides_g', 'lipides_g', 'fibres_g', 'sucres_g'] as const;

/** PostgREST renvoie les `numeric` en texte : on les relit en nombres. */
function lireLigne(brute: Record<string, unknown>): LigneRepas {
  const ligne = { ...brute } as Record<string, unknown>;
  NUMERIQUES.forEach((cle) => {
    ligne[cle] = Number(brute[cle] ?? 0) || 0;
  });
  ligne.micros = brute.micros ?? {};
  return ligne as LigneRepas;
}

/** Ce que l'athlète a noté pour un jour (RLS : uniquement ses lignes), dans l'ordre de saisie. */
export function useJournal(date: string) {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: [...CLE_NUTRITION, 'journal', userId, date],
    enabled: Boolean(userId),
    queryFn: async (): Promise<LigneRepas[]> => {
      const { data, error } = await supabase
        .from('repas_journal')
        .select(COLONNES)
        .eq('user_id', userId as string)
        .eq('date_repas', date)
        .order('heure', { ascending: true });
      if (error) throw error;
      return ((data ?? []) as Record<string, unknown>[]).map(lireLigne);
    },
  });
}

/** Objectifs nutritionnels actifs, rédigés par le serveur (`null` s'il n'en a pas encore écrit). */
export function useObjectifsNutritionnels() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: [...CLE_NUTRITION, 'objectifs', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ObjectifsNutritionnels | null> => {
      const { data, error } = await supabase
        .from('objectifs_nutritionnels')
        .select('calories_cibles, proteines_g, glucides_g, lipides_g, fibres_g, hydratation_ml_cible, micronutriments_surveilles')
        .eq('user_id', userId as string)
        .eq('actif', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const o = data as Record<string, unknown>;
      const n = (v: unknown) => (v === null || v === undefined ? null : Number(v));
      return {
        calories_cibles: n(o.calories_cibles),
        proteines_g: n(o.proteines_g),
        glucides_g: n(o.glucides_g),
        lipides_g: n(o.lipides_g),
        fibres_g: n(o.fibres_g),
        hydratation_ml_cible: n(o.hydratation_ml_cible),
        micronutriments_surveilles: (o.micronutriments_surveilles as string[] | null) ?? null,
      };
    },
  });
}

/** Ajouter ou retirer un aliment du journal ; les écrans nutrition relisent ensuite. */
export function useActionsRepas() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const apres = () => queryClient.invalidateQueries({ queryKey: [...CLE_NUTRITION, 'journal'] });

  const ajouter = useMutation({
    mutationFn: async (ligne: NouvelleLigne) => {
      if (!userId) throw new Error('Session absente');
      const { error } = await supabase.from('repas_journal').insert({ ...ligne, user_id: userId });
      if (error) throw error;
    },
    onSuccess: apres,
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('Session absente');
      const { error } = await supabase.from('repas_journal').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: apres,
  });

  return { ajouter, supprimer };
}
