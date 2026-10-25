import { ArrowUp } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors, opacity, radius, sizes } from '@/theme/tokens';

import { CIBLE } from './dimensions';

type Props = {
  accessibilityLabel: string;
  onPress: () => void;
  desactive: boolean;
};

/**
 * Bouton « Envoyer » (icône seule, 48 × 48, accent). `components/IconButton` n'a pas d'état désactivé :
 * ce bouton l'ajoute (aspect et `accessibilityState`) tant que le champ est vide ou que le coach répond.
 */
export function BoutonEnvoyer({ accessibilityLabel, onPress, desactive }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: desactive }}
      disabled={desactive}
      onPress={onPress}
      style={({ pressed }) => [styles.bouton, desactive && styles.desactive, pressed && styles.presse]}>
      <ArrowUp color={desactive ? colors.discret : colors.surAccent} size={sizes.icone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    width: CIBLE,
    height: CIBLE,
    borderRadius: radius.rond,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desactive: { backgroundColor: colors.carte2 },
  presse: { opacity: opacity.presse },
});
