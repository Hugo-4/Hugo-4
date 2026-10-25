import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { sizes, spacing } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import { libelleProgression } from '../presentation';
import type { Progression } from '../types';

/** 1RM estimé par exercice d'après les séances (`GET /progressions`) : valeurs et tendance du serveur. */
export function ListeProgressions({ progressions }: { progressions: Progression[] }) {
  const { t } = useTranslation();
  if (progressions.length === 0) return null;
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.tests.e1rmTitre')}</AppText>
      <AppText variant="libelle">{t('progres.tests.e1rmTexte')}</AppText>
      {progressions.map((p) => {
        const details = [
          libelleProgression(p.tendance),
          p.derniere_seance_date ? t('progres.tests.derniereSeance', { date: formatDateJour(p.derniere_seance_date) }) : null,
        ].filter(Boolean);
        return (
          <View key={p.exercices?.slug} style={styles.ligne}>
            <View style={styles.textes}>
              <AppText variant="corpsGras">{p.exercices?.nom}</AppText>
              {details.length ? <AppText variant="libelle">{details.join(' · ')}</AppText> : null}
            </View>
            <AppText variant="chiffre" maxFontSizeMultiplier={1.3}>
              {formatValeur(Number(p.e1rm_recent ?? p.one_rep_max_kg), 'kg')}
            </AppText>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  textes: { flex: 1, gap: spacing.xxs },
});
