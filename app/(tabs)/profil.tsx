import { useScrollToTop } from 'expo-router';
import { useRef } from 'react';
import { RefreshControl, ScrollView, type ScrollViewInstance, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { DeconnexionBouton } from '@/features/auth/components/DeconnexionBouton';
import { ListeRubriques } from '@/features/parametres/components/ListeRubriques';
import { useEcranProfil } from '@/features/profil/useEcranProfil';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Profil : « Mes réglages et mes données » (FRONTEND.md §4.7). */
export default function ProfilScreen() {
  const { t } = useTranslation();
  const p = useEcranProfil();
  const liste = useRef<ScrollViewInstance>(null);
  useScrollToTop(liste);

  return (
    <Screen>
      <ScrollView
        ref={liste}
        contentContainerStyle={styles.contenu}
        refreshControl={
          <RefreshControl
            refreshing={p.rafraichissement}
            onRefresh={p.reessayer}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.carte}
          />
        }>
        <AppText variant="titre" accessibilityRole="header">
          {t('onglets.profil')}
        </AppText>
        <EtatsEcran
          chargement={p.chargement}
          erreur={p.erreur}
          aDesDonnees={p.aDesDonnees}
          onReessayer={p.reessayer}
          squelette={
            <View style={styles.squelette}>
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} hauteur={sizes.pasAPas} />
              ))}
            </View>
          }>
          <ListeRubriques
            identite={p.identite}
            sports={p.sports}
            consentements={p.consentements}
            avecSante={p.avecSante}
            offre={p.offre}
            manquants={p.manquants}
          />
        </EtatsEcran>
        <DeconnexionBouton />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.xxl },
  squelette: { gap: spacing.s },
});
