import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  texte: string;
  icon?: ReactNode;
  /** `info` : discret (hors ligne) ; `alerte` : orange. */
  ton?: 'info' | 'alerte';
};

/** Bandeau d'une ligne (hors ligne, alerte). Ne bloque jamais l'écran. */
export function Bandeau({ texte, icon, ton = 'info' }: Props) {
  const couleur = ton === 'alerte' ? colors.alerte : colors.texte2;
  return (
    <View style={[styles.bandeau, ton === 'alerte' && styles.alerte]} accessibilityRole="alert">
      {icon}
      <AppText variant="secondaire" color={couleur} style={styles.texte}>
        {texte}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bandeau: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: radius.petit,
    backgroundColor: colors.carte2,
  },
  alerte: { borderWidth: sizes.bordure, borderColor: colors.alerte },
  texte: { flex: 1 },
});
