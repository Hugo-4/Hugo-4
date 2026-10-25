import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

/** Squelette de la conversation : bulles du coach à gauche, de l'athlète à droite. */
const BULLES = [
  { cote: 'gauche', largeur: '75%', lignes: 3 },
  { cote: 'droite', largeur: '55%', lignes: 1 },
  { cote: 'gauche', largeur: '80%', lignes: 4 },
  { cote: 'droite', largeur: '45%', lignes: 1 },
] as const;

export function SqueletteMessages() {
  return (
    <View style={styles.liste} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {BULLES.map((b, i) => (
        <View key={i} style={[b.cote === 'droite' ? styles.droite : styles.gauche, { width: b.largeur }]}>
          <Skeleton hauteur={b.lignes * sizes.cibleTactile - spacing.l} arrondi={radius.bouton} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { flex: 1, justifyContent: 'flex-end', gap: spacing.l, paddingVertical: spacing.l },
  gauche: { alignSelf: 'flex-start' },
  droite: { alignSelf: 'flex-end' },
});
