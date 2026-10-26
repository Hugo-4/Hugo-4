import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { colors, radius, spacing } from '@/theme/tokens';

const REPERES = ['legumes', 'feculents', 'proteines', 'eau'] as const;
const COULEURS = { legumes: colors.accent, feculents: colors.vigilance, proteines: colors.info, eau: colors.texte2 } as const;

/** Repères d'assiette, affichés à la place des calories (masquées par défaut avant 18 ans). */
export function CarteReperesAssiette() {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.assiette.titre')}</AppText>
      {REPERES.map((r) => (
        <View key={r} style={styles.ligne}>
          <View style={[styles.pastille, { backgroundColor: COULEURS[r] }]} />
          <AppText variant="secondaire" style={styles.texte}>
            {t(`nutrition.assiette.${r}`)}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  pastille: { width: spacing.m, height: spacing.m, borderRadius: radius.rond },
  texte: { flex: 1 },
});
