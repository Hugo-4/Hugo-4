import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme/tokens';

type Props = {
  titre: string;
  aide?: string;
  radio?: boolean;
  children: ReactNode;
};

/** Titre + rangée de puces qui passent à la ligne. */
export function GroupeChoix({ titre, aide, radio, children }: Props) {
  return (
    <View style={styles.groupe}>
      <AppText variant="corpsGras" color={colors.texte2}>
        {titre}
      </AppText>
      {aide ? <AppText variant="libelle">{aide}</AppText> : null}
      <View style={styles.puces} accessibilityRole={radio ? 'radiogroup' : undefined} accessibilityLabel={titre}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.s },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});
