import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import type { StatsMois as Stats } from '../types';

/** Chiffres du mois calculés par le serveur : séances prévues, faites, assiduité. */
export function StatsMois({ stats }: { stats: Stats }) {
  const { t } = useTranslation();
  const assiduite =
    stats.assiduite_pct === null ? t('programme.stats.inconnue') : t('programme.stats.pourcent', { valeur: formatNombre(stats.assiduite_pct) });
  const chiffres = [
    { cle: 'prevues', valeur: formatNombre(stats.seances_prevues), libelle: t('programme.stats.prevues') },
    { cle: 'faites', valeur: formatNombre(stats.faites), libelle: t('programme.stats.faites') },
    { cle: 'assiduite', valeur: assiduite, libelle: t('programme.stats.assiduite') },
  ];
  return (
    <Card>
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.stats.titre')}
      </AppText>
      <View style={styles.ligne}>
        {chiffres.map((c) => (
          <View key={c.cle} style={styles.chiffre} accessible accessibilityLabel={t('programme.stats.a11y', { libelle: c.libelle, valeur: c.valeur })}>
            <AppText variant="chiffre">{c.valeur}</AppText>
            <AppText variant="libelle">{c.libelle}</AppText>
          </View>
        ))}
      </View>
      {stats.assiduite_pct === null ? <AppText variant="libelle">{t('programme.stats.assiduiteAide')}</AppText> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', gap: spacing.m },
  chiffre: { flex: 1, gap: spacing.xxs },
});
