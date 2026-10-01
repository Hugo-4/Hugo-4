import { Pressable, StyleSheet } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  label: string;
  selectionne: boolean;
  onPress: () => void;
  role?: 'radio' | 'checkbox';
  accessibilityLabel?: string;
};

/** Puce sélectionnable (jours, créneaux, zones…). */
export function Chip({ label, selectionne, onPress, role = 'checkbox', accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selectionne }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.puce, selectionne && styles.selectionnee, pressed && styles.presse]}>
      <AppText variant="corpsGras" color={selectionne ? colors.surAccent : colors.texte}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  puce: {
    minHeight: sizes.cibleTactile,
    minWidth: sizes.cibleTactile,
    paddingHorizontal: spacing.l,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionnee: { backgroundColor: colors.accent, borderColor: colors.accent },
  presse: { opacity: opacity.presse },
});
