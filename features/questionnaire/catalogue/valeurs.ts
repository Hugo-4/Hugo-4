import { sport, test } from '../destinations';
import type { FormatTest, Question, SportSlug } from '../types';

type DefinitionTest = { type: string; exercice?: string; format: FormatTest; unite: string };

/**
 * Valeurs clés (TC100 à TC103 et blocs de sport) : types de `types_tests`, exercices du catalogue (slug).
 * Une valeur de test est envoyée à `POST /tests` ; le serveur garde la méthode (testée ou déclarée).
 */
const TESTS: Record<string, DefinitionTest> = {
  '1rm_squat': { type: '1rm', exercice: 'muscu_squat_barre', format: 'charge', unite: 'kg' },
  '1rm_couche': { type: '1rm', exercice: 'muscu_developpe_couche_barre', format: 'charge', unite: 'kg' },
  '1rm_terre': { type: '1rm', exercice: 'muscu_souleve_de_terre', format: 'charge', unite: 'kg' },
  '1rm_militaire': { type: '1rm', exercice: 'muscu_developpe_militaire', format: 'charge', unite: 'kg' },
  '1rm_rowing': { type: '1rm', exercice: 'muscu_rowing_barre', format: 'charge', unite: 'kg' },
  tractions_max: { type: 'reps_max', exercice: 'muscu_tractions_pronation', format: 'nombre', unite: 'reps' },
  pompes_max: { type: 'reps_max', exercice: 'muscu_pompes_classiques', format: 'nombre', unite: 'reps' },
  temps_5km: { type: 'temps_5km', format: 'duree', unite: 's' },
  temps_10km: { type: 'temps_10km', format: 'duree', unite: 's' },
  temps_semi: { type: 'temps_semi', format: 'duree', unite: 's' },
  temps_marathon: { type: 'temps_marathon', format: 'duree', unite: 's' },
  vma: { type: 'vma', format: 'nombre', unite: 'kmh' },
  cooper: { type: 'cooper', format: 'nombre', unite: 'm' },
  allure_seuil: { type: 'allure_seuil', format: 'allure', unite: 'parKm' },
  fc_max: { type: 'fc_max', format: 'nombre', unite: 'bpm' },
  fc_repos: { type: 'fc_repos', format: 'nombre', unite: 'bpm' },
  fc_seuil: { type: 'fc_seuil', format: 'nombre', unite: 'bpm' },
  ftp: { type: 'ftp', format: 'nombre', unite: 'w' },
  pma: { type: 'pma', format: 'nombre', unite: 'w' },
  nage_100m: { type: 'nage_100m', format: 'duree', unite: 's' },
  nage_200m: { type: 'nage_200m', format: 'duree', unite: 's' },
  nage_400m: { type: 'nage_400m', format: 'duree', unite: 's' },
  cmj: { type: 'cmj', format: 'nombre', unite: 'cm' },
  sprint_10m: { type: 'sprint_10m', format: 'nombre', unite: 'secondes' },
  sprint_30m: { type: 'sprint_30m', format: 'nombre', unite: 'secondes' },
  t_test: { type: 't_test', format: 'nombre', unite: 'secondes' },
  gainage_max: { type: 'gainage_max', format: 'duree', unite: 's' },
  grip: { type: 'grip', format: 'nombre', unite: 'kg' },
  mobilite_cheville: { type: 'mobilite_cheville', format: 'nombre', unite: 'cm' },
  sit_and_reach: { type: 'sit_and_reach', format: 'nombre', unite: 'cm' },
};

const COURSE = ['temps_5km', 'temps_10km', 'temps_semi', 'temps_marathon', 'vma', 'allure_seuil', 'fc_max', 'fc_repos'];
const COMBAT = ['vma', 'cooper', 'fc_repos', 'fc_max', 'cmj', 'sprint_10m', 't_test', 'gainage_max', 'pompes_max', 'tractions_max'];

/** Valeurs demandées par sport, dans l'ordre (validé le 26/10/2026 : la boxe commence par le cardio). */
const VALEURS_PAR_SPORT: Record<SportSlug, string[]> = {
  musculation: ['1rm_squat', '1rm_couche', '1rm_terre', '1rm_militaire', '1rm_rowing', 'tractions_max', 'pompes_max'],
  course_a_pied: COURSE,
  trail: COURSE,
  cyclisme: ['ftp', 'pma', 'fc_seuil', 'fc_max', 'fc_repos'],
  natation: ['nage_100m', 'nage_200m', 'nage_400m', 'fc_repos'],
  triathlon: ['temps_10km', 'vma', 'ftp', 'nage_200m', 'nage_400m'],
  boxe_anglaise: COMBAT,
  mma: [...COMBAT, 'grip', '1rm_squat', '1rm_terre'],
  football: ['vma', 'cooper', 'sprint_10m', 'sprint_30m', 't_test', 'cmj'],
  general: ['fc_repos', 'gainage_max', 'mobilite_cheville', 'sit_and_reach', 'pompes_max'],
};

/** Identifiant de question d'une valeur connue (`V_vma`, `V_1rm_squat`…). */
export const idValeur = (libelle: string) => `V_${libelle}`;

function questionTest(libelle: string): Question {
  const t = TESTS[libelle];
  return {
    id: idValeur(libelle),
    section: 'valeurs',
    type: 'test',
    test: { format: t.format, unite: t.unite, libelle },
    destination: test(t.type, t.exercice),
  };
}

/** Questions de valeurs connues pour le sport principal, puis le choix d'un test si aucune n'est connue (TC104). */
export function questionsValeurs(sportPrincipal: SportSlug | null): Question[] {
  const libelles = VALEURS_PAR_SPORT[sportPrincipal ?? 'general'];
  const ids = libelles.map(idValeur);
  return [
    ...libelles.map(questionTest),
    {
      id: 'TC104',
      section: 'valeurs',
      type: 'unique',
      options: ['premiere_semaine', 'plus_tard'],
      // Proposé seulement si aucune valeur clé n'est connue pour le sport.
      si: (c) => ids.every((id) => c.valeurs[id] === undefined),
      destination: sport('test_souhaite'),
    },
  ];
}
