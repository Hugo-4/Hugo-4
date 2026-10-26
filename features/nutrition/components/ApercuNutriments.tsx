import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import type { Nutriments } from '../types';

/** Ce que la portion apporte (règle de trois sur les valeurs pour 100 g de la base). */
export function ApercuNutriments({ nutriments }: { nutriments: Nutriments }) {
  const { t } = useTranslation();
  const valeurs = [
    { cle: 'calories', libelle: t('nutrition.calories'), valeur: nutriments.calories, unite: t('nutrition.kcal') },
    { cle: 'proteines', libelle: t('nutrition.proteines'), valeur: nutriments.proteines_g, unite: t('nutrition.g') },
    { cle: 'glucides', libelle: t('nutrition.glucides'), valeur: nutriments.glucides_g, unite: t('nutrition.g') },
    { cle: 'lipides', libelle: t('nutrition.lipides'), valeur: nutriments.lipides_g, unite: t('nutrition.g') },
  ];
  return (
    <View style={styles.ligne}>
      {valeurs.map((v) => (
        <View key={v.cle} style={styles.valeur}>
          <AppText variant="libelle">{v.libelle}</AppText>
          <AppText variant="corpsGras">{t('nutrition.valeurUnite', { valeur: formatQuantite(v.valeur), unite: v.unite })}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  valeur: { flexGrow: 1, gap: spacing.xxs, backgroundColor: colors.carte2, borderRadius: radius.petit, padding: spacing.m },
});
