import { useState } from 'react';

import type { ValeurDate } from '@/components/DateField';

import { ECART_DEPLACEMENT_JOURS } from './constantes';
import { DATE_VIDE, dateIso, fenetreDeplacement, saisieComplete } from './dates';
import { useDeplacerSeance } from './mutationsSeance';

/**
 * Choix de la nouvelle date d'une séance : une puce parmi les jours permis, ou une date saisie.
 * Fenêtre du serveur (`verifierDeplacement`) : ± 6 jours autour de la date prévue, jamais dans le passé.
 * Le serveur vérifie aussi la récupération et le créneau, et peut refuser avec sa raison.
 */
export function useDeplacement(programmeSeanceId: string, dateActuelle: string, onDeplacee: (date: string) => void) {
  const mutation = useDeplacerSeance(programmeSeanceId);
  const [puce, setPuce] = useState<string | null>(null);
  const [saisie, setSaisie] = useState<ValeurDate>(DATE_VIDE);
  const fenetre = fenetreDeplacement(dateActuelle, ECART_DEPLACEMENT_JOURS);

  const dateSaisie = saisieComplete(saisie) ? dateIso(saisie) : null;
  const saisieInvalide = saisieComplete(saisie) && (!dateSaisie || !fenetre.dates.includes(dateSaisie));
  const date = puce ?? (saisieInvalide ? null : dateSaisie);
  const reponse = mutation.data;
  const refus = reponse && !reponse.applique ? (reponse.raison_refus ?? reponse.message ?? null) : null;

  const reinitialiser = () => {
    setPuce(null);
    setSaisie(DATE_VIDE);
    mutation.reset();
  };

  return {
    puces: fenetre.dates,
    /** Premier et dernier jour permis (texte d'aide et message d'erreur de la saisie libre). */
    debut: fenetre.debut,
    fin: fenetre.fin,
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
