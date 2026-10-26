import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

/** Chargement du détail d'une séance : en-tête, actions, exercices. */
export function SeanceDetailSquelette() {
  return (
    <View style={styles.bloc} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton hauteur={sizes.anneauForme * 1.2} arrondi={radius.carte} />
      <Skeleton hauteur={sizes.pasAPas} />
      <Skeleton hauteur={sizes.pasAPas} />
      <Skeleton hauteur={sizes.graphique * 1.5} arrondi={radius.carte} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { padding: spacing.ecran, gap: spacing.entreCartes },
});
