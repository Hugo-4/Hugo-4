import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Feuille } from '@/components/Feuille';
import { formatDateEvenement, formatNombre } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import type { CreditsCoach } from '../types';

type Props = {
  visible: boolean;
  credits: CreditsCoach;
  onFermer: () => void;
};

/** Explication du solde de crédits, avec un lien vers l'abonnement. */
export function FeuilleCredits({ visible, credits, onFermer }: Props) {
  const { t } = useTranslation();
  const voirAbonnement = () => {
    onFermer();
    router.push('/compte/abonnement');
  };
  return (
    <Feuille visible={visible} titre={t('coach.credits.feuilleTitre')} onFermer={onFermer}>
      <View style={styles.solde}>
        <AppText variant="chiffreXL" color={colors.accent}>
          {formatNombre(credits.restant)}
        </AppText>
        <AppText variant="secondaire">{t('coach.credits.surTotal', { total: formatNombre(credits.total) })}</AppText>
      </View>
      <AppText variant="corps">{t('coach.credits.explication')}</AppText>
      <AppText variant="secondaire">
        {t('coach.credits.renouvellement', { date: formatDateEvenement(credits.renouvellement_le) })}
      </AppText>
      <Button label={t('coach.credits.voirAbonnement')} variant="secondaire" onPress={voirAbonnement} />
    </Feuille>
  );
}

const styles = StyleSheet.create({
  solde: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s },
});
