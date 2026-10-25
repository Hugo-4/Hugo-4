import { useTranslation } from 'react-i18next';

import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { ContenuSante } from '@/features/parametres/components/ContenuSante';
import { SanteSansAccord } from '@/features/parametres/components/SanteSansAccord';
import { useSante } from '@/features/parametres/useSante';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { radius, sizes } from '@/theme/tokens';

/**
 * Profil : blessures actives et rééducation en cours, seulement avec le consentement « données de santé ».
 * Sans lui (ou dès qu'il est retiré) : explication et lien vers Consentements, aucune donnée lue ni affichée.
 */
export default function SanteScreen() {
  const { t } = useTranslation();
  const { consentement, autorise, requete } = useSante();

  return (
    <EcranEdition
      titre={t('parametres.sante.titre')}
      rafraichir={autorise ? { actif: requete.isRefetching, onRafraichir: requete.refetch } : undefined}>
      <EtatsEcran
        chargement={consentement.isPending || (autorise && requete.isPending)}
        erreur={consentement.error ?? (autorise ? requete.error : null)}
        aDesDonnees={consentement.data === false || (autorise && requete.data !== undefined)}
        onReessayer={() => (consentement.isError ? consentement.refetch() : requete.refetch())}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} arrondi={radius.carte} />}>
        {autorise && requete.data ? <ContenuSante donnees={requete.data} /> : <SanteSansAccord />}
      </EtatsEcran>
    </EcranEdition>
  );
}
