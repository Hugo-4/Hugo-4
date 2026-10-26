import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { sizes, spacing } from '@/theme/tokens';

type Props = { symbole: ReactNode; texte: string };

/** Une ligne de la légende du calendrier : le symbole tel qu'il apparaît dans une case, et ce qu'il veut dire. */
export function LigneLegende({ symbole, texte }: Props) {
  return (
    <View style={styles.ligne} accessible accessibilityLabel={texte}>
      <View style={styles.symbole}>{symbole}</View>
      <AppText variant="corps" style={styles.texte}>
        {texte}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.cibleTactile },
  symbole: { width: sizes.cibleTactile, alignItems: 'center' },
  texte: { flex: 1 },
});
