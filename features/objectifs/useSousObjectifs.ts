import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import type { SaisieEtape, SousObjectif, StatutEtape } from './types';

export const CLE_OBJECTIFS = ['objectifs'] as const;
const cleEtapes = (userId: string | undefined) => [...CLE_OBJECTIFS, 'etapes', userId] as const;

const COLONNES =
  'id, sport_id, evenement_id, titre, type, indicateur, exercice_slug, valeur_depart, valeur_cible, unite, ' +
  'progression_hebdo_pct, date_debut, date_cible, statut, origine, raison, notes';

/** Étapes de l'athlète (RLS : uniquement les siennes), par date. Les abandonnées ne sont pas relues. */
export function useSousObjectifs() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: cleEtapes(userId),
    enabled: Boolean(userId),
    queryFn: async (): Promise<SousObjectif[]> => {
      const { data, error } = await supabase
        .from('sous_objectifs')
        .select(COLONNES)
        .eq('user_id', userId as string)
        .neq('statut', 'abandonne')
        .order('date_cible', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as SousObjectif[];
    },
  });
}

/** Créer, modifier, changer le statut ou supprimer une étape ; Programme et le coach relisent ensuite. */
export function useActionsEtape() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const apres = () => queryClient.invalidateQueries({ queryKey: CLE_OBJECTIFS });
  const verifier = (r: { error: unknown }) => {
    if (r.error) throw r.error;
  };

  const enregistrer = useMutation({
    mutationFn: async ({ id, saisie }: { id: string | null; saisie: SaisieEtape }) => {
      if (!userId) throw new Error('Session absente');
      const ligne = { ...saisie, updated_at: new Date().toISOString() };
      verifier(
        id
          ? await supabase.from('sous_objectifs').update(ligne).eq('id', id).eq('user_id', userId)
          : await supabase.from('sous_objectifs').insert({ ...ligne, user_id: userId, origine: 'athlete', statut: 'actif' }),
      );
    },
    onSuccess: apres,
  });

  const changerStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: StatutEtape }) => {
      if (!userId) throw new Error('Session absente');
      verifier(await supabase.from('sous_objectifs').update({ statut, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', userId));
    },
    onSuccess: apres,
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('Session absente');
      verifier(await supabase.from('sous_objectifs').delete().eq('id', id).eq('user_id', userId));
    },
    onSuccess: apres,
  });

  return { enregistrer, changerStatut, supprimer };
}
