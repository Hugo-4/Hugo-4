import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  titre: string;
  sousTitre?: string;
  /** Valeur à droite (ex. « 3 », « Activé »). */
  valeur?: string;
  icon?: ReactNode;
  onPress?: () => void;
  /** Lu en plus du titre (ex. « bientôt disponible »). */
  accessibilityHint?: string;
};

/** Ligne de liste tactile (≥ 48 px) : icône, titre, sous-titre, valeur, chevron si elle ouvre quelque chose. */
export function LigneListe({ titre, sousTitre, valeur, icon, onPress, accessibilityHint }: Props) {
  const contenu = (
    <>
      {icon}
      <View style={styles.texte}>
        <AppText variant="corpsGras">{titre}</AppText>
        {sousTitre ? <AppText variant="secondaire">{sousTitre}</AppText> : null}
      </View>
      {valeur ? <AppText variant="secondaire">{valeur}</AppText> : null}
      {onPress ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
    </>
  );
  if (!onPress) {
    return (
      <View style={styles.ligne} accessible accessibilityHint={accessibilityHint}>
        {contenu}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.pasAPas,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: radius.petit,
    backgroundColor: colors.carte,
  },
  texte: { flex: 1, gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});
