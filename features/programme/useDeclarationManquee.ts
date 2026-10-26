import { useState } from 'react';

import { useConsentementSante } from '@/features/checkin/useConsentementSante';

import { CATEGORIES_MANQUE, CATEGORIES_SANTE } from './constantes';
import { useSeanceManquee } from './mutationsSeance';
import type { CategorieManque, ReponseManquee } from './types';

/**
 * Séance manquée : catégorie, raison facultative, « essayer de la replacer cette semaine ».
 * Douleur et maladie sont des données de santé : proposées seulement avec le consentement.
 */
export function useDeclarationManquee(programmeSeanceId: string, onFait: (reponse: ReponseManquee) => void) {
  const mutation = useSeanceManquee(programmeSeanceId);
  const consentement = useConsentementSante();
  const [categorie, setCategorie] = useState<CategorieManque | null>(null);
  const [raison, setRaison] = useState('');
  const [reporter, setReporter] = useState(true);
  const sante = consentement.data === true;

  const reinitialiser = () => {
    setCategorie(null);
    setRaison('');
    setReporter(true);
    mutation.reset();
  };

  return {
    categories: CATEGORIES_MANQUE.filter((c) => sante || !CATEGORIES_SANTE.includes(c)),
    sansConsentementSante: !sante,
    categorie,
    choisirCategorie: setCategorie,
    raison,
    changerRaison: setRaison,
    reporter,
    changerReporter: setReporter,
    erreur: mutation.error,
    enCours: mutation.isPending,
    reinitialiser,
    envoyer: () => {
      if (!categorie || mutation.isPending) return;
      mutation.mutate(
        { categorie, raison, reporter },
        {
          onSuccess: (reponse) => {
            reinitialiser();
            onFait(reponse);
          },
        },
      );
    },
  };
}
