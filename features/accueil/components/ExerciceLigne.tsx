import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

import { prescription } from '../presentation';
import type { ExercicePresente } from '../types';

export function ExerciceLigne({ exercice }: { exercice: ExercicePresente }) {
  const texte = prescription(exercice);
  return (
    <View style={styles.ligne}>
      <AppText variant="corpsGras" numberOfLines={1}>
        {exercice.exercice.nom}
      </AppText>
      {texte ? <AppText variant="secondaire">{texte}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    gap: spacing.xxs,
  },
});
