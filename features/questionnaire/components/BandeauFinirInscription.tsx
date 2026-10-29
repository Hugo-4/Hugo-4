import { router } from 'expo-router';
import { ChevronRight, ClipboardList } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { useQuestionnaire } from '../useQuestionnaire';

/**
 * « Finir mon inscription · 35 % » (Aujourd'hui et Profil) : visible tant qu'il reste des questions du
 * questionnaire complet, il ouvre la liste des blocs. Rien ne s'affiche pendant le chargement ou en cas d'erreur.
 */
export function BandeauFinirInscription() {
  const { t } = useTranslation();
  const q = useQuestionnaire();
  if (!q.pret || q.reste === 0) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('questionnaire.bandeau.a11y', { pct: q.pourcentage })}
      onPress={() => router.push('/questionnaire')}
      style={({ pressed }) => [styles.carte, pressed && styles.presse]}>
      <View style={styles.ligne}>
        <ClipboardList color={colors.accent} size={sizes.icone} />
        <View style={styles.textes}>
          <AppText variant="corpsGras">{t('questionnaire.bandeau.titre')}</AppText>
          <AppText variant="secondaire">{t('questionnaire.bandeau.texte', { pct: q.pourcentage })}</AppText>
        </View>
        <ChevronRight color={colors.discret} size={sizes.icone} />
      </View>
      <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <ProgressBar progression={q.pourcentage / 100} accessibilityLabel={t('questionnaire.pourcentage', { pct: q.pourcentage })} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    gap: spacing.m,
    padding: spacing.carte,
    borderRadius: radius.carte,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.accent,
  },
  presse: { opacity: opacity.presse },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  textes: { flex: 1, gap: spacing.xxs },
});
