import { router } from 'expo-router';
import { Baby } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { DeconnexionBouton } from '@/features/auth/components/DeconnexionBouton';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Moins de 15 ans : un compte parent est obligatoire avant de continuer. */
export default function ParentScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.contenu}>
        <Baby color={colors.accent} size={sizes.icone * 3} />
        <AppText variant="titre" style={styles.centre} accessibilityRole="header">
          {t('inscription.parent.titre')}
        </AppText>
        <AppText variant="secondaire" style={styles.centre}>
          {t('inscription.parent.texte')}
        </AppText>
        <View style={styles.actions}>
          <Button label={t('inscription.parent.corriger')} variant="secondaire" onPress={() => router.back()} />
          <DeconnexionBouton />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.l, padding: spacing.xxl },
  centre: { textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: spacing.s },
});
