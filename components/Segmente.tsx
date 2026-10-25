import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Option<T extends string> = { valeur: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  valeur: T;
  onChange: (valeur: T) => void;
  accessibilityLabel: string;
};

/** Bascule à 2 ou 3 choix (ex. « Exercice » / « Toute la séance »). */
export function Segmente<T extends string>({ options, valeur, onChange, accessibilityLabel }: Props<T>) {
  return (
    <View style={styles.piste} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const actif = option.valeur === valeur;
        return (
          <Pressable
            key={option.valeur}
            accessibilityRole="radio"
            accessibilityState={{ checked: actif }}
            onPress={() => onChange(option.valeur)}
            style={({ pressed }) => [styles.option, actif && styles.active, pressed && styles.presse]}>
            <AppText variant="corpsGras" color={actif ? colors.surAccent : colors.texte2}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piste: {
    flexDirection: 'row',
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    minHeight: sizes.cibleTactile,
    borderRadius: radius.petit - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.accent },
  presse: { opacity: opacity.presse },
});
