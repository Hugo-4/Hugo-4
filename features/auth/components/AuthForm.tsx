import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors, spacing } from '@/theme/tokens';

import { type ErreursFormulaire, validerIdentifiants } from '../validation';
import { MessageErreur } from './MessageErreur';

type Props = {
  titre: string;
  sousTitre: string;
  libelleBouton: string;
  nouveauCompte?: boolean;
  enCours: boolean;
  erreurServeur?: string;
  onEnvoyer: (email: string, motDePasse: string) => void;
  lienTexte: string;
  lienLibelle: string;
  onLien: () => void;
};

/** Formulaire email + mot de passe partagé par la connexion et la création de compte. */
export function AuthForm(props: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurs, setErreurs] = useState<ErreursFormulaire>({});

  const envoyer = () => {
    const resultat = validerIdentifiants(email, motDePasse);
    setErreurs(resultat);
    if (!resultat.email && !resultat.motDePasse) props.onEnvoyer(email, motDePasse);
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Logo />
          <View style={styles.titres}>
            <AppText variant="titre">{props.titre}</AppText>
            <AppText variant="secondaire">{props.sousTitre}</AppText>
          </View>
          <TextField
            label={t('auth.champs.email')}
            value={email}
            onChangeText={setEmail}
            erreur={erreurs.email && t(erreurs.email)}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType={props.nouveauCompte ? 'username' : 'emailAddress'}
            returnKeyType="next"
          />
          <TextField
            label={t('auth.champs.motDePasse')}
            value={motDePasse}
            onChangeText={setMotDePasse}
            erreur={erreurs.motDePasse && t(erreurs.motDePasse)}
            aide={props.nouveauCompte ? t('auth.champs.motDePasseAide') : undefined}
            motDePasse
            autoCapitalize="none"
            autoComplete={props.nouveauCompte ? 'new-password' : 'current-password'}
            textContentType={props.nouveauCompte ? 'newPassword' : 'password'}
            returnKeyType="go"
            onSubmitEditing={envoyer}
          />
          {props.erreurServeur ? <MessageErreur texte={props.erreurServeur} /> : null}
          <Button label={props.libelleBouton} onPress={envoyer} disabled={props.enCours} />
          <View style={styles.lien}>
            <AppText variant="secondaire" color={colors.discret}>
              {props.lienTexte}
            </AppText>
            <Button label={props.lienLibelle} variant="discret" onPress={props.onLien} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenu: { flexGrow: 1, justifyContent: 'center', padding: spacing.ecran, gap: spacing.l },
  titres: { gap: spacing.xs, marginTop: spacing.s },
  lien: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
});
