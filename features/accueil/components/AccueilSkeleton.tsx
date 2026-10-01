import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

/** Squelette affiché pendant le chargement de l'écran Aujourd'hui. */
export function AccueilSkeleton() {
  return (
    <View style={styles.conteneur} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.entete}>
        <View style={styles.texte}>
          <Skeleton hauteur={spacing.m} largeur="40%" />
          <Skeleton hauteur={spacing.xxl + spacing.xs} largeur="70%" />
        </View>
        <Skeleton hauteur={sizes.avatar} largeur={sizes.avatar} arrondi={radius.rond} />
      </View>
      <Skeleton hauteur={sizes.anneauForme + spacing.xxxl * 2} arrondi={radius.carte} />
      <Skeleton hauteur={sizes.anneauForme * 3} arrondi={radius.carte} />
      <Skeleton hauteur={sizes.anneauForme + spacing.xxxl} arrondi={radius.carte} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { padding: spacing.ecran, gap: spacing.entreCartes },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.s },
});
