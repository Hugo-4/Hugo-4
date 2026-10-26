import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

type Props = {
  visible: boolean;
  titre: string;
  onFermer: () => void;
  children: ReactNode;
};

/** Feuille qui monte du bas de l'écran (Modal natif, sans dépendance) ; elle remonte au-dessus du clavier. */
export function Feuille({ visible, titre, onFermer, children }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onFermer} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.fond} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={styles.voile} onPress={onFermer} accessibilityLabel={t('commun.fermer')} />
        <View style={[styles.feuille, { paddingBottom: insets.bottom + spacing.l }]}>
          <View style={styles.entete}>
            <AppText variant="sousTitre" accessibilityRole="header" style={styles.titre}>
              {titre}
            </AppText>
            <IconButton accessibilityLabel={t('commun.fermer')} onPress={onFermer}>
              <X color={colors.texte} size={sizes.icone} />
            </IconButton>
          </View>
          <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: { flex: 1, justifyContent: 'flex-end' },
  voile: { ...StyleSheet.absoluteFill, backgroundColor: colors.fond, opacity: opacity.voile },
  feuille: {
    maxHeight: '85%',
    backgroundColor: colors.carte,
    borderTopLeftRadius: radius.carte,
    borderTopRightRadius: radius.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    paddingTop: spacing.l,
  },
  entete: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.ecran, gap: spacing.m },
  titre: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.l },
});
