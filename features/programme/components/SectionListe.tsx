import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

type Props = {
  titre: string;
  lignes: string[];
  /** Étapes : numérotées ; sinon puces. */
  numerotee?: boolean;
};

/** Liste titrée de la fiche technique (consignes, étapes, erreurs fréquentes…), textes du catalogue tels quels. */
export function SectionListe({ titre, lignes, numerotee }: Props) {
  if (!lignes.length) return null;
  return (
    <View style={styles.bloc}>
      <AppText variant="surTitre" accessibilityRole="header">
        {titre}
      </AppText>
      {lignes.map((ligne, i) => (
        <AppText key={`${i}-${ligne}`} variant="corps">
          {numerotee ? `${i + 1}. ${ligne}` : `• ${ligne}`}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});
