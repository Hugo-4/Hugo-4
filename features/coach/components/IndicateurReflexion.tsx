import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

const DUREE_PULSATION_MS = 700;

/** « Le coach réfléchit… » pendant que le serveur prépare sa réponse (sans animation si l'athlète l'a demandé). */
export function IndicateurReflexion() {
  const { t } = useTranslation();
  const reduire = useReducedMotion();
  const opacite = useSharedValue(1);

  useEffect(() => {
    if (reduire) return;
    opacite.value = withRepeat(withTiming(opacity.desactive, { duration: DUREE_PULSATION_MS }), -1, true);
  }, [opacite, reduire]);

  const style = useAnimatedStyle(() => ({ opacity: opacite.value }));

  return (
    <Animated.View style={[styles.bulle, style]} accessibilityLiveRegion="polite" accessibilityRole="text">
      <AppText variant="secondaire">{t('coach.reflexion')}</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bulle: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.carte,
    borderRadius: radius.bouton,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte,
  },
});
