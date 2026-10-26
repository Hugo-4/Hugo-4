import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { HAUTEUR_PUCE, MARGE_TACTILE } from './dimensions';

type Props = {
  label: string;
  onPress: () => void;
  desactive: boolean;
};

/**
 * Puce de réponse rapide : 40 de haut à l'écran, 48 au toucher (FRONTEND.md §4.4 et §5.3).
 * `components/Chip` est une puce de sélection (case à cocher) : ici c'est une action, d'où ce composant.
 */
export function PuceReponse({ label, onPress, desactive }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desactive }}
      disabled={desactive}
      onPress={onPress}
      hitSlop={MARGE_TACTILE}
      style={({ pressed }) => [styles.puce, pressed && styles.presse, desactive && styles.desactive]}>
      <AppText variant="secondaire" color={colors.texte} numberOfLines={1} maxFontSizeMultiplier={multiplicateurMax}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  puce: {
    minHeight: HAUTEUR_PUCE,
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
    borderRadius: radius.rond,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte2,
  },
  presse: { opacity: opacity.presse },
  desactive: { opacity: opacity.desactive },
});
