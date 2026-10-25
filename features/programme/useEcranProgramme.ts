import { router } from 'expo-router';
import { useState } from 'react';

import { dateDuJour, moisCourant, moisVoisin } from './dates';
import { etatsRequete } from './etatRequete';
import { competitionsAVenir, estSeanceProgramme, objectifA } from './presentation';
import { useCalendrier, useEvenements, useLegende, useProgramme } from './requetes';
import type { JourCalendrier } from './types';

/** Données et actions de l'onglet Programme (« Qu'est-ce qui m'attend ? »). */
export function useEcranProgramme() {
  const programme = useProgramme();
  const [mois, setMois] = useState(moisCourant);
  const calendrier = useCalendrier(mois);
  const evenements = useEvenements();
  const legende = useLegende();
  const [jourOuvert, setJourOuvert] = useState<JourCalendrier | null>(null);
  const [legendeOuverte, setLegendeOuverte] = useState(false);
  const [rafraichissement, setRafraichissement] = useState(false);
  const aujourdhui = dateDuJour();

  const rafraichir = async () => {
    setRafraichissement(true);
    try {
      await Promise.all([programme.refetch(), calendrier.refetch(), evenements.refetch()]);
    } finally {
      setRafraichissement(false);
    }
  };

  /** Une seule séance du programme ce jour-là : son détail ; plusieurs, ou une compétition : la feuille du jour. */
  const ouvrirJour = (jour: JourCalendrier) => {
    const seance = jour.seances[0];
    if (jour.seances.length === 1 && !jour.evenements.length && seance && estSeanceProgramme(seance)) {
      router.push({ pathname: '/programme/seance/[id]', params: { id: seance.id } });
    } else if (jour.seances.length || jour.evenements.length) {
      setJourOuvert(jour);
    }
  };

  return {
    aujourdhui,
    ...etatsRequete(programme),
    vide: programme.data?.programme === null,
    programme: programme.data,
    mois,
    changerMois: (decalage: number) => setMois((m) => moisVoisin(m, decalage)),
    calendrier,
    legende: legende.data,
    objectif: objectifA(evenements.data, aujourdhui),
    competitions: competitionsAVenir(evenements.data, aujourdhui),
    ouvrirJour,
    jourOuvert,
    fermerJour: () => setJourOuvert(null),
    legendeOuverte,
    ouvrirLegende: () => setLegendeOuverte(true),
    fermerLegende: () => setLegendeOuverte(false),
    rafraichir,
    rafraichissement,
  };
}

export type EcranProgramme = ReturnType<typeof useEcranProgramme>;
