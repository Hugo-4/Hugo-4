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
import { useNouveauMotDePasse } from '@/features/auth/useMotDePasse';
import { LONGUEUR_MIN_MOT_DE_PASSE } from '@/features/auth/validation';
import { spacing } from '@/theme/tokens';

/** Ouvert par le lien « mot de passe oublié » : choix du nouveau mot de passe. */
export default function NouveauMotDePasseScreen() {
  const { t } = useTranslation();
  const [motDePasse, setMotDePasse] = useState('');
  const [tropCourt, setTropCourt] = useState(false);
  const enregistrement = useNouveauMotDePasse();

  const envoyer = () => {
    const court = motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE;
    setTropCourt(court);
    if (!court) enregistrement.mutate(motDePasse);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <Logo />
        <View style={styles.titres}>
          <AppText variant="titre">{t('auth.nouveau.titre')}</AppText>
          <AppText variant="secondaire">{t('auth.nouveau.sousTitre')}</AppText>
        </View>
        <TextField
          label={t('auth.champs.motDePasse')}
          value={motDePasse}
          onChangeText={setMotDePasse}
          motDePasse
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          aide={t('auth.champs.motDePasseAide')}
          erreur={tropCourt ? t('auth.erreurs.motDePasseCourt') : undefined}
          onSubmitEditing={envoyer}
        />
        {enregistrement.isError ? <MessageErreur texte={t(cleErreurAuth(enregistrement.error))} /> : null}
        <Button label={t('auth.nouveau.bouton')} onPress={envoyer} disabled={enregistrement.isPending} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, justifyContent: 'center', padding: spacing.ecran, gap: spacing.l },
  titres: { gap: spacing.xs },
});
