import { router } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { cleErreurAuth } from '@/features/auth/erreurs';
import { useMotDePasseOublie } from '@/features/auth/useMotDePasse';
import { validerIdentifiants } from '@/features/auth/validation';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Mot de passe oublié : envoie un lien de réinitialisation par email. */
export default function MotDePasseOublieScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [erreurEmail, setErreurEmail] = useState(false);
  const envoi = useMotDePasseOublie();

  const envoyer = () => {
    const invalide = Boolean(validerIdentifiants(email, 'x'.repeat(8)).email);
    setErreurEmail(invalide);
    if (!invalide) envoi.mutate(email);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <Logo />
        {envoi.isSuccess ? (
          <View style={styles.succes}>
            <MailCheck color={colors.accent} size={sizes.icone * 3} />
            <AppText variant="titre">{t('auth.oublie.envoyeTitre')}</AppText>
            <AppText variant="secondaire">{t('auth.oublie.envoyeTexte', { email: email.trim() })}</AppText>
          </View>
        ) : (
          <>
            <View style={styles.titres}>
              <AppText variant="titre">{t('auth.oublie.titre')}</AppText>
              <AppText variant="secondaire">{t('auth.oublie.sousTitre')}</AppText>
            </View>
            <TextField
              label={t('auth.champs.email')}
              value={email}
              onChangeText={setEmail}
              erreur={erreurEmail ? t('auth.erreurs.emailInvalide') : undefined}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onSubmitEditing={envoyer}
            />
            {envoi.isError ? <MessageErreur texte={t(cleErreurAuth(envoi.error))} /> : null}
            <Button label={t('auth.oublie.bouton')} onPress={envoyer} disabled={envoi.isPending} />
          </>
        )}
        <Button label={t('auth.oublie.retour')} variant="discret" onPress={() => router.replace('/connexion')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, justifyContent: 'center', padding: spacing.ecran, gap: spacing.l },
  titres: { gap: spacing.xs },
  succes: { gap: spacing.m },
});
