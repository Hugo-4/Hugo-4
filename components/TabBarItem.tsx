import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  label: string;
  actif: boolean;
  onPress: () => void;
  renderIcon: (couleur: string) => ReactNode;
};

export function TabBarItem({ label, actif, onPress, renderIcon }: Props) {
  const couleur = actif ? colors.accent : colors.discret;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: actif }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.onglet, pressed && styles.presse]}>
      {renderIcon(couleur)}
      <AppText variant="libelle" color={couleur} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  onglet: {
    flex: 1,
    minHeight: sizes.cibleTactile,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  presse: { opacity: opacity.presse },
});
