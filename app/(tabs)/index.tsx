import { CalendarDays } from 'lucide-react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { AccueilContent } from '@/features/accueil/components/AccueilContent';
import { AccueilSkeleton } from '@/features/accueil/components/AccueilSkeleton';
import { useAujourdhui } from '@/features/accueil/useAujourdhui';
import { colors, sizes } from '@/theme/tokens';

export default function AujourdhuiScreen() {
  const { t } = useTranslation();
  const { accueil, checkin, chargement, erreur, vide, rafraichir, rafraichissement } = useAujourdhui();

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
        <ErrorState onRetry={rafraichir} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={vide ? { flexGrow: 1 } : undefined}
        refreshControl={<RefreshControl refreshing={rafraichissement} onRefresh={rafraichir} tintColor={colors.accent} />}>
        {vide ? (
          <EmptyState
            icon={<CalendarDays color={colors.discret} size={sizes.icone * 2} />}
            titre={t('accueil.videTitre')}
            texte={t('accueil.videTexte')}
          />
        ) : (
          <AccueilContent accueil={accueil} checkin={checkin} />
        )}
      </ScrollView>
    </Screen>
  );
}
