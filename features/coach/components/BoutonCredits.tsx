import { Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { formatNombre } from '@/lib/format';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import type { CreditsCoach } from '../types';
import { creditsBas, creditsEpuises } from '../useCredits';
import { CIBLE } from './dimensions';
import { FeuilleCredits } from './FeuilleCredits';

/** Solde de crédits dans l'en-tête ; le toucher ouvre l'explication. Rien tant que le solde n'est pas connu. */
export function BoutonCredits({ credits }: { credits: CreditsCoach | undefined }) {
  const { t } = useTranslation();
  const [ouverte, setOuverte] = useState(false);
  if (!credits) return null;
  const faible = creditsBas(credits) || creditsEpuises(credits);
  const couleur = faible ? colors.alerte : colors.texte;
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('coach.credits.a11ySolde', { count: credits.restant, total: credits.total })}
        accessibilityHint={t('coach.credits.a11yIndice')}
        onPress={() => setOuverte(true)}
        style={({ pressed }) => [styles.bouton, pressed && styles.presse]}>
        <Zap color={couleur} size={sizes.iconePetite} />
        <AppText variant="corpsGras" color={couleur}>
          {formatNombre(credits.restant)}
        </AppText>
      </Pressable>
      <FeuilleCredits visible={ouverte} credits={credits} onFermer={() => setOuverte(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  bouton: {
    minHeight: CIBLE,
    minWidth: CIBLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: radius.rond,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte,
  },
  presse: { opacity: opacity.presse },
});
