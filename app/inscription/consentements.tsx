import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoixOption } from '@/components/ChoixOption';
import { Screen } from '@/components/Screen';
import { useSession } from '@/features/auth/AuthProvider';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { useInscription } from '@/features/inscription/InscriptionProvider';
import { useConsentements } from '@/features/inscription/useConsentements';
import { spacing } from '@/theme/tokens';

/** Consentements, avant toute question de santé. Sans consentement santé, ces questions ne sont pas posées. */
export default function ConsentementsScreen() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { setConsentementSante, setIndex } = useInscription();
  const enregistrement = useConsentements();
  const [cgu, setCgu] = useState(false);
  const [sante, setSante] = useState(false);

  const continuer = () => {
    if (!session) return;
    enregistrement.mutate(
      { userId: session.user.id, donneesSante: sante },
      {
        onSuccess: () => {
          setConsentementSante(sante);
          setIndex(0);
          router.push('/inscription/questions');
        },
      },
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.contenu}>
        <View style={styles.titres}>
          <AppText variant="titre" accessibilityRole="header">
            {t('inscription.consentements.titre')}
          </AppText>
          <AppText variant="secondaire">{t('inscription.consentements.sousTitre')}</AppText>
        </View>
        <ChoixOption
          role="checkbox"
          titre={t('inscription.consentements.cgu')}
          description={t('inscription.consentements.cguTexte')}
          selectionne={cgu}
          onPress={() => setCgu(!cgu)}
        />
        <ChoixOption
          role="checkbox"
          titre={t('inscription.consentements.sante')}
          description={t('inscription.consentements.santeTexte')}
          selectionne={sante}
          onPress={() => setSante(!sante)}
        />
        <AppText variant="libelle">{t('inscription.consentements.retrait')}</AppText>
        {enregistrement.isError ? <ErreurEnregistrement erreur={enregistrement.error} /> : null}
        <Button label={t('inscription.suivant')} onPress={continuer} disabled={!cgu || enregistrement.isPending} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.l },
  titres: { gap: spacing.xs },
});
