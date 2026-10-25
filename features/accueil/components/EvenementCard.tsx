import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { CompteARebours } from '@/components/CompteARebours';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Accueil } from '../types';

type Props = { evenement: NonNullable<Accueil['prochain_evenement']>; aujourdhui: string };

/**
 * Prochain objectif : compte à rebours lisible et la date en dessous.
 * Toucher la carte ouvrira l'événement quand l'écran existera (étape 7, Programme).
 */
export function EvenementCard({ evenement, aujourdhui }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
        <View style={styles.texte}>
          <AppText variant="surTitre">{t('accueil.evenement.titre')}</AppText>
          <AppText variant="corpsGras">{evenement.nom}</AppText>
        </View>
        <CompteARebours jours={evenement.jours_restants} date={evenement.date} aujourdhui={aujourdhui} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.xxs },
});
