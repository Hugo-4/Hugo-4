import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

/** Chargement de l'onglet Programme : objectif, frise des blocs, calendrier, chiffres du mois. */
export function ProgrammeSquelette() {
  return (
    <View style={styles.bloc} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton hauteur={sizes.anneauForme * 0.8} arrondi={radius.carte} />
      <View style={styles.frise}>
        <Skeleton hauteur={sizes.graphique * 0.75} largeur="48%" arrondi={radius.carte} />
        <Skeleton hauteur={sizes.graphique * 0.75} largeur="48%" arrondi={radius.carte} />
      </View>
      <Skeleton hauteur={sizes.graphique * 2.5} arrondi={radius.carte} />
      <Skeleton hauteur={sizes.anneauForme * 0.8} arrondi={radius.carte} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.entreCartes },
  frise: { flexDirection: 'row', justifyContent: 'space-between' },
});
