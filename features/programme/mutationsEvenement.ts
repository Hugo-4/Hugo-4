import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { invaliderEvenements } from './cles';
import type { CorpsEvenement, Evenement } from './types';

export type EnregistrementEvenement = {
  /** Compétition à modifier (ou doublon même nom + même date à mettre à jour) ; absent : création. */
  id?: string;
  corps: CorpsEvenement;
  /** Catégorie de poids (sports de combat) ; `undefined` : on n'y touche pas. */
  poidsKg?: number | null;
  /** L'autre compétition A du même sport, à passer en B d'abord (l'athlète a confirmé). */
  retrograderId?: string;
};

/**
 * Création / modification par le serveur (`POST /evenements`, `PATCH /evenements/:id`). La catégorie de poids
 * n'est pas acceptée par le serveur (CHAMPS_EVT) : elle est écrite ensuite en direct dans `evenements_athlete`
 * (RLS « evenements_proprietaire »), filtrée sur l'id ET l'athlète connecté. Manque signalé (docs/manques/programme.md).
 */
export function useEnregistrerEvenement() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  return useMutation({
    mutationFn: async ({ id, corps, poidsKg, retrograderId }: EnregistrementEvenement) => {
      if (retrograderId) await api.patch(`/evenements/${retrograderId}`, { priorite: 'B' });
      const ligne = id ? await api.patch<Evenement | null>(`/evenements/${id}`, corps) : await api.post<Evenement>('/evenements', corps);
      if (!ligne) throw new Error('compétition introuvable');
      if (poidsKg !== undefined && userId) {
        const { error } = await supabase
          .from('evenements_athlete')
          .update({ categorie_poids_kg: poidsKg })
          .eq('id', ligne.id)
          .eq('user_id', userId);
        if (error) throw error;
      }
      return ligne;
    },
    // Même en cas d'échec partiel (ex. ancienne A déjà passée en B), l'affichage suit la base.
    onSettled: () => invaliderEvenements(queryClient),
  });
}

/** `DELETE /evenements/:id` : la compétition passe au statut « annule ». */
export function useSupprimerEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ id: string; statut: string } | null>(`/evenements/${id}`),
    onSettled: () => invaliderEvenements(queryClient),
  });
}
