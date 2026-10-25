import { StyleSheet, Switch, View } from 'react-native';

import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  libelle: string;
  aide?: string;
  valeur: boolean;
  onChange: (valeur: boolean) => void;
  desactive?: boolean;
};

/** Réglage oui / non avec son libellé ; toute la ligne fait au moins 48 px. */
export function Interrupteur({ libelle, aide, valeur, onChange, desactive }: Props) {
  return (
    <View style={styles.ligne}>
      <View style={styles.texte}>
        <AppText variant="corpsGras">{libelle}</AppText>
        {aide ? <AppText variant="secondaire">{aide}</AppText> : null}
      </View>
      <Switch
        accessibilityLabel={libelle}
        value={valeur}
        onValueChange={onChange}
        disabled={desactive}
        trackColor={{ false: colors.ligne, true: colors.accent }}
        thumbColor={colors.texte}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  texte: { flex: 1, gap: spacing.xxs },
});
