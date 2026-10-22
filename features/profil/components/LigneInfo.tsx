import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme/tokens';

type Props = {
  libelle: string;
  valeur: string;
  couleur?: string;
};

export function LigneInfo({ libelle, valeur, couleur }: Props) {
  return (
    <View style={styles.ligne}>
      <AppText variant="libelle">{libelle}</AppText>
      <AppText variant="corpsGras" color={couleur ?? colors.texte} style={styles.valeur}>
        {valeur}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.m },
  valeur: { flexShrink: 1, textAlign: 'right' },
});
