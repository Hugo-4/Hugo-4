import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

/** Chargement de la séance (démarrage par le serveur). */
export function SeanceSkeleton() {
  return (
    <View style={styles.contenu}>
      <Skeleton hauteur={sizes.cibleTactile} />
      <Skeleton hauteur={sizes.cibleTactile} />
      <Skeleton hauteur={sizes.anneauForme * 2} />
      <Skeleton hauteur={sizes.boutonSeance} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.l },
});
