import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes } from '@/theme/tokens';

/** Point orange posé sur une icône (proposition en attente, réglage manquant). Décoratif : le libellé porte l'info. */
export function PointBadge() {
  return <View style={styles.point} accessibilityElementsHidden importantForAccessibility="no" />;
}

const styles = StyleSheet.create({
  point: {
    position: 'absolute',
    top: 0,
    right: -sizes.badge / 2,
    width: sizes.badge,
    height: sizes.badge,
    borderRadius: radius.rond,
    backgroundColor: colors.alerte,
  },
});
