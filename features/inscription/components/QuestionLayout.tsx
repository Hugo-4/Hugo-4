import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  titre: string;
  sousTitre?: string;
  /** Position dans le parcours (1 = première question). */
  numero: number;
  total: number;
  onRetour: () => void;
  onSuivant: () => void;
  suivantActif: boolean;
  libelleSuivant?: string;
  enCours?: boolean;
  /** Message affiché au-dessus du bouton (ex. erreur d'enregistrement). */
  bandeau?: ReactNode;
  children: ReactNode;
};

/** Mise en page commune des questions : retour, progression, question, bouton Suivant en bas. */
export function QuestionLayout(props: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.entete}>
          <IconButton accessibilityLabel={t('commun.retour')} onPress={props.onRetour}>
            <ChevronLeft color={colors.texte} size={sizes.icone} />
          </IconButton>
          <View style={styles.progression}>
            <ProgressBar
              progression={props.numero / props.total}
              accessibilityLabel={t('inscription.progression', { numero: props.numero, total: props.total })}
            />
          </View>
          <AppText variant="libelle">{t('inscription.compteur', { numero: props.numero, total: props.total })}</AppText>
        </View>
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <View style={styles.titres}>
            <AppText variant="titre" accessibilityRole="header">
              {props.titre}
            </AppText>
            {props.sousTitre ? <AppText variant="secondaire">{props.sousTitre}</AppText> : null}
          </View>
          {props.children}
        </ScrollView>
        <View style={styles.pied}>
          {props.bandeau}
          <Button
            label={props.libelleSuivant ?? t('inscription.suivant')}
            onPress={props.onSuivant}
            disabled={!props.suivantActif || props.enCours}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, paddingHorizontal: spacing.ecran },
  progression: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.l },
  titres: { gap: spacing.xs },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});
