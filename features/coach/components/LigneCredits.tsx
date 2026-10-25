import { Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { formatDateEvenement } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { CreditsCoach } from '../types';

/** Ligne discrète quand il reste moins de 20 % des crédits du mois. */
export function LigneCredits({ credits }: { credits: CreditsCoach }) {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne}>
      <Zap color={colors.alerte} size={sizes.iconePetite} />
      <AppText variant="libelle" color={colors.texte2} style={styles.texte}>
        {t('coach.credits.bas', { count: credits.restant, date: formatDateEvenement(credits.renouvellement_le) })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  texte: { flexShrink: 1 },
});
