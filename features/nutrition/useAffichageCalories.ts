import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { ageDepuis } from '@/features/questionnaire/donnees';
import { supabase } from '@/lib/supabase';

const CLE = ['nutrition', 'affichageCalories'] as const;

type Lecture = { mineur: boolean; choix: boolean | null; preferences: Record<string, unknown> };

/**
 * Afficher les calories ? Choix de l'athlète (`user_profiles.preferences_entrainement.afficher_calories`), sinon
 * par défaut : non avant 18 ans (ou âge inconnu), oui à partir de 18 ans. Avant la lecture, rien n'est affiché.
 * Sans calories, l'app montre les macronutriments en grammes et des repères d'assiette.
 */
export function useAffichageCalories() {
  const { session } = useSession();
  const userId = session?.user.id;
  const requete = useQuery({
    queryKey: [...CLE, userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Lecture> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('date_naissance, preferences_entrainement')
        .eq('user_id', userId as string)
        .maybeSingle();
      if (error) throw error;
      const ligne = (data ?? {}) as { date_naissance?: string | null; preferences_entrainement?: Record<string, unknown> | null };
      const age = ageDepuis(ligne.date_naissance);
      const preferences = ligne.preferences_entrainement ?? {};
      const choix = typeof preferences.afficher_calories === 'boolean' ? preferences.afficher_calories : null;
      return { mineur: age === null || age < 18, choix, preferences };
    },
  });
  const d = requete.data;
  return { requete, afficher: d ? (d.choix ?? !d.mineur) : false, mineur: d?.mineur ?? true };
}

/** Enregistre le choix dans `preferences_entrainement` (fusion : les autres clés sont gardées). */
export function useModifierAffichageCalories() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  return useMutation({
    mutationFn: async (afficher: boolean) => {
      if (!userId) throw new Error('Session absente');
      const lu = await supabase.from('user_profiles').select('preferences_entrainement').eq('user_id', userId).maybeSingle();
      if (lu.error) throw lu.error;
      const actuelles = ((lu.data as { preferences_entrainement?: Record<string, unknown> | null } | null)?.preferences_entrainement ?? {}) as Record<string, unknown>;
      const { error } = await supabase
        .from('user_profiles')
        .update({ preferences_entrainement: { ...actuelles, afficher_calories: afficher } })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLE }),
  });
}
