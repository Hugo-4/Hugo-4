import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { sizes, spacing } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import type { ChargeSemaines } from '../types';

/** Détail semaine par semaine (la plus récente en haut) : charge et nombre de séances. */
export function ListeSemainesCharge({ charge }: { charge: ChargeSemaines }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.charge.detailSemaines')}</AppText>
      {[...charge.semaines].reverse().map((semaine) => (
        <View key={semaine.debut} style={styles.ligne} accessible>
          <AppText variant="corpsGras" style={styles.date}>
            {t(semaine.en_cours ? 'progres.charge.semaineEnCours' : 'progres.charge.semaineDu', { date: formatDateJour(semaine.debut) })}
          </AppText>
          <AppText variant="secondaire">
            {t('progres.charge.ligneSemaine', {
              valeur: formatValeur(semaine.charge, charge.unite),
              seances: t('progres.charge.seances', { count: semaine.seances }),
            })}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  date: { flex: 1 },
});
