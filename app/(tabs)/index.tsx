import { RefreshControl, ScrollView } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { AccueilContent } from '@/features/accueil/components/AccueilContent';
import { AccueilSkeleton } from '@/features/accueil/components/AccueilSkeleton';
import { AucunProgramme } from '@/features/accueil/components/AucunProgramme';
import { useAujourdhui } from '@/features/accueil/useAujourdhui';
import { colors } from '@/theme/tokens';

export default function AujourdhuiScreen() {
  const { accueil, checkin, chargement, erreur, detailErreur, vide, rafraichir, rafraichissement } = useAujourdhui();

  if (chargement) {
    return (
      <Screen>
        <AccueilSkeleton />
      </Screen>
    );
  }

  if (erreur || !accueil) {
    return (
      <Screen>
        <ErrorState onRetry={rafraichir} erreur={detailErreur} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={vide ? { flexGrow: 1 } : undefined}
        refreshControl={<RefreshControl refreshing={rafraichissement} onRefresh={rafraichir} tintColor={colors.accent} />}>
        {vide ? (
          <AucunProgramme />
        ) : (
          <AccueilContent accueil={accueil} checkin={checkin} />
        )}
      </ScrollView>
    </Screen>
  );
}
