import { useState } from 'react';

import { etatsRequete } from './etatRequete';
import { useAdaptations } from './requetes';

/** Historique des adaptations : liste, états de l'écran, tirer pour rafraîchir. */
export function useEcranAdaptations() {
  const requete = useAdaptations();
  const [rafraichissement, setRafraichissement] = useState(false);
  return {
    ...etatsRequete(requete),
    adaptations: requete.data ?? [],
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
