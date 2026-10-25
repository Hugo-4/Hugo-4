import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { dateLocale } from '@/lib/format';
import i18n from '@/lib/i18n';
import { colors, sizes, spacing } from '@/theme/tokens';

import { compteARebours } from '../presentation';
import type { Accueil } from '../types';

type Props = { evenement: NonNullable<Accueil['prochain_evenement']>; aujourdhui: string };

/**
 * Prochain objectif : compte à rebours lisible et la date en dessous.
 * Toucher la carte ouvrira l'événement quand l'écran existera (étape 7, Programme).
 */
export function EvenementCard({ evenement, aujourdhui }: Props) {
  const { t } = useTranslation();
  const date = dateLocale(evenement.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Card>
      <View style={styles.ligne}>
        <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
        <View style={styles.texte}>
          <AppText variant="surTitre">{t('accueil.evenement.titre')}</AppText>
          <AppText variant="corpsGras">{evenement.nom}</AppText>
        </View>
        <View style={styles.compte}>
          <AppText variant="chiffre" color={colors.accent}>
            {compteARebours(evenement.jours_restants, evenement.date, aujourdhui)}
          </AppText>
          <AppText variant="libelle" color={colors.texte2}>
            {date}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.xxs },
  compte: { alignItems: 'flex-end', gap: spacing.xxs, flexShrink: 1 },
});
