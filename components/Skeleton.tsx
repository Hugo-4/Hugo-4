import { useEffect } from 'react';
import { type DimensionValue, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius } from '@/theme/tokens';

type Props = {
  hauteur: number;
  largeur?: DimensionValue;
  arrondi?: number;
};

/** Bloc gris qui pulse pendant le chargement. */
export function Skeleton({ hauteur, largeur = '100%', arrondi = radius.petit }: Props) {
  const opacite = useSharedValue(0.5);
  // « Réduire les animations » activé : le bloc reste fixe.
  const mouvementReduit = useReducedMotion();

  useEffect(() => {
    if (mouvementReduit) return;
    opacite.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacite, mouvementReduit]);

  const style = useAnimatedStyle(() => ({ opacity: opacite.value }));

  return (
    <Animated.View
      style={[styles.bloc, { height: hauteur, width: largeur, borderRadius: arrondi }, style]}
    />
  );
}

const styles = StyleSheet.create({
  bloc: { backgroundColor: colors.carte2 },
});
