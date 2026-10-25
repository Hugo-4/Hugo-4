import { useTranslation } from 'react-i18next';

import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { ConsentementCgu } from '@/features/profil/components/ConsentementCgu';
import { ConsentementSante } from '@/features/profil/components/ConsentementSante';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { useConsentementsAthlete } from '@/features/profil/useProfil';
import { sizes } from '@/theme/tokens';

/**
 * Consentements : CGU (date d'acceptation, ou acceptation si elles manquent) et données de santé
 * (accorder / retirer : le retrait masque tout de suite les écrans de santé).
 */
export default function ConsentementsScreen() {
  const { t } = useTranslation();
  const consentements = useConsentementsAthlete();

  return (
    <EcranEdition
      titre={t('profil.consentements.titre')}
      rafraichir={{ actif: consentements.isRefetching, onRafraichir: consentements.refetch }}>
      <EtatsEcran
        chargement={consentements.isPending}
        erreur={consentements.error}
        aDesDonnees={consentements.data !== undefined}
        onReessayer={consentements.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} />}>
        <ConsentementCgu etat={consentements.data?.cgu} />
        <ConsentementSante etat={consentements.data?.donnees_sante} />
      </EtatsEcran>
    </EcranEdition>
  );
}
