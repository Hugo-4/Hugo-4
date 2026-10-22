import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { PAYS } from '../constantes';
import { useInscription } from '../InscriptionProvider';

/** Pays de résidence → `user_profiles.pays` (règles françaises ou internationales). */
export function EtapePays() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {PAYS.map((pays) => (
        <ChoixOption
          key={pays}
          titre={t(`pays.${pays}`)}
          selectionne={reponses.pays === pays}
          onPress={() => modifier({ pays })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});
