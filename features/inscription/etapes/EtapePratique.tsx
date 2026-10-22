import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { useInscription } from '../InscriptionProvider';
import type { Reponses } from '../types';

/** Changer de parcours efface les réponses liées au sport. */
const REMISE_A_ZERO: Partial<Reponses> = {
  sportId: null,
  ambition: null,
  objectifSport: null,
  niveau: null,
  objectifsSecondaires: [],
  besoins: [],
};

/** « Tu pratiques déjà un sport ? » → parcours A (oui) ou B (pas encore). */
export function EtapePratique() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const choisir = (pratique: 'oui' | 'non') =>
    modifier(pratique === reponses.pratique ? {} : { ...REMISE_A_ZERO, pratique });

  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      <ChoixOption
        titre={t('inscription.pratique.oui')}
        description={t('inscription.pratique.ouiTexte')}
        selectionne={reponses.pratique === 'oui'}
        onPress={() => choisir('oui')}
      />
      <ChoixOption
        titre={t('inscription.pratique.non')}
        description={t('inscription.pratique.nonTexte')}
        selectionne={reponses.pratique === 'non'}
        onPress={() => choisir('non')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});
