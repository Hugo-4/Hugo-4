import { useQuery } from '@tanstack/react-query';

import { accueilMock, SCENARIO } from './mock';
import type { Accueil } from './types';

const DELAI_FICTIF_MS = 600;

/** Étape 1 : données fictives. Étape 4 : remplacé par l'appel `GET /accueil` via lib/api.ts. */
async function chargerAccueil(): Promise<Accueil | null> {
  await new Promise((resolve) => setTimeout(resolve, DELAI_FICTIF_MS));
  if (SCENARIO === 'erreur') {
    throw new Error('Erreur fictive');
  }
  return accueilMock();
}

export function useAccueil() {
  return useQuery({ queryKey: ['accueil'], queryFn: chargerAccueil });
}
