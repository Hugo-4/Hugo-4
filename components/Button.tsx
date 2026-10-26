import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Variant = 'principal' | 'secondaire' | 'discret' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const couleurTexte: Record<Variant, string> = {
  principal: colors.surAccent,
  secondaire: colors.texte,
  discret: colors.accent,
  danger: colors.danger,
};

export function Button({ label, onPress, variant = 'principal', icon, disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.presse,
        disabled && styles.desactive,
        style,
      ]}>
      {icon ? <View>{icon}</View> : null}
      <AppText variant="bouton" color={couleurTexte[variant]} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.cibleTactile + spacing.xs,
    borderRadius: radius.bouton,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
  },
  principal: { backgroundColor: colors.accent, minHeight: sizes.boutonPrincipal },
  secondaire: { backgroundColor: colors.carte2, borderWidth: sizes.bordure, borderColor: colors.bordureChamp },
  discret: { backgroundColor: 'transparent', minHeight: sizes.cibleTactile, paddingHorizontal: spacing.s },
  danger: { backgroundColor: 'transparent', borderWidth: sizes.bordure, borderColor: colors.danger },
  presse: { opacity: opacity.presse },
  desactive: { opacity: opacity.desactive },
  label: { textTransform: 'uppercase' },
});
