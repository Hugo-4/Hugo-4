import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { useEnLigne } from '@/lib/useEnLigne';

import { enregistrerBrouillon, lireBrouillon } from './brouillonCheckin';
import { SEUIL_ENERGIE_BASSE } from './constantes';
import { dateDuJour } from './dateDuJour';
import { SAISIE_VIDE, type SaisieCheckin, saisieComplete } from './types';
import { useCheckinDuJour } from './useCheckinDuJour';
import { useConsentementSante } from './useConsentementSante';
import { useEnregistrerCheckin } from './useEnregistrerCheckin';
import { useLieux } from './useLieux';

/** Consentement santé : `inconnu` si on n'a pas pu le lire (hors ligne, erreur) — la question des douleurs reste alors masquée. */
export type EtatConsentement = 'oui' | 'non' | 'inconnu';

/**
 * État et envoi du check-in du matin. La saisie est gardée en brouillon sur le téléphone à chaque changement ;
 * à l'ouverture : brouillon du jour, sinon notes du check-in déjà fait aujourd'hui (pour le refaire), sinon vide.
 */
export function useCheckin() {
  const date = dateDuJour();
  const [saisie, setSaisie] = useState<SaisieCheckin>(SAISIE_VIDE);
  const [brouillon, setBrouillon] = useState<SaisieCheckin | null | undefined>(undefined);
  const initialise = useRef(false);
  const modifie = useRef(false);
  const enLigne = useEnLigne();
  const consentement = useConsentementSante();
  const checkin = useCheckinDuJour();
  const lieux = useLieux();
  const enregistrement = useEnregistrerCheckin();
  const checkinEnChargement = checkin.isPending && checkin.fetchStatus === 'fetching';

  useEffect(() => {
    let actif = true;
    lireBrouillon(date).then((b) => {
      if (actif) setBrouillon(b);
    });
    return () => {
      actif = false;
    };
  }, [date]);

  useEffect(() => {
    if (initialise.current || brouillon === undefined || checkinEnChargement) return;
    initialise.current = true;
    const fait = checkin.data;
    if (brouillon) setSaisie(brouillon);
    else if (fait)
      setSaisie((s) => ({
        ...s,
        notes: {
          energie: fait.energie,
          sommeil: fait.sommeil_ressenti,
          courbatures: fait.courbatures,
          motivation: fait.motivation,
          stress: fait.stress_ressenti,
        },
      }));
  }, [brouillon, checkin.data, checkinEnChargement]);

  useEffect(() => {
    if (modifie.current) enregistrerBrouillon(date, saisie);
  }, [date, saisie]);

  const modifier = (changement: Partial<SaisieCheckin>) => {
    modifie.current = true;
    setSaisie((s) => ({ ...s, ...changement }));
  };
  const energieBasse = saisie.notes.energie !== null && saisie.notes.energie <= SEUIL_ENERGIE_BASSE;
  const etatConsentement: EtatConsentement =
    consentement.data === true ? 'oui' : consentement.data === false ? 'non' : 'inconnu';

  const envoyer = () =>
    enregistrement.mutate(
      { saisie, consentementSante: etatConsentement === 'oui' },
      {
        onSuccess: () => {
          // Le brouillon est effacé par la mutation (même si la feuille a été fermée entre-temps).
          modifie.current = false;
          router.back();
        },
      },
    );

  return {
    saisie,
    modifier,
    energieBasse,
    etatConsentement,
    lieux: lieux.data ?? [],
    // Hors ligne, les requêtes sans cache restent en pause : on n'attend que les vrais chargements.
    pret: brouillon !== undefined && !(consentement.isPending && consentement.fetchStatus === 'fetching') && !checkinEnChargement,
    enLigne,
    complet: saisieComplete(saisie),
    envoyer,
    enregistrement,
  };
}
