import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { formatDateEvenement } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import type { CreditsCoach } from '../types';

/** Plus de crédits : à la place de la saisie, l'explication et le chemin vers l'abonnement (FRONTEND.md §6). */
export function BlocCreditsEpuises({ credits }: { credits: CreditsCoach }) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc} accessibilityRole="summary">
      <AppText variant="corpsGras">{t('coach.credits.epuisesTitre')}</AppText>
      <AppText variant="secondaire">
        {t('coach.credits.epuisesTexte', { date: formatDateEvenement(credits.renouvellement_le) })}
      </AppText>
      <Button label={t('coach.credits.voirAbonnement')} variant="secondaire" onPress={() => router.push('/compte/abonnement')} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});
