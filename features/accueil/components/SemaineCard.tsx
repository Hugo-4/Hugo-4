import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { spacing } from '@/theme/tokens';

import type { Semaine } from '../types';
import { ChargeGauge } from './ChargeGauge';
import { JourPastille } from './JourPastille';

type Props = {
  semaine: Semaine;
  onVoirMois: () => void;
};

export function SemaineCard({ semaine, onVoirMois }: Props) {
  const { t } = useTranslation();
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
      <ChargeGauge niveau={semaine.charge.niveau} position={semaine.charge.position} />
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  jours: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
});
