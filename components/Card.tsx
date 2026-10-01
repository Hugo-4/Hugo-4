import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, sizes, spacing } from '@/theme/tokens';

type Props = ViewProps & {
  /** Bordure de couleur (ex. orange pour la fatigue). */
  borderColor?: string;
};

export function Card({ borderColor, style, ...rest }: Props) {
  return (
    <View
      style={[styles.card, borderColor ? { borderColor, borderWidth: sizes.bordureForte } : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.carte,
    borderRadius: radius.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    padding: spacing.carte,
    gap: spacing.m,
  },
});
