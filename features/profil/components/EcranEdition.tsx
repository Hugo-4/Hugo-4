import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  titre: string;
  /** Absent : pas de bouton Enregistrer (écran de consultation). */
  onEnregistrer?: () => void;
  enregistrementActif?: boolean;
  bandeau?: ReactNode;
  children: ReactNode;
};

/** Mise en page des écrans de modification : retour, titre, contenu, bouton Enregistrer. */
export function EcranEdition({ titre, onEnregistrer, enregistrementActif = true, bandeau, children }: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.entete}>
          <IconButton accessibilityLabel={t('commun.retour')} onPress={() => router.back()}>
            <ChevronLeft color={colors.texte} size={sizes.icone} />
          </IconButton>
          <AppText variant="sousTitre" accessibilityRole="header" style={styles.flex} numberOfLines={1}>
            {titre}
          </AppText>
        </View>
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {onEnregistrer || bandeau ? (
          <View style={styles.pied}>
            {bandeau}
            {onEnregistrer ? (
              <Button label={t('profil.enregistrer')} onPress={onEnregistrer} disabled={!enregistrementActif} />
            ) : null}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, paddingHorizontal: spacing.ecran },
  contenu: { padding: spacing.ecran, gap: spacing.xl },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});
