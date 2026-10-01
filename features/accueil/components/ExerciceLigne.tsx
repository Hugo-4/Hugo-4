import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

import type { ExerciceApercu } from '../types';

type Props = {
  exercice: ExerciceApercu;
};

export function ExerciceLigne({ exercice }: Props) {
  return (
    <View style={styles.ligne}>
      <AppText variant="corpsGras" style={styles.nom} numberOfLines={1}>
        {exercice.nom}
      </AppText>
      <AppText variant="secondaire">{exercice.prescription}</AppText>
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
  nom: { flexShrink: 1 },
});
