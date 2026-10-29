import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import type { Aliment } from '../types';

/** Valeurs de la base pour 100 g, telles quelles : la base calcule la portion à l'enregistrement. */
export function ApercuNutriments({ aliment, calories }: { aliment: Aliment; calories: boolean }) {
  const { t } = useTranslation();
  const valeurs = [
    ...(calories ? [{ cle: 'calories', libelle: t('nutrition.calories'), valeur: aliment.calories_100g, unite: t('nutrition.kcal') }] : []),
    { cle: 'proteines', libelle: t('nutrition.proteines'), valeur: aliment.proteines_100g, unite: t('nutrition.g') },
    { cle: 'glucides', libelle: t('nutrition.glucides'), valeur: aliment.glucides_100g, unite: t('nutrition.g') },
    { cle: 'lipides', libelle: t('nutrition.lipides'), valeur: aliment.lipides_100g, unite: t('nutrition.g') },
  ];
  return (
    <View style={styles.bloc}>
      <AppText variant="libelle">{t('nutrition.ajout.pour100g')}</AppText>
      <View style={styles.ligne}>
        {valeurs.map((v) => (
          <View key={v.cle} style={styles.valeur}>
            <AppText variant="libelle">{v.libelle}</AppText>
            <AppText variant="corpsGras">{t('nutrition.valeurUnite', { valeur: formatQuantite(Number(v.valeur ?? 0) || 0), unite: v.unite })}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  valeur: { flexGrow: 1, gap: spacing.xxs, backgroundColor: colors.carte2, borderRadius: radius.petit, padding: spacing.m },
});
