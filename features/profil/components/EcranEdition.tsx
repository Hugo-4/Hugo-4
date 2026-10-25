import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
  /** Libellé du bouton principal (par défaut « Enregistrer »). */
  libelleEnregistrer?: string;
  bandeau?: ReactNode;
  /** Tirer pour rafraîchir (écrans qui affichent des données du serveur). */
  rafraichir?: { actif: boolean; onRafraichir: () => void };
  children: ReactNode;
};

/** Mise en page des écrans de modification : retour, titre, contenu, bouton Enregistrer. */
export function EcranEdition({
  titre,
  onEnregistrer,
  enregistrementActif = true,
  libelleEnregistrer,
  bandeau,
  rafraichir,
  children,
}: Props) {
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
        <ScrollView
          contentContainerStyle={styles.contenu}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            rafraichir ? (
              <RefreshControl
                refreshing={rafraichir.actif}
                onRefresh={rafraichir.onRafraichir}
                tintColor={colors.accent}
                colors={[colors.accent]}
                progressBackgroundColor={colors.carte}
              />
            ) : undefined
          }>
          {children}
        </ScrollView>
        {onEnregistrer || bandeau ? (
          <View style={styles.pied}>
            {bandeau}
            {onEnregistrer ? (
              <Button
                label={libelleEnregistrer ?? t('profil.enregistrer')}
                onPress={onEnregistrer}
                disabled={!enregistrementActif}
              />
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
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.xl },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});
