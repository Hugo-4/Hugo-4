import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ProgrammeActif } from './semaineProgramme';

/**
 * `GET /programme` : programme actif et séances du bloc en cours. Chargé seulement quand
 * Aujourd'hui en a besoin (semaine en cours vide, jour de repos sans séance demain).
 */
export function useProgrammeActif(actif: boolean) {
  return useQuery({
    queryKey: ['programme', 'actif'],
    queryFn: () => api.get<ProgrammeActif>('/programme'),
    enabled: actif,
  });
}
