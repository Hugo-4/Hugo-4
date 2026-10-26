import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Ton = 'info' | 'alerte' | 'urgence';

type Props = {
  texte: string;
  icon?: ReactNode;
  /** `info` : discret (hors ligne) ; `alerte` : orange ; `urgence` : rouge (15 / 112). */
  ton?: Ton;
  /** Bouton à droite (ex. « Appeler le 15 »). */
  action?: ReactNode;
};

const couleurs: Record<Ton, string> = { info: colors.texte2, alerte: colors.alerte, urgence: colors.danger };

/** Bandeau d'une ligne (hors ligne, alerte, urgence). Ne bloque jamais l'écran. */
export function Bandeau({ texte, icon, ton = 'info', action }: Props) {
  return (
    <View
      style={[styles.bandeau, ton !== 'info' && { borderWidth: sizes.bordure, borderColor: couleurs[ton] }]}
      accessibilityRole="alert">
      {icon}
      <AppText variant="secondaire" color={couleurs[ton]} style={styles.texte}>
        {texte}
      </AppText>
      {action}
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
  texte: { flex: 1 },
});
