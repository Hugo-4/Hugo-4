import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useSession } from '@/features/auth/AuthProvider';
import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { colors, spacing } from '@/theme/tokens';

/**
 * Retour de Google / Apple : la session est ouverte par useLiensAuth,
 * puis la navigation part d'elle-même (inscription ou Aujourd'hui).
 */
export default function AuthCallbackScreen() {
  const { t } = useTranslation();
  const { erreurLien } = useSession();
  return (
    <Screen>
      <View style={styles.contenu}>
        {erreurLien ? (
          <>
            <MessageErreur texte={t('auth.erreurs.lien', { detail: erreurLien })} />
            <Button label={t('auth.oublie.retour')} onPress={() => router.replace('/connexion')} />
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.accent} size="large" />
            <AppText variant="secondaire" style={styles.centre}>
              {t('auth.connexionEnCours')}
            </AppText>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, justifyContent: 'center', padding: spacing.ecran, gap: spacing.l },
  centre: { textAlign: 'center' },
});
