import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { LIEUX } from '../constantes';
import { useInscription } from '../InscriptionProvider';

/** Lieu d'entraînement principal (parcours Complet) → `lieux_athlete`. */
export function EtapeLieu() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {LIEUX.map((lieu) => (
        <ChoixOption
          key={lieu}
          titre={t(`inscription.lieu.${lieu}`)}
          selectionne={reponses.lieu === lieu}
          onPress={() => modifier({ lieu })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});
