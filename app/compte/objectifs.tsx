import { useTranslation } from 'react-i18next';

import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { CarteObjectifPrincipal } from '@/features/parametres/components/CarteObjectifPrincipal';
import { EtatSection } from '@/features/parametres/components/EtatSection';
import { ListeCompetitions } from '@/features/parametres/components/ListeCompetitions';
import { useEvenements } from '@/features/parametres/useEvenements';
import { useObjectifPrincipal } from '@/features/parametres/useObjectifPrincipal';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { sizes } from '@/theme/tokens';

/** Profil : objectif principal (échéance modifiable) et compétitions. */
export default function ObjectifsScreen() {
  const { t } = useTranslation();
  const objectif = useObjectifPrincipal();
  const evenements = useEvenements();

  return (
    <EcranEdition
      titre={t('parametres.objectifs.titre')}
      rafraichir={{
        actif: objectif.isRefetching || evenements.isRefetching,
        onRafraichir: () => {
          objectif.refetch();
          evenements.refetch();
        },
      }}>
      <EtatsEcran
        chargement={objectif.isPending}
        erreur={objectif.error}
        aDesDonnees={objectif.data !== undefined}
        onReessayer={objectif.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} />}>
        <CarteObjectifPrincipal objectif={objectif.data ?? null} evenements={evenements.data} />
        <EtatSection
          chargement={evenements.isPending}
          erreur={evenements.error}
          aDesDonnees={evenements.data !== undefined}
          onReessayer={evenements.refetch}
          lignes={3}>
          <ListeCompetitions evenements={evenements.data ?? []} />
        </EtatSection>
      </EtatsEcran>
    </EcranEdition>
  );
}
