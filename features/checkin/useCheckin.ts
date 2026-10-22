import { router } from 'expo-router';
import { useState } from 'react';

import { SEUIL_ENERGIE_BASSE } from './constantes';
import { SAISIE_VIDE, type SaisieCheckin, saisieComplete } from './types';
import { useConsentementSante } from './useConsentementSante';
import { useEnregistrerCheckin } from './useEnregistrerCheckin';
import { useLieux } from './useLieux';

/** État et envoi du check-in du matin. */
export function useCheckin() {
  const [saisie, setSaisie] = useState<SaisieCheckin>(SAISIE_VIDE);
  const consentement = useConsentementSante();
  const lieux = useLieux();
  const enregistrement = useEnregistrerCheckin();

  const modifier = (changement: Partial<SaisieCheckin>) => setSaisie((s) => ({ ...s, ...changement }));
  const energieBasse = saisie.notes.energie !== null && saisie.notes.energie <= SEUIL_ENERGIE_BASSE;

  const envoyer = () =>
    enregistrement.mutate(
      { saisie, consentementSante: consentement.data === true },
      { onSuccess: () => router.back() },
    );

  return {
    saisie,
    modifier,
    energieBasse,
    consentementSante: consentement.data === true,
    lieux: lieux.data ?? [],
    pret: !consentement.isPending,
    complet: saisieComplete(saisie),
    envoyer,
    enregistrement,
  };
}
