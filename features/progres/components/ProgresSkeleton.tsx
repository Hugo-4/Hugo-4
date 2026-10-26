import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

type Props = {
  /** Nombre de blocs (cartes) à simuler. */
  blocs?: number;
};

/** Squelette pendant le premier chargement (vue d'ensemble ou vue de détail). */
export function ProgresSkeleton({ blocs = 4 }: Props) {
  return (
    <View style={styles.conteneur} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: blocs }, (_, i) => (
        <Skeleton key={i} hauteur={i === 0 ? sizes.graphique + spacing.xxxl : sizes.graphique / 2 + spacing.xxxl} arrondi={radius.carte} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { gap: spacing.entreCartes },
});
