import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ouvrirCoach } from '@/features/coach/ouvrirCoach';
import { useTests } from '@/features/progres/useTests';
import { dateDuJour } from '@/features/programme/dates';
import { objectifA } from '@/features/programme/presentation';
import { useEvenements } from '@/features/programme/requetes';

import { trierEtapes } from './avancement';
import { useActionsEtape, useSousObjectifs } from './useSousObjectifs';

/** Objectif principal (compétition A à venir), étapes proposées et frise, actions et ouverture du coach. */
export function useObjectifs() {
  const { t } = useTranslation();
  const evenements = useEvenements();
  const etapes = useSousObjectifs();
  const tests = useTests();
  const actions = useActionsEtape();
  const aujourdhui = dateDuJour();
  const objectif = objectifA(evenements.data, aujourdhui);
  const { proposees, frise } = trierEtapes(etapes.data ?? []);

  const refuser = (id: string) =>
    Alert.alert(t('objectifs.refuserTitre'), t('objectifs.refuserTexte'), [
      { text: t('commun.annuler'), style: 'cancel' },
      { text: t('objectifs.refuser'), style: 'destructive', onPress: () => actions.supprimer.mutate(id) },
    ]);

  return {
    etapes,
    evenements,
    objectif,
    aujourdhui,
    proposees,
    frise,
    tests: tests.data ?? [],
    actions,
    accepter: (id: string) => actions.changerStatut.mutate({ id, statut: 'actif' }),
    refuser,
    construireAvecCoach: () =>
      ouvrirCoach({ type: 'objectif', titre: objectif?.nom ?? t('objectifs.monObjectif'), evenementId: objectif?.id ?? null }),
  };
}

export type EtatObjectifs = ReturnType<typeof useObjectifs>;
