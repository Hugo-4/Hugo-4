import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme/tokens';

type Props = { titre: string; aide?: string; children: ReactNode };

/** Question à choix unique : titre, puces sur plusieurs lignes, aide éventuelle. */
export function GroupePuces({ titre, aide, children }: Props) {
  return (
    <View style={styles.bloc}>
      <AppText variant="libelle" color={colors.texte2}>
        {titre}
      </AppText>
      <View style={styles.puces} accessibilityRole="radiogroup" accessibilityLabel={titre}>
        {children}
      </View>
      {aide ? <AppText variant="libelle">{aide}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});
