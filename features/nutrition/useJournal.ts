import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { CleMicro, EntreeJournal, NouvelleEntree, ObjectifsNutritionnels, TotauxJour } from './types';

export const CLE_NUTRITION = ['nutrition'] as const;
/** Journal et totaux d'un jour : relus ensemble après chaque ajout ou retrait. */
const CLE_JOURNAL = [...CLE_NUTRITION, 'journal'] as const;

const COLONNES =
  'id, date_entree, moment_journee, aliment_id, nom_libre, quantite_g, calories, proteines, glucides, lipides, fibres, sucres, ' +
  'sodium_mg, micros, aliments(nom)';

const n = (v: unknown) => Number(v ?? 0) || 0;

/** PostgREST renvoie les `numeric` en texte ; le sodium (colonne à part) rejoint les micronutriments affichés. */
function lireEntree(e: Record<string, unknown>): EntreeJournal {
  const micros = { ...((e.micros as Record<string, unknown> | null) ?? {}) } as Partial<Record<CleMicro, number>>;
  Object.keys(micros).forEach((cle) => {
    micros[cle as CleMicro] = n(micros[cle as CleMicro]);
  });
  if (n(e.sodium_mg) > 0) micros.sodium_mg = n(e.sodium_mg);
  const aliment = e.aliments as { nom: string } | null;
  return {
    id: e.id as string,
    date_entree: e.date_entree as string,
    moment_journee: e.moment_journee as EntreeJournal['moment_journee'],
    aliment_id: (e.aliment_id as string | null) ?? null,
    nom: aliment?.nom ?? (e.nom_libre as string | null) ?? '',
    quantite_g: n(e.quantite_g),
    calories: n(e.calories),
    proteines: n(e.proteines),
    glucides: n(e.glucides),
    lipides: n(e.lipides),
    fibres: n(e.fibres),
    sucres: n(e.sucres),
    micros,
  };
}

/** Ce que l'athlète a noté pour un jour (`journal_entrees`, RLS : uniquement ses lignes), dans l'ordre de saisie. */
export function useJournal(date: string) {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: [...CLE_JOURNAL, 'entrees', userId, date],
    enabled: Boolean(userId),
    queryFn: async (): Promise<EntreeJournal[]> => {
      const { data, error } = await supabase
        .from('journal_entrees')
        .select(COLONNES)
        .eq('user_id', userId as string)
        .eq('date_entree', date)
        .order('heure', { ascending: true, nullsFirst: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return ((data ?? []) as unknown as Record<string, unknown>[]).map(lireEntree);
    },
  });
}

/** Totaux du jour (`journal_nutrition`), recalculés par la base à chaque entrée ; `null` si rien n'est noté. */
export function useTotauxJour(date: string) {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: [...CLE_JOURNAL, 'totaux', userId, date],
    enabled: Boolean(userId),
    queryFn: async (): Promise<TotauxJour | null> => {
      const { data, error } = await supabase
        .from('journal_nutrition')
        .select('calories_total, proteines_total, glucides_total, lipides_total, fibres_total, sucres_total, sodium_total_mg')
        .eq('user_id', userId as string)
        .eq('date_journal', date)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const t = data as Record<string, unknown>;
      return {
        calories: n(t.calories_total),
        proteines: n(t.proteines_total),
        glucides: n(t.glucides_total),
        lipides: n(t.lipides_total),
        fibres: n(t.fibres_total),
        sucres: n(t.sucres_total),
        sodium_mg: n(t.sodium_total_mg),
      };
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
      const ou = (v: unknown) => (v === null || v === undefined ? null : Number(v));
      return {
        calories_cibles: ou(o.calories_cibles),
        proteines_g: ou(o.proteines_g),
        glucides_g: ou(o.glucides_g),
        lipides_g: ou(o.lipides_g),
        fibres_g: ou(o.fibres_g),
        hydratation_ml_cible: ou(o.hydratation_ml_cible),
        micronutriments_surveilles: (o.micronutriments_surveilles as string[] | null) ?? null,
      };
    },
  });
}

/**
 * Ajouter ou retirer une entrée du journal. La base rattache l'entrée au journal du jour, calcule ses valeurs
 * (aliment de la base) et met à jour les totaux ; l'app relit ensuite le journal et les totaux.
 */
export function useActionsRepas() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const apres = () => queryClient.invalidateQueries({ queryKey: CLE_JOURNAL });

  const ajouter = useMutation({
    mutationFn: async (entree: NouvelleEntree) => {
      if (!userId) throw new Error('Session absente');
      const { error } = await supabase.from('journal_entrees').insert({ ...entree, user_id: userId });
      if (error) throw error;
    },
    onSuccess: apres,
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('Session absente');
      const { error } = await supabase.from('journal_entrees').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: apres,
  });

  return { ajouter, supprimer };
}
