import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api';

/** La génération prend en général 40 à 90 s (docs/API.md) : on attend jusqu'à 150 s. */
const DELAI_GENERATION_MS = 150_000;

export type ProgrammeGenere = {
  programme_id: string;
  nom: string;
  blocs: { nom: string; phase: string; date_debut: string; date_fin: string }[];
  bloc_en_cours: unknown;
};

export function useGenererProgramme() {
  return useMutation({
    mutationFn: () => api.post<ProgrammeGenere>('/programme/generer', {}, { delaiMs: DELAI_GENERATION_MS }),
  });
}
