import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { CLES_PROGRES } from './cles';

/**
 * Tirer pour rafraîchir : relance toutes les requêtes de Progrès. L'indicateur ne tourne que pendant
 * ce geste (pas pendant les rafraîchissements discrets au retour sur l'écran).
 */
export function useRafraichir() {
  const queryClient = useQueryClient();
  const [rafraichissement, setRafraichissement] = useState(false);
  const rafraichir = async () => {
    setRafraichissement(true);
    try {
      await queryClient.invalidateQueries({ queryKey: CLES_PROGRES.racine });
    } finally {
      setRafraichissement(false);
    }
  };
  return { rafraichissement, rafraichir };
}
