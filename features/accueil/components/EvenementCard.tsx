import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Accueil } from '../types';

/** Prochaine compétition ou objectif daté, avec le compte à rebours renvoyé par le serveur. */
export function EvenementCard({ evenement }: { evenement: NonNullable<Accueil['prochain_evenement']> }) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
        <View style={styles.texte}>
          <AppText variant="surTitre">{t('accueil.evenement.titre')}</AppText>
          <AppText variant="corpsGras">{evenement.nom}</AppText>
        </View>
        <AppText variant="chiffre" color={colors.accent}>
          {t('accueil.evenement.jours', { count: evenement.jours_restants })}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.xxs },
});
