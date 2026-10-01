import { CalendarDays } from 'lucide-react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Screen } from '@/components/Screen';
import { AccueilContent } from '@/features/accueil/components/AccueilContent';
import { AccueilSkeleton } from '@/features/accueil/components/AccueilSkeleton';
import { useAccueil } from '@/features/accueil/useAccueil';
import { colors, sizes } from '@/theme/tokens';

export default function AujourdhuiScreen() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, isRefetching } = useAccueil();

  if (isPending) {
    return (
      <Screen>
        <AccueilSkeleton />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={data ? undefined : { flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
        }>
        {data ? (
          <AccueilContent accueil={data} />
        ) : (
          <EmptyState
            icon={<CalendarDays color={colors.discret} size={sizes.icone * 2} />}
            titre={t('accueil.videTitre')}
            texte={t('accueil.videTexte')}
          />
        )}
      </ScrollView>
    </Screen>
  );
}
