import { useTests } from '@/features/progres/useTests';
import type { TestAthlete } from '@/features/progres/types';
import { CORPS } from '@/features/questionnaire/catalogue/commun';
import { useQuestionnaire } from '@/features/questionnaire/useQuestionnaire';

import { usePoids } from './usePoids';

/** Sports à catégorie de poids : la composition corporelle y est proposée dès 18 ans. */
const SPORTS_CATEGORIE_POIDS = ['boxe_anglaise', 'mma'];

export type DetailCorps = { slug: string; dernier: TestAthlete | null };

/**
 * Données de « Mon corps » : réponses déjà connues (questionnaire), poids (historique `GET /poids`) et valeurs
 * physiologiques (derniers tests). Le poids est demandé à tous (obligatoire) mais jamais commenté avant 18 ans :
 * ni courbe, ni moyenne, ni évolution. La composition corporelle n'est proposée qu'à partir de 18 ans, et seulement
 * si elle sert (combat) ou existe déjà.
 */
export function useCorps() {
  const q = useQuestionnaire();
  const tests = useTests();
  const age = q.pret ? q.contexte.age : null;
  const sport = q.pret ? q.contexte.sport : null;
  const combat = SPORTS_CATEGORIE_POIDS.includes(sport ?? '');
  const mineur = age === null || age < 18;
  const poids = usePoids(q.pret);

  const dernier = (slug: string) => tests.data?.find((t) => t.types_tests?.slug === slug) ?? null;
  const composition = age !== null && age >= 18 && (combat || dernier('masse_grasse') !== null);
  const details: DetailCorps[] = ['fc_repos', 'fc_max', ...(composition ? ['masse_grasse', 'tour_taille'] : [])].map((slug) => ({
    slug,
    dernier: dernier(slug),
  }));

  return {
    questionnaire: q,
    valeurs: q.pret ? q.contexte.valeurs : {},
    /** Avant 18 ans : le poids est affiché seul, sans aucun commentaire ni évolution. */
    poidsCommente: !mineur,
    poids,
    details,
    /** Question « Ta taille ? » du questionnaire : sa modification est enregistrée comme une réponse. */
    questionTaille: CORPS.find((x) => x.id === 'TC09'),
  };
}
