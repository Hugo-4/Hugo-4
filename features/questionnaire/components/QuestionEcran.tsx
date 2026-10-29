import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, sizes, spacing } from '@/theme/tokens';

import { texteQuestion, texteTest } from '../textes';
import type { Question, ValeurReponse } from '../types';
import { SaisieQuestion } from './SaisieQuestion';

type Props = {
  question: Question;
  /** Valeur déjà connue : la question est préremplie (sauf les tests, toujours saisis à neuf). */
  valeurConnue: ValeurReponse | undefined;
  numero: number;
  total: number;
  enCours: boolean;
  erreur: unknown;
  onValider: (valeur: ValeurReponse) => void;
  onPasser: () => void;
};

/** Une question par écran : progression du bloc, saisie, « Valider » et « Je ne sais pas » sous le pouce. */
export function QuestionEcran(p: Props) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const [valeur, setValeur] = useState<ValeurReponse | null>(p.question.type === 'test' ? null : (p.valeurConnue ?? null));
  const titre = p.question.test ? texteTest(t, p.question.test.libelle) : texteQuestion(t, p.question.id);
  const bloque = !enLigne || p.enCours;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.progression}>
        <ProgressBar
          progression={p.numero / Math.max(p.total, 1)}
          accessibilityLabel={t('questionnaire.question.compteur', { numero: p.numero, total: p.total })}
        />
        <AppText variant="libelle">{t('questionnaire.question.compteur', { numero: p.numero, total: p.total })}</AppText>
      </View>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <AppText variant="titre" accessibilityRole="header">
          {titre}
        </AppText>
        <SaisieQuestion question={p.question} valeur={valeur} onChange={setValeur} />
      </ScrollView>
      <View style={styles.pied}>
        {enLigne ? null : <Bandeau texte={t('questionnaire.question.horsLigne')} />}
        {p.erreur ? <ErreurEnregistrement erreur={p.erreur} /> : null}
        <Button label={t('questionnaire.question.suivant')} onPress={() => valeur !== null && p.onValider(valeur)} disabled={valeur === null || bloque} />
        {p.question.obligatoire ? null : (
          <Button label={t('questionnaire.question.passer')} variant="discret" onPress={p.onPasser} disabled={bloque} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progression: { paddingHorizontal: spacing.ecran, gap: spacing.xs },
  contenu: { padding: spacing.ecran, gap: spacing.l },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});
