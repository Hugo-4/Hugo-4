import { router } from 'expo-router';
import { useState } from 'react';

import { useConsentementSante } from '@/features/checkin/useConsentementSante';

import { etatsRequete } from './etatRequete';
import { useAdaptations } from './requetes';

/**
 * Historique des adaptations : liste, états de l'écran, tirer pour rafraîchir. Sans consentement « données de
 * santé » (ou tant qu'il n'est pas connu), les causes de santé sont masquées.
 */
export function useEcranAdaptations() {
  const requete = useAdaptations();
  const consentement = useConsentementSante();
  const [rafraichissement, setRafraichissement] = useState(false);
  return {
    ...etatsRequete(requete),
    adaptations: requete.data ?? [],
    santeAutorisee: consentement.data === true,
    voirProgramme: () => router.navigate('/programme'),
    rafraichissement,
    rafraichir: async () => {
      setRafraichissement(true);
      try {
        await requete.refetch();
      } finally {
        setRafraichissement(false);
      }
    },
  };
}
