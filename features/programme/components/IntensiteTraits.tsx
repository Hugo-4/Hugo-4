import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type Props = {
  /** 1 à 5. */
  niveau: number;
  /** Couleur des traits pleins (texte posé sur l'accent pour une case « faite »). */
  couleur?: string;
};

const NIVEAUX = [1, 2, 3, 4, 5];

/**
 * Intensité 1-5 lisible sans couleur : autant de traits pleins que le niveau, les autres en creux.
 * Décoratif pour le lecteur d'écran : le libellé de la case dit « intensité 4 sur 5 : Difficile ».
 */
export function IntensiteTraits({ niveau, couleur = colors.texte2 }: Props) {
  return (
    <View style={styles.ligne} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {NIVEAUX.map((n) => (
        <View key={n} style={[styles.trait, { backgroundColor: n <= niveau ? couleur : colors.ligne }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', gap: spacing.xxs, height: spacing.xs },
  trait: { width: spacing.xs, height: spacing.xs, borderRadius: radius.rond },
});
