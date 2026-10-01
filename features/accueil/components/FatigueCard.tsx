import { TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Fatigue } from '../types';

type Props = {
  fatigue: Fatigue;
  onAccepter: (adaptationId: string) => void;
  onRefuser: (adaptationId: string) => void;
};

export function FatigueCard({ fatigue, onAccepter, onRefuser }: Props) {
  const { t } = useTranslation();
  const { proposition, seanceRemplacee } = fatigue;
  return (
    <Card borderColor={colors.alerte}>
      <View style={styles.titre}>
        <TriangleAlert color={colors.alerte} size={sizes.icone} />
        <AppText variant="surTitre" color={colors.alerte}>
          {t('accueil.fatigue.titre')}
        </AppText>
      </View>
      <AppText variant="corps">{fatigue.message}</AppText>
      {seanceRemplacee ? (
        <AppText variant="secondaire">
          {t('accueil.fatigue.remplacee', { avant: seanceRemplacee.avant, apres: seanceRemplacee.apres })}
        </AppText>
      ) : null}
      {proposition ? (
        <View style={styles.boutons}>
          <Button label={t('accueil.fatigue.alleger')} onPress={() => onAccepter(proposition.id)} />
          <Button
            label={t('accueil.fatigue.garder')}
            variant="secondaire"
            onPress={() => onRefuser(proposition.id)}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  titre: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  boutons: { gap: spacing.s },
});
