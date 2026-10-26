import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { FormulaireSport } from '@/features/profil/components/FormulaireSport';
import { useSportsAthlete } from '@/features/profil/useProfil';
import { sizes } from '@/theme/tokens';

export default function SportScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sports = useSportsAthlete();
  const sport = sports.data?.find((s) => s.id === id);
  if (sport) return <FormulaireSport sport={sport} />;
  return (
    <EcranEdition titre={t('profil.sports.titre')}>
      <BandeauHorsLigne />
      {sports.isPending ? <Skeleton hauteur={sizes.anneauForme * 2} /> : null}
      {sports.isError ? <ErrorState onRetry={sports.refetch} erreur={sports.error} /> : null}
      {sports.data && !sport ? <EmptyState titre={t('profil.sports.introuvable')} /> : null}
    </EcranEdition>
  );
}
