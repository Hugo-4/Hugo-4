import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

import { type EtapeId, listeEtapes } from './etapes';
import { type Parcours, REPONSES_INITIALES, type Reponses } from './types';

type ContexteInscription = {
  parcours: Parcours;
  setParcours: (parcours: Parcours) => void;
  consentementSante: boolean;
  setConsentementSante: (accorde: boolean) => void;
  reponses: Reponses;
  modifier: (changement: Partial<Reponses>) => void;
  etapes: EtapeId[];
  index: number;
  setIndex: (index: number) => void;
  /** Parties déjà enregistrées : un nouvel essai ne les renvoie pas (pas de doublons). */
  enregistrees: Set<string>;
};

const Contexte = createContext<ContexteInscription | null>(null);

/** Réponses du questionnaire, gardées en mémoire jusqu'à l'enregistrement final. */
export function InscriptionProvider({ children }: { children: ReactNode }) {
  const [parcours, setParcours] = useState<Parcours>('rapide');
  const [consentementSante, setConsentementSante] = useState(false);
  const [reponses, setReponses] = useState<Reponses>(REPONSES_INITIALES);
  const [index, setIndex] = useState(0);
  const [enregistrees] = useState(() => new Set<string>());

  const valeur = useMemo<ContexteInscription>(
    () => ({
      parcours,
      setParcours,
      consentementSante,
      setConsentementSante,
      reponses,
      modifier: (changement) => setReponses((actuelles) => ({ ...actuelles, ...changement })),
      etapes: listeEtapes(parcours, consentementSante),
      index,
      setIndex,
      enregistrees,
    }),
    [parcours, consentementSante, reponses, index, enregistrees],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useInscription(): ContexteInscription {
  const contexte = useContext(Contexte);
  if (!contexte) throw new Error('useInscription doit être utilisé dans InscriptionProvider');
  return contexte;
}
