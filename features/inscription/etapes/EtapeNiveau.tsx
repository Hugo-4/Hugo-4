import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { NIVEAUX } from '../constantes';
import { useInscription } from '../InscriptionProvider';

export function EtapeNiveau() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {NIVEAUX.map((niveau) => (
        <ChoixOption
          key={niveau}
          titre={t(`inscription.niveau.${niveau}.titre`)}
          description={t(`inscription.niveau.${niveau}.description`)}
          selectionne={reponses.niveau === niveau}
          onPress={() => modifier({ niveau })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});
