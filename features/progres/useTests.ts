import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES_PROGRES } from './cles';
import type { NouveauTest, TestAthlete, TypeTest } from './types';

/** `GET /tests` : historique des tests de l'athlète (200 derniers, du plus récent au plus ancien). */
export function useTests() {
  return useQuery({
    queryKey: CLES_PROGRES.tests,
    queryFn: async () => {
      const tests = await api.get<TestAthlete[]>('/tests');
      // PostgREST renvoie les `numeric` en nombre ; on reste prudent.
      return (tests ?? []).map((test) => ({ ...test, valeur: Number(test.valeur) }));
    },
  });
}

/** `GET /tests/types` : tests disponibles, unités, protocoles (change rarement). */
export function useTypesTests() {
  return useQuery({
    queryKey: CLES_PROGRES.typesTests,
    queryFn: () => api.get<TypeTest[]>('/tests/types'),
    staleTime: 24 * 60 * 60_000,
  });
}

/** `POST /tests` puis rafraîchit les tests et ce qui en dépend (records, niveaux). */
export function useAjouterTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (test: NouveauTest) => api.post<{ id: string }>('/tests', test, { delaiMs: 20_000 }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: CLES_PROGRES.tests }),
        queryClient.invalidateQueries({ queryKey: CLES_PROGRES.records }),
        queryClient.invalidateQueries({ queryKey: CLES_PROGRES.niveaux }),
      ]),
  });
}
