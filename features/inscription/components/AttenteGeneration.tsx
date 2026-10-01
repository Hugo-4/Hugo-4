import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Ring } from '@/components/Ring';
import { sizes, spacing } from '@/theme/tokens';

const ETAPES = ['profil', 'doctrine', 'blocs', 'seances', 'finalisation'] as const;
const DUREE_ETAPE_MS = 12_000;
const DUREE_TOUR_MS = 1_600;

/** Attente animée pendant la génération (environ une minute). */
export function AttenteGeneration() {
  const { t } = useTranslation();
  const [etape, setEtape] = useState(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: DUREE_TOUR_MS, easing: Easing.linear }), -1, false);
    const minuteur = setInterval(() => setEtape((e) => Math.min(e + 1, ETAPES.length - 1)), DUREE_ETAPE_MS);
    return () => clearInterval(minuteur);
  }, [rotation]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View style={styles.bloc} accessibilityLiveRegion="polite">
      <Animated.View style={style}>
        <Ring progression={0.25} taille={sizes.anneauForme} epaisseur={sizes.epaisseurAnneau} />
      </Animated.View>
      <AppText variant="titre" style={styles.centre}>
        {t('inscription.generation.titre')}
      </AppText>
      <AppText variant="secondaire" style={styles.centre}>
        {t(`inscription.generation.etapes.${ETAPES[etape]}`)}
      </AppText>
      <AppText variant="libelle" style={styles.centre}>
        {t('inscription.generation.duree')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { alignItems: 'center', gap: spacing.l },
  centre: { textAlign: 'center' },
});
