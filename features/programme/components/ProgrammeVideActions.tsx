import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { spacing } from '@/theme/tokens';

import type { EcranProgramme } from '../useEcranProgramme';
import { CompetitionsAVenir } from './CompetitionsAVenir';

/**
 * Sous l'état « Pas encore de programme » : [P] « Aller à Aujourd'hui », puis les compétitions et
 * [S] « + Compétition » (on peut ajouter son objectif avant que le programme existe).
 */
export function ProgrammeVideActions({ e }: { e: EcranProgramme }) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <Button label={t('programme.vide.action')} onPress={() => router.navigate('/')} />
      <CompetitionsAVenir requete={e.evenements} competitions={e.competitions} sansObjectifA={!e.objectif} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.entreCartes },
});
