import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { Chip } from '@/components/Chip';
import { spacing } from '@/theme/tokens';

import { GroupeChoix } from '../components/GroupeChoix';
import { LONGUEURS, TONS } from '../constantes';
import { useInscription } from '../InscriptionProvider';

/** Style de coaching (parcours Complet) → `PATCH /preferences`. */
export function EtapeCoaching() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  return (
    <View style={styles.bloc}>
      <View style={styles.liste} accessibilityRole="radiogroup">
        {TONS.map((ton) => (
          <ChoixOption
            key={ton}
            titre={t(`inscription.coaching.tons.${ton}.titre`)}
            description={t(`inscription.coaching.tons.${ton}.description`)}
            selectionne={reponses.ton === ton}
            onPress={() => modifier({ ton })}
          />
        ))}
      </View>
      <GroupeChoix titre={t('inscription.coaching.longueur')} radio>
        {LONGUEURS.map((longueur) => (
          <Chip
            key={longueur}
            role="radio"
            label={t(`inscription.coaching.longueurs.${longueur}`)}
            selectionne={reponses.longueur === longueur}
            onPress={() => modifier({ longueur })}
          />
        ))}
      </GroupeChoix>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xxl },
  liste: { gap: spacing.s },
});
