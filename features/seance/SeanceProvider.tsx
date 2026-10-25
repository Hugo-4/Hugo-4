import { useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useEffect, useReducer, useState } from 'react';

import { type Action, type EtatSeance, etatInitial, reducteur } from './etat';
import { demarrerSeance } from './source';
import { lireSeanceEnCours, sauverSeanceEnCours } from './stockageSeance';

type Contexte = {
  etat: EtatSeance;
  dispatch: (action: Action) => void;
};

const SeanceContexte = createContext<Contexte | null>(null);

type ActionRacine = { type: 'charger'; etat: EtatSeance } | Action;

function racine(etat: EtatSeance | null, action: ActionRacine): EtatSeance | null {
  if (action.type === 'charger') return action.etat;
  return etat ? reducteur(etat, action) : etat;
}

/**
 * Charge la séance : reprise de la séance sauvegardée sur le téléphone si c'est la même,
 * sinon démarrage par le serveur. Chaque changement est sauvegardé aussitôt.
 */
export function useChargementSeance(programmeSeanceId: string) {
  const [etat, dispatch] = useReducer(racine, null);
  const [stockageLu, setStockageLu] = useState(false);

  useEffect(() => {
    lireSeanceEnCours().then((sauvee) => {
      if (sauvee?.programmeSeanceId === programmeSeanceId) dispatch({ type: 'charger', etat: sauvee });
      setStockageLu(true);
    });
  }, [programmeSeanceId]);

  const demarrage = useQuery({
    queryKey: ['seance', 'demarrer', programmeSeanceId],
    queryFn: () => demarrerSeance(programmeSeanceId),
    enabled: stockageLu && etat === null,
    staleTime: Infinity,
    gcTime: 0,
    retry: 1,
  });

  useEffect(() => {
    if (demarrage.data && etat === null) {
      dispatch({ type: 'charger', etat: etatInitial(programmeSeanceId, demarrage.data, Date.now()) });
    }
  }, [demarrage.data, etat, programmeSeanceId]);

  useEffect(() => {
    if (etat) sauverSeanceEnCours(etat).catch(() => undefined);
  }, [etat]);

  return {
    etat,
    dispatch,
    chargement: !etat && !demarrage.isError,
    erreur: demarrage.isError ? demarrage.error : null,
    reessayer: () => demarrage.refetch(),
  };
}

export function SeanceProvider({ etat, dispatch, children }: Contexte & { children: ReactNode }) {
  return <SeanceContexte.Provider value={{ etat, dispatch }}>{children}</SeanceContexte.Provider>;
}

export function useSeance(): Contexte {
  const contexte = useContext(SeanceContexte);
  if (!contexte) throw new Error('useSeance doit être utilisé dans SeanceProvider');
  return contexte;
}
