import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TESTS, VALEURS_PAR_SPORT } from '@/features/questionnaire/catalogue/valeurs';
import type { SportSlug } from '@/features/questionnaire/types';

import { type ChampsEtape, champsDepuis, ecrireDuree, estDuree, verifierEtape } from './saisie';
import { useObjectifs } from './useObjectifs';

/** Formulaire d'une étape : création (`nouvelle`) ou modification, avec l'indicateur suivi et sa valeur de départ. */
export function useFormulaireEtape(id: string) {
  const { t } = useTranslation();
  const o = useObjectifs();
  const nouvelle = id === 'nouvelle';
  const etape = nouvelle ? null : (o.etapes.data?.find((e) => e.id === id) ?? null);
  const [champs, setChamps] = useState<ChampsEtape | null>(nouvelle ? champsDepuis(null) : null);
  const [tente, setTente] = useState(false);

  // Modification : le formulaire part de l'étape dès qu'elle est lue.
  useEffect(() => {
    if (!champs && etape) setChamps(champsDepuis(etape));
  }, [champs, etape]);

  const sport = (o.objectif?.sports?.slug ?? 'general') as SportSlug;
  const indicateurs = VALEURS_PAR_SPORT[sport] ?? VALEURS_PAR_SPORT.general;
  const modifier = (changement: Partial<ChampsEtape>) => setChamps((c) => (c ? { ...c, ...changement } : c));

  /** Choisir un indicateur préremplit la valeur de départ avec la dernière mesure, si elle existe. */
  const choisirIndicateur = (libelle: string | null) => {
    if (!champs) return;
    const def = libelle ? TESTS[libelle] : null;
    const mesure = def ? o.tests.find((x) => x.types_tests?.slug === def.type && (!def.exercice || x.exercices?.slug === def.exercice)) : undefined;
    const depart = mesure ? (estDuree(libelle) ? ecrireDuree(mesure.valeur) : String(mesure.valeur).replace('.', ',')) : '';
    modifier({ indicateur: libelle, depart, cible: '' });
  };

  const verification = champs
    ? verifierEtape(champs, o.aujourdhui, {
        evenement_id: etape?.evenement_id ?? o.objectif?.id ?? null,
        sport_id: etape?.sport_id ?? o.objectif?.sport_id ?? null,
      })
    : null;

  const enregistrer = () => {
    setTente(true);
    if (!verification?.saisie) return;
    o.actions.enregistrer.mutate({ id: etape?.id ?? null, saisie: verification.saisie }, { onSuccess: () => router.back() });
  };

  const marquerAtteinte = () =>
    etape && o.actions.changerStatut.mutate({ id: etape.id, statut: 'atteint' }, { onSuccess: () => router.back() });

  const supprimer = () =>
    etape &&
    Alert.alert(t('objectifs.supprimerTitre'), t('objectifs.supprimerTexte'), [
      { text: t('commun.annuler'), style: 'cancel' },
      { text: t('objectifs.supprimer'), style: 'destructive', onPress: () => o.actions.supprimer.mutate(etape.id, { onSuccess: () => router.back() }) },
    ]);

  return {
    o,
    nouvelle,
    etape,
    introuvable: !nouvelle && o.etapes.data !== undefined && !etape,
    champs,
    erreurs: tente ? (verification?.erreurs ?? {}) : {},
    indicateurs,
    modifier,
    choisirIndicateur,
    enregistrer,
    marquerAtteinte,
    supprimer,
    enCours: o.actions.enregistrer.isPending || o.actions.changerStatut.isPending || o.actions.supprimer.isPending,
    erreurEnvoi: o.actions.enregistrer.error ?? o.actions.changerStatut.error ?? o.actions.supprimer.error,
  };
}
