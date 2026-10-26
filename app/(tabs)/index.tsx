import { useScrollToTop } from 'expo-router';
import { useRef } from 'react';
import { RefreshControl, ScrollView, type ScrollViewInstance } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { EtatHorsLigne } from '@/components/EtatHorsLigne';
import { Screen } from '@/components/Screen';
import { AccueilContent } from '@/features/accueil/components/AccueilContent';
import { AccueilSkeleton } from '@/features/accueil/components/AccueilSkeleton';
import { AucunProgramme } from '@/features/accueil/components/AucunProgramme';
import { useAujourdhui } from '@/features/accueil/useAujourdhui';
import { colors } from '@/theme/tokens';

export default function AujourdhuiScreen() {
  const { accueil, checkin, chargement, horsLigneSansDonnees, detailErreur, vide, rafraichir, rafraichissement } =
    useAujourdhui();
  // Toucher l'onglet déjà ouvert remonte en haut de l'écran.
  const defilement = useRef<ScrollViewInstance>(null);
  useScrollToTop(defilement);

  if (chargement) {
    return (
      <Screen>
        <AccueilSkeleton />
      </Screen>
    );
  }

  if (!accueil) {
    return (
      <Screen>
        {horsLigneSansDonnees ? (
          <EtatHorsLigne onRetry={rafraichir} />
        ) : (
          <ErrorState onRetry={rafraichir} erreur={detailErreur} />
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        ref={defilement}
        contentContainerStyle={vide ? { flexGrow: 1 } : undefined}
        refreshControl={<RefreshControl refreshing={rafraichissement} onRefresh={rafraichir} tintColor={colors.accent} />}>
        {vide ? <AucunProgramme /> : <AccueilContent accueil={accueil} checkin={checkin} />}
      </ScrollView>
    </Screen>
  );
}
