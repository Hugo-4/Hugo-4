import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { ConsentementSante } from '@/features/profil/components/ConsentementSante';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { LigneInfo } from '@/features/profil/components/LigneInfo';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { useConsentementsAthlete } from '@/features/profil/useProfil';
import { formatHorodatage } from '@/lib/format';
import { sizes } from '@/theme/tokens';

/** Consentements : CGU (date d'acceptation) et données de santé (accorder / retirer). */
export default function ConsentementsScreen() {
  const { t } = useTranslation();
  const consentements = useConsentementsAthlete();
  const cgu = consentements.data?.cgu;

  return (
    <EcranEdition titre={t('profil.consentements.titre')}>
      {consentements.isPending ? <Skeleton hauteur={sizes.anneauForme * 2} /> : null}
      {consentements.isError ? <ErrorState onRetry={consentements.refetch} /> : null}
      {consentements.data ? (
        <>
          <SectionProfil titre={t('profil.consentements.cgu')}>
            <LigneInfo
              libelle={t('profil.consentements.statut')}
              valeur={cgu?.accorde ? t('profil.consentements.accordeLe', { horodatage: formatHorodatage(cgu.le) }) : t('profil.consentements.jamais')}
            />
            <AppText variant="libelle">{t('profil.consentements.cguRetrait')}</AppText>
          </SectionProfil>
          <ConsentementSante etat={consentements.data.donnees_sante} />
        </>
      ) : null}
    </EcranEdition>
  );
}
