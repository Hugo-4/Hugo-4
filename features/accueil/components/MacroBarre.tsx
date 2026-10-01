import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

type Props = {
  libelle: string;
  /** Part de l'objectif atteinte (0 à 1). */
  valeur: number;
  texte: string;
};

export function MacroBarre({ libelle, valeur, texte }: Props) {
  const borne = Math.min(Math.max(valeur, 0), 1);
  return (
    <View style={styles.bloc} accessible accessibilityLabel={`${libelle}, ${texte}`}>
      <AppText variant="libelle">{libelle}</AppText>
      <View style={styles.piste}>
        <View style={[styles.rempli, { width: `${borne * 100}%` }]} />
      </View>
      <AppText variant="secondaire" numberOfLines={1}>
        {texte}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { flex: 1, gap: spacing.xs },
  piste: { height: sizes.jauge / 2 + spacing.xxs, borderRadius: radius.rond, backgroundColor: colors.carte2 },
  rempli: { height: '100%', borderRadius: radius.rond, backgroundColor: colors.accent },
});
