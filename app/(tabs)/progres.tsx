import { useScrollToTop } from 'expo-router';
import { BarChart3 } from 'lucide-react-native';
import { useRef } from 'react';
import { RefreshControl, ScrollView, type ScrollViewInstance, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { ProgresContenu } from '@/features/progres/components/ProgresContenu';
import { ProgresSkeleton } from '@/features/progres/components/ProgresSkeleton';
import { ouvrirVue } from '@/features/progres/navigation';
import { useVueEnsemble } from '@/features/progres/useVueEnsemble';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Progrès (onglet 4) : « Est-ce que je progresse ? » — vue d'ensemble, chaque carte ouvre sa vue. */
export default function ProgresScreen() {
  const { t } = useTranslation();
  const liste = useRef<ScrollViewInstance>(null);
  useScrollToTop(liste);
  const vue = useVueEnsemble();

  return (
    <Screen>
      <ScrollView
        ref={liste}
        contentContainerStyle={styles.contenu}
        refreshControl={<RefreshControl refreshing={vue.rafraichissement} onRefresh={vue.rafraichir} tintColor={colors.accent} />}>
        <AppText variant="titre" accessibilityRole="header">
          {t('progres.titre')}
        </AppText>
        <EtatsEcran
          chargement={vue.chargement}
          erreur={vue.erreur}
          aDesDonnees={vue.aDesDonnees}
          vide={vue.vide}
          onReessayer={vue.rafraichir}
          squelette={<ProgresSkeleton />}
          etatVide={{
            icon: <BarChart3 color={colors.discret} size={sizes.icone * 2} />,
            titre: t('progres.vide.titre'),
            texte: t('progres.vide.texte'),
            action: <Button label={t('progres.tests.ajouter')} onPress={() => ouvrirVue('tests', { ajouter: '1' })} />,
          }}>
          <ProgresContenu vue={vue} />
        </EtatsEcran>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.entreCartes },
});
