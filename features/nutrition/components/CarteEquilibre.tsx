import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import type { equilibre } from '../calcul';
import { formatQuantite } from '../format';
import type { Nutriments } from '../types';

type Props = { total: Nutriments; parts: ReturnType<typeof equilibre> };

const COULEURS = { glucides: colors.accent, proteines: colors.info, lipides: colors.vigilance } as const;

/** Part des glucides, protéines et lipides dans les calories notées, puis fibres et sucres. */
export function CarteEquilibre({ total, parts }: Props) {
  const { t } = useTranslation();
  const cles = ['glucides', 'proteines', 'lipides'] as const;
  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.equilibre.titre')}</AppText>
      {parts ? (
        <>
          <View
            style={styles.barre}
            accessible
            accessibilityLabel={cles.map((c) => t('nutrition.equilibre.part', { nom: t(`nutrition.${c}`), pct: parts[c] })).join(', ')}>
            {cles.map((c) => (parts[c] > 0 ? <View key={c} style={{ flex: parts[c], backgroundColor: COULEURS[c] }} /> : null))}
          </View>
          <View style={styles.legende}>
            {cles.map((c) => (
              <View key={c} style={styles.element}>
                <View style={[styles.pastille, { backgroundColor: COULEURS[c] }]} />
                <AppText variant="secondaire">{t('nutrition.equilibre.part', { nom: t(`nutrition.${c}`), pct: parts[c] })}</AppText>
              </View>
            ))}
          </View>
        </>
      ) : (
        <AppText variant="secondaire">{t('nutrition.equilibre.vide')}</AppText>
      )}
      <AppText variant="libelle">
        {t('nutrition.equilibre.fibresSucres', { fibres: formatQuantite(total.fibres_g), sucres: formatQuantite(total.sucres_g) })}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  barre: { flexDirection: 'row', height: sizes.jauge * 2, borderRadius: radius.rond, overflow: 'hidden', backgroundColor: colors.carte2 },
  legende: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  element: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pastille: { width: spacing.m, height: spacing.m, borderRadius: radius.rond },
});
