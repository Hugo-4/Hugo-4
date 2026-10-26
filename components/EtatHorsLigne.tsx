import { CloudOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { Button } from './Button';

/**
 * Hors ligne et rien en cache : un message clair au lieu d'un squelette sans fin.
 * Les données se chargent seules au retour du réseau ; « Réessayer » relance tout de suite.
 */
export function EtatHorsLigne({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.conteneur} accessibilityRole="alert">
      <CloudOff color={colors.texte2} size={sizes.icone * 2} />
      <AppText variant="sousTitre" style={styles.centre}>
        {t('commun.horsLigneTitre')}
      </AppText>
      <AppText variant="secondaire" style={styles.centre}>
        {t('commun.horsLigneTexte')}
      </AppText>
      <Button label={t('commun.reessayer')} variant="secondaire" onPress={onRetry} style={styles.bouton} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.m, padding: spacing.xxl },
  centre: { textAlign: 'center' },
  bouton: { alignSelf: 'stretch', marginTop: spacing.s },
});
