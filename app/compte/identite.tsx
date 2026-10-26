import { useTranslation } from 'react-i18next';

import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { FormulaireIdentite } from '@/features/profil/components/FormulaireIdentite';
import { useIdentite } from '@/features/profil/useProfil';
import { sizes } from '@/theme/tokens';

/** Modifier prénom, date de naissance (obligatoire) et pays. */
export default function IdentiteScreen() {
  const { t } = useTranslation();
  const identite = useIdentite();
  if (identite.data) return <FormulaireIdentite initiale={identite.data} />;
  return (
    <EcranEdition titre={t('profil.identite.titre')}>
      <BandeauHorsLigne />
      {identite.isError ? (
        <ErrorState onRetry={identite.refetch} erreur={identite.error} />
      ) : (
        <Skeleton hauteur={sizes.anneauForme * 2} />
      )}
    </EcranEdition>
  );
}
