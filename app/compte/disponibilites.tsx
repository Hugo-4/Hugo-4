import { useTranslation } from 'react-i18next';

import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { EditeurDisponibilites } from '@/features/parametres/components/EditeurDisponibilites';
import { useDisponibilites } from '@/features/parametres/useDisponibilites';
import { useListeLieux } from '@/features/parametres/useLieux';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { sizes } from '@/theme/tokens';

/** Profil : créneaux de la semaine (durée, lieu) et accès aux lieux. */
export default function DisponibilitesScreen() {
  const { t } = useTranslation();
  const disponibilites = useDisponibilites();
  const lieux = useListeLieux();
  const rafraichir = {
    actif: disponibilites.isRefetching || lieux.isRefetching,
    onRafraichir: () => {
      disponibilites.refetch();
      lieux.refetch();
    },
  };

  // Les lieux ne servent qu'à nommer les créneaux : sans eux (hors ligne, erreur), l'écran reste utilisable.
  // `isLoading` et non `isPending` : une requête en pause hors ligne ne bloque pas l'écran.
  if (disponibilites.data && !lieux.isLoading) {
    return <EditeurDisponibilites initiales={disponibilites.data} lieux={lieux.data} rafraichir={rafraichir} />;
  }
  return (
    <EcranEdition titre={t('parametres.disponibilites.titre')}>
      <EtatsEcran
        chargement={disponibilites.isPending || lieux.isLoading}
        erreur={disponibilites.error}
        aDesDonnees={false}
        onReessayer={disponibilites.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 3} />}>
        {null}
      </EtatsEcran>
    </EcranEdition>
  );
}
