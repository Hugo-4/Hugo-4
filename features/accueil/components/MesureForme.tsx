import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

type Props = {
  libelle: string;
  valeur: string;
  detail?: string;
};

/** Une ligne « Sommeil  7 h 42 » de la carte Forme du jour. */
export function MesureForme({ libelle, valeur, detail }: Props) {
  return (
    <View style={styles.ligne}>
      <AppText variant="libelle" style={styles.libelle}>
        {libelle}
      </AppText>
      <AppText variant="corpsGras">{valeur}</AppText>
      {detail ? <AppText variant="libelle">{detail}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s, flexWrap: 'wrap' },
  libelle: { minWidth: spacing.xxxl * 2 },
});
