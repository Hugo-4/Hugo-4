import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  libelle: string;
  aide?: string;
  valeur: boolean;
  onChange: (valeur: boolean) => void;
  desactive?: boolean;
};

/** Réglage oui / non avec son libellé : toute la ligne (au moins 48 px) bascule le réglage. */
export function Interrupteur({ libelle, aide, valeur, onChange, desactive }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={libelle}
      accessibilityHint={aide}
      accessibilityState={{ checked: valeur, disabled: desactive }}
      disabled={desactive}
      onPress={() => onChange(!valeur)}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
      <View style={styles.texte}>
        <AppText variant="corpsGras">{libelle}</AppText>
        {aide ? <AppText variant="secondaire">{aide}</AppText> : null}
      </View>
      <Switch
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        value={valeur}
        onValueChange={onChange}
        disabled={desactive}
        trackColor={{ false: colors.ligne, true: colors.accent }}
        thumbColor={colors.texte}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.cibleTactile },
  texte: { flex: 1, gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});
