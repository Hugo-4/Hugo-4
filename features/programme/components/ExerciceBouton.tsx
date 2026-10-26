import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { prescription } from '@/features/accueil/presentation';
import type { ExercicePresente } from '@/features/accueil/types';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

type Props = { exercice: ExercicePresente; onPress: (slug: string) => void };

/** Exercice et sa prescription (« 4 × 5 · 120 kg · RIR 2 ») ; toucher ouvre la fiche technique. */
export function ExerciceBouton({ exercice, onPress }: Props) {
  const { t } = useTranslation();
  const texte = prescription(exercice);
  const slug = exercice.exercice.slug;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[exercice.exercice.nom, texte].filter(Boolean).join(', ')}
      accessibilityHint={t('programme.seance.a11yFiche')}
      disabled={!slug}
      onPress={() => onPress(slug)}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
      <View style={styles.texte}>
        <AppText variant="corpsGras">{exercice.exercice.nom}</AppText>
        {texte ? <AppText variant="secondaire">{texte}</AppText> : null}
      </View>
      {slug ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.pasAPas,
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  texte: { flex: 1, gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});
