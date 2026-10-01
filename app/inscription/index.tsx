import { router } from 'expo-router';
import { ListChecks, Zap } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoixOption } from '@/components/ChoixOption';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { DeconnexionBouton } from '@/features/auth/components/DeconnexionBouton';
import { LangueBascule } from '@/features/inscription/components/LangueBascule';
import { useInscription } from '@/features/inscription/InscriptionProvider';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Début de l'inscription : langue, puis choix du parcours Rapide ou Complet. */
export default function InscriptionAccueilScreen() {
  const { t } = useTranslation();
  const { parcours, setParcours, setIndex } = useInscription();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.contenu}>
        <View style={styles.entete}>
          <Logo />
          <LangueBascule />
        </View>
        <View style={styles.titres}>
          <AppText variant="titre">{t('inscription.accueil.titre')}</AppText>
          <AppText variant="secondaire">{t('inscription.accueil.sousTitre')}</AppText>
        </View>
        <View style={styles.choix} accessibilityRole="radiogroup">
          <ChoixOption
            titre={t('inscription.accueil.rapide')}
            description={t('inscription.accueil.rapideTexte')}
            icon={<Zap color={colors.accent} size={sizes.icone} />}
            selectionne={parcours === 'rapide'}
            onPress={() => setParcours('rapide')}
          />
          <ChoixOption
            titre={t('inscription.accueil.complet')}
            description={t('inscription.accueil.completTexte')}
            icon={<ListChecks color={colors.accent} size={sizes.icone} />}
            selectionne={parcours === 'complet'}
            onPress={() => setParcours('complet')}
          />
        </View>
        <Button
          label={t('inscription.accueil.commencer')}
          onPress={() => {
            setIndex(0);
            router.push('/inscription/consentements');
          }}
        />
        <DeconnexionBouton />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.xl },
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titres: { gap: spacing.xs },
  choix: { gap: spacing.s },
});
