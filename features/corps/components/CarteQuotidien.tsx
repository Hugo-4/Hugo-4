import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { texteOption, texteQuestion } from '@/features/questionnaire/textes';
import type { ValeurReponse } from '@/features/questionnaire/types';
import { spacing } from '@/theme/tokens';

/** Réponses « au quotidien » du questionnaire affichées ici (latéralité, journée, sommeil, stress). */
const QUESTIONS = ['TC11', 'TC48', 'TC125', 'TC127'] as const;

/** Ce que le coach sait de ton quotidien ; « Modifier » rouvre ces questions du questionnaire. */
export function CarteQuotidien({ valeurs }: { valeurs: Record<string, ValeurReponse | undefined> }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('corps.quotidien')}</AppText>
      {QUESTIONS.map((id) => {
        const v = valeurs[id];
        return (
          <View key={id} style={styles.ligne} accessible>
            <AppText variant="secondaire">{texteQuestion(t, id)}</AppText>
            <AppText variant="corpsGras">{typeof v === 'string' ? texteOption(t, v) : t('corps.aRenseigner')}</AppText>
          </View>
        );
      })}
      <Button
        label={t('corps.modifier')}
        variant="secondaire"
        onPress={() => router.push({ pathname: '/questionnaire/[bloc]', params: { bloc: 'corps' } })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { gap: spacing.xxs },
});
