import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { EtatSection } from '../etats';
import { formatValeur } from '../format';
import { regrouperTests } from '../regroupement';
import type { Progression, TestAthlete } from '../types';
import { CarteSection } from './CarteSection';
import { LigneTest } from './LigneTest';

type Props = {
  tests: TestAthlete[] | undefined;
  progressions: Progression[];
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
  onAjouter: () => void;
};

const TESTS_VISIBLES = 3;

/** Tests : dernière valeur et mini-courbe des 3 tests les plus récents ; sinon le 1RM estimé des séances. */
export function CarteTests({ tests, progressions, etat, onReessayer, onPress, onAjouter }: Props) {
  const { t } = useTranslation();
  const groupes = regrouperTests(tests ?? []);
  const e1rm = progressions.find((p) => (p.e1rm_recent ?? p.one_rep_max_kg) !== null && p.exercices);
  const vide = groupes.length === 0 && !e1rm;

  return (
    <CarteSection titre={t('progres.tests.titre')} etat={etat} onReessayer={onReessayer} onPress={vide ? undefined : onPress}>
      {groupes.slice(0, TESTS_VISIBLES).map((groupe) => (
        <LigneTest key={groupe.cle} groupe={groupe} />
      ))}
      {groupes.length > TESTS_VISIBLES ? (
        <AppText variant="libelle">{t('progres.tests.autres', { count: groupes.length - TESTS_VISIBLES })}</AppText>
      ) : null}
      {groupes.length === 0 && e1rm?.exercices ? (
        <View style={styles.e1rm}>
          <AppText variant="corpsGras">{t('progres.tests.e1rmExercice', { exercice: e1rm.exercices.nom })}</AppText>
          <AppText variant="chiffre">{formatValeur(Number(e1rm.e1rm_recent ?? e1rm.one_rep_max_kg), 'kg')}</AppText>
        </View>
      ) : null}
      {vide ? (
        <View style={styles.vide}>
          <AppText variant="secondaire" color={colors.texte2}>
            {t('progres.tests.videTexte')}
          </AppText>
          <Button label={t('progres.tests.ajouter')} variant="secondaire" onPress={onAjouter} />
        </View>
      ) : null}
    </CarteSection>
  );
}

const styles = StyleSheet.create({
  e1rm: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.m, minHeight: sizes.pasAPas },
  vide: { gap: spacing.m },
});
