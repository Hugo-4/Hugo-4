import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { sizes, spacing } from '@/theme/tokens';

import { formatDateJour } from '../format';
import type { SemaineRegularite } from '../types';
import { PastilleSemaine } from './PastilleSemaine';

/** Détail semaine par semaine (la plus récente en haut) : statut et séances faites / prévues. Des faits, pas de jugement. */
export function ListeSemainesRegularite({ semaines }: { semaines: SemaineRegularite[] }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.regularite.detail')}</AppText>
      {[...semaines].reverse().map((s) => (
        <View key={s.debut} style={styles.ligne} accessible>
          <PastilleSemaine statut={s.statut} petite />
          <View style={styles.textes}>
            <AppText variant="corpsGras">{t('progres.regularite.semaineDu', { date: formatDateJour(s.debut) })}</AppText>
            <AppText variant="libelle">{t(`progres.regularite.statut.${s.statut}`)}</AppText>
          </View>
          {s.prevues > 0 ? (
            <AppText variant="secondaire">{t('progres.regularite.seancesFaites', { faites: s.faites, prevues: s.prevues })}</AppText>
          ) : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  textes: { flex: 1, gap: spacing.xxs },
});
