import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, sizes, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { AppText } from './AppText';
import { PointBadge } from './PointBadge';

type Props = {
  label: string;
  actif: boolean;
  onPress: () => void;
  renderIcon: (couleur: string) => ReactNode;
  /** Point orange (FRONTEND.md §3.1) ; le libellé lu par le lecteur d'écran le précise. */
  badge?: string | null;
};

export function TabBarItem({ label, actif, onPress, renderIcon, badge }: Props) {
  const couleur = actif ? colors.accent : colors.discret;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: actif }}
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.onglet, pressed && styles.presse]}>
      <View>
        {renderIcon(couleur)}
        {badge ? <PointBadge /> : null}
      </View>
      <AppText variant="libelle" color={couleur} numberOfLines={1} maxFontSizeMultiplier={multiplicateurMax}>
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
