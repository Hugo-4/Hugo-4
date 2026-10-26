import { CloudOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, sizes, spacing } from '@/theme/tokens';

/**
 * Dans une feuille ou un formulaire qui écrit sur le serveur, hors ligne : l'envoi attendrait sans rien dire,
 * alors le bouton est désactivé et ce message dit pourquoi.
 */
export function AvisHorsLigne() {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne} accessible accessibilityRole="alert">
      <CloudOff color={colors.alerte} size={sizes.icone} />
      <AppText variant="secondaire" color={colors.alerte} style={styles.texte}>
        {t('programme.horsLigneEnvoi')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  texte: { flex: 1 },
});
