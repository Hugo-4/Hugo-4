import type { CoteTest, TestAthlete } from './types';

/** Résultats d'un même test (type + exercice + côté), du plus ancien au plus récent. */
export type GroupeTest = {
  cle: string;
  type: { slug: string; nom: string; unite: string | null };
  exercice: { slug: string; nom: string } | null;
  cote: CoteTest | null;
  resultats: TestAthlete[];
  dernier: TestAthlete;
};

/** Identifiant d'un groupe, utilisé dans l'adresse du détail (`/progres/tests?type=…&exercice=…&cote=…`). */
export type FiltreTest = { type: string; exercice?: string; cote?: string };

const cleDe = (type: string, exercice?: string | null, cote?: string | null) => `${type}|${exercice ?? ''}|${cote ?? ''}`;

/** Regroupe l'historique par test ; les groupes les plus récemment testés d'abord. */
export function regrouperTests(tests: TestAthlete[]): GroupeTest[] {
  const groupes = new Map<string, GroupeTest>();
  for (const test of tests) {
    if (!test.types_tests || !Number.isFinite(test.valeur)) continue;
    const cle = cleDe(test.types_tests.slug, test.exercices?.slug, test.cote);
    const groupe = groupes.get(cle);
    if (groupe) groupe.resultats.push(test);
    else groupes.set(cle, { cle, type: test.types_tests, exercice: test.exercices, cote: test.cote, resultats: [test], dernier: test });
  }
  return [...groupes.values()]
    .map((groupe) => {
      const resultats = [...groupe.resultats].sort((a, b) => a.date_test.localeCompare(b.date_test));
      return { ...groupe, resultats, dernier: resultats[resultats.length - 1] };
    })
    .sort((a, b) => b.dernier.date_test.localeCompare(a.dernier.date_test));
}

export function filtreDe(groupe: GroupeTest): FiltreTest {
  return {
    type: groupe.type.slug,
    ...(groupe.exercice ? { exercice: groupe.exercice.slug } : {}),
    ...(groupe.cote ? { cote: groupe.cote } : {}),
  };
}

export function trouverGroupe(groupes: GroupeTest[], filtre: FiltreTest): GroupeTest | undefined {
  return groupes.find((g) => g.cle === cleDe(filtre.type, filtre.exercice, filtre.cote));
}

export type Tendance = 'hausse' | 'baisse' | 'stable';

/** Sens de la courbe entre le premier et le dernier résultat (un fait, pas un jugement). */
export function tendanceDe(groupe: GroupeTest): Tendance | null {
  if (groupe.resultats.length < 2) return null;
  const ecart = groupe.dernier.valeur - groupe.resultats[0].valeur;
  return ecart > 0 ? 'hausse' : ecart < 0 ? 'baisse' : 'stable';
}
