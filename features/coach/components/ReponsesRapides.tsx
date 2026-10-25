import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/theme/tokens';

import type { CodeReponseRapide } from '../types';
import { MARGE_TACTILE } from './dimensions';
import { PuceReponse } from './PuceReponse';

type Props = {
  codes: CodeReponseRapide[];
  onChoisir: (code: CodeReponseRapide, texte: string) => void;
  desactive: boolean;
};

/** « Je n'ai que 30 min », « Pas de salle aujourd'hui »… : une puce envoie le message tel quel. */
export function ReponsesRapides({ codes, onChoisir, desactive }: Props) {
  const { t } = useTranslation();
  return (
    <View accessibilityLabel={t('coach.reponsesRapides.a11y')} accessibilityRole="list">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.ligne}>
        {codes.map((code) => {
          const texte = t(`coach.reponsesRapides.${code}`);
          return <PuceReponse key={code} label={texte} desactive={desactive} onPress={() => onChoisir(code, texte)} />;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { gap: spacing.s, paddingHorizontal: spacing.ecran, paddingVertical: MARGE_TACTILE },
});
