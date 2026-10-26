import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, fontSizes, opacity, radius, sizes, spacing } from '@/theme/tokens';

import type { Avis } from '../types';
import { useAvis } from '../useAvis';
import { CIBLE } from './dimensions';

type Props = { messageId: string; avis: Avis };

/** 👍 / 👎 sous une réponse du coach ; toucher le choix actif le retire. */
export function BoutonsAvis({ messageId, avis }: Props) {
  const { t } = useTranslation();
  const vote = useAvis();
  const choix = [
    { valeur: 1 as const, emoji: t('coach.avis.utile'), libelle: t('coach.avis.a11yUtile') },
    { valeur: -1 as const, emoji: t('coach.avis.pasUtile'), libelle: t('coach.avis.a11yPasUtile') },
  ];
  return (
    <View style={styles.ligne}>
      {choix.map(({ valeur, emoji, libelle }) => {
        const actif = avis === valeur;
        return (
          <Pressable
            key={valeur}
            accessibilityRole="button"
            accessibilityLabel={libelle}
            accessibilityState={{ selected: actif }}
            onPress={() => vote.mutate({ messageId, avis: actif ? null : valeur })}
            style={({ pressed }) => [styles.bouton, actif && styles.actif, pressed && styles.presse]}>
            <AppText style={styles.emoji}>{emoji}</AppText>
          </Pressable>
        );
      })}
      {vote.isError ? (
        <AppText variant="libelle" color={colors.alerte} accessibilityLiveRegion="polite" style={styles.erreur}>
          {t('coach.avis.erreur')}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  bouton: {
    width: CIBLE,
    height: CIBLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.rond,
    borderWidth: sizes.bordure,
    borderColor: 'transparent',
  },
  actif: { backgroundColor: colors.carte2, borderColor: colors.accent },
  presse: { opacity: opacity.presse },
  emoji: { fontSize: fontSizes.l },
  erreur: { flexShrink: 1 },
});
