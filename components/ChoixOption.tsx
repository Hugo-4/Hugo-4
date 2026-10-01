import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  titre: string;
  description?: string;
  selectionne: boolean;
  onPress: () => void;
  /** `checkbox` pour un choix multiple, `radio` pour un choix unique. */
  role?: 'radio' | 'checkbox';
  icon?: ReactNode;
};

/** Grande ligne sélectionnable (choix d'un sport, d'un niveau…). */
export function ChoixOption({ titre, description, selectionne, onPress, role = 'radio', icon }: Props) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selectionne }}
      accessibilityLabel={description ? `${titre}, ${description}` : titre}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selectionne && styles.selectionne, pressed && styles.presse]}>
      {icon}
      <View style={styles.textes}>
        <AppText variant="corpsGras">{titre}</AppText>
        {description ? <AppText variant="secondaire">{description}</AppText> : null}
      </View>
      <View style={[styles.coche, selectionne && styles.cocheActive]}>
        {selectionne ? <Check color={colors.surAccent} size={sizes.iconePetite} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.cibleTactile + spacing.m,
    paddingHorizontal: spacing.carte,
    paddingVertical: spacing.m,
    borderRadius: radius.bouton,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte,
  },
  selectionne: { borderColor: colors.accent, borderWidth: sizes.bordureForte },
  presse: { opacity: opacity.presse },
  textes: { flex: 1, gap: spacing.xxs },
  coche: {
    width: sizes.icone + spacing.xs,
    height: sizes.icone + spacing.xs,
    borderRadius: radius.rond,
    borderWidth: sizes.bordureForte,
    borderColor: colors.discret,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cocheActive: { backgroundColor: colors.accent, borderColor: colors.accent },
});
