import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { spacing } from '@/theme/tokens';

import type { Accueil } from '../types';
import { JourPastille } from './JourPastille';

type Props = {
  semaine: Accueil['semaine'];
  onVoirMois: () => void;
};

export function SemaineCard({ semaine, onVoirMois }: Props) {
  const { t } = useTranslation();
  const { stats } = semaine;
  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre">{t('accueil.semaine.titre')}</AppText>
        <Button label={t('accueil.semaine.voirMois')} variant="discret" onPress={onVoirMois} />
      </View>
      <View style={styles.jours}>
        {semaine.jours.map((jour) => (
          <JourPastille key={jour.date} jour={jour} />
        ))}
      </View>
      <AppText variant="secondaire">
        {t('accueil.semaine.stats', { faites: stats.faites, prevues: stats.prevues, minutes: stats.minutes_prevues })}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  jours: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
});
