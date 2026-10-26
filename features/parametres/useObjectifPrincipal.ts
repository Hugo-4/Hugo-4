import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import type { Precision } from '@/features/inscription/constantes';
import { verifier } from '@/features/inscription/enregistrementOutils';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { CLES } from './constantes';
import type { Echeance, Evenement } from './types';
import { trierEvenements } from './useEvenements';

export type ObjectifPrincipal = {
  /** `user_sport_profiles.id` du sport principal. */
  id: string;
  echeance: Echeance | null;
  sports: { id: string; slug: string; nom: string } | null;
  objectifs_sport: {
    libelle_fr: string;
    libelle_en: string;
    echeance_requise: boolean;
    precision_demandee: Precision | null;
  } | null;
};

/** Sport principal de l'athlète, son objectif précis et son échéance (Supabase, filtré sur lui). */
export function useObjectifPrincipal() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['profil', 'objectifPrincipal', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ObjectifPrincipal | null> => {
      const { data, error } = await supabase
        .from('user_sport_profiles')
        .select('id, echeance, sports!user_sport_profiles_sport_id_fkey(id, slug, nom), objectifs_sport(libelle_fr, libelle_en, echeance_requise, precision_demandee)')
        .eq('user_id', userId as string)
        .eq('role', 'principal')
        .eq('actif', true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ObjectifPrincipal | null;
    },
  });
}

type ModificationEcheance = { objectif: ObjectifPrincipal; echeance: Echeance; evenements: Evenement[] };

/**
 * Modifie l'échéance du sport principal (`user_sport_profiles.echeance`, même logique que l'inscription) :
 * la compétition A prévue de ce sport suit la nouvelle date (PATCH /evenements/:id), ou elle est créée
 * (POST /evenements) s'il n'y en a pas, comme à l'inscription.
 */
export function useModifierEcheance() {
  const { session } = useSession();
  const userId = session?.user.id ?? '';
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ objectif, echeance, evenements }: ModificationEcheance) => {
      const valeurs = { ...(objectif.echeance ?? {}), ...echeance };
      await verifier(
        supabase.from('user_sport_profiles').update({ echeance: valeurs }).eq('id', objectif.id).eq('user_id', userId),
      );
      if (!echeance.date || !echeance.epreuve) return;
      const slug = objectif.sports?.slug;
      const competitionA = trierEvenements(evenements).aVenir.find(
        (e) => e.priorite === 'A' && e.statut === 'prevu' && (!slug || e.sports?.slug === slug),
      );
      const evenement = { nom: echeance.epreuve, date_evenement: echeance.date };
      if (competitionA) await api.patch(`/evenements/${competitionA.id}`, evenement);
      else await api.post('/evenements', { ...evenement, priorite: 'A', type_evenement: 'competition', sport_slug: slug });
    },
    onSuccess: () =>
      Promise.all(
        [['profil'], CLES.evenements, ['accueil'], ['programme'], ['calendrier']].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  });
}
