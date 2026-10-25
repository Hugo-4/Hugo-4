import { useState } from 'react';

import type { ValeurDate } from '@/components/DateField';

import { JOURS_DEPLACEMENT } from './constantes';
import { DATE_VIDE, dateDuJour, dateIso, prochainsJours, saisieComplete } from './dates';
import { useDeplacerSeance } from './mutationsSeance';

/**
 * Choix de la nouvelle date d'une séance : une puce parmi les 7 prochains jours, ou une date saisie.
 * Le serveur vérifie les règles (même semaine, récupération) et peut refuser avec sa raison.
 */
export function useDeplacement(programmeSeanceId: string, dateActuelle: string, onDeplacee: (date: string) => void) {
  const mutation = useDeplacerSeance(programmeSeanceId);
  const [puce, setPuce] = useState<string | null>(null);
  const [saisie, setSaisie] = useState<ValeurDate>(DATE_VIDE);

  const dateSaisie = saisieComplete(saisie) ? dateIso(saisie) : null;
  const saisieInvalide = saisieComplete(saisie) && (!dateSaisie || dateSaisie < dateDuJour() || dateSaisie === dateActuelle);
  const date = puce ?? (saisieInvalide ? null : dateSaisie);
  const reponse = mutation.data;
  const refus = reponse && !reponse.applique ? (reponse.raison_refus ?? reponse.message ?? null) : null;

  const reinitialiser = () => {
    setPuce(null);
    setSaisie(DATE_VIDE);
    mutation.reset();
  };

  return {
    puces: prochainsJours(JOURS_DEPLACEMENT).filter((d) => d !== dateActuelle),
    puce,
    choisirPuce: (d: string) => {
      setPuce(d);
      setSaisie(DATE_VIDE);
      mutation.reset();
    },
    saisie,
    changerSaisie: (valeur: ValeurDate) => {
      setSaisie(valeur);
      setPuce(null);
      mutation.reset();
    },
    saisieInvalide,
    date,
    refus,
    erreur: mutation.error,
    enCours: mutation.isPending,
    reinitialiser,
    confirmer: () => {
      if (!date || mutation.isPending) return;
      mutation.mutate(date, {
        onSuccess: (r) => {
          if (!r.applique) return;
          reinitialiser();
          onDeplacee(date);
        },
      });
    },
  };
}
