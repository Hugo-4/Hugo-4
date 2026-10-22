import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Accueil } from './types';

export const CLE_ACCUEIL = ['accueil'] as const;

/** `GET /accueil` : aujourd'hui en détail, demain, la semaine, le bloc, la compétition, l'adaptation proposée. */
export function useAccueil() {
  return useQuery({ queryKey: CLE_ACCUEIL, queryFn: () => api.get<Accueil>('/accueil') });
}
