import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { DeconnexionBouton } from '@/features/auth/components/DeconnexionBouton';
import { LangueBascule } from '@/features/inscription/components/LangueBascule';
import { CarteConsentements } from '@/features/profil/components/CarteConsentements';
import { CarteIdentite } from '@/features/profil/components/CarteIdentite';
import { CarteSports } from '@/features/profil/components/CarteSports';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { useEcranProfil } from '@/features/profil/useEcranProfil';
import { radius, sizes, spacing } from '@/theme/tokens';

export default function ProfilScreen() {
  const { t } = useTranslation();
  const p = useEcranProfil();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.contenu}>
        <AppText variant="titre" accessibilityRole="header">
          {t('onglets.profil')}
        </AppText>
        {p.chargement ? (
          [0, 1, 2].map((i) => <Skeleton key={i} hauteur={sizes.anneauForme} arrondi={radius.carte} />)
        ) : p.erreur || !p.identite ? (
          <ErrorState onRetry={p.reessayer} />
        ) : (
          <>
            <CarteIdentite identite={p.identite} onModifier={() => router.push('/compte/identite')} />
            <CarteSports sports={p.sports} onOuvrir={(id) => router.push({ pathname: '/compte/sport/[id]', params: { id } })} />
            <CarteConsentements consentements={p.consentements} onGerer={() => router.push('/compte/consentements')} />
          </>
        )}
        <SectionProfil titre={t('inscription.langue')}>
          <LangueBascule />
        </SectionProfil>
        <View style={styles.pied}>
          <DeconnexionBouton />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
  pied: { marginTop: spacing.s },
});
