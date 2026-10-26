import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, opacity, radius, sizes } from '@/theme/tokens';

type Props = {
  /** Obligatoire : le bouton n'a pas de texte visible. */
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  disabled?: boolean;
};

export function IconButton({ accessibilityLabel, onPress, children, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.bouton, pressed && styles.presse, disabled && styles.desactive]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    width: sizes.cibleTactile,
    height: sizes.cibleTactile,
    borderRadius: radius.rond,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presse: { opacity: opacity.presse },
  desactive: { opacity: opacity.desactive },
});
